***Riley Francis***
- - -
> [!problem] Question 1
> The last HW asked you to: Prove that if there are simply connected open subsets $U$ and $V$ of $X$ such that $U \cup V=X$ and $U \cap V$ is nonempty and path connected, then $X$ is simply connected. Look through the book's proof of this and make sure you understand it. Note: we are proving a piece of the Seifert-van Kampen Theorem so you can't just say it is true due to Van-Kampen. Why is it important that $U \cap V$ is path connected?

![[Pasted image 20260407133538.png]]

$U\cap V$ must be path connected because if it were not, then you could not guarantee that you can connect $x_0$ to $f(a_n)$ via a path $\alpha_n$ that stays entirely within $U\cap V$. This would then mean that you can't create loops that are entirely contained within $U$ and $V$ separately.

> [!problem] Question 2
> For each of the following spaces, the fundamental group is either trivial, isomorphic to $\mathbb{Z}$ or isomorphic to the fundamental group of the figure eight. Determine which one it is in each case.
> 1. The "solid torus" $B^2 \times S^1$
> 2. The torus $T$ with a point removed
> 3. The cylinder $S^1 \times I$
> 4. $\mathbb{R}^3$ with the non-negative $x$, $y$ and $z$-axes removed.
> 5. $S^1 \cup (\mathbb{R}_+ \times \mathbb{R})$ viewed as a subset of $\mathbb{R}^2$
> 6. $S^1 \cup (\mathbb{R}_+ \times 0)$ viewed as a subset of $\mathbb{R}^2$

1. The fundamental group of $B^2 \times S^1$ is isomorphic to $\mathbb Z$.
2. The fundamental group of a torus $T$ with a single point removed is isomorphic to the figure eight.
3. The fundamental group of $S^1\times I$ is isomorphic to $\mathbb Z$.
4. The fundamental group of $\mathbb R^3$ with the non-negative $x$, $y$, and $z$ axes removed is isomorphic to the figure eight.
5. $S^1 \cup (\mathbb{R}_+ \times \mathbb{R})$ is isomorphic to $\mathbb Z$.
6. 

> [!problem] Question 3
> Show that if $A$ is a deformation retract of $X$ and $B$ is a deformation retract of $A$, then $B$ is a deformation retract of $X$

***Proof:*** Let $A$ be a deformation retract of $X$ and $B$ be a deformation retract of $A$. We must show that $B$ is a deformation retract of $X$.

Since $A$ is a deformation retract of $X$, then $A\subseteq X$ and there is a map $f:X\rightarrow A$ where $f(a)=a$ for all $a\in A$. The following are true:
1. $f(x,0)=x$ for all $x\in X$
2. $f(x,1)\in A$ for all $x\in X$
3. $f(a,t)=a$ for all $a\in A$ and $t\in I$.

Similarly, since $B$ is a deformation retraction of $A$, $B\subseteq A$ and there is a map $g:A\rightarrow B$ where $g(b)=b$ for all $b\in B$. The following are true:
1. $g(a,0)=a$ for all $a\in A$
2. $g(a,1)\in B$ for all $a\in A$
3. $g(b,t)=b$ for all $b\in B$ and $t\in I$.

We can then define the homotopy $h:X\rightarrow B$ as $$h(x, t) = \begin{cases} f(x, 2t) & t \in \left[0, \tfrac{1}{2}\right] \\ g\big(f(x,1), 2t-1\big) & t \in \left[\tfrac{1}{2}, 1\right] \end{cases}$$
1. $h(x,0)=f(x,2(0))=f(x,0)=x$ for all $x\in X$ $\checkmark$
2. $h(x,1)=g(f(x,1),2(1)-1)=g(f(x,1),1)\in B$ for all $x\in X$ $\checkmark$
3. When $t\in[0,\tfrac12]$, $h(b,t)=f(b,2t)=b$ and when $t\in[\frac12,1]$, $h(b,t)=g(f(b,1),2t-1)=g(b,2t-1)=b$ $\checkmark$

Since $h$ satisfies each of the above conditions, $B$ must be a deformation retraction of $X$.

> [!problem] Question 4
> Describe the deformation retraction of $S^n$ onto $\mathbb{R}^{n+1}-0$. Cleary explain why it meets all the conditions of a deformation retraction. ^[I think that this is supposed to be the other way, so I am going to solve this question as if it is asking about $\mathbb R^{n+1}-0$ onto $S^n$]

The deformation retraction of $\mathbb R^{n+1}-0$ onto $S^n$ is a function that normalizes all of the vectors beginning at the origin in $\mathbb R^{n+1}-0$. Specifically, we can define a function $f:(\mathbb R^{n+1}-0)\times I\rightarrow S^n$ that projects each point onto the circle. So, $f(x,t)=\frac{x}{(1-t)||x||+t}$ where $||x||$ is the norm of $x$. Here $t\in I$ interpolates between $x$ and the projected point on $S^n$.

We have each of the following:
1. $f(x,0)=x$ since when $t=0$ we have not moved.
2. $f(x,1)=\frac{x}{||x||}\in S^n$ is the complete projection onto $S^n$.
3. $f(a,t)=\frac{a}{(1-t)||a||+t}=\frac{a}{(1-t)+t}=\frac a1 = a$.

Therefore this is a deformation retraction.