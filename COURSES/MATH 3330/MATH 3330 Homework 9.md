> [!tip] Siefert-van Kampen Theorem 
> Suppose $X$ is a space which is the union of closed subspaces $Y$ and $Z$ and there is a point $p$ such that $Y\cap Z=\{p\}$. Then we call $X$ the wedge of $Y$ and $Z$ and write $X=Y\vee Z$. 

> [!problem] Question 1
> Find $\pi_1(S^1\vee S^1)$. Explain your reasoning in terms of the Siefert-van Kampen Theorem.

Using the Siefert-van Kampen Theorem, we can decompose $S^1\vee S^1$ into a two pieces that are glued together at a single point. So let $Y=S^1$ be the first loop and $Z=S^1$ be the second loop which are joined at a point $p$ where $Y\cap Z=\{p\}$. Since $Y\cap Z$ is contractible to $p$, then $\pi_1(Y\cup Z) \cong \pi_1(Y)*\pi_1(Z)$ where $*$ is the free product. Since $Y$ and $Z$ are both just $S^1$, both of $\pi_1(Y),\pi_1(Z) \cong \mathbb Z$. Then $\pi_1(S^1\vee S^1)=\mathbb Z * \mathbb Z$.

Being in the free group here means that order matters. Wrapping around the $Y$ loop then the $Z$ loop is different than doing that order backwards.

> [!problem] Question 2
> Assume $p$ is the deformation retract of of some $W_1$ in $Y$ and of some $W_2$ in $Z$. What is $\pi_1(Y \vee Z).$ Explain your reasoning in terms of the Seifert-van Kampen Theorem.

We can let $U=W_1$ and $V=W_2$ where $U\cap V=\{p\}$. Since $p$ is a deformation retract of $W_1$, then $\pi_1(W_1)\cong\pi_1(p)$ which is trivial. Likewise, $p$ is a deformation retract of $W_1$, so $\pi_1(W_2)\cong \pi_1(p)$ is also trivial. Since their intersection is only one point $p$, then $\pi_1(U\cap V)$ is also trivial.

> [!problem] Question 3
> Explain how to find the fundamental group of both the standard torus and the real projective plane using the Seifert-van Kampen Theorem.

**Torus:**
$T=S^1\times S^1$. Let $U= T\setminus {p}$ for a point $p$ on the torus, and $V$ be a small open ball around $p$. Then,
1. $U\cup V=T$
2. $U\cap V=S^1$ (Since their intersection creates a very small disk around the point $p$ which can be contracted to a circle)
3. $V$ can be contracted to a point.

For $U$, it retracts onto the figure eight, so $\pi_1(U)=\mathbb Z * \mathbb Z$.

> [!problem] Question 4
> Let's find the fundamental group of the 2-fold torus two ways.
> 1. Find the fundamental group of the 2-fold torus using the appropriate identification of a polygon. Explain using Sefiert-van Kampen( - are you noticing a theme?).
> 2. Find the fundamental group of the 2-fold torus by viewing it as the connect sum of two standard tori and use Seifert-van Kampen where U and V are the punctured tori and the intersection is a cylinder.

1. 

> [!problem] Question 5
> Find spaces $X$ and $Y$ with $\pi_1(X,p) \cong \mathbb{Z}_n \times \mathbb{Z}_m$ and $\pi_1(Y,p) \cong \mathbb{Z}_n * \mathbb{Z}_m$

$X=L(n,1)\times L(m,1)$ is the product of two lens spaces. $L(n,1)\cong \mathbb Z_n$ so then $\pi_1(X)=$

> [!problem] Question 6
> (Not on Test 5 but could be on final exam) For each of the following surface presentations, compute the Euler characteristic and determine which standard surface it represents.
> 1. $S=\left\langle a,b,c,d\ |\ abcdad^{-1}cb^{-1}\right\rangle$.
> 2. $S=\left< a, b, c, d, e, f, g, h, i, j\;\vert \;abfg;\; bchi;\; cdjf^{-1};\; deg^{-1}h^{-1};\; eai^{-1}j^{-1}\right>$. 