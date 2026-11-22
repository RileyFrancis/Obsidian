All monsters have the following attributes:
1. A name
2. A number (for the purpose of fetching the correct monster)
3. Attributes like **health**, **attack**, **defense**, and **speed**
4. Passive ability
5. Action set

On a monster's turn, it will perform all possible actions in its action set sequentially. If one or more of the actions in its action set are impossible, those actions will be skipped. The possible actions that a monster can take are outlined below:

> [!tip] **MOVE {distance}**
> **MOVE** a number of tiles toward or away from some target. This target could be the nearest player, the nearest token, a specific tile, or something else. The monster will always take the path that will move it to its goal fastest. If multiple targets are equally far away or if multiple tiles/paths bring the monster closest to its goal, the players may decide which of those targets/tiles the monster goes to.
> - **MOVE 5:** toward the nearest player
> - **MOVE 2:** toward the nearest token
> - **MOVE 8:** toward the nearest player that lost health during their last turn
> - **MOVE 1:** away from the closest player
> - **MOVE 2:** toward the nearest monster
> - **MOVE 5:** toward the nearest player **IF** no other monster is within 3 tiles.

> [!tip] **ATTACK {range} {# players}**
> **Attack** one or more players that are within range of the monster. Monsters may only attack in straight lines through open connections between tiles up to their max range. When attacking a player, that player rolls both their D20 and the monster D20. Then they add their speed score to 

