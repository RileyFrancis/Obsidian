***Riley Francis***
- - -
> [!problem] Question 1
> Let $X=\{a,b,c\}$. How many topologies are on $X$?

The following are unique topologies on $X$:
1. $\{\emptyset, X\}$
2. $\{\emptyset, \{a\}, X\}$
3. $\{\emptyset, \{b\}, X\}$
4. $\{\emptyset, \{c\}, X\}$
5. $\{\emptyset, \{a,b\}, X\}$
6. $\{\emptyset, \{a,c\}, X\}$
7. $\{\emptyset, \{b,c\}, X\}$
8. $\{\emptyset, \{a\}, \{a,b\}, X\}$
9. $\{\emptyset, \{a\}, \{a,c\}, X\}$
10. $\{\emptyset, \{a\}, \{b,c\}, X\}$
11. $\{\emptyset, \{b\}, \{a,b\}, X\}$
12. $\{\emptyset, \{b\}, \{a,c\}, X\}$
13. $\{\emptyset, \{b\}, \{b,c\}, X\}$
14. $\{\emptyset, \{c\}, \{a,b\}, X\}$
15. $\{\emptyset, \{c\}, \{a,c\}, X\}$
16. $\{\emptyset, \{c\}, \{b,c\}, X\}$
17. $\{\emptyset, \{a\}, \{b\}, \{a,b\}, X\}$
18. $\{\emptyset, \{a\}, \{c\}, \{a,c\}, X\}$
19. $\{\emptyset, \{b\}, \{c\}, \{b,c\}, X\}$
20. $\{\emptyset, \{a\}, \{a,b\}, \{a,c\}, X\}$
21. $\{\emptyset, \{b\}, \{a,b\}, \{b,c\}, X\}$
22. $\{\emptyset, \{c\}, \{a,c\}, \{b,c\}, X\}$
23. $\{\emptyset,\{a\},\{b\},\{a,b\},\{a,c\},X\}$
24. $\{\emptyset,\{a\},\{b\},\{a,b\},\{b,c\},X\}$
25. $\{\emptyset,\{a\},\{c\},\{a,b\},\{a,c\},X\}$
26. $\{\emptyset,\{a\},\{c\},\{a,c\},\{b,c\},X\}$
27. $\{\emptyset,\{b\},\{c\},\{a,b\},\{b,c\},X\}$
28. $\{\emptyset,\{b\},\{c\},\{a,c\},\{b,c\},X\}$
29. $\{\emptyset, \{a\}, \{b\}, \{c\}, \{a,b\}, \{a,c\}, \{b,c\}, X\}$

There are a total of 29 unique topologies on $X$.

> [!problem] Question 2
> Let $\mathcal T$ consist of $\mathbb R, \emptyset$, and all infinite open intervals in the form of $(a,\infty)$, where $a$ is real. Show that $\mathcal T$ is a topology. What if we restrict $\mathcal T$ to $\mathbb Q$?

***Proof:*** Let $\mathcal T$ consist of $\mathbb R, \emptyset$, and all infinite open intervals in the form of $(a,\infty)$, where $a$ is real. Let $\mathcal U\subseteq \mathcal T$ a subcollection of $\mathcal T$. In order for $\mathcal T$ to be a topology, it must satisfy all of the following conditions:
1. If $\mathcal T$ is a topology on a set $X$, then $X,\emptyset\in\mathcal T$.
2. The union of elements for any subcollection of $\mathcal T$ is in $\mathcal T$.
3. The intersection of elements of any finite subcollection of $\mathcal T$ is in $\mathcal T$.

**1.** By the definition of $\mathcal T$, since $X=\mathbb R$, $X,\emptyset\in\mathcal T$.

**2.** If $\mathbb R\in\mathcal U$, then $\bigcup\mathcal U=\mathbb R\in\mathcal T$. If $\mathcal U$ contains only $\emptyset$, then trivially $\bigcup\mathcal U=\emptyset\in\mathcal T$. Now consider the case when $\mathbb R\notin \mathcal U$ and $\mathcal U$ contains collections other than than $\emptyset$ ($\mathcal U$ contains at least one nonempty set in the form $(a,\infty)$ for $a\in\mathbb R$). Let $A=\{a\in\mathbb R \mid (a,\infty)\in\mathcal U\}$. Since $\mathcal U$ contains at least one nonempty set, $A\neq\emptyset$. We will show that $\bigcup_{(a,\infty)\in\mathcal U}(a,\infty)=(\inf A, \infty)$ by double inclusion:

- $\subseteq$ : If $x\in \bigcup_{(a,\infty)\in\mathcal U}(a,\infty)$, then $x>a$ for some $a\in A$, and since $\inf A\le a$, we get $\inf A\le a < x$. So, $x\gt\inf A$ by transitivity, so $x\in (\inf A,\infty)$.
- $\supseteq$ : If $x\in (\inf A,\infty)$, then $\inf A < x$. By the definition of the infimum, there must exist some $a\in A$ such that $\inf A \le a < x$, so $x\in \bigcup_{(a\infty)\in\mathscr U}(a,\infty)$.

Therefore, $\bigcup_{(a,\infty)\in\mathcal U}(a,\infty)=(\inf A, \infty)$, so the union of elements from any subcollection $\mathcal U$ of $\mathcal T$ is in $\mathcal T$.

**3.** If $\emptyset\in\mathcal U$, then trivially $\bigcap\mathcal U=\emptyset\in\mathcal T$. Now consider $(a_1,\infty),\ldots,(a_n,\infty)$ for $n\in\mathbb N$ and $a_1,\ldots, a_n\in\mathbb R$. A point $x$ is in the intersection of $(a_1,\infty),\ldots,(a_n,\infty)$ if $x>a_1,\ldots, x>a_n$. So, $x>\max\{a_1,\ldots a_n\}$, and thus $\bigcap_{i=1}^n(a_i,\infty)=(\max\{a_1,\ldots,a_n\},\infty)$. Since $\max\{a_1,\ldots,a_n\}\in\mathbb R$, $(\max\{a_1,\ldots,a_n\},\infty)\in\mathcal T$, so the intersection of elements of any finite subcollection of $\mathcal T$ is in $\mathcal T$.

Therefore, $\mathcal T$ is a topology.

**Restricting to $\mathbb Q$:** We will define $\mathcal T_{\mathbb Q}$ as $\{U\cap \mathbb Q \mid U\in\mathcal T\}$. Then $\mathcal T_{\mathbb Q}$ becomes:$$\mathcal T_{\mathbb Q}=\{\emptyset,\mathbb Q\}\cup\{(a,\infty)\cap\mathbb Q\mid a\in\mathbb R\}$$
**1.** $\emptyset=\emptyset\cap \mathbb Q\in\mathcal T_{\mathbb Q}$ and $\mathbb Q=\mathbb R\cap\mathbb Q\in\mathcal T_{\mathbb Q}$.

**2.** Take any subcollection ${U_n \cap \mathbb Q}_{n \in \mathbb N} \subseteq \mathcal T_{\mathbb Q}$ with each $U_n \in \mathcal T$. Then $\bigcup_{n \in \mathbb N} (U_n \cap \mathbb Q) = \left( \bigcup_{n \in \mathbb N} U_n \right) \cap \mathbb Q.$ Since $\bigcup_{n \in \mathbb N} U_n \in \mathcal T$ (because $\mathcal T$ is a topology on $\mathbb R$), it follows that $\left( \bigcup_{n \in \mathbb N} U_n \right) \cap \mathbb Q \in \mathcal T_{\mathbb Q}.$ Therefore $\mathcal T_{\mathbb Q}$ is closed under arbitrary unions.

**3.** Let $U_1, \dots, U_n \in \mathcal T$ for $n\in\mathbb N$. Then $\bigcap_{i=1}^n (U_i \cap \mathbb Q) = \left( \bigcap_{i=1}^n U_i \right) \cap \mathbb Q.$ Since $\bigcap_{i=1}^n U_i \in \mathcal T$ (because $\mathcal T$ is closed under finite intersections), it follows that $\left( \bigcap_{i=1}^n U_i \right) \cap \mathbb Q \in \mathcal T_{\mathbb Q}.$ Thus $\mathcal T_{\mathbb Q}$ is closed under finite intersections.

Therefore $\mathcal T_{\mathbb Q}$ is also a topology.

> [!problem] Question 3
> Let $X$ be a topological space and $A$ be a subset of $X$. Suppose that for each $x\in A$ there is an open set $U$ containing $x$ such that $U\subseteq A$. Show that $A$ is open in $X$. 

***Proof:*** Let $X$ be a topological space and $A\subseteq X$. Suppose that for each $x\in A$ there is an arbitrary open set $U_x$ containing $x$ such that $U_x\subseteq A$. We must show that $A$ is open in $X$. Consider the union $U=\bigcup_{x\in A}U_x$. $U$ must be open since the union of open sets is open. We will show that $U=A$. 

First, if $y\in U$, then $y\in U_x$ for some $x\in A$, and since $U_x\subseteq A$, $y\in A$, so $U\subseteq A$.

Then, if $y \in A$, then by assumption $y \in U_y$, where for $y\in A$, $U_y\subseteq U$ contains $y$. Then, $y \in U$. Thus $A \subseteq U$.

Therefore, $A=U$, and since $U$ is open in $X$, $A$ must also be open in $X$.

> [!problem] Question 4
> Show that if $\mathcal A$ is a basis for a topology on $X$, then the topology generated by $\mathcal A$ equals the intersection of all topologies on $X$ that contain $\mathcal A$. Prove the same if $\mathcal A$ is a subbasis.

***Proof:*** Let $\mathcal A$ be a basis for a topology on $X$ and let $\mathcal T_\mathcal A$ be the topology generated by $\mathcal A$, so $\mathcal T_\mathcal A=\bigcup_{U\subseteq A}U$. Also, let $\mathcal T$ be the intersection of all all topologies on $X$ that contain $\mathcal A$. We must show that $\mathcal T_\mathcal A = \mathcal T$ by double inclusion.

$\subseteq$ : Let $U\in \mathcal T_\mathcal A$. Then, $U=\bigcup\mathcal U$ for $\mathcal U\subseteq \mathcal A$ since $U\in\mathcal T_\mathcal A$ and $\mathcal T_\mathcal A$ is the topology generated by the basis $\mathcal A$. Now let $\tau$ be some arbitrary topology on $X$. Then $\mathcal U\subseteq\mathcal A\subseteq\tau$. Since $\tau$ is a topology, it is closed under arbitrary unions, so $\bigcup\mathcal U\in\tau$. Thus $U\in\tau$ for each topology $\tau$, since $U=\bigcup \mathcal U$. Therefore, $U$ lies in the intersection of all $\tau$, so $\mathcal T_\mathcal A \subseteq \mathcal T$.

$\supseteq$ : $\mathcal T_\mathcal A$ is a topology on $X$ that contains $\mathcal A$ since it was constructed from the basis $\mathcal A$. Then, $\mathcal T_\mathcal A$ is one of the topologies intersected to form $\mathcal T$. Since an intersection of a family of sets is always contained within each member of the family, $\mathcal T\subseteq \mathcal T_\mathcal A$.

Thus $\mathcal T_\mathcal A = \mathcal T$ and therefore the topology generated by $\mathcal A$ equals the intersection of all topologies on $X$ that contain $\mathcal A$.

**If $\mathcal A$ is a subbasis:** Now, let $\mathcal A$ be a subbasis for a topology on $X$, and let $\mathcal T_\mathcal A$ be the topology generated by $\mathcal A$. Let $\mathcal B = \{\bigcap A_i \mid A_i \in \mathcal A\}$ be the collection of all finite intersections of elements of $\mathcal A$. Then $\mathcal B$ is a basis for $\mathcal T_A$, so every element of $\mathcal T_\mathcal A$ can be written as a union of elements of $\mathcal B$, that is, $\mathcal T_\mathcal A = \{\bigcup \mathcal U \mid \mathcal U \subseteq \mathcal B\}$. Also, let $\mathcal T$ be the intersection of all topologies on $X$ that contain $\mathcal A$. We must show that $\mathcal T_A = \mathcal T$ by double inclusion.

$\subseteq$: Let $U \in \mathcal T_\mathcal A$. Then $U = \bigcup \mathcal U$ for some $\mathcal U \subseteq \mathcal B$, since $\mathcal B$ is a basis for $\mathcal T_\mathcal A$. Now let $\tau$ be some arbitrary topology on $X$ such that $A \subseteq \tau$. Since $\tau$ is a topology, it is closed under finite intersections, so every element of $\mathcal B$ lies in $\tau$. So $\mathcal U \subseteq \mathcal B \subseteq \tau$. Since $\tau$ is also closed under arbitrary unions, we have $\bigcup \mathcal U \in \tau$. Thus $U \in \tau$ for each topology $\tau$ containing $A$. Therefore $U$ lies in the intersection of all such $\tau$, so $\mathcal T_A \subseteq \mathcal T$.

$\supseteq$: $\mathcal T_\mathcal A$ is a topology on $X$ that contains $\mathcal A$, since $\mathcal A \subseteq \mathcal B \subseteq \mathcal T_A$ because each $A \in \mathcal A$ is a finite intersection with $n=1$. Therefore $\mathcal T_A$ is one of the topologies intersected to form $\mathcal T$. Since an intersection of a family of sets is always contained within each member of the family, $\mathcal T \subseteq \mathcal T_\mathcal A$.

Thus $\mathcal T_\mathcal A = \mathcal T$, and therefore the topology generated by the subbasis $\mathcal A$ equals the intersection of all topologies on $X$ that contain $\mathcal A$.

> [!problem] Question 5
> A map $f:X\rightarrow Y$ is said to be an open map if for every open set $U$ of $X$, the set $f(U)$ is open in $Y$. Show that $\pi : X\times Y \rightarrow Y$ is an open map.

***Proof:*** Let $f:X\rightarrow Y$ be an open map. That is, for every open set $U$ of $X$, the set $f(U)$ is open in $Y$. Let $V\subseteq X\times Y$ be open. We must show that for $\pi:X\times Y\rightarrow Y$, $\pi(V)$ is also open in $Y$.

Then, for all open subsets $A\subseteq X$ and $B\subseteq Y$, we have $$V=\bigcup A\times B$$Since $\pi(A\times B)=B$ for all subsets $A$ and $B$, and the projection distributes over unions, then for all subsets $A$ and $B$, we get$$\pi(V)=\pi\left(\bigcup A\times B\right)=\bigcup \pi(A\times B)=\bigcup B$$
Since $B$ is open in $Y$, so is $\pi(V)$ since it is the union of open sets, so $\pi:X\times Y\rightarrow Y$ is an open map.

> [!problem] Question 6
> Show that the countable collection $$\left\{(a,b)\times (c,d) \mid a<b, c<d, a,b,c,d\in\mathbb Q\right\}$$ is a basis for $\mathbb R^2$ with the standard topology.

***Proof:*** In order for the collection $X=\left\{(a,b)\times (c,d) \mid a<b, c<d, a,b,c,d\in\mathbb Q\right\}$ to be a basis $\mathcal B$ for $\mathbb R^2$ with the standard topology, the following must be true:
1. For each $x\in X$, there is at least one basis element in $\mathcal B$ containing it.
2. If $B_1, B_2\in\mathcal B$ and $x\in B_1\cap B_2$, then $x\in B_3\subseteq B_1\cap B_2$.

**1.** Let $(x,y)\in \mathbb R^2$. Since $\mathbb Q$ is dense in $\mathbb R$, we can choose rationals $a,b,c,d$ such that $a<x<b$ and $c<y<d$. So, $(x,y)\in(a,b)\times(c,d)$, and thus is in $\mathcal B$, so each element in the collection has at least one basis element containing it.

**2.** Let $B_1=(a_1,b_1)\times(c_1,d_1)$ and $B_2=(a_2,b_2)\times(c_2,d_2)$ be elements of $\mathcal B$, and suppose that $(x,y)\in B_1\cap B_2$. We must show that there exists some $B_3\in\mathcal B$ such that $(x,y)\in B_3\subseteq B_1\cap B_2$.$$B_1\cap B_2=(\max(a_1,a_2),\min(b_1,b_2))\times (\max(c_1,c_2),\min(d_1,d_2))$$Since $(x,y)\in B_1\cap B_2$, then $\max(a_1​,a_2​)<x<\min(b_1​,b_2​)$ and $\max(c_1​,c_2​)<y<\min(d_1​,d_2​)$. Because $\mathbb Q$ is dense, we want to choose $a',b',c',d'\in \mathbb Q$ such that $$\begin{align}\max(a_1​,a_2​)<a'<x<b'<\min(b_1​,b_2​) \\ \max(c_1​,c_2​)<c'<y<d'<\min(d_1​,d_2​)\end{align}$$
Then, by our construction, $B_3=(a',b')\times (c',d')\in\mathcal B$ and $(x,y)\in B_3\subseteq B_1\cap B_2$.


Therefore, $\mathcal B$ is a basis for $\mathbb R^2$ with the standard topology.

> [!problem] Question 7 
> If $L$ is a straight line in the plane, describe the topology $L$ inherits as a subspace of $\mathbb R_l\times \mathbb R$ and as a subspace of $\mathbb R_l\times \mathbb R_l$.

Note: there are three different cases for a line $L$:
1. Vertical: $L=\{x\}\times \mathbb R$
2. Horizontal : $L = \mathbb R \times \{y\}$
3. Sloped: $L=\{(x,mx+b)\mid x,m,b\in\mathbb R,m\neq0\}$

**For $\mathbb R_l\times \mathbb R$:** The basis for $\mathbb$

**For $\mathbb R_l\times \mathbb R_l$:**