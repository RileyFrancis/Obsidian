***Riley Francis  - rif17002***
[[Assignment_6.pdf]]
- - -
## Part 2
### Support Vector Machine
#### a.
We want to find the Lagrangian of the formulation $$\min_{w,b,\xi}\left\{ \frac{1}{2} w^\top w + \frac{C}{2}\sum\xi_{i}^2\right\}$$subject to $y_{i}(w^\top w + b) \ge 1 - \xi_{i}$ and $i\in \{1,\ldots N\}$.

We can rearrange the constraint to get $y_{i}(w^\top w + b) \le 0$.

The Lagrangian of the formula above is$$\begin{align}\mathcal{L}(w,b,\xi,\alpha) &= \frac{1}{2}w^\top w + \frac{C}{2}\sum_{i=1}^N\xi_i^2-\sum_{i=1}^N\alpha_i\big(y_i(w^\top x_i+b)-1+\xi_i\big) \\ &= \frac{1}{2}w^\top w + \frac{C}{2}\sum_{i=1}^N\xi_i^2-\sum_{i=1}^N\alpha_i\big(y_i(w^\top x_i+b)-1+\xi_i\big)\end{align}$$

#### b.
The partial derivative of the Lagrangian from *part a.* with respect to $w$, $b$, and $\xi$ is as follows: 

### Decision Trees
#### a.
#### b.
#### c.


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