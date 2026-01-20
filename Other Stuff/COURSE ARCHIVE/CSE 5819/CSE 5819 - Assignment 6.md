***Riley Francis  - rif17002***
[[Assignment_6.pdf]]
- - -
## Part 2
### Support Vector Machine
#### a.
We want to find the Lagrangian of the formulation $$\min_{w,b,\xi}\left\{ \frac{1}{2} w^\top w + \frac{C}{2}\sum\xi_{i}^2\right\}$$subject to $y_{i}(w^\top w + b) \ge 1 - \xi_{i}$ and $i\in \{1,\ldots N\}$.

We can rearrange the constraint to get $1 - \xi_{i} - y_{i}(w^\top w + b) \le 0$. If we let $g_i(w,b,\xi) = 1 - \xi_{i} - y_{i}(w^\top w + b)$, then this becomes $g_i(w,b,\xi)\le 0$. We are trying to find a Lagrangian: $$\mathcal L = \text{objective} + \sum_i \alpha_i g_i$$The objective comes directly from the first equation above. If we introduce the Lagrange multiplier $\alpha$, the Lagrangian of the formula above is then$$\begin{align}\mathcal{L}(w,b,\xi,\alpha) &= \frac{1}{2}w^\top w + \frac{C}{2}\sum_{i=1}^N\xi_i^2-\sum_{i=1}^N\alpha_i\big(y_i(w^\top x_i+b)-1+\xi_i\big)\end{align}$$
#### b.
The partial derivative of the Lagrangian from *part a.* with respect to $w$, $b$, and $\xi$ is as follows: $$\begin{align}\frac{\partial\mathcal L}{\partial w}&=w-\sum_{i=1}^N\alpha_iy_ix_i=0\Rightarrow & w =\sum_{i=1}^N\alpha_iy_ix_i \\ \frac{\partial\mathcal L}{\partial b}&=\sum_{i=1}^N\alpha_iy_i=0\Rightarrow &0=\sum_{i=1}^N\alpha_iy_i \\ \frac{\partial\mathcal L}{\partial \xi_i}&=C\xi_i-\alpha_i=0\Rightarrow &\xi_i=\frac{\alpha_i}{C}\end{align}$$

### Decision Trees
#### a.
First we calculate the Gini impurity of $y$:$$Gini(s)=1-\sum_ip_i^2=1-(p_{positive}^2+p_{negative}^2)=1-\big((0.666)^2+(0.333)^2\big)=0.445$$Next, we find the Gini impurity of each of the possible splits.

For $x1$, we have $\frac{4}{6}(1-(0.5^2+0.5^2))+\frac{2}{6}(1-1^2+0^2)=0.333$, so the information gain is $0.112$.

Next, we calculate the Gini impurity of each of the possible splits of $x2$:

| Threshold | Weighted Gini | Gini Gain |
| :-------: | :-----------: | :-------: |
|     1     |     0.445     |   0.000   |
|     3     |     0.417     |   0.028   |
|     4     |     0.222     |   0.223   |
|     6     |     0.333     |   0.112   |
|     7     |     0.267     |   0.178   |
|    11     |     0.400     |   0.045   |
Since the largest Gini gain is $x2$ with a threshold of $x2\le 4$, that is the split that we will use.
#### b.
![[CSE5819_assignment6_decision_tree]]
#### c.
The root node of the decision tree could not remain the same since this would lead to wrongly classifying the altered data point as positive. We can see this by recalculating the Gini table:

Splitting on $x1$: Gini gain = 0.25
Splitting on $x2$:

| Threshold (x2) | Weighted Gini | Gini Gain |
|:---------------|:---------------|:-----------|
| 1  | 0.500 | 0.000 |
| 3  | 0.444 | 0.056 |
| 4  | 0.333 | 0.167 |
| 6  | 0.333 | 0.167 |
| 7  | 0.333 | 0.167 |
| 11 | 0.444 | 0.056 |
As you can see, the new largest Gini gain is actually splitting on $x1$ instead.

## Part 3: Programming
**Submitted separately**

### Part 1: ChatGPT
##### 1. What is the most used evaluation metrics for classification?
![[Pasted image 20251028130734.png]]
##### 2. What is the most used evaluation metrics for regression?
![[Pasted image 20251028163559.png]]
##### 3. For supervised learning algorithms, what would be a reliable procedure of evaluating their performance?
![[Pasted image 20251028163642.png]]
##### 4. Study bagging (bootstrapping aggregation)?
![[Pasted image 20251028164239.png]]
##### 5. Why the bagging procedure can create models of lower variance?
![[Pasted image 20251028163831.png]]
##### 6. What are the advantages of Support vector machine?
![[Pasted image 20251028164444.png]]
##### 7. What is support vector regression? (We have discussed support vector classifier, but SVM can also be extended to solve regression problems.)
![[Pasted image 20251028164630.png]]
##### 8. How many different formulations of SVM?
![[Pasted image 20251028164708.png]]
##### 9. How to solve an SVM optimization problem? 
![[Pasted image 20251028164819.png]]