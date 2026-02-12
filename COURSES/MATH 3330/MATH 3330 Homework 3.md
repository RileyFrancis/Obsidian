> [!problem] Question 1
> Find if possible a choice function for the following collections, without using the choice axiom:
> 1. The collection $\mathcal A$ of nonempty subsets of $\mathbb Z_+$.
> 2. The collection $\mathcal B$ of nonempty subsets of $\mathbb Q$.

1. For a collection $\mathcal A$ of nonempty subsets of $\mathbb Z_+$, we define a choice function $f:\mathcal A\rightarrow \mathbb Z_+$ by $f(A)=\min(A)$ for all $A\in\mathcal A$. This is a valid choice function because every $A\in\mathcal A$ is nonempty, each $f(A)$ has a well defined smallest element, and $f(A)\in A$. 

2. For a collection $\mathcal B$ of nonempty subsets of $\mathbb Q$, we define a choice function $f:\mathcal B\rightarrow \mathbb Q$. We will assume that all $\frac pq\in\mathbb Q$ is already in reduced form ($p,q\in\mathbb Z$, $q\neq 0$, and $\gcd(p,q)=1$). First we will define a well ordering "$\prec$" on $\mathbb Q$:$$\frac{p}{q}\prec \frac{p'}{q'}\iff \left\{ \begin{align} &|p|+q < |p'|+q' &\text{or} \\ &|p| +q = |p'|+q' \text{ and }q<q' &\text{or} \\ &|p|+q = |p'|+q' \text{ and } q=q' \text{ and } p <p'\end{align}\right.$$Now we define $f:\mathcal B\rightarrow\mathbb Q$ as $f(B)=\text{"The smallest element in } B \text{ according to } \prec \text{"}$  for all $B\in\mathcal B$. This is a valid choice function because every $B\in \mathcal B$ is nonempty, each $f(B)$ has a well defined smallest element and $f(B)\in B$.  

> [!problem] Question 2
> There was a theorem in $\S 7$ whose proof involved an infinite number of arbitrary choices. Which one was it? Rewrite the proof making explicit use of the choice axiom. 

Theorem $7.5$ in $\S7$ uses infinitely many arbitrarily choices.

***Proof:*** Let $\{A_n\}_{n\in J}$ be an indexed family of countable sets where the index set $$ $$

> [!problem] Question 3 
> Let $A$ and $B$ be two nonempty sets. If there is an injection of $B$ into $A$, but no injection of $A$ into $B$, we say that $A$ has greater cardinality than $B$. Show that if $A$ has greater cardinality than $B$ and $B$ has greater cardinality than $C$, then $A$ has greater cardinality than $C$.

> [!problem] Question 4 
> Describe a well ordering on $\mathbb Q_+$ (Hint: use a well ordering on $\mathbb Z_+ \times \mathbb Z_+$). Using your ordering, find the smallest element in $(0,1)$. 
