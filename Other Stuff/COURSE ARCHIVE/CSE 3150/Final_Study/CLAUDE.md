# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

This is the CSE 3150 (C++) coursework directory inside an Obsidian vault. The parent directory (`COURSES/CSE 3150/`) contains several independent sub-projects, each with its own build system:

| Directory | What it is |
|---|---|
| `Final_Study/` | *(here)* Scratch sandbox for final exam prep — `src/main.cpp` + `include/` |
| `Course_Project/` | BGP simulator — the largest project; header-only C++17 library + test suite |
| `Homework/day_*_hw/` | Individual homework submissions, each a standalone git repo with pytest tests |
| `CPP/` | Weekly practice files, compiled ad-hoc |

Each homework directory and the Course Project has its **own** `.git` repo. Changes inside them do not affect the parent Obsidian vault repo.

---

## Final_Study (this directory)

**Build and run:**
```bash
# from Final_Study/
bash buildnrun.sh
# which is equivalent to:
g++ src/*.cpp -o build/program.exe -I include/
./build/program.exe
```

Headers live in `include/`, sources in `src/`. Output binary goes to `build/program.exe`.

---

## Course Project (BGP Simulator)

**Build:**
```bash
cd ../Course_Project
make              # builds build/bgp_simulator
make test         # builds and runs all test binaries
make clean
```

**Run a single test:**
```bash
make test_bgp_policy && ./build/test_bgp_policy
# available: test_graph, test_announcement, test_bgp_policy,
#            test_flatten_graph, test_seeding, test_propagation,
#            test_output, test_rov, test_caida_policy
```

**Run the simulator:**
```bash
./build/bgp_simulator <caida_file> <announcements.csv> <rov_asns.txt> <output.csv>
make run_prefix   # uses bench/prefix/ data
make run_many     # uses bench/many/ data
```

Compiler flags: `-std=c++17 -Wall -Wextra -g -Iinclude`. All implementation is header-only under `include/`; `src/main.cpp` is the entry point.

**WebAssembly build** (requires Emscripten):
```bash
source ~/emsdk/emsdk_env.sh
make wasm         # writes web/bgp_sim.js + web/bgp_sim.wasm
```

---

## Homework Assignments

Each `Homework/day_N_hw/` directory has its own build and test pattern:

**Assignments with a Makefile** (e.g. `day_16_hw`, `day_22_hw`):
```bash
cd ../Homework/day_16_hw
make              # compiles solution binary
make test         # compiles then runs: pytest test_game.py -v
make run          # runs the solution binary directly
make clean
```

**Assignments without a Makefile** (e.g. `day_14_hw`):
```bash
g++ -std=c++17 starter_main.cpp -o program.out
pytest test_homework.py -v
```

**Run a single pytest test by name:**
```bash
pytest test_game.py -v -k "test_name"
```

Tests are written in Python (pytest) and drive the compiled C++ binary via subprocess — they are integration tests, not unit tests. Compiler standard is C++17 throughout.

---

## Course_Project Architecture

The simulator is a header-only C++17 library. All types live in `include/`:

- `as.hpp` — `AS` struct: holds a `unique_ptr<Policy>`, a cached raw `BGP*`, and a per-prefix RIB (`unordered_map`)
- `as_graph.hpp` — `ASGraph`: builds an adjacency list from a CAIDA topology file, runs cycle detection (DFS), and assigns propagation ranks (BFS from leaves upward into `rank_structure_`)
- `announcement.hpp` — `Announcement` struct; `received_from` is a 1-byte enum (not a string) for performance
- `policy.hpp` — `Policy` (base), `BGP`, `ROV` — BGP route selection and ROV invalid-route rejection

Propagation runs in three phases (up → across → down) iterated over `rank_structure_`. The RIB is iterated directly by `const&` during propagation to avoid copying.

The `wasm_main.cpp` entry point exposes `run_bgp_simulation` to JavaScript via Emscripten's `ccall`.
