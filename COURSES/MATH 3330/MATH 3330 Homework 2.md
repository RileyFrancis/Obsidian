***Riley Francis***
- - -
> [!problem] 
> If $f$ and $g$ are surjective, what can you say about $g\circ f$? If $g\circ f$ is surjective, what can you say about $f$ and $g$? State and prove a theorem about surjectivity under composition.

**If $f$ and $g$ are surjective, then $g\circ f$ must also be surjective.** 
***Proof:*** Let $f:A\rightarrow B$ and $g: B\rightarrow C$ be functions such that $f$ and $g$ are surjective. Take any $c\in C$. Since $g$ is surjective, there exists some $b\in B$ such that $g(b)=c$ for all $c\in C$. Furthermore, since $f$ is surjective, there exists some $a\in A$ such that $f(a)=b$ for all $b\in B$. Therefore the composition is $(g\circ f)(a)=g(f(a))=g(b)=c$. Since $(g\circ f)(a)=c$ for all $c\in C$, then $g\circ f$ must be surjective.

**If $g\circ f$ is surjective, then $g$ must be surjective, but not necessarily $f$.**
***Proof:*** Let $f:A\rightarrow B$ and $g:B\rightarrow C$ be functions such that $g\circ f$ is surjective. Let $f(a)=b$ for $a\in A$ and $b\in B$. For every $c\in C$, there exists some $a\in A$ such that $(g\circ f)(a)=g(f(a))=g(b)=c$. Since $g(b)=c$ holds for all $c\in C$, $g$ must be surjective.

Now consider $f$. Suppose for the sake of contradiction that $f$ must be surjective. Consider the example when $A=\{0\}$, $B=\{x,y\}$, and $C=\{\alpha\}$ and $f(0)=x$, $g(x)=\alpha$, and $g(y)=\alpha$. Then there exists a $b\in B$ (namely $y$) that $f$ does not map to, meaning that $f$ is not surjective.

> [!problem] 
> Show that $f^{-1}$ preserves difference of sets, but not $f$.

***Proof:*** We must show that $f^{-1}(A-B)=f^{-1}(A)-f^{-1}(B)$. Let $x\in f^{-1}(A-B)$. That means that $x\in A-B$. Thus, $x\in A$ and $x\notin B$. Since $x\in A$, $x\in f^{-1}(A)$, and since $x\notin B$, $x\notin f^{-1}(B)$. So, $x\in f^{-1}(A)-f^{-1}(B)$. Therefore, $f^{-1}$ preserves difference of sets.

Now we must show that $f(A-B)\neq f(A)-f(B)$. Let $x\in A-B$ and $y\in B$.
