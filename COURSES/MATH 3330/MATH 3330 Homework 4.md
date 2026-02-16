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

***Proof:*** Let $\mathcal T$ consist of $\mathbb R, \emptyset$, and all infinite open intervals in the form of $(a,\infty)$, where $a$ is real. In order for $\mathcal T$ to be a topology, it must satisfy all of the following conditions:
1. If $\mathcal T$ is a topology on a set $X$, then $X,\emptyset\in\mathcal T$.
2. The union of elements for any subcollection of $\mathcal T$ is in $\mathcal T$.
3. The intersection of elements of any finite subcollection of $\mathcal T$ is in $\mathcal T$.

**1.** By the definition of $\mathcal T$, since $X=\mathbb R$, $X,\emptyset\in\mathcal T$.
**2.** Let $\mathcal U\subseteq \mathcal T$. If $\mathbb R\in\mathcal U$, then $\bigcup\mathcal U=\mathbb R\in\mathcal T$. If $\mathcal U$ contains only $\emptyset$, then trivially $\bigcup\mathcal U=\emptyset\in\mathcal T$. Now consider the case when $\mathbb R\notin \mathcal U$ and $\mathcal U$ contains collections other than than $\emptyset$ ($\mathcal U$ contains at least one nonempty set in the form $(a,\infty)$ for $a\in\mathbb R$).