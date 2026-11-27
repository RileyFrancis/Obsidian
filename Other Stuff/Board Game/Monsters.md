All monsters have the following attributes:
1. A name
2. A number (for the purpose of fetching the correct monster)
3. A level
4. Attributes like **health**, **attack**, **defense**, and **speed**
5. Passive ability
6. Action set

On a monster's turn, it will perform all possible actions in its action set sequentially. If one or more of the actions in its action set are impossible, those actions will be skipped. The possible actions that a monster can take are outlined below:

> [!tip] **MOVE {distance} {target}**
> **MOVE** a number of tiles toward or away from some target. This target could be the nearest player, the nearest token, a specific tile, or something else. The monster will always take the path that will move it to its goal fastest. If multiple targets are equally far away or if multiple tiles/paths bring the monster closest to its goal, the players may decide which of those targets/tiles the monster goes to.
> - **MOVE 5** toward the nearest player
> - **MOVE 2** toward the nearest token
> - **MOVE 8** toward the nearest player that lost health during their last turn
> - **MOVE 1** away from the closest player
> - **MOVE 2** toward the nearest monster
> - **MOVE 5** toward the nearest player **IF** no other monster is within 3 tiles.

> [!tip] **ATTACK {range} {# players}: {hit effect}**
> **Attack** one or more players that are within range of the monster. Monsters may only attack in straight lines through open connections between tiles up to their max range. The range is counted as the tile distance between the player and the monster (so being in the same tile counts as range 0). If there are more players within range than targets that the monster can hit, it will prioritize attacking the player with lower sanity.
> 
> When attacking a player, that player rolls both their D20 and the monster D20. Then they add their speed score to their roll and the monster's speed score to the monster's roll. If the player's roll is then lower, the monster will deal damage equal to its attack to the player (sometimes reduced by defense). Sometimes an attack also triggers some effect too which triggers only on a successful hit.
> - **ATTACK 2 range, 1 player:** -
> - **ATTACK 0 range, $\infty$ player:** -
> - **ATTACK $\infty$ range, $\infty$ player:** -
> - **ATTACK 3 range, 2 player:** Drain 2 sanity
> - **ATTACK 1 range, 1 player:** Swap locations with the target hit

> [!tip] **TRANSFORM {requirements}: {stat increases}**
> Some monsters might **Transform**, gaining stats or extra abilities. In order for a monster to transform, all of the requirements for its transformation must be fulfilled. Stat increases could 
> - **TRANSFORM** 10 rounds: +3 speed, +2 defense
> - **TRANSFORM** if I share a location with a player: +3 attack
> - **TRANSFORM** 15 rounds, no other monsters exist: -

> [!tip] **General Action**
> A **general action** is any action that does not fit into the other actions above. This could include changing the stats of some players, placing tokens, or any other action  
> 
> - Players that share a tile with this monster lose 1 sanity
> - Place a acid token at the monster's location.
> - If this monster has not transformed, teleport to location X

