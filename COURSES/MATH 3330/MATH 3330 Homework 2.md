***Riley Francis***
- - -
> [!problem] Question 1
> If $f$ and $g$ are surjective, what can you say about $g\circ f$? If $g\circ f$ is surjective, what can you say about $f$ and $g$? State and prove a theorem about surjectivity under composition.

**If $f$ and $g$ are surjective, then $g\circ f$ must also be surjective.** 
***Proof:*** Let $f:A\rightarrow B$ and $g: B\rightarrow C$ be functions such that $f$ and $g$ are surjective. Take any $c\in C$. Since $g$ is surjective, there exists some $b\in B$ such that $g(b)=c$ for all $c\in C$. Furthermore, since $f$ is surjective, there exists some $a\in A$ such that $f(a)=b$ for all $b\in B$. Therefore the composition is $(g\circ f)(a)=g(f(a))=g(b)=c$. Since $(g\circ f)(a)=c$ for all $c\in C$, then $g\circ f$ must be surjective.

**If $g\circ f$ is surjective, then $g$ must be surjective, but not necessarily $f$.**
***Proof:*** Let $f:A\rightarrow B$ and $g:B\rightarrow C$ be functions such that $g\circ f$ is surjective. Let $f(a)=b$ for $a\in A$ and $b\in B$. For every $c\in C$, there exists some $a\in A$ such that $(g\circ f)(a)=g(f(a))=g(b)=c$. Since $g(b)=c$ holds for all $c\in C$, $g$ must be surjective.

Now consider $f$. Suppose for the sake of contradiction that $f$ must be surjective. Consider the example when $A=\{0\}$, $B=\{x,y\}$, and $C=\{\alpha\}$ and $f(0)=x$, $g(x)=\alpha$, and $g(y)=\alpha$. Then there exists a $b\in B$ (namely $y$) that $f$ does not map to, meaning that $f$ is not surjective.

> [!problem] Question 2
> Show that $f^{-1}$ preserves difference of sets, but not $f$.

***Proof:*** We must show that $f^{-1}(A-B)=f^{-1}(A)-f^{-1}(B)$. Let $x\in f^{-1}(A-B)$. That means that $x\in A-B$. Thus, $x\in A$ and $x\notin B$. Since $x\in A$, $x\in f^{-1}(A)$, and since $x\notin B$, $x\notin f^{-1}(B)$. So, $x\in f^{-1}(A)-f^{-1}(B)$. Therefore, $f^{-1}$ preserves difference of sets.

Now we must show that $f(A-B)\neq f(A)-f(B)$. Suppose for example $A=\{1,2\}$ and $B=\{1\}$ such that $A,B\subseteq X$. We define $f:X\rightarrow Y$ by $f(1)=0$ and $f(2)=0$. On the left hand side, $f(A-B)=f(\{1,2\}-\{1\})=f(\{2\})=\{0\}$. On the right hand side, $f(A)-f(B)=f(\{1,2\})-f(\{1\})=\{0\}-\{0\}=\emptyset$. Since the left and right side are not equivalent, $f$ does not preserve difference of sets.

> [!problem] Question 3
> Let $C$ be a relation on a set $A$. If $A_0\subset A$, define the restriction of $C$ to $A_0$ to be the relation $C\cap (A_0\times A_0)$.
> 1. Show that the restriction of an equivalence relation is an equivalence relation.
> 2. Show that the restriction of an order relation is an order relation.

***Proof:*** In order to show that the restriction of $C$ to $A_0$ (we will define as $C_0:=C\cap(A_0\times A_0)$) is an equivalence relation, we must show that it is reflexive, symmetric, and transitive. $(x,y)\in C_0$ means that $(x,y)\in C$, and that $x,y\in A_0$.

*Reflexive:* Let $x\in A_0$. Since $A_0\subset A$, $x\in A$. Since $C$ is an equivalence relation, it is reflexive on $A$, meaning $(x,x)\in C$. But also, $(x,x)\in (A_0\times A_0)$, so $(x,x)\in C\cap (A_0\times A_0)=C_0$. Therefore, the restriction of $C$ to $A_0$ is reflexive.

*Symmetric:* Let $x,y\in A_0$ and suppose that $(x,y)\in C_0$. Then $(x,y)\in C$. Since $C$ is an equivalence relation, it is symmetric on $A$, meaning $(y,x)\in C$. Because $x,y\in A_0$, $(y,x)\in(A_0\times A_0)$, so $(y,x)\in C\cap (A_0\times A_0)=C_0$. Therefore, the restriction of $C$ to $A_0$ is symmetric.

*Transitive:* Let $x,y,z\in A_0$ and suppose that $(x,y)\in C_0$ and $(y,z)\in C_0$. Then $(x,y)\in C$ and $(y,z)\in C$. Since $C$ is an equivalence relation, it is transitive on $A$, meaning $(x,z)\in C$. Because $x,z\in A_0$, $(x,z)\in(A_0\times A_0)$, so $(x,z)\in C\cap (A_0\times A_0)=C_0$. Therefore the restriction of $C$ to $A_0$ is transitive.

Since the restriction of $C$ to $A_0$ is reflexive, symmetric, and transitive, it is an equivalence relation.

***Proof:*** In order to show that the restriction of $C$ to $A_0$ is an order relation, we must show that it is reflexive, non-symmetric, and transitive. $(x,y)\in C_0=C\cap(A_0\times A_0)$ means that $(x,y)\in C$, and that $x,y\in A_0$.

*Reflexive:* Let $x\in A_0$. Since $A_0\subset A$, $x\in A$. Since $C$ is an order relation, it is reflexive on $A$, meaning $(x,x)\in C$. But also, $(x,x)\in (A_0\times A_0)$, so $(x,x)\in C\cap (A_0\times A_0)=C_0$. Therefore, the restriction of $C$ to $A_0$ is reflexive.

*Symmetric:* Let $x,y\in A_0$ and suppose that $(x,y)\in C_0$ and $(y,x)\in C_0$. Then $(x,y)\in C$ and $(y,x)\in C$. Since $C$ is an order relation and is non-symmetric on $A$, this implies that $x=y$, so therefore, the restriction of $C$ to $A_0$ is also non-symmetric.

*Transitive:* Let $x,y,z\in A_0$ and suppose that $(x,y)\in C_0$ and $(y,z)\in C_0$. Then $(x,y)\in C$ and $(y,z)\in C$. Since $C$ is an order relation, it is transitive on $A$, meaning $(x,z)\in C$. Because $x,z\in A_0$, $(x,z)\in(A_0\times A_0)$, so $(x,z)\in C\cap (A_0\times A_0)=C_0$. Therefore the restriction of $C$ to $A_0$ is transitive.

Since the restriction of $C$ to $A_0$ is reflexive, non-symmetric, and transitive, it is an order relation.

> [!problem] Question 4
> Let $S$, $S'$ be the following subsets of the plane:$$\begin{align} S &= \{(x,y)\mid y=x+1 \text{ and } 0<x<2\} \\ S' &= \{(x,y)\mid y-x\in\mathbb Z\}\end{align}$$ 
> 1. Show that $S'$ is an equivalence relation on the real line and that $S\subset S'$. Describe the equivalence classes of $S'$.
> 2. Show that given any collection of equivalence relations on a set $A$, their intersection is an equivalence relation on set $A$.
> 3. Describe the equivalence relation $T$ on the real line that is the intersection of all equivalence relations on the real line that contain $S$. Describe the equivalence classes of $T$.
##### 1.
We must show that $S'$ is reflexive, symmetric, and transitive. For all $x$, $(x,x)=x-x=0\in S'$, so $S'$ is reflexive. For all $(x,y)$, $(x,y)=y-x=-(x-y)=(-y,-x)$. Since $\mathbb Z$ is closed under multiplication by $-1$, $(y,x)\in S'$, so $S'$ is symmetric. For all $(x,y)$ and $(y,z)$, we have $y-x\in\mathbb Z$ and $z-y\in\mathbb Z$. Then, $(y-x)+(z-y)=z-x$, so $x\sim z$ and thus $S'$ is transitive. Therefore, $S'$ is an equivalence relation. 

Furthermore, if you pick some $(x,y)\in S$, by definition, $y=x+1$ and $0<x<2$. Then, $y-x=1\in\mathbb Z$, so $(x,y)\in S'$. Therefore, $S\subset S'$.

The equivalence classes of $S'$ form sets of numbers that differ by whole integer values (i.e. $\{1.5, 2.5, 8.5, \ldots\}$).
##### 2.
Let $A$ be a set and let $\{R_i\}_i\in$

> [!problem] Question 5
> Prove the following statement: If an ordered set $A$ has the least upper bound property, then it has the greatest lower bound property.

***Proof:*** Let $A$ be a set that has the least upper bound property. We must show that it has the greatest lower bound property (that there exists an infimum in $A$). Since $A$ has the least upper bound property, that means that every nonempty subset $S\subseteq A$ that is bounded above has a supremum in $A$.

> [!problem] Question 6
> Show that if $\mathcal A$ is a collection of inductive sets, then the intersection of the elements of $\mathcal A$ is also an inductive set (and thus $\mathbb Z_+$ is an inductive set).

***Proof:*** A set $S$ is inductive if $1\in S$ and whenever $n\in S$, then $n+1\in S$. Let $\mathcal A$ be a collection of inductive sets and define$$I=\bigcap_{A\in\mathcal A}A$$as the intersection of the sets in $\mathcal A$. We must show that $I$ is also inductive. Since each $A\in\mathcal A$ is an inductive set, $1\in A$ for all $A\in\mathcal A$. Thus $1\in I$.

Now, assume that $n\in I$, meaning that $n\in A$ for all $A\in \mathcal A$. But since every $A$ is inductive, it's also necessary that $n+1\in A$ for all $A\in\mathcal A$. Since $n+1\in A$ for all $A\in\mathcal A$, then $n+1\in I$.

Therefore, $I$, the intersection of the elements of $\mathcal A$ is also an inductive set, and thus $\mathbb Z_+$.

> [!problem] Question 7
> Prove by induction that given $n\in\mathbb Z_+$, every nonempty subset of $\{1,\ldots,n\}$ has a largest element. Does this mean that every nonempty subset of $\mathbb Z_+$ has a largest element? Why or why not?

***Proof:*** Let $n\in \mathbb Z_+$. We must show that every nonempty subset of $\{1,\ldots,n\}$ has a largest element. Take $n=1$. The set $\{1,\ldots,n\}$ has exactly one nonempty subset, being $\{1\}$, which trivially has the largest element of $1$. This completes the base case.

Now take $k=n+1$ and assume that every subset of $\{1,\ldots,n\}$ has a largest element. We must show that every nonempty subset of $\{1,\ldots, n, k\}$ has a largest element. Every subset of $\{1,\ldots, n, k\}$ must either contain $k$ or not, so we have two cases:
1. $k\in S\subseteq \{1,\ldots, n, k\}$, so $k$ is the largest element, since $k=n+1$ is larger than all elements in $S\subseteq\{1,\ldots, n\}$.
2. $k\notin S\subseteq \{1,\ldots, n, k\}$, so $S\subseteq \{1,\ldots, n\}$. By our initial assumption, every subset of $S$ has a largest element.

Since we have shown that every nonempty subset of $\{1,\ldots,n\}$ has a largest element for $n=1$ and have proven that this statement holds for $k=n+1$, it must be true.

No, not every nonempty subset of $\mathbb Z_+$ has a largest element because if you take $\mathbb Z_+$ itself, there is no largest element since $\mathbb Z_+$ is an infinite set.

> [!problem] Question 8
> Which of the following subsets of $\mathbb R^\omega$ can be written as the cartesian product of subsets of $\mathbb R$?
> 1. $\{x\mid x_i \text{ is an integer for all } i\}$
> 2. $\{x\mid x_2=x_3\}$

1. **Yes**: If you take $A_i\in \mathbb Z$ for every $i$, then $\{x\mid x_i \text{ is an integer for all } i\}=\prod_{i\in\omega}\mathbb Z=Z^\omega$. This works since $\mathbb Z\subset \mathbb R$.
2. **No**: This set forces two elements to be identical which can not be expressed in a cartesian product.

> [!problem] Question 9
> Show that if $B$ is not finite and $B\subset A$, then $A$ must not be finite.

***Proof:*** Let $B$ be a non-finite set and $B\subset A$. Assume for the sake of contradiction that $A$ is finite. Since $A$ is finite, every subset of $A$ must also be finite. However, $B\subset A$ and $B$ is not finite, contradicting our claim that $A$ is finite. Therefore, $A$ must not be finite.