# Design Doc: Bimanual Franka Duo Teleoperation on the Avatar (Eupheme) System

**Project:** Odyssey (Bi-Manual Package Sort)
**Status:** Draft

**Author:** Jack Tommaney

**Date:** 2026-07-16


---

## 1. Summary

We are extending the existing Avatar (Specifically, the ARInnovLabEupheme -Motion and -Common) robot-control stack to teleoperate a
bimanual Franka Duo (two Franka FR3 arms) on the single-machine Odyssey
workstation. Teleoperation is the near-term goal because it is how we will (a) validate
the Duo control stack end-to-end and (b) collect the bimanual demonstration data
needed to fine-tune a VLA policy (RLDX-1) for eventual autonomous operation.

This document defines the proposed system, what already exists, and the specific
changes/additions required to extend Avatar for the new functionality.

MVP definition: two-arm teleoperation driven by two HTC Vive
Trackers (one per arm) commanding arm motion only (no end-effector actuation),
running entirely on the Odyssey workstation. Everything else (Orca hands, MANUS
gloves, and the RLDX / extensible model bridge) depends on this core framework.

---

## 2. Goals & Non-Goals

### 2.1 Goals (MVP)
- Teleoperate both FR3 arms of the Franka Duo simultaneously from two Vive Trackers.
- Run the entire teleop + control stack on the one Odyssey workstation
  (RTX 5090, 24-core, RT kernel), inside the existing Docker environment.
- Reuse the existing `vive_device` > sequencer > libfranka control path per arm, 
  specifically as a bimanual setup.
- Preserve the ability to record bimanual demonstrations (existing `data_collector`
  path or an extended new pipeline), since that is the eventual training data source.
- Produce a clean, documented bringup runbook and setup scripts for a single-box Duo teleop session.
- Additional: MANUS teleop with *simulated* Orca hands - real ones will come later

### 2.2 Non-Goals for MVP
- **End-effector actuation.** No Orca hand control and no gripper control in the MVP —
  arms move, hands do not. (Orca is Phase 2; see Section 8.)
- **VLA / RLDX model bridge.** Closed-loop policy inference is a separate future effort.
- **Arm–arm self-collision avoidance** via a planner/constraint solver. The MVP relies
  on per-arm workspace limits and operator care (see Section 7, Risks).
- **Remote / off-LAN teleoperation.** Local operation only for now, unlike Avatar.

---

## 3. Current System

The current stack from the Avatar demo is in the `FTRILabOdyssey` monorepo, which mounts two ROS 2 workspaces
inside a Docker container (CUDA 12.8 + ROS 2 Humble):

- **`ARInnovLabEuphemeCommon`** — shared messages, robot descriptions (URDFs), file server. Branch: `mainline`.
- **`ARInnovLabEuphemeMotion`** — the arm controller and teleop input. Most updated branch: `nodoka/dev`.

### 3.1 Reusable building blocks

| Component | Package | What it does | Reuse for Duo |
|---|---|---|---|
| `sequencer` (C++) | `avatar_arm_controller` | 1 kHz libfranka torque control, per-arm. Selectable controller: OSC (Operational Space Control) is our chosen controller (see Section 3.4); Drake provides dynamics (M, J, FK). Already parameterized per side (`controller_type: osc` set in the per-side configs). | Directly — one instance per arm. |
| `vive_device.py` | `avatar_teleop_input` | Vive Tracker > delta Cartesian pose, with engage-gating, measured-pose anchoring, velocity clamps, a "leash" on command-vs-measured, and workspace clipping. Already side-agnostic and has a `bimanual.shoulder_scale_y` param. | Directly - one instance per tracker. |
| `dual_teleop.launch.py` | `avatar_teleop_input` | Brings up 2× `vive_device` (+ MANUS/Sharpa/recording). | **Adapt** — need a lean, hands-free Duo variant. |
| `avatar.urdf.xacro` | `avatar_description` | Dual-FR3 model with pluggable EE args. | Superseded by the new Franka Duo URDF (see Section 3.2). |
| `data_collector` + `dual_data_collection_params.yaml` | `avatar_teleop_input` | Bimanual HDF5 recording. | Directly - (arm-only fields for MVP).  Will need extending later for full teleop data (for model training) |
| Per-side configs | both | `left_params.yaml` / `right_params.yaml` (sequencer), `left_vive_params.yaml` / `right_vive_params.yaml` (teleop). | **Adapt** to Duo geometry/IPs/serials. |

### 3.2 Provided assets (confirmed available)
- Franka Duo URDF already exists in the repo under
  `common_ros_ws/src/descriptions/odyssey_description/` — this replaces the older
  Vention-rig `avatar.urdf.xacro` / `dual_fr3.urdf` as the geometric source of truth.
  It includes the Duo mount (`accessories/fr3_duo_mount_v0_3/`), a two-arm robot
  macro (`robots/fr3_duo/fr3_duo.xacro`), and the Orca-hand model
  (`robots/fr3_duo_orca/fr3_duo_orca.urdf.xacro` + `end_effectors/orca_hand/{left,right}.xacro`).
- **URDF choice:** use the `fr3_duo_orca` model — arms with
  the Orca hands attached, even though the physical Duo has no hands yet. The 
  same URDF is correct for simulation (in IsaacSim), where we can command the
  simulated Orca hands from the MANUS gloves over ROS topics, and it keeps one model
  across sim and eventual hardware. On the physical robot - just won't have hands
  mounted for a while; the extra hand links are harmless (the per-arm sequencer only
  builds a Drake model from its configured `joint_names`, so the hand joints are
  ignored by arm control — see Section 5.2).
- **Important:** The only instantiable top-level URDF model is `fr3_duo_orca.urdf.xacro`.
- **To verify (RViz):** base-to-base transform, per-arm base frames, and the exact
  link/joint names the model produces — arms come out as
  `left_fr3v2_*` / `right_fr3v2_*` (e.g. flange `left_fr3v2_link8`), not the old
  Eupheme `fr3_left_*` names. The sequencer configs must reference these new names.

### 3.3 Teleop control model - how `vive_device` works currently
`vive_device` computes incremental motion: each tick it takes the Vive Tracker's
pose delta (translation + rotation) since the previous tick, transforms it from the
SteamVR world frame into the robot frame, clamps it to velocity limits, applies it to
a running command target `cur_T_`, leashes that target against the arm's *measured* EE
pose, clips to a Cartesian workspace box, and publishes a `geometry_msgs/Pose` on
`/{side}/set_cartesian_position`. The sequencer's active controller (OSC — see Section 3.4)
tracks it.

Teleop is gated by an "episode signal" (mmap flag) so motion only happens when
engaged; `test_mode:=true` forces engagement for hardware-free bringup.  This is so that a single human operator can run the system without needing a dedicated test operator on the console, since they can't reach the keyboard while operating.

Key consequence for the MVP: arm teleop needs nothing from the end-effector. The
Vive path already produces exactly the per-arm Cartesian command the sequencer
consumes. This is why arms-only teleop is a clean, small first milestone.

### 3.4 Control law: OSC (Operational Space Control)
Recently, an OSC (Operational Space Control) controller became available for use on the project,
and it is the controller I propose to use for the Duo instead of the pose > joint IK
solver. The per-side sequencer configs already select it on dev_nodoka (`controller_type: osc`).

What OSC is and why it's preferred (thanks Claude):
- **Torque-level Cartesian impedance controller.** OSC computes joint torques directly
  from the task-space (Cartesian) pose error using the robot's dynamics:
  `tau = J_pos^T (Λ_pos (Kp_p e_p − Kd_p ẋ)) + J_ori^T (Λ_ori (Kp_r e_r − Kd_r ω)) + nullspace posture + joint-limit avoidance`,
  where the task-space inertia matrices `Λ` come from the SVD pseudo-inverse of
  `(J M⁻¹ Jᵀ)` and derivative gains are critically damped (`Kd = 2√Kp`).
- **No separate IK solve in the loop.** Unlike the Drake IK path (which solves
  pose → joint targets, then a joint controller tracks them), OSC consumes the desired
  Cartesian pose *directly* and does its operational-space computation inside the 1 kHz
  RT step. Drake is still used, but only for dynamics — mass matrix `M`, geometric
  Jacobian `J`, and forward kinematics — not for IK.
- **Advantages for teleop:** smoother, compliant Cartesian tracking; natural impedance
  behavior (safer on contact); a dynamically-consistent nullspace for posture control
  and joint-limit avoidance without fighting the task; and no IK solver failures /
  discontinuities in the loop.
- **Same interface.** OSC and the IK path both consume the identical
  `/{side}/set_cartesian_position` Cartesian pose command. Switching control laws is a
  config change (`controller_type`), so **nothing upstream of the sequencer changes** —
  `vive_device` and (later) the model bridge are unaffected.
- **Tunables (per side):** `control_loop.osc.kp_translation`, `osc.kp_rotation`,
  `osc.residual_mass_vec` (distal-joint conditioning), and the nullspace posture target.
  These need per-arm tuning on the Duo (see Section 7.2 / Risks).

---

## 4. Target Architecture (MVP)

```
Operator (two hands, each attached to a Vive Tracker)
        │
        │  SteamVR (headless) pose stream
        ▼
┌───────────────────────── Odyssey workstation (single box, RT kernel) ──────────────────────────┐
│                                                                                                │
│  vive_device (left)   ──/left/set_cartesian_position──►  sequencer_left  ──libfranka──► FR3 L  │
│  vive_device (right)  ──/right/set_cartesian_position─►  sequencer_right ──libfranka──► FR3 R  │
│        ▲                                                      │                                │
│        └──────────/left|right/cartesian_pose (measured)◄──────┘  (feedback for leash/anchor)   │
│                                                                                                │
│   /left/joint_states ┐                                                                         │
│   /right/joint_states┴─► joint_state_merger ──/joint_states──► robot_state_publisher (ONE) ──► /tf
│                                             (fr3_duo_orca URDF) ──► robot_description          │
│                                                                                                │
│  (optional) data_collector  ──► bimanual HDF5   [record:=false by default in MVP]              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

Two independent per-arm control chains; a joint_state_merger feeds one shared RSP for
TF/visualization; one optional recorder. No hand/glove teleop nodes in the MVP
(the loaded model has Orca hands, but arm control ignores those joints — see §5.2;
in sim they're driven separately over ROS, see §8).

---

## 5. Required Changes & Additions

Organized by package. Each item notes **New** vs **Modify**.

### 5.1 `ARInnovLabEuphemeCommon` — robot description
1. **Already present:** — use `fr3_duo_orca` as-is. Load the
   `robots/fr3_duo_orca/fr3_duo_orca.urdf.xacro` model (arms + Orca hands). We use
   the hands-attached model even with no physical hands yet — it's correct for
   IsaacSim (command the simulated hands from MANUS over ROS) and gives us one model
   across sim and hardware. No new arms-only URDF is needed. (Note: the
   `robots/fr3_duo/fr3_duo.xacro` file is only a macro, not a loadable model — do
   not try to load it directly.)
2. **Verify (RViz):** base-to-base transform, per-arm base frames, and the exact
   prefixed link/joint names the model emits (`left_fr3v2_*` / `right_fr3v2_*`, flange
   `{side}_fr3v2_link8`, Orca hand links prefixed `{side}_`). The sequencer configs
   must reference these exact names — see §5.2. `odyssey_description/launch/visualize.launch.py`
   already loads `fr3_duo_orca` for this check.

### 5.2 `avatar_arm_controller` — dual sequencer bringup
3. **New:** `config/odyssey_left_params.yaml`, `config/odyssey_right_params.yaml` — Duo arm
   IPs, `ee_link`, home joint configs, and conservative velocity/torque limits and
   per-arm Cartesian workspace limits for first bringup. `has_gripper: false` for MVP.
   Set `controller_type: osc` and provide the per-arm OSC gains under
   `control_loop.osc` (`kp_translation`, `kp_rotation`, `residual_mass_vec`) plus the
   nullspace posture target; these need tuning on the Duo (see Risks).
   - **Link/joint names must match the `fr3_duo_orca` model, NOT the Eupheme names.**
     Set `ee_link: {side}_fr3v2_link8`, `base_link: base`, and `joint_names:
     [{side}_fr3v2_joint1 … joint7]`. The old `fr3_left_*` / `fr3_right_*` names in
     `left_params.yaml` / `right_params.yaml` do **not** exist in this model. Because
     each sequencer builds its Drake model from only these `joint_names`, the Orca
     hand joints in the URDF are automatically ignored by arm control (this is why
     the hands-attached model is safe for arms-only teleop).
   - **Param-key hygiene (load-bearing):** the existing per-side YAMLs are keyed by
     the node name (`sequencer:`). ROS 2 only applies a params block to a node whose
     name matches the top key (or the `/**` wildcard). Since the launch (item 4) names
     the nodes `sequencer_left` / `sequencer_right`, the new config files **must** use
     a `/**:` top key — otherwise params silently don't load and the nodes come up on
     defaults (wrong IP, no OSC gains) with no obvious error.
4. **New:** `launch/duo_sequencers.launch.py` — brings up one `robot_state_publisher`
   (on the `fr3_duo_orca` URDF) plus two sequencer nodes (`sequencer_left`,
   `sequencer_right`), each with its per-side config. This is a significant change,
   because the existing `sequencer.launch.py` bundles one sequencer with its own RSP
   (robot state publisher); naively launching it twice creates two RSPs contending
   over `/tf` and `robot_description`. The Duo launch file must have a single RSP and
   namespace the two sequencers cleanly. (Both sequencers can share the one duo
   `/robot_description`; each `DrakeUtils` filters it down to its own `joint_names`.)
5. **New — joint-state merger (required for correct TF).** Each sequencer publishes
   only its own 7 joints on `/{side}/joint_states`. A single RSP needs one
   `/joint_states` carrying all 14 arm joints (plus, in sim, the hand joints) to
   compute a correct `/tf`; nothing merges the per-side topics today. Add a small
   `joint_state_merger` node (subscribe `/left/joint_states` + `/right/joint_states`,
   publish a combined `/joint_states`) and launch it from `duo_sequencers.launch.py`.
   This is genuinely new code, not a config tweak. (In sim, the simulated Orca hand
   joint states must also feed the merged `/joint_states` for the hands to render.)
6. **New (Phase 2 implementation, scaffold out now):** Orca hand command/state channels on the sequencer
   side — 2 sets of hand states (left + right) with empty endpoints to start. For 
   MVP-in-sim the hands are driven by MANUS > IsaacSim over ROS topics (see Section 8), not by the sequencer.
7. **Verify:** confirm both Franka controllers are reachable from the one workstation
   (NIC / switch topology) and that two 1 kHz FCI loops coexist under the RT kernel with
   CPU affinity set appropriately (have 32 cores on the machine, so able to pin each RT control thread).

### 5.3 `avatar_teleop_input` — Duo teleop input
8. **New:** `config/odyssey_left_vive_params.yaml`, `config/odyssey_right_vive_params.yaml` —
   the two tracker serials, Duo-specific initial poses, per-arm workspace limits, and
   `/{side}/set_cartesian_position` topics. Same param-key hygiene as Section 5.2: key
   these with `/**:` (not `vive_device:`), because the launch names the nodes
   `vive_device_left` / `vive_device_right`.
9. **New:** `launch/duo_teleop.launch.py` — a lean, hands-free variant of
   `dual_teleop.launch.py`: 2x `vive_device` only, with `data_collector` optional
   (`record:=false` default). No MANUS / Sharpa / retargeting nodes yet, but will extend later with a node for Orca hand kinematics and MANUS gloves.
   - Engage path (documented for operators): `vive_device` only publishes
     commands while the episode flag == 1, which is set by `data_collector` (SPACE) or
     by `test_mode:=true` (vive forces it). So with the default `record:=false`, the
     launch must also be given `test_mode:=true` or nothing moves. Expose both
     `record` and `test_mode` as launch args and state the dependency in the runbook.
   - **Note:** do not treat `dual_teleop.launch.py` as a working template — on
     `nodoka/dev` it still launches the removed `manus_to_sharpa` executable and
     won't run. Build the Duo launch fresh.
10. **New:** `config/odyssey_dual_data_collection_params.yaml` — the Duo recorder
    config for M4. Records both arms; stubs/zeros the hand joint + sensor fields so
    the pre-Orca dataset is full-schema and forward-compatible (per Section 9). Open item:
    confirm whether emitting zeroed hand fields is config-only or needs a small
    `data_collector` code change (the existing collector reads hand state from a
    Sharpa mmap that won't be present) — treat a minor code change as likely.
11. **Modify:** `vive_device` currently hardcodes a
    `_RIGHT_WRIST_CORRECTION` matrix for tracker-to-EE mounting orientation. Confirm the
    left tracker's physical mounting yields a correct frame; if the two trackers mount
    differently, change this correction to a per-side config parameter rather than a
    hardcoded constant.

### 5.4 Documentation
12. **New/Modify:** single station Duo teleop runbook in the Motion README and Odyssey
    `CLAUDE.md` (bringup order, tracker pairing, engage/`test_mode` dependency, safety
    limits). Per lab best practice, written so a new co-op can run it months from now.

### 5.5 What we are not changing (to protect the existing line)
- The single-arm and old-Eupheme bimanual configs/launch files stay as-is (new files,
  not edits, wherever practical - potentially put all Odyssey files that don't fit anywhere else into a new directory within Motion?).
- MANUS/Sharpa nodes, `manus_to_sharpa*`, `sharpa_*`, tactile pipeline left as-is.

---

## 6. Milestones & Verification

| # | Milestone | Verify |
|---|---|---|
| M0 | `fr3_duo_orca` model loads; both workspaces build in-container | Clean `colcon build`; model loads in RViz (`visualize.launch.py`) with correct dual-arm + hands geometry; confirm prefixed link names (`{side}_fr3v2_link8`) |
| M1 | Dual sequencer bringup (sim interface or arms in guide/idle) | Both sequencers start, **one** RSP, **joint_state_merger publishes all-joint `/joint_states`**, `/tf` sane for both arms, no topic contention, per-side params actually loaded (check IPs/OSC gains, not defaults) |
| M2 | Single-arm tracker regression (right only, `test_mode:=true`) | Right arm tracks tracker exactly as in the current single-arm flow |
| M3 | Full bimanual Vive teleop (arms only), `test_mode:=true` | Both arms driven independently by their trackers; no cross-talk; limits enforced; left-arm frame correct (wrist-correction check) |
| M4 | Short recorded bimanual session (small dataset) | `data_collector` writes a valid bimanual HDF5 with the **full** schema — arm fields populated, hand-joint/sensor fields present but **zeroed/stubbed** until Orca hands arrive |
| M5 | Runbook documented | A second person brings up the system from the doc alone |

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| **Two 1 kHz FCI loops on one host** starve each other or miss RT deadlines | Control instability / protective stops | RT kernel present; pin each control thread to dedicated cores (32 available); start one arm, add the second; monitor cycle-time. |
| **Network to two Franka controllers** from one box | One arm unreachable | Confirm NIC/switch topology and per-arm IPs before M1; the Eupheme configs used 172.16.0.2/.3 as a reference. |
| **Arm–arm self-collision** (no planner in MVP) | Hardware damage | Per-arm non-overlapping Cartesian workspace limits; conservative velocity caps; operator supervision; e-stop within reach. Assessed as non-trivial to add now (see note below), so it stays post-MVP. |
| **OSC gain tuning** on the Duo (new EE mass/geometry vs. where OSC was first validated) | Sluggish or unstable/oscillating Cartesian tracking | Start with the existing per-side OSC gains; tune `kp_translation`/`kp_rotation` conservatively per arm; keep torque/velocity caps low during M2/M3; the impedance behavior degrades gracefully (compliant) rather than diverging if gains are too soft. |
| **Left tracker frame mismatch** (hardcoded wrist correction) | Left arm mirrors/mis-rotates | Verify at M2/M3; parameterize the correction per side if needed. |
| **Regression to single-arm workflow** | Breaks existing work | Add new files rather than editing shared ones; keep single-arm launch/configs intact; M2 is an explicit regression gate. |

**On self-collision difficulty (why it stays post-MVP):** the current control stack is
not set up for it. Each `sequencer` is a separate process that builds its own
single-arm Drake `MultibodyPlant` (`base_link`→`ee_link`) and does so **dynamics-only —
no Drake `SceneGraph` and no collision geometry is registered at all** (Drake is used
purely for M, J, FK). So neither process has the other arm's state or any collision
model. Adding real self-collision checking means new work: a shared monitor that
receives both arms' joint states, builds a two-arm Drake model with a
SceneGraph + collision geometry, runs per-cycle signed-distance queries, and enforces
a stop/clamp across the process boundary back into both 1 kHz loops. That is a small
project of its own, not a config tweak — hence it remains a post-MVP item, with the
workspace-limit + supervision mitigations above covering the MVP.

## 8. Later Phases (context, but will be implementing after the MVP)

Listed so the MVP design leaves the right seams open:

1. **Orca hand integration (Phase 2).** The Orca hands are already in the loaded
   `fr3_duo_orca` model. Phase 2 adds the physical hardware **driver** and a
   `/{side}/hand/*` command/state channel. The Orca is ~17 DOF with force/torque (and
   possibly tactile) sensing — richer than the old Sharpa path.
2. **MANUS glove teleop → Orca (sim first, then hardware).** Bring glove → hand
   retargeting into the Duo flow to teleoperate the Orca hands. Because the loaded
   model already carries the hands, we can do this **in IsaacSim before any physical
   hand exists**: MANUS glove → retargeting node → `/{side}/hand/*` joint commands →
   simulated Orca hands in IsaacSim (over ROS topics). This is the "Additional" MVP
   goal in §2.1 and validates the hand teleop path early. The existing
   `manus_to_sharpa*` / dexr retargeting is a reference pattern; Orca-specific
   retargeting (against the Orca URDF) will be needed.
3. **RLDX-1 model bridge (Phase 3).** Ability to swap the human teleop source for an interchangeable VLA policy.
   The per-arm Cartesian + (later) hand command topics are intentionally the same
   named channels the model bridge will publish to — the bridge replaces `vive_device`
   as the command producer. Bimanual demos recorded via `data_collector` become the
   LeRobot-format training data.

Down the line: this teleop command interface is the same interface
the model bridge will target later. Keeping per-arm arm-command and
hand-command channels cleanly separated is key to a stable autonomous system later.

---

## 9. Open Questions

- Duo home poses and safe per-arm workspace boxes for the shared workspace?

**Resolved:**
- *URDF / model choice* — use the `fr3_duo_orca` model (arms + Orca hands) as-is,
  even with no physical hands yet. Correct for sim; one model across sim + hardware;
  arm control ignores the hand joints. No arms-only URDF needed. (§3.2, §5.1)
- *M4 recording* — record the full-schema dataset now with hand joint/sensor
  fields zeroed/stubbed, so the small pre-Orca dataset is forward-compatible with
  the eventual Orca data (no migration later). This needs a minor
  `data_collector` config/extension to output the stubbed hand fields (as in Section 5.3).
- *Joint-state merger* — the "one RSP" design requires a new `joint_state_merger`
  node to combine both arms' `/{side}/joint_states` into a single `/joint_states`
  for correct TF. Added as §5.2 item 5.
- *Param-key hygiene* — per-side config files for uniquely-named nodes must use the
  `/**:` top key, or params silently don't load. (§5.2, §5.3)
- *Engage without recording* — `test_mode:=true` is required for teleop to move when
  `record:=false`. (§5.3)