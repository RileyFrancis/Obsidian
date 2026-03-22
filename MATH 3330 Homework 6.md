> [!problem] Question 1
> Let $\mathcal{T}$ and $\mathcal{T}'$ be two topologies on $X$. If $\mathcal{T} \subset \mathcal{T}'$, what does connectedness of $X$ in one imply about connectedness in the other? What does the compactness of $X$ under one of these topologies imply about compactness under the other?

If $\mathcal T\subset \mathcal T'$ and $\mathcal T'$ is connected, then $\mathcal T$ must also be connected because it is a coarser topology.

On the other hand, if $\mathcal T \subset \mathcal T'$ and $\mathcal T$ is compact, then $\mathcal T'$ must also be compact. This is because $\mathcal T$ has more sets and thus more possible open covers. 

> [!problem] Question 2
> Show that if $X$ is an infinite set, it is connected in the finite complement topology (sets are open if their complement is finite).

***Proof:*** Let $X$ be an infinite set with the cofinite topology, meaning sets in $X$ are open if their complement is finite. We must show that $X$ is connected, so there should not exist nonempty open sets $U$ and $V$ such that $U\cap V=\varnothing$ and $U\cup V = X$. Assume for the sake of contradiction that $X$ is disconnected, so sets $U$ and $V$ should exist.

If $U\subseteq X$ is nonempty, then $X\setminus U$ is finite because $U$ is infinite. Similarly if $V\subseteq X$ is nonempty, then $X\setminus V$ is finite because $V$ is finite. Since $U\cup V=X$, $X\setminus U=V$ and $X\setminus V=U$, however the union of two finite sets is finite, contradicting the fact that $X$ is infinite.

Therefore, sets $U$ and $V$ must not exist and $X$ must be connected.

> [!problem] Question 3
> Determine whether or not $\mathbb{R}^{\omega}$ is connected in the uniform topology.



> [!problem] Question 4
> Show that no two of $(0,1), (0,1]$ and $[0,1]$ are homeomorphic. (Hint: What happens if you remove a point from each of these spaces?)

***Proof:*** Consider the sets $A=(0,1)$, $B=(0,1]$, and $C=[0,1]$. Let $f:A\rightarrow B$, $g:B\rightarrow C$, and $h:C\rightarrow A$ be functions. We will show that no two of $A$, $B$, or $C$ are homeomorphic by showing that $f$, $g$, and $h$ are not continuous bijective functions with continuous inverses.

Consider $f:(0,1)\rightarrow (0,1]$.
Let $p=f^{-1}(1)\in(0,1)$. If we restrict $f$ by removing the point $p$, then $f$ becomes $f|_{(0,1)\setminus\{p\}}:(0,1)\setminus \{p\}\rightarrow (0,1]\setminus \{1\}$. Then the domain $(0,1)\setminus \{p\}=(0,p)\cup (p,1)$ and must be disconnected, however $(0,1]\setminus\{1\}=(0,1)$ which is connected. $f$ can't be a homeomorphism because it does not preserve connectedness.

Consider $g:(0,1]\rightarrow [0,1]$.
Let $p=g^{-1}(0)\in(0,1]$. If we restrict $g$ by removing the point $p$, then $g$ becomes $f|_{(0,1]\setminus\{p\}}:(0,1]\setminus \{p\}\rightarrow [0,1]\setminus \{0\}$. Then the domain $(0,1]\setminus\{p\}=(0,p)\cup(p,1]$ and must be disconnected, however $[0,1]\setminus\{0\}=(0,1)$ which is connected. $g$ can't be a homeomorphism because it does not preserve connectedness.

Consider $h:[0,1]\rightarrow (0,1)$
Since $[0,1]$ is compact in $\mathbb R$ and $(0,1)$ is not compact in $\mathbb R$ and homeomorphisms must preserve compactness, $h:[0,1]\rightarrow (0,1)$ must not be a homeomorphism.

Therefore, none of $f,g,h$ are homeomorphisms.

> [!problem] Question 5
> Let $f:S^1\to \mathbb{R}$ be a continuous map. Show there exists a point $x$ of $S^1$ such that $f(x)=f(-x)$.

***Proof:*** Let $f:S^1\to \mathbb{R}$ be a continuous map. We must show that there exists a point $x\in S^1$ such that $f(x)=f(-x)$. Define a new continuous function $g:S^1\rightarrow \mathbb R$ as $g(x)=f(x)-f(-x)$. We must show that $g(x)=0$.

Fix a point $y\in S^1$. We have $$g(-y)=f(-y)-f(y)=-(f(y)-f(-y)=-g(y)$$If $g(y)=0$ for the fixed point $y$, trivially we are done. If $g(y)\neq0$, then $g(y)$ and $g(-y)=-g(y)$ have opposite signs. Since $g$ is continuous (because it is a combination of continuous functions), by the intermediate value theorem, there there must exist some point $y'\in S^1$ such that $g(y')=0$. Therefore, $f(x)=f(-x)$.

> [!problem] Question 6
> Show that if $X$ is a well ordered set, then $X \times [0,1)$ in the dictionary order is a linear continuum.

> [!problem] Question 7
> Show that the finite union of compact spaces in compact.

> [!problem] Question 8
> Show that if $f:X \to Y$ is continuous, where $X$ is compact and $Y$ is Hausdorff, then $f$ is a closed map (i.e. $f$ maps closed sets to closed sets.)

> [!problem] Question 9
> Prove that if $X$ is an ordered set in which every closed interval is compact, then $X$ has the least upper bound property.
    
> [!problem] Question 10
> Let $\mathbb{R}_K$ denote $\mathbb{R}$ with the $K-$topology.
> - Show that $[0,1]$ is not compact as a subspace of $\mathbb{R}_K$.
> - Show that $\mathbb{R}_K$ is connected.
> - Show that $\mathbb{R}_K$ is not path connected.