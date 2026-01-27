***Riley Francis***
- - -
> [!question] **1.** Show that $A\cap (B\cup C) = (A\cap B)\cup (A\cap C)$. 

***Proof:*** We must show that $A\cap (B\cup C) = (A\cap B)\cup (A\cap C)$ by proving that $A\cap (B\cup C) \subseteq (A\cap B)\cup (A\cap C)$ and that $(A\cap B)\cup (A\cap C) \subseteq A\cap (B\cup C)$. 

Let $x\in A\cap (B\cup C)$. Then it must be true that $x\in A$ and $x\in B\cup C$. So if $x\in B$, then $x\in A\cap B$. Similarly, if $x\in C$, then $x\in A\cap C$. Since $x\in B\cup C$ (that is, $x$ is a member of $B$, or $x$ is a member of $C$, or $x$ is a member of both $B$ and $C$), one or both of the two previous statements are true, so $x\in (A\cap B)\cup (A\cap C)$. Therefore, $A\cap (B\cup C) \subseteq (A\cap B)\cup (A\cap C)$.

Let $x\in (A\cap B)\cup (A\cap C)$. Then $x\in A\cap B$ or $x\in A\cap C$. So, $x\in A$ and $x$ must be a member of $B$ or $C$. Thus, $x\in A\cap (B\cup C)$, so therefore $(A\cap B)\cup (A\cap C) \subseteq A\cap (B\cup C)$.

Since we have shown $A\cap (B\cup C) \subseteq (A\cap B)\cup (A\cap C)$ and $(A\cap B)\cup (A\cap C) \subseteq A\cap (B\cup C)$, it must be true that $A\cap (B\cup C) = (A\cap B)\cup (A\cap C)$.

> [!question] **2.** Show that $A- (B\cap C) = (A- B)\cup (A- C)$. 

***Proof:*** We must show that $A- (B\cap C) = (A- B)\cup (A- C)$ by proving that $A- (B\cap C) \subseteq (A- B)\cup (A- C)$ and that $(A- B)\cup (A- C) \subseteq A- (B\cap C)$.

Let $x\in A-(B\cap C)$. That means that $x\in A$, but $x\not\in B\cap C$ (so $x\not\in B$ or $x\not\in C$). If $x\not\in B$, then $x\in A-B$. Similarly, if $x\not\in C$, then $x\in A-C$. Since one or both of the two previous statements must be true, $x\in (A- B)\cup (A- C)$. Therefore, $A- (B\cap C) = (A- B)\cup (A- C)$.

Let $x\in (A- B)\cup (A- C)$. Then $x\in A-B$ or $x\in A-C$. So, $x\in A$, and $x\not\in B$ or $x\not\in C$, implying that $x\notin B\cap C$. Thus, $x\in A-(B\cap C)$, and therefore $(A- B)\cup (A- C) \subseteq A- (B\cap C)$.

Since we have shown that $A- (B\cap C) \subseteq (A- B)\cup (A- C)$ and that $(A- B)\cup (A- C) \subseteq A- (B\cap C)$, it must be true that $A- (B\cap C) = (A- B)\cup (A- C)$.

> [!question] **3.** True or False? $(A\cap B)\cup(A-B)=A$

This statement is true.

***Proof:*** Assume that $A-B=A\cap B^c$. Then $(A\cap B)\cup(A-B)=(A\cap B)\cup(A\cap B^c)$. From **#1**, we've shown that $A\cap (B\cup C) = (A\cap B)\cup (A\cap C)$, letting $B^c=C$, we have $(A\cap B)\cup(A\cap B^c)=A\cap(B\cup B^c)$. Since $B\cup B^c=U$ (the universal set $U$), so $A\cap(B\cup B^c)=A\cap U=A$. Therefore, $(A\cap B)\cup(A-B)=A$ is true.

> [!question] **4.** True or False? $(A\times B)\cup (C\times D)=(A\cup C)\times(B\cup D)$

This statement is false.

***Counterexample:*** Take $A=\set{1}$, $B=\set{1}$, $A=\set{2}$, $D=\set{2}$. Then the left hand side would be $\set{(1,1),(2,2)}$, while the right hand side would be $\set{}$

> [!question] **6.** What is the negation of the following statements?

1. There exists some $n\in\mathbb Z$ such that $n^2+n$ is not composite.
2. $\forall a\in A$, $a\in B$.

