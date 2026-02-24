***Riley Francis***
- - -
> [!problem] Question 1
> Let $X$ be an ordered set in the order topology. Show that $\overline{(a, b)}\subseteq[a, b]$. Under what conditions does the equality hold?

***Proof:*** Let $X$ be an ordered set in the order topology. Let $x\in\overline{(a,b)}$, so every open neighborhood of $x$ must intersect $(a,b)$. Then consider the following:

If $x<a$, then we can choose some $m,n$ such that $m<x<n<a$. Then, $x\in\overline{(m,n)}$, but $(m,n)\cap(a,b)=\emptyset$ since $m<n<a$, contradicting the fact that $(m,n)$ must intersect $(a,b)$ if $x\in\overline{(a,b)}$. Thus $x\not<a$, so $a\le x$.

Similarly, if $b<x$, then we can choose some $m,n$ such that $b<m<x<n$. Then, $x\in\overline{(m,n)}$, but $(m,n)\cap(a,b)=\emptyset$ since $b<m<n$, contradicting the fact that $(m,n)$ must intersect $(a,b)$ if $x\in\overline{(a,b)}$. Thus $b\not<x$, so $x\le b$.

So, $a\le x\le b$, or equivalently, $x\in[a,b]$. Therefore, $\overline{(a,b)}\subseteq[a,b]$.

**Under what conditions does the equality hold?**
Equality will hold when $[a,b]\subseteq \overline{(a,b)}$. This means that both $a,b\in\overline{(a,b)}$, so every neighborhood of $a$ and every neighborhood of $b$ contains a point in $(a,b)$. In the order topology, neighborhoods of $a$ contain intervals of the form $(u,v)$ with $u<a<v$. Thus $a\in\overline{(a,b)}$​ exactly when every interval contains a point $x$ with $a<x<b$. This holds precisely when there is no element of $X$ that is the immediate successor of $a$. Otherwise, if $c$ were the smallest element greater than $a$, we could choose an interval around $a$ that lies entirely below $c$ and it would not intersect $(a,b)$.

Similarly, b∈(a,b)‾b\in\overline{(a,b)}b∈(a,b)​ exactly when there is no element of XXX that is the immediate predecessor of bbb.

> [!problem] Question 2
> Let $A_\alpha$ be a subset of a space $X$. Decide if $\overline{\cap A_\alpha} = \cap\overline{A_\alpha}$. If not, is one a subset of the other?

> [!problem] Question 3
> In the finite complement topology on $\mathbb R$, to what point or points does the sequence $x_n=\frac1n$ converge?

> [!problem] Question 4
> Show that the $T_1$ axiom is equivalent to the condition for each pair of points of $X$, each has a neighborhood not containing the other.

> [!problem] Question 5
> Prove that for functions $f:\mathbb R\rightarrow \mathbb R$, the $\epsilon-\delta$ definition of continuity implies the open set definition.

> [!problem] Question 6
> Suppose $f:X\rightarrow Y$ is continuous. If $x$ is a limit point of the subset $A$ of $X$, is it necessarily true that $f(x)$ is a limit point of $f(A)$?

> [!problem] Question 7
> Let $F:X\times Y\rightarrow Z$. We say that $F$ is continuous in each variable separately if for each $y_0$ in $Y$, the map $h:X\rightarrow Z$ defined by $h(x)=F(x\times y_0)$ is continuous, and for each $x_0$ in $X$, the map $k:Y\rightarrow Z$ defined by $k(y)=F(x_0\times y)$ is continuous. Show that if $F$ is continuous, then $F$ is continuous in each variable separately.

> [!problem] Question 8
> Let $F:\mathbb R\times\mathbb R\rightarrow \mathbb R$ be defined by the equation $$F(x\times y)=\left\{\begin{align}&\frac{xy}{x^2+y^2} & \text{if } x\times y\neq 0\times0 \\ &0 & \text{if } x\times y = 0\times 0\end{align}\right.$$
> 1. Show that $F$ is continuous in each variable separately.
> 2. Compute the function $g:\mathbb R\rightarrow \mathbb R$ defined by $g(x)=F(x\times x)$.
> 3. Show that $F$ is not continuous (using techniques of this class).

> [!problem] Question 9
> Let $\mathbb R^\infty$ be the subset of $\mathbb R^\omega$ consisting of all sequences that are "eventually zero," that is, all sequences $(x_1,x_2,\ldots)$ such that $x_i\neq 0$ for only finitely many of i. values of $i$. What is the closure of $\mathbb R^\infty$ in $\mathbb R^\omega$ in the box and product topologies? Justify your answer.

> [!problem] Question 10
> Given sequences $(a_1,a_2,\ldots)$ and $(b_1,b_2,\ldots)$ of real numbers with $a_i>0$ for all $i$, define $h:\mathbb R^\omega \rightarrow \mathbb R^\omega$ by the equation $$h\big((x_1,x_2,\ldots)\big)=(a_1x_1+b_1,a_2x_2+b_2,\ldots)$$Show that if $\mathbb R^\omega$ is given the product topology, $h$ is a homeomorphism of $\mathbb R^\omega$ with itself. What happens if $\mathbb R^\omega$ is given the box topology?


