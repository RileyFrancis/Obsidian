### Final course grades
Final exam: 30%
Homework (3): 20%
Project: 25%
Midterm: 25%

### Final exam format
You can use two sheets of paper

Expect about half relational algebra and SQL. The other half will be as follows:
##### Includes
- Everything from Exam 1 (50%)
- ERD
	- Know how to draw one from scratch
		- Look at solution to HW 3 to know how to draw arrows & notation
	- From an ERD, know how to convert it to SQL
	- Convert a schema into an ERD
	- 7 rules
- Normalization
	- Normal forms (1NF, 2NF, 3NF, BCNF, 4NF
	- **SKIP:** Canonical cover
- *ERD and Normalization will be about 25-30% (everything else will be stuff like transactions, index and storage, and everything else)*
- *Only possible question for data analytics is just the difference between data warehouse and database*
	- **SKIP:** OLAP
- Transactions
	- Understand serializability and recoverability
	- Schedules (serial schedule)
		- Identify conflicts in schedules (conflict serializability)
		- View serializability
		- Recoverability
		- Cascadeless schedules
- Concurrency Control
	- Lock-Based Protocols (modes X and S)
	- Deadlock & starvation
		- Deadlock detection
	- Schemes
	- Multi-version timestamp ordering
	- phantom phenomenon
- Index & Storage
	- Very important: B+ tree
		- Insert/delete nodes
		- Properties
		- Querries
	- Records (fixed and variable length)
	- Search key and pointer
	- Understand multilevel index (prob no question on this)
	- Important: Hashing
	- `create index name on relation(attributes)`
