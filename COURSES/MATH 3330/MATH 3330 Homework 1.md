***Riley Francis***
- - -
> [!question] **1.** Show that $A\cap (B\cup C) = (A\cap B)\cup (A\cap C)$. 

***Proof:*** We must show that $A\cap (B\cup C) = (A\cap B)\cup (A\cap C)$ by proving that $A\cap (B\cup C) \subseteq (A\cap B)\cup (A\cap C)$ and that $(A\cap B)\cup (A\cap C) \subseteq A\cap (B\cup C)$. 

Let $x\in A\cap (B\cup C)$. Then it must be true that $x\in A$ and $x\in B\cup C$. So if $x\in B$, then $x\in A\cap B$. Similarly, if $x\in C$, then $x\in A\cap C$. Since $x\in B\cup C$ (that is, $x$ is a member of $B$, or $x$ is a member of $C$, or $x$ is a member of both $B$ and $C$), one or both of the two previous statements are true, so $x\in (A\cap B)\cup (A\cap C)$. Therefore, $A\cap (B\cup C) \subseteq (A\cap B)\cup (A\cap C)$.

Let $x\in (A\cap B)\cup (A\cap C)$. Then $x\in A\cap B$ or $x\in A\cap C$. So, $x\in A$ and $x$ must be a member of $B$ or $C$. Thus, $x\in A\cap (B\cup C)$, so therefore $(A\cap B)\cup (A\cap C) \subseteq A\cap (B\cup C)$.

Since we have shown $A\cap (B\cup C) \subseteq (A\cap B)\cup (A\cap C)$ and $(A\cap B)\cup (A\cap C) \subseteq A\cap (B\cup C)$, it must be true that $A\cap (B\cup C) = (A\cap B)\cup (A\cap C)$.

> [!question] **2.** Show that $A- (B\cap C) = (A- B)\cup (A- C)$. 

***Proof:*** We must show that $A- (B\cap C) = (A- B)\cup (A- C)$ by proving that $A- (B\cap C) \subseteq (A- B)\cup (A- C)$ and that $(A- B)\cup (A- C) \subseteq A- (B\cap C)$.

Let $x\in A-(B\cap C)$. That means that $x\in A$, but $x\not\in$