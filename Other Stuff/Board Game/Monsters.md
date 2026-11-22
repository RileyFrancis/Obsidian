All monsters have the following attributes:
1. A name
2. A number (for the purpose of fetching the correct monster)
3. Attributes like **health**, **attack**, **defense**, and **speed**
4. Passive ability
5. Action set

On a monster's turn, it will perform all possible actions in its action set sequentially. If one or more of the actions in its action set are impossible, those actions will be skipped. The possible actions that a monster can take are outlined below:
1. **MOVE** a number of tiles toward or away from some target. This target could be the nearest player, the nearest token, a specific tile, or something else. The monster will always take the path that will move it to its goal fastest. If multiple of those paths exist, players may choose the path
	- **MOVE 5:** toward the nearest player
	- **MOVE 2:** toward the nearest token
	- **MOVE 8:** toward the nearest player that lost health during their last turn
	- **MOVE 1:** away from the closest player
	- **MOVE 2:** toward the nearest monster
	- **MOVE 5:** toward the nearest player **IF** no other monster is within 3 tiles.
2. **ATTACK** one or more players.