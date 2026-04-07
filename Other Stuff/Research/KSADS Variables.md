Below are the KSADS variables that are most important for irritability. We can select a few of the most important from each of these files to use. I've already selected variables from these files that seem most important, but they can be further pruned.

| Module  | File(s)                          | Variables to use (csv rows, inclusive)                            | Parent/Child | Pruned Variables | Total Variables |
| ------- | -------------------------------- | ----------------------------------------------------------------- | ------------ | ---------------- | --------------- |
| ODD     | `opp_defiant_disorder_p01.csv`   | `7:34`, `41`                                                      | Parent       | $28$             | $41$            |
| MDD     | `depressive_disorders_p01.csv`   | `8, 11, 23:29, 31:32, 45, 71:75, 77:78, 82, 86:89, 91, 93, 95:96` | Parent       | $28$             | $97$            |
| MDD     | `depressive_disorders01.csv`     | `8, 11, 23:29, 31:32, 45, 71:75, 77:78, 82, 86:89, 91, 93, 95:96` | Child        | $28$             | $97$            |
| Various | `abcd_ksads01.csv`               | See below                                                         | Child        | $30$             | $959$           |
| DMDD    | `disruptive_mood_dysreg_p01.csv` | `7:17`                                                            | Parent       | $10$             | $17$            |
| DMDD    | `disruptive_mood_dysreg01.csv`   | `7:17`                                                            | Child        | $10$             | $17$            |
Total pruned variables: $134$
## abcd_ksads01.csv
This contains some overlap with other files, but the variables are different. This is a heavily pruned list. The full file contains 959 variables.

| Module             | Row # | Variable Name  | Description                                          |
| ------------------ | ----- | -------------- | ---------------------------------------------------- |
| DMDD               | 109   | ksads_3_848_p  | Diagnosis - DMDD Current                             |
| DMDD               | 110   | ksads_3_228_p  | No 3-month period without symptoms                   |
| DMDD               | 111   | ksads_3_227_p  | Present at least 12 months                           |
| DMDD               | 112   | ksads_3_229_p  | Temper/irritability present in at least 2 settings   |
| DMDD               | 113   | ksads_3_226_p  | Temper outbursts occur 3+ times per week             |
| ODD (irritability) | 408   | ksads_15_433_p | Often angry or resentful Present                     |
| ODD (irritability) | 411   | ksads_15_432_p | Often touchy or easily annoyed Present               |
| ODD (irritability) | 413   | ksads_15_91_p  | Often loses temper Present                           |
| MDD                | 21    | ksads_1_3_p    | Irritability Present                                 |
| MDD                | 40    | ksads_1_1_p    | Depressed Mood Present                               |
| MDD                | 42    | ksads_1_5_p    | Anhedonia Present                                    |
| MDD                | 46    | ksads_1_159_p  | Fatigue Present                                      |
| MDD                | 51    | ksads_1_179_p  | Hopelessness Present                                 |
| MDD                | 54    | ksads_1_177_p  | Guilt Present                                        |
| MDD                | 30    | ksads_1_175_p  | Psychomotor Retardation Present                      |
| MDD                | 37    | ksads_1_181_p  | Decreased Self-Esteem Present                        |
| ODD (headstrong)   | 400   | ksads_15_95_p  | Often disobeys rules/requests Present                |
| ODD (headstrong)   | 404   | ksads_15_435_p | Often deliberately annoys people Present             |
| ODD (headstrong)   | 422   | ksads_15_434_p | Spiteful or vindictive Present                       |
| GAD                | 249   | ksads_10_45_p  | Excessive worries more days than not Present         |
| GAD                | 254   | ksads_10_324_p | Difficulty controlling worries Present               |
| ADHD               | 357   | ksads_14_76_p  | Difficulty sustaining attention Present              |
| ADHD               | 373   | ksads_14_80_p  | Easily distracted Present                            |
| ADHD               | 369   | ksads_14_84_p  | Difficulty remaining seated Present                  |
| ADHD               | 379   | ksads_14_88_p  | Impulsivity Present                                  |
| ADHD               | 351   | ksads_14_403_p | Acts like driven by a motor Present                  |
| ADHD               | 353   | ksads_14_405_p | Blurts out answers Present                           |
| Separation Anxiety | 203   | ksads_7_24_p   | Distress upon separation Present                     |
| Social Anxiety     | 220   | ksads_8_29_p   | Fear of Social Situations Present                    |
| Social Anxiety     | 231   | ksads_8_301_p  | Social situations invariably provoke anxiety Present |
