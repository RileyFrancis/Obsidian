***Riley Francis***
- - -
> [!problem] 
> If $f$ and $g$ are surjective, what can you say about $g\circ f$? If $g\circ f$ is surjective, what can you say about $f$ and $g$? State and prove a theorem about surjectivity under composition.

If $f$ and $g$ are surjective, then $g\circ f$ must also be surjective. 
***Proof:*** Let $f:A\rightarrow B$ and $g: B\rightarrow C$ be functions such that $f$ and $g$ are surjective. Take any $c\in C$. Since $g$ is surjective, there exists some $b\in B$ such that $g(b)=c$ for all $c\in C$. Furthermore, since $f$ is surjective, there exists some $a\in A$ such that $f(a)=b$ for all $b\in B$. Therefore the composition is $(g\circ f)(a)=g(f(a))=g(b)=c$. Since $(g\circ$

If $g\circ f$ is surjective, then $g$ must be surjective, but not necessarily $f$.
***Proof:*** Let $f:A\rightarrow B$ and $g:B\rightarrow C$ be functions such that $g\circ f$ is surjective. For every $c\in C$, there exists some $a\in A$ such that $(g\circ f)(a)=g(f(a))=$ 