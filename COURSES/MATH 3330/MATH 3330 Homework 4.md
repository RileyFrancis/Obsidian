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

***Proof:*** Let $X$ be a topological space and $A\subseteq X$. Suppose that for each $x\in A$ there is an open set $U$ containing $x$ such that $U\subseteq A$. We must show that $A$ is open in $X$.