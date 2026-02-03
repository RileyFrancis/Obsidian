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
> 1. Show that $S'$ is an equivalence relation on the real line and that $S'\subset S$. Describe the equivalence classes of $S'$.
> 2. Show that given any collection of equivalence relations on a set $A$, their intersection is an equivalence relation on set $A$.
> 3. Describe the equivalence relation $T$ on the real line that is the intersection of all equivalence relations on the real line that contain $S$. Describe the equivalence classes of $T$.

> [!problem] Question 5
> Prove the following statement: If an ordered set $A$ has the least upper bound property, then it has the greatest lower bound property.

***Proof:***

> [!problem] Question 6
> Show that if $\mathcal A$ is a collection of inductive sets, then the intersection of the elements of $\mathcal A$ is also an inductive set (and thus $\mathbb Z_+$ is an inductive set).

> [!problem] Question 7
> Prove by induction that given $n\in\mathbb Z_+$, every nonempty subset of $\{1,\ldots,n\}$ has a largest element. Does this mean that every nonempty subset of $\mathbb Z_+$
