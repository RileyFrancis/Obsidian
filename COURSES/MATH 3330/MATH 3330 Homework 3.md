***Riley Francis***
- - -
> [!problem] Question 1
> Find if possible a choice function for the following collections, without using the choice axiom:
> 1. The collection $\mathcal A$ of nonempty subsets of $\mathbb Z_+$.
> 2. The collection $\mathcal B$ of nonempty subsets of $\mathbb Q$.

1. For a collection $\mathcal A$ of nonempty subsets of $\mathbb Z_+$, we define a choice function $f:\mathcal A\rightarrow \mathbb Z_+$ by $f(A)=\min(A)$ for all $A\in\mathcal A$. This is a valid choice function because every $A\in\mathcal A$ is nonempty, each $f(A)$ has a well defined smallest element, and $f(A)\in A$. 

2. For a collection $\mathcal B$ of nonempty subsets of $\mathbb Q$, we define a choice function $f:\mathcal B\rightarrow \mathbb Q$. We will assume that all $\frac pq\in\mathbb Q$ is already in reduced form ($p,q\in\mathbb Z$, $q\neq 0$, and $\gcd(p,q)=1$). First we will define a well ordering "$\prec$" on $\mathbb Q$:$$\frac{p}{q}\prec \frac{p'}{q'}\iff \left\{ \begin{align} &|p|+q < |p'|+q' &\text{or} \\ &|p| +q = |p'|+q' \text{ and }q<q' &\text{or} \\ &|p|+q = |p'|+q' \text{ and } q=q' \text{ and } p <p'\end{align}\right.$$Now we define $f:\mathcal B\rightarrow\mathbb Q$ as $f(B)=\text{"The smallest element in } B \text{ according to } \prec \text{"}$  for all $B\in\mathcal B$. This is a valid choice function because every $B\in \mathcal B$ is nonempty, each $f(B)$ has a well defined smallest element and $f(B)\in B$.  

> [!problem] Question 2
> There was a theorem in $\S 7$ whose proof involved an infinite number of arbitrary choices. Which one was it? Rewrite the proof making explicit use of the choice axiom. 

Theorem $7.5$ in $\S7$ uses infinitely many arbitrarily choices.

***Proof:*** Let $(A_n)_{n\in\mathbb N}$ be a family of sets such that each $A_n$ is countable. For each $n\in\mathbb N$ define
$S_n := \{ f \in A_n^{\mathbb N} : f \text{ is surjective} \}$. Since $A_n$ is countable, there exists at least one surjection $\mathbb N\to A_n$, so $S_n \neq \emptyset$ for every $n\in\mathbb N$.

By the Axiom of Choice applied to the indexed family $(S_n)_{n\in\mathbb N}$ of nonempty sets, there exists some choice function $c$ on $\{S_n : n\in\mathbb N\}$. Let $A := \bigcup_{n\in\mathbb N} A_n$. We define $F:\mathbb N\times\mathbb N\to A$ as $F(n,m) = f_n(m)$. This is well defined since $f_n(m) \in A_n \subseteq A$ for all $(n,m)\in\mathbb N\times\mathbb N$.

We claim that $F$ is surjective. Let $a\in A$. Then $a\in A_k$ for some $k\in\mathbb N$. Because $f_k$ is surjective onto $A_k$, there exists $m\in\mathbb N$ such that $f_k(m)=a$. Therefore $F(k,m)=a$, so $F$ is surjective.

Since $\mathbb N\times\mathbb N$ is countable, there exists a bijection $p:\mathbb N\to\mathbb N\times\mathbb N$. Define $G:\mathbb N\to A$ by $G := F\circ p$. Since $p$ is surjective and $F$ is surjective, $G$ is surjective.

Therefore there exists a surjection $\mathbb N\to A$. Hence $A$ is countable.

> [!problem] Question 3 
> Let $A$ and $B$ be two nonempty sets. If there is an injection of $B$ into $A$, but no injection of $A$ into $B$, we say that $A$ has greater cardinality than $B$. Show that if $A$ has greater cardinality than $B$ and $B$ has greater cardinality than $C$, then $A$ has greater cardinality than $C$.

***Proof:*** Let $A, B, C$ be nonempty sets. Let $A$ have a greater cardinality than $B$, meaning that there exists an injection $f:B\rightarrow A$, but there does not exist an injection $f:A\rightarrow B$. Assume that $A$ has a greater cardinality than $C$. Here we will denote a set having a greater cardinality than another set using the "$>$" symbol. Since $B>C$, there is an injection $g:C\rightarrow B$ and since $A>B$, there is an injection $f:B\rightarrow A$.

Now consider the composition of $f$ and $g$, being $f\circ g: C\rightarrow A$. Because the composition of injective functions is injective, $f\circ g$ must be injective. 

Then, suppose for the sake of contradiction that there exists an injection $h:A\rightarrow C$. Since $g$ is injective, the composition $g\circ h:A\rightarrow B$ must also be injective by composition of injective functions. This contradicts the fact that $A>B$, so there must exist no injection $h$.

Therefore, $A$ has a greater cardinality than $C$.

> [!problem] Question 4 
> Describe a well ordering on $\mathbb Q_+$ (Hint: use a well ordering on $\mathbb Z_+ \times \mathbb Z_+$). Using your ordering, find the smallest element in $(0,1)$. 

For $p,q\in\mathbb Z$, $q\neq0$, and $\gcd(p,q)=1$, we define the well ordering on $\mathbb Q_+$ as:$$\frac{p}{q}\prec \frac{p'}{q'}\iff \left\{ \begin{align} &|p|+q < |p'|+q' &\text{or} \\ &|p| +q = |p'|+q' \text{ and }q<q' &\text{or} \\ &|p|+q = |p'|+q' \text{ and } q=q' \text{ and } p <p'\end{align}\right.$$for all $\frac{p}{q},\frac{p'}{q'}\in \mathbb Q_+$.

The smallest element in $(0,1)$ under this ordering would be $\frac{1}{2}$.