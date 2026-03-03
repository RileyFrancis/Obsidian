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

$Similarly, $b\in\overline{(a,b)}$​ exactly when there is no element of $X$ that is the immediate predecessor of $b$.

Therefore, $\overline{(a,b)}=[a,b]$ when $a$ has no immediate successor and $b$ has no immediate predecessor in $X$.

> [!problem] Question 2
> Let $A_\alpha$ be a subset of a space $X$. Decide if $\overline{\cap A_\alpha} = \cap\overline{A_\alpha}$. If not, is one a subset of the other?

The equivalency is not true, and $\overline{\cap A_\alpha} \subseteq \cap\overline{A_\alpha}$.

***Proof:*** Let $x\in\overline{\cap A_\alpha}$. Then every open neighborhood of $x$ intersects with $\cap A_\alpha$. Then, each of those neighborhoods must also intersect all individual $A_\alpha$ since those neighborhoods intersect with the intersection of each $A_\alpha$. So, $x\in \overline{A_\alpha}$ for all $\alpha$, and then $x\in\cap\overline{A_\alpha}$. Therefore, $\overline{\cap A_\alpha} \subseteq \cap\overline{A_\alpha}$.

Now for $\cap\overline{A_\alpha} \subseteq \overline{\cap A_\alpha}$, consider the counterexample for when $A_1=(0,1)$ and $A_2=(1,2)$. Then, $\overline{(0,1)}\cap\overline{(1,2)}=\{1\}$ and $\overline{(0,1)\cap(1,2)}=\emptyset$. Since $\{1\}\not\subseteq\emptyset$, $\cap\overline{A_\alpha} \not\subseteq \overline{\cap A_\alpha}$.

Therefore, $\overline{\cap A_\alpha} \neq \cap\overline{A_\alpha}$, however $\overline{\cap A_\alpha} \subseteq \cap\overline{A_\alpha}$.

> [!problem] Question 3
> In the finite complement topology on $\mathbb R$, to what point or points does the sequence $x_n=\frac1n$ converge?

A sequence $x_n$ converges to $x$ if for every open set $U\in\mathbb R$ containing $x$, all but finitely many $x_n$ are in $U$. Let $U\subseteq\mathbb R$ be an open set containing $x\in\mathbb R$. In the complement topology $U$ is open if $U=\emptyset$ or $U=X-F$ where $F$ is a finite set in $\mathbb R$. $U\neq \emptyset$ since $U$ contains $x$, so then $x\in X$, but $x\notin F$.

Since $F$ is finite and the sequence $x_n$ takes in distinct values that are each assigned to unique values in $\{\frac{1}{n}\}$, there are only finitely many indices that $x_n\in F$. Therefore, there must exist some $N$ such that for all $n>N$, $x_n\notin F$, and since $U=X-F$, $x_n\in U$. Then, all but finitely many terms of $x_n$ converge to $x$. Since $x$ was arbitrary, the sequence converges to every $x\in \mathbb R$.

> [!problem] Question 4
> Show that the $T_1$ axiom is equivalent to the condition for each pair of points of $X$, each has a neighborhood not containing the other.

The $T_1$ axiom states that a space $X$ is $T_1$ if for each pair $x\neq y$, there exists an open set containing $x$ but not $y$, and an open set containing $y$ but not $x$. Additionally, a neighborhood of $x$ is a set $U$ that contains an open set containing $x$.

***Proof:*** Let $X$ be $T_1$ and $x,y\in X$ such that $x\neq Y$. By the definition of a $T_1$ space, there must exist an open set $U$ containing $x$ that does not contain $y$, as well as an open set $V$ containing $y$ that does not contain $x$. Thus $U$ is a neighborhood of $x$ that doesn't contain $y$, and $V$ is a neighborhood of $y$ that doesn't contain $x$. Therefore, each pair of points $x$ and $y$ have some neighborhood not containing the other.

Now assume that each pair of non-equal points $x$ and $y$ have a neighborhood not containing the other. Then by the definition of a neighborhood, $x\in U\subseteq X$ and $y\in V\subseteq Y$. Therefore, there is an open set containing $x$ but not $y$ and another open set containing $y$ but not $x$, so $X$ is $T_1$.

> [!problem] Question 5
> Prove that for functions $f:\mathbb R\rightarrow \mathbb R$, the $\epsilon-\delta$ definition of continuity implies the open set definition.

***Proof:*** Let $f:\mathbb R\rightarrow \mathbb R$ be a function. $f$ is continuous by the $\epsilon-\delta$ definition of continuity at a point $x$ if for every $\epsilon>0$, there exists some $\delta>0$ such that given another point $y$ that's close to $x$, $|x-y|<\delta\Rightarrow |f(x)-f(y)|<\epsilon$. We must show that given the $\epsilon-\delta$ definition of continuity, $f$ is continuous if for every open set $U\subseteq \mathbb R$, the inverse $f^{-1}(U)=\{x\in\mathbb R\mid f(x)\in U\}$ is open in $\mathbb R$ (the open set definition).

Assume that $f$ satisfies the $\epsilon-\delta$ definition of continuity. Then for $U\subseteq\mathbb R$, take any point $x\in f^{-1}(U)=\{x\in\mathbb R\mid f(x)\in U\}$. Since $U$ is an open set, there must exist some $\epsilon>0$ such that an open ball ($B_\epsilon$) around $f(x)$ with radius $\epsilon$ is in $U$, that is, $B_\epsilon(f(x))=\{y\in\mathbb R \mid |y-f(x)|<\epsilon\}$. So $B_\epsilon(f(x))\subseteq U$.

Since $f$ is continuous with the $\epsilon-\delta$ definition of continuity, $|x-y|<\delta\Rightarrow|f(x)-f(y)|<\epsilon$. Since distance is symmetric, $|f(x)-f(y)|<\epsilon$ is the same as $|f(y)-f(x)|<\epsilon$. Then, $f(y)\in B_\epsilon(f(x))\subseteq U$, so $f(y)\in U$ and $y\in f^{-1}(U)$. Therefore, $|x-y|<\delta\Rightarrow y\in f^{-1}(U)$ and since every point in $f^{-1}(U)$ has some open ball around it contained in $f^{-1}(U)$, $f^{-1}(U)$ is open. And therefore, $f$ is continuous in the open-set definition of continuity.

> [!problem] Question 6
> Suppose $f:X\rightarrow Y$ is continuous. If $x$ is a limit point of the subset $A$ of $X$, is it necessarily true that $f(x)$ is a limit point of $f(A)$?

The statement is false. As a counterexample, choose $X=Y=\mathbb R$ with the standard topology. Let $f(x)=6$ (as an example) for all $x\in X$. Then we take the subset $A=(6,7) \subset\mathbb R$, $f(A)=\{6\}$ by our example with the limit point $x=6$. Obviously $f$ is continuous as it is a trivial function mapping $\mathbb R$ to $6$.

However, $f(x=6)=6$ is not a limit point of $f\big(A=(6,7)\big)=\{6\}$ because $f(A)$ contains only a single point.

> [!problem] Question 7
> Let $F:X\times Y\rightarrow Z$. We say that $F$ is continuous in each variable separately if for each $y_0$ in $Y$, the map $h:X\rightarrow Z$ defined by $h(x)=F(x\times y_0)$ is continuous, and for each $x_0$ in $X$, the map $k:Y\rightarrow Z$ defined by $k(y)=F(x_0\times y)$ is continuous. Show that if $F$ is continuous, then $F$ is continuous in each variable separately.

***Proof:*** Let $F:X\times Y\rightarrow Z$ be a continuous function. We must show that $F$ is continuous in each variable separately.

Fix a point $y_0\in Y$ and define a new function $h:X\rightarrow Z$ as $h(x)=F(x,y_0)$. Then consider the map $g:X\rightarrow X\times Y$ defined by $g(x)=(x,y_0)$. $g$ must be continuous since it maps $x\mapsto x$ and $y_0$ was fixed. Then,$$F\circ g=F(g(x))=F((x,y_0))=h(x)$$
Similarly, fix a point $x_0\in X$ and define a new function $h':Y\rightarrow Z$ as $h'(y)=F(x_0,y)$. Then consider the map $g':Y\rightarrow X\times Y$ defined by $g'(y)=(x_0,y)$. $g'$ must be continuous since it maps $y\mapsto y$ and $x_0$ was fixed. Then,$$F\circ g'=F(g(y))=F((x_0,y))=h'(y)$$Since both $F$ and $g$ are continuous functions and $h$ is the composition of those functions, $h$ must also be continuous. Therefore, $F$ must be continuous in each variable separately.

> [!problem] Question 8
> Let $F:\mathbb R\times\mathbb R\rightarrow \mathbb R$ be defined by the equation $$F(x\times y)=\left\{\begin{align}&\frac{xy}{x^2+y^2} & \text{if } x\times y\neq 0\times0 \\ &0 & \text{if } x\times y = 0\times 0\end{align}\right.$$
> 1. Show that $F$ is continuous in each variable separately.
> 2. Compute the function $g:\mathbb R\rightarrow \mathbb R$ defined by $g(x)=F(x\times x)$.
> 3. Show that $F$ is not continuous (using techniques of this class).

***1.***
We fix $y_0$ at some point in $\mathbb R$. If $y_0=0$, then $F(x,0)=0$ for all $x$ so $F$ is continuous in this case. If $y_0\neq 0$, then $F(x,y_0)=\frac{xy_0}{x^2+y_0^2}$. Since $x^2+y_0^2>0$ for all $x,y_0$, the denominator is never zero, so $F$ is also continuous in this case. We can show the same is true for fixing a point $x_0$ to show that $F$ is still continuous here, so $F$ must be continuous in each variable separately.

***2.***
When $x\neq 0$, $$g(x)=F(x\times x)=\frac{x^2}{2x^2}=\frac{1}{2}$$And $g(x)=0$ when $x=0$.

***3.***
***Proof:*** Consider the closed set $\{\frac{1}{2}\}$. If $F$ is continuous, then the preimage of $F$ should also be closed. $F^{-1}(\{\frac{1}{2}\})$ contains points in the form $(x,x)$. The point $(0,0)$ is a limit point of $F^{-1}(\{\frac12\})$ because it intersects at a point other than itself. $F(0,0)=0$ is not in the preimage, however, so the preimage is not closed as it does not contain all its limit points. 

> [!problem] Question 9
> Let $\mathbb R^\infty$ be the subset of $\mathbb R^\omega$ consisting of all sequences that are "eventually zero," that is, all sequences $(x_1,x_2,\ldots)$ such that $x_i\neq 0$ for only finitely many of i. values of $i$. What is the closure of $\mathbb R^\infty$ in $\mathbb R^\omega$ in the box and product topologies? Justify your answer.

In the **box topology**, the closure of $\mathbb R^\infty$ in $\mathbb R^\omega$ is $\mathbb R^\infty$. We will show that $\overline{\mathbb R^\infty}=\mathbb R^\infty$ by showing that its compliment is open. Let $x\notin \mathbb R^\infty$, so there are infinitely many nonzero coordinates in $x$. Consider the neighborhood $U=\prod_i U_i$, where we choose each $U_i$ by restricting $\mathbb R$ to be an open interval around $x_i$ that excludes $0$ whenever $x_i\neq 0$. So for some $\epsilon>$, $$U_i=\left\{\begin{align}&(x_i-\epsilon,x_i+\epsilon) & x_i\neq 0 \\ &\mathbb R & x_i=0\end{align}\right.$$Then each $y\in U$ has infinitely many nonzero coordinates, so $y\notin \mathbb R^\infty$. Thus $U$ is an open neighborhood of $x$ disjoint from $\mathbb R^\infty$, so $x$ is not a limit point. Therefore, $\overline{\mathbb R^\infty}=\mathbb R^\infty$ in the box topology.

In the **product topology**, the closure of $\mathbb R^\infty$ in $\mathbb R^\omega$ is $\mathbb R^\omega$. Let $x\in\mathbb R^\omega$. We will show that every open set containing $x$ intersects $\mathbb R^\omega$. Consider the neighborhood $U=\prod_i U_i$, where $U_i=\mathbb R$ for all finitely many $i$. Then we define the sequence $y$ by $y_i=x$ for all $i$ smaller than some number $N$, and $y_i=0$ for all $i$ greater than $N$.

$y\in \mathbb R^\infty$ since the sequence is eventually $0$. Also $y\in U$ since $y_i=x_i\in U_i$ for $i\le N$ and $y_i=0\in\mathbb R=U_i$ for $i>N$. Thus every open neighborhood of $x$ contains a point in $\mathbb R^\infty$, so $x$ is in $\overline{\mathbb R^\infty}$. Therefore, $\overline{\mathbb R^\infty}=\mathbb R^\omega$ in the product topology.

> [!problem] Question 10
> Given sequences $(a_1,a_2,\ldots)$ and $(b_1,b_2,\ldots)$ of real numbers with $a_i>0$ for all $i$, define $h:\mathbb R^\omega \rightarrow \mathbb R^\omega$ by the equation $$h\big((x_1,x_2,\ldots)\big)=(a_1x_1+b_1,a_2x_2+b_2,\ldots)$$Show that if $\mathbb R^\omega$ is given the product topology, $h$ is a homeomorphism of $\mathbb R^\omega$ with itself. What happens if $\mathbb R^\omega$ is given the box topology?

