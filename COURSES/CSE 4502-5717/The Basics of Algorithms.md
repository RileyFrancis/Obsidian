Algorithms are a technique to solve a given problem. Our problems can either be decidable or undecidable. An example of an undecidable problem is the halting problem, in which are impossible to create an algorithm for it.

As a subset of the decidable problems, we have tractable (ex. sorting, matrix multiplication) and intractable (np hard problems, ex. SAT, CLIQUE).

Almost all algorithms have an input and an output.

For example, matrix multiplication takes two inputs being matrices $A$ and $B$, and outputs a new matrix $C$ which is the product of the two input matrices

### How do we measure the performance of an algorithm?
- **Time Complexity**: How much time it takes to run an algorithm. (Big-O notation). Time complexity is an integer function of the input size (the number of memory cells needed to describe the problem instance).
- **Space Complexity:** How much physical storage an algorithm uses when it runs (also use Big-O)

*Big-O*: We say that $f(n)=O(g(n))$ if $f(n)\le Cg(n)$ $\forall n\ge n_0$ where $C$ and $n_0$ are constants.

### Randomized Algorithm
A **randomized algorithm** is one where certain decision are made based on the outcome of random events (coin flips)

A **Monte Carlo algorithm** runs for a predetermined amount of time (so there is a low probability^[A low probability is one that is smaller than $n^{-\alpha}$, where $n$ is the input size and $\alpha$ is a probability parameter] that it may not find a solution to the problem in time)

A **Las Vegas algorithm** will always terminate with the correct answer. Its runtime is a random variable.

> [!info]
> 



