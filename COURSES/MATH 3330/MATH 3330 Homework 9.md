> [!tip] Siefert-van Kampen Theorem 
> Suppose $X$ is a space which is the union of closed subspaces $Y$ and $Z$ and there is a point $p$ such that $Y\cap Z=\{p\}$. Then we call $X$ the wedge of $Y$ and $Z$ and write $X=Y\vee Z$. 

> [!problem] Question 1
> Find $\pi_1(S^1\vee S^1)$. Explain your reasoning in terms of the Siefert-van Kampen Theorem.

Using the Siefert-van Kampen Theorem, we can decompose $S^1\vee S^1$ into a two pieces that are glued together at a single point. So let $Y=S^1$ be the first loop and $Z=S^1$ be the second loop which are joined at a point $p$ where $Y\cap Z=\{p\}$. Since $Y\cap Z$ is contractible to $p$, then $\pi_1(Y\cup Z) \cong \pi_1(Y)*\pi_1(Z)$ where $*$ is the free product. Since $Y$ and $Z$ are both just $S^1$, both of $\pi_1(Y),\pi_1(Z) \cong \mathbb Z$. Then $\pi_1(S^1\vee S^1)=\mathbb Z * \mathbb Z$.

Being in the free group here means that order matters. Wrapping around the $Y$ loop then the $Z$ loop is different than doing that order backwards.

> [!problem] Question 2
> Assume $p$ is the deformation retract of of some $W_1$ in $Y$ and of some $W_2$ in $Z$. What is $\pi_1(Y \vee Z).$ Explain your reasoning in terms of the Seifert-van Kampen Theorem.

$\pi_1(Y\vee Z)=\pi_1(Y)*\pi_1(Z)$. (* is the free product)

We can let $U$ be an open neighborhood of $Y$ in $Y\vee Z$ that deformation retracts into $Y$, and $V$ be an open neighborhood of $Z$ in $Y\vee Z$ that deformation retracts into $Z$. Then $U\cup V=Y\vee Z$ and $U\cup V$ is an open neighborhood of $p$ that deformation retracts to that point. Then since $\pi_1(U\cap V)$ is isomorphic to the identity, $\pi_1(Y\vee Z)\cong \pi_1(Y)*_{\pi_1(U\cap V)}\pi_1(Z)=\pi_1(Y)*\pi_1(Z)$ where $*$ is the free product.

> [!problem] Question 3
> Explain how to find the fundamental group of both the standard torus and the real projective plane using the Seifert-van Kampen Theorem.

**Torus:**
$T=S^1\times S^1$. Let $U= T\setminus {p}$ for a point $p$ on the torus, and $V$ be a small open ball around $p$.
1. $\pi_1(U\cap V)=S^1$ (Since their intersection creates a very small disk around the point $p$ which can be contracted to a circle)
2. $V$ can be contracted to a point.
3. $U$ contracts to the figure eight ($\mathbb Z * \mathbb Z$)

So $\pi_1(V)$ is trivial, $\pi_1(U)\cong \mathbb Z*\mathbb Z$, and $\pi_1(U\cap V)\cong \mathbb Z$. 

**Real Projective Plane:**
1. $U=\mathbb RP^2\setminus p$ for some point $p$. This retracts to the frame, and is then the same as $\mathbb Z$
2. $V$ is a disk around the point $p$ which retracts to a trivial point.
3. $U\cap V$ retracts to $S^1$ which is the same as $\mathbb Z$.

Then $\pi_1(\mathbb RP^2)\cong\mathbb Z *_\mathbb Z e$. Figuring out the amalgamation: $\pi(\mathbb RP^2)=\langle 1,a \mid i_U(\gamma)=i_V(\gamma)\rangle$. $i_V(\gamma)=e$ since loops in $V$ are trivial. $i_U(\gamma)=a^2$ since loops in $U$ must make two loops around $p$ in order to return to their starting point. So, $\pi_1(\mathbb RP^2)=\langle 1,a\mid b^2=e\rangle=\mathbb Z\setminus2\mathbb Z$ which is the cyclic group of order 2.

> [!problem] Question 4
> Let's find the fundamental group of the 2-fold torus two ways.
> 1. Find the fundamental group of the 2-fold torus using the appropriate identification of a polygon. Explain using Sefiert-van Kampen( - are you noticing a theme?).
> 2. Find the fundamental group of the 2-fold torus by viewing it as the connect sum of two standard tori and use Seifert-van Kampen where U and V are the punctured tori and the intersection is a cylinder.

4. We can represent the standard 2-fold torus (call it $X$) as $aba^{-1}b^{-1}cdc^{-1}d^{-1}$ (by gluing two standard tori together) in the shape of an octagon. Let $U$ be that octagon with a single point $p$ missing and let $V$ be a small disk around that point. Then $U\cap V$ is homotopy equivalent to $S^1$. $U$ retracts to the boundary, and is homotopy equivalent to the wedge of circles (one for each edge $a,b,c,d$). $V$ contracts to a point and is trivial. Then $\pi_1(X)=\langle a,b,c,d \mid aba^{-1}b^{-1}cdc^{-1}d^{-1}=e \rangle$ is the group on four generators.

5. Let $U$ and $V$ be two tori with a disk removed and $U\cap V$ be a cylinder that connects them. $\pi_1(U)=\langle a,b \rangle$ the free group on two generators, and $\pi_1(V)=\langle c,d\rangle$ the free group on two generators. $\pi_1(U\cap V)\cong \mathbb Z$. Then, $\pi_1(T_1 \# T_2)=\langle a,b\rangle *_\mathbb Z \langle c,d\rangle$. When a loop crosses the boundary between $T_1$ (with the polygon representation $aba^{-1}b^{-1}$) and $T_2$ (with the polygon representation $cdc^{-1}d^{-1}$), these must be equal $aba^{-1}b^{-1}=cdc^{-1}d^{-1}$. So $aba^{-1}b^{-1}dcd^{-1}c^{-1}=e$. $c$ and $d$ can be relabeled with each other, so $aba^{-1}b^{-1}cdc^{-1}d^{-1}=e$. Then the fundamental group is $\langle a,b,c,d \mid aba^{-1}b^{-1}cdc^{-1}d^{-1}=e \rangle$ the group on four generators.

> [!problem] Question 5
> Find spaces $X$ and $Y$ with $\pi_1(X,p) \cong \mathbb{Z}_n \times \mathbb{Z}_m$ and $\pi_1(Y,p) \cong \mathbb{Z}_n * \mathbb{Z}_m$

$X=L(n,1)\times L(m,1)$ is the product of two lens spaces. $L(n,1)\cong \mathbb Z_n$ so then $\pi_1(X)=\pi_1(L(n,1)\times L(m,1)) = \pi_1(L(n,1))\times \pi_1(L(m,1))=\mathbb Z_n\times\mathbb Z_m$.

$Y=L(n,1)\vee L(m,1)$. By the Siefert-van Kampen Theorem, the wedge of two spaces is isomorphic to their free product: $\pi_1(L(n,1)\vee L(m,1))\cong \pi_1(L(n,1))* \pi_1 (L(m,1))\cong \mathbb Z_n*\mathbb Z_m$.

> [!problem] Question 6
> (Not on Test 5 but could be on final exam) For each of the following surface presentations, compute the Euler characteristic and determine which standard surface it represents.
> 1. $S=\left\langle a,b,c,d\ |\ abcdad^{-1}cb^{-1}\right\rangle$.
> 2. $S=\left< a, b, c, d, e, f, g, h, i, j\;\vert \;abfg;\; bchi;\; cdjf^{-1};\; deg^{-1}h^{-1};\; eai^{-1}j^{-1}\right>$. 

1. Each edge appears twice, so $abcdad^{-1}cb^{-1}$ is a proper labeling scheme of projective plane type (since there are letters of like-powers). There is 1 face, 4 edges, and 2 vertices (the tails of $b$ and the heads of $d$ are the same, and both sides of the $c$ edges are the same), so $1-4+2=2-m\rightarrow m=3$. This is a 3-fold projective plane.

2. We can concatenate identity loops where they have shared edges: $$\begin{align}&abfg \\ &a[bchi]bfg \\ &ab[cdjf^{-1}]chibgf \\ &abc[deg^{-1}h^{-1}]djf^{-1}chibgf \\ &abcd[eai^{-1}j^{-1}]eg^{-1}h^{-1}djf^{-1}chibgf \\ &abcdeai^{-1}j^{-1}eg^{-1}h^{-1}djf^{-1}chibgf\end{align}$$Then since each letter appears twice and there are letters with like-powers, this is a projective plane. There is 1 face, 10 edges, and 4 vertices, so $1-10+4=2-m\rightarrow m=7$. This is a 7-fold projective plane.
