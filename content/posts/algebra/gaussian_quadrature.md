+++
title = '🧮 Numerical integration via Gaussian Quadrature'
date = 2025-01-02T11:09:19+01:00
tags = ["numerical integration", "linear algebra", "mathematics", "gaussian quadrature"]
draft = false
+++

<span style="background-color: lightgrey; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
  <details>
    <summary><strong>Table of Contents</strong></summary>
      {{< toc >}}
  </details>
</span>
<br><br>

All the <strong>code</strong> used to generate the animations in this article is available at the following public repository:

<span style="background-color: lightblue; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
    <img src="/github.svg" alt="GitHub Icon" style="width: 24px; height: 24px; margin-right: 10px;">
    <a href="https://github.com/InakiRaba91/numerical_integration" style="text-decoration: none; color: blue; line-height: 1;"><strong>Auxiliary repository</strong></a>
</span>
<br><br>

# 1. Motivation

There are many scenarios in which we need to compute the integral of a function over a given interval. For instance, in physics, we may want to calculate the work done by a force over a certain distance. Or in statistics, we may want to estimate the area under a probability density function. Sometimes, we can compute the integral analytically. But we often run into functions that cannot be integrated in closed form, or we may not have access to the function itself, only to its values at certain points. In these cases, we need to resort to <strong>numerical integration</strong> techniques.

Common strategies for numerical integration include:

- <strong>Rectangle rule</strong>: Approximate the function by a constant over each subinterval.
  $$
  \begin{equation}
  \int_{a}^{b} f(x)  dx \approx \sum_{i=1}^{n} f(x_i) \cdot \Delta x
  \end{equation}
  $$

  <figure class="figure" style="text-align: center;">
    <video src="/gaussian_quadrature/RectangleRule.mp4" width="90%" controls style="display: block; margin: auto;">
      Numerical integration using the rectangle rule
    </video>
    <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Numerical integration using the rectangle rule</figcaption>
  </figure>
- <strong>Trapezoid rule</strong>: Approximate the function by a linear function over each subinterval.
  $$
  \begin{equation}
  \int_{a}^{b} f(x)  dx \approx \frac{1}{2} \sum_{i=1}^{n} (f(x_{i-1}) + f(x_i)) \cdot \Delta x
  \end{equation}
  $$
  <figure class="figure" style="text-align: center;">
    <video src="/gaussian_quadrature/TrapezoidRule.mp4" width="90%" controls style="display: block; margin: auto;">
      Numerical integration using the trapezoid rule
    </video>
    <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Numerical integration using the trapezoid rule</figcaption>
  </figure>
- <strong>Simpson's rule</strong>: Approximate the function by a quadratic function over each subinterval.
  $$
  \begin{equation}
  \int_{a}^{b} f(x)  dx \approx \frac{1}{6} \sum_{i=1}^{n} (f(x_{i-1}) + 4f(x_{i-1/2}) + f(x_i)) \cdot \Delta x
  \end{equation}
  $$
  <figure class="figure" style="text-align: center;">
    <video src="/gaussian_quadrature/SimpsonRule.mp4" width="90%" controls style="display: block; margin: auto;">
      Numerical integration using Simpson's rule
    </video>
    <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Numerical integration using Simpson's rule</figcaption>
  </figure>

These methods are simple to implement and work well for many functions. However, they are only exact for piecewise constant, linear, and quadratic functions, respectively. Importantly, we can observe they all approximate the integral of a function by a weighted sum of its values at certain points $\\{x_i\\}_{i=1}^n$:

$$
\begin{equation}
\int_{a}^{b} f(x)  dx \approx \sum_{i=1}^{n} w_i \cdot f(x_i)
\end{equation}
$$

where $\\{w_i\\}_{i=1}^n$ are the weights assigned to each point, respectively. At this point it is worth asking: if we can only evaluate the function at $n$ points, how could one find the locations of those points and the corresponding weights to make the approximation as accurate as possible?

Without loss of generality, from now on we will focus on the interval $[-1, 1]$. One way to approach the problem is to enforce that the method is exact for polynomials up to a degree $n-1$. Say we sample the points randomly $\\{x_i\\}_{i=1}^n$. For each polynomial of the form $p(x) = x^k$, with $k = 0, 1, \ldots, n-1$, we can compute the integral exactly:

$$
\begin{equation}
\int_{-1}^{1} x^k dx = 
\begin{cases}
0 & \text{if } k \text{ is odd} \\\\
\frac{2}{k+1} & \text{if } k \text{ is even}
\end{cases}
\end{equation}
$$

Likewise, we can evaluate the weighted sum:

$$
\begin{equation}
\sum_{i=1}^{n} w_i \cdot f(x_i) = \sum_{i=1}^{n} w_i \cdot x_i^k
\end{equation}
$$

We can then solve the system of equations for the weights $\\{w_i\\}_{i=1}^n$ characterized by a <strong>Vandermonde matrix</strong>:

$$
\begin{equation}
\begin{bmatrix}
1 & 1 & \cdots & 1 \\\\
x_1 & x_2 & \cdots & x_n \\\\
\vdots & \vdots & \ddots & \vdots \\\\
x_1^{n-1} & x_2^{n-1} & \cdots & x_n^{n-1}
\end{bmatrix}
\begin{bmatrix}
w_1 \\\\
w_2 \\\\
\vdots \\\\
w_n
\end{bmatrix} =
\begin{bmatrix}
2 \\\\
0 \\\\
\vdots
\end{bmatrix}
\end{equation}
$$

We have now found a way to compute the integral of any polynomial of degree $n-1$ exactly by a weighted sum of its values at $n$ points. Therefore this approach also provides a way to numerically estimate the integral of any function that can be approximated by a polynomial of degree $n-1$.

Notably, it turns out that by choosing smartly the points $\\{x_i\\}_{i=1}^n$, we can double the degree of the polynomial that we can integrate exactly! This is the idea behind <strong>Gaussian Quadrature</strong>, where <italic>Quadrature</italic> is a historical term that refers to the process of calculating the area under a curve. And Legendre polynomials, which we introduced in a previous post ([Orthogonalization via Gram Schmidt](https://inakiraba91.github.io/posts/algebra/gram_schmidt_orthogonalization/)), are at the core of this method.

# 2. Properties of the Legendre polynomials

The <strong>Legendre polynomials</strong> are a sequence of orthogonal polynomials. You can use the slider to visualize the first ten Legendre polynomials:

<!-- Interactive Legendre Polynomials -->
<input type="range" id="degreeSlider" min="0" max="10" value="0">
<span id="degreeValue">n=0</span>
<div id="plot"></div>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script type="module" src="/js/plotLegendre.js"></script>

It is worth noting a few properties they satisfy. Proofs for these properties is included for the sake of completeness, but feel free to skip them if you are not interested:

- **Property 1**: The **parity** of the Legendre polynomial $L_n(x)$ is $(-1)^n$.
  
  <span style="background-color: lightyellow; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
    <details>
      <summary><strong>Proof</strong></summary>
        The Legendre polynomials can be constructed by orthogonalizing the monomial basis $\{x^k\}_{k=0}^n$ in the interval $[-1, 1]$., where each monomial
        is either even or odd according to its degree $k$. They satisfy the following equation by design:
        $$
        L_k(x) = x^k - \sum_{j=0}^{k-1} \frac{\langle x^k, L_j \rangle}{\langle L_j, L_j \rangle} L_j(x)
        $$
        We will resort to mathematical induction to prove the property. <br><br>
        <strong>Base case</strong>: The Legendre polynomial $L_0(x)=1$ is a constant function, which is even.<br><br>
        <strong>Inductive step</strong>: Assume that the sequence $\{L_j(x)\}_{j=0}^{k-1}$ satisfies that each element is either even or odd according to its index $j$. 
        Since the interval of integration is symmetric, $\langle x^k, L_j \rangle =0$ when $k$ and $j$ have different parity. 
        From the previous equation, $L_k(x)$ is a sum of functions of the same parity as $k$. Therefore, $L_k(x)$ is either even or odd according to the parity of $k$.
    </details>
  </span>

- **Property 2**: The Legendre polynomial $L_n(x)$ is **orthogonal** to any polynomial of degree $n-1$.

  <span style="background-color: lightyellow; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
    <details>
      <summary><strong>Proof</strong></summary>
        When orthogonalizing the k-th vector $\mathbf{w}_k$, Gram-Schmidt process guarantees that the resulting vector $\mathbf{v}_k$ is orthogonal to the space spanned by the previous vectors $\{\mathbf{v}_j\}_{j=0}^{k-1}$. Legendre polynomials are derived by applying Gram Schmidt process the monomial basis $\{x^k\}_{k=0}^n$ in the interval $[-1, 1]$. Therefore, by construction, $L_n(x)$ is orthogonal to any monomial $\{x^k\}_{k=0}^{n-1}$, which in turn spans the space of polynomials of degree $n-1$.
    </details>
  </span>

- **Property 3**: The Legendre polynomial $L_n(x)$ has $n$ distinct real **roots** in the interval $[-1, 1]$.
  
  <span style="background-color: lightyellow; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
    <details>
      <summary><strong>Proof</strong></summary>
        Let us prove it by contradiction (see Theorem 5.2 in [6]). We know that $L_n(x)$ is orthogonal to $L_0(x)$ by construction. Therefore
        $$
        \int_{-1}^{1} L_n(x) \cdot L_0(x)  dx = 0
        $$
        This implies that $L_n(x)$ must change sign at least once in the interval $[-1, 1]$. Or equivalently, it has at least one real root of odd multiplicity. 
        <br><br>
        Let us assume it has $m$ roots, $x_1, x_2, \ldots, x_m$, with odd multiplicity. By the previous argument, $m > 0$. Furthermore, since $L_n(x)$ is a 
        polynomial of degree $n$, we have that $m \leq n$.
        <br><br>
        Now let us assume $m < n$. We can consider the polynomial
        $$
        Z(x) = (x-x_1) \cdot (x-x_2) \cdots (x-x_m)
        $$
        Notice all rots of $L_n(x) \cdot Z(x)$ have even multiplicity. That implies it does not change sign in the interval $[-1, 1]$, which results
        in its integral being non-zero
        $$
        \int_{-1}^{1} L_n(x) \cdot Z(x)  dx \neq 0
        $$
        Moreover, since $Z_n(x)$ has degree $m < n$, it must be orthogonal to $L_n(x)$ (see Property 2). Thus the integral must satisfy:
        $$
        \int_{-1}^{1} L_n(x) \cdot Z(x)  dx = 0
        $$
        And thus the contradiction. Therefore, the only possibility is that $m=n$, and $L_n(x)$ has $n$ distinct real roots in the interval $[-1, 1]$.
    </details>
  </span>
 

# 3. Numerical integration via Gaussian Quadrature

Let us recap how we got here. We proved in Section 1 there is a way to compute the integral of any polynomial of degree $n-1$ exactly by a weighted sum 
of its values at $n$ distinct points: 

$$
\begin{equation}
\int_{a}^{b} f(x)  dx \approx \sum_{i=1}^{n} w_i \cdot f(x_i)
\end{equation}
$$

As a result, we can expect a good numerical approximation of the integral of any function that is well approximated by a polynomial of degree $n-1$. 
And here is where a beautiful insight by Carl Friedrich Gauss comes into play. He realized that by choosing the points $\\{x_i\\}_{i=1}^n$ 
smartly, we can double the degree of the polynomial that we can integrate exactly. This is the idea behind <strong>Gaussian Quadrature</strong>.

Let us say we have a polynomial $P_{2n-1}(x)$ of degree $2n-1$. If we divide it by the Legendre polynomial $L_n(x)$, we can express it as:

$$
\begin{equation}
P_{2n-1}(x) = L_n(x) \cdot Q_{n-1}(x) + R_{n-1}(x)
\end{equation}
$$

where according to the rules of polynomial division:
 - The quotient $Q_{n-1}(x)$ is a polynomial of degree $n-1$ 
 - The remainder $R_{n-1}(x)$ is a polynomial of degree at most $n-1$
 
Recall the goal is to compute exactly the integral of $P_{2n-1}(x)$ by a weighted sum of its values at $n$ points. We can rewrite the integral as:

$$
\begin{equation}
\int_{-1}^{1} P_{2n-1}(x)  dx = \int_{-1}^{1} L_n(x) \cdot Q_{n-1}(x)  dx + \int_{-1}^{1} R_{n-1}(x)  dx
\end{equation}
$$

Now you can see why we chose to divide by the Legendre polynomial $L_n(x)$. By Property 2, the Legendre polynomial $L_n(x)$ is
orthogonal to any polynomial of degree $n-1$. Therefore, the first integral is zero. We are left with the integral of the remainder $R_{n-1}(x)$:

$$
\begin{equation}
\int_{-1}^{1} P_{2n-1}(x)  dx = \int_{-1}^{1} R_{n-1}(x)  dx
\end{equation}
$$

This means the integral of $P_{2n-1}(x)$ is equal to the integral of a polynomial of degree at most $n-1$. That in turn implies we can compute the integral of 
it exactly from just $n$ points! There is a price to pay though: it is not $P_{2n-1}(x)$ that we have to evaluate, but the remainder $R_{n-1}(x)$, which we would need to compute.

Notice though we have not chosen the points $\\{x_i\\}_{i=1}^n$ yet. Gauss made a really clever observation. What if we choose the points to 
be the $n$ roots of the Legendre polynomial $L_n(x)$? Then from Eq.(9) we have

$$
\begin{equation}
P_{2n-1}(z_i) = L_n(z_i) \cdot Q_{n-1}(z_i) + R_{n-1}(z_i)
\end{equation}
$$

where $\\{z_i\\}_{i=1}^n$ denote the roots of the Legendre polynomial $L_n(x)$. Since $L_n(z_i) = 0$, we have that 

$$
\begin{equation}
P_{2n-1}(z_i) = R_{n-1}(z_i) \quad \forall i \in \\{1, \ldots, n \\}
\end{equation}
$$

And that is it! We have found a way to compute the integral of any polynomial of degree $2n-1$ exactly by a weighted sum of its values at $n$ points!

$$
\begin{equation}
\int_{a}^{b} f(x)  dx \approx \sum_{i=1}^{n} w_i \cdot f(z_i)
\end{equation}
$$

where the weights $\\{w_i\\}_{i=1}^n$ can be precomputed for every $n$ by solving the Vandermonde system of equations in Eq.(7).

The interactive plot below shows how the different methods approximate the integral of a function. You can change the function, the number of points $n$, and the method used to compute the integral.

<!-- Interactive Legendre Polynomials Approximation-->
<input type="text" id="functionInput" value="cos(2x)exp(x)" placeholder="e.g., cos(x), exp(x)" style="border: 2px solid black; padding: 5px;">
<button id="plotIntegralButton" style="background-color: #FFFFE0; border: 2px solid black; box-shadow: 2px 2px 5px grey; padding: 5px 10px;">Plot Function</button>
<br><br>
<input type="range" id="numPointsSlider" min="1" max="5" value="2">
<span id="numPointsValue">n=2</span>
<br><br>
<select id="methodSelect" style="background-color: #ADD8E6; border: 2px solid black; padding: 5px;">
  <option value="gaussian" selected>Gaussian Quadrature</option>
  <option value="rectangle">Rectangle Rule</option>
  <option value="trapezoid" id="trapezoidOption">Trapezoid Rule</option>
  <option value="simpson" id="simpsonOption" style="display: none;">Simpson's Rule</option>
</select>
<br><br>
<div id="functionPlot"></div>

<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/9.4.4/math.min.js"></script>
<script type="module" src="/js/plotLegendreIntegral.js"></script>

# 4. Conclusion

In this article, we have introduced the concept of **Gaussian Quadrature**, a numerical integration technique that allows us to compute the integral of any polynomial of degree $2n-1$ exactly by a weighted sum of its values at $n$ points. We have seen how it leverages the properties of the **Legendre polynomials** to achieve this. We have also compared it to other numerical integration methods, such as the **Rectangle Rule**, the **Trapezoid Rule**, and **Simpson's Rule**.

# 5. References

1. Approximation Theory. [University of Queensland](https://teaching.smp.uq.edu.au/scims/Num_analysis/Polynomial.html)
2. Legendre polynomials. [Wikipedia](https://en.wikipedia.org/wiki/Legendre_polynomials)
3. Numerical Integration: Gauss Quadrature [University of Alberta](https://engcourses-uofa.ca/books/numericalanalysis/numerical-integration/gauss-quadrature/)
4. Numerical Integration [Wikipedia](https://en.wikipedia.org/wiki/Numerical_integration)
5. Gaussian Quadrature video series by MathTheBeautiful [YouTube](https://www.youtube.com/watch?v=65zwMgGZnUs)
6. An Introduction to Orthogonal Polynomials, by T.S. Chihara. Dover Publications, 2011.
7. Polynomial long division. [Wikipedia](https://en.wikipedia.org/wiki/Polynomial_long_division)
8. ManimMiniProjects by TheRookieNerd. [GitHub](https://github.com/TheRookieNerd/ManimMiniProjects/tree/master)
