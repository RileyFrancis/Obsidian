- We have `/Data/ppmi` which contains many sub-xxxx folders for subjects, but also have `/Data/ppmi/Data/PPMI_fMRI_FC` which is giving errors in our data loader.
- Solve times are extremely long
	- Complex optimization problem

```
Presolved model has 586872 SOS constraint(s)
Variable types: 4605748 continuous, 306169 integer (306169 binary)
```
^^^ Lots of variables!!!

### Testing with ABCD dataset
- Different data format
	- Data is preprocessed as numpy files. Very nice dataset actually
- Very unbalanced dataset (about 90% class 0)
- GNN often just predicts class 0 for everything to get 90% accuracy. Still trying to fix this

