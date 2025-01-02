+++
title = '📐 Orthogonalization via Gram Schmidt'
date = 2024-12-26T11:16:19+01:00
tags = ["orthogonalization", "linear algebra", "mathematics", "gram-schmidt", "basis"]
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
    <a href="https://github.com/InakiRaba91/orthogonalization" style="text-decoration: none; color: blue; line-height: 1;"><strong>Auxiliary repository</strong></a>
</span>
<br><br>

# 1. Motivation

<strong>Orthogonal bases</strong> are a powerful tool in linear algebra. They allow us to decompose vectors into simpler components,
and they are at the core of many numerical algorithms. For instance, imagine we are given an arbitrary function. It maybe computationally
hard to evaluate it, its derivatives, or its integrals. However, if we can approximate it by a polynomial, evaluating these operations becomes much easier. 

We would like to express a function as a linear combination of polynomials $P_n(x)$ up to degree $N$:

$$
\begin{equation}
\tilde{f}(x) = \sum_{n=0}^{N} a_n P_n(x)
\end{equation}
$$

where $\mathbf{a} = [a_0, a_1, \ldots, a_N]$ are the coefficients of the polynomial basis.

Taylor expansion relies on the information of the function and its derivatives at a single point. Therefore it provides a very good approximation of the function near that point, but as we move farther from it, the approximation becomes less accurate. One can instead minimize the difference between the function and its approximation over a given interval. We will define a dot product between two functions $f(x)$ and $g(x)$ in the interval $[a, b]$ as:

$$
\begin{equation}
\left\langle f(x), g(x) \right\rangle = \int_{a}^{b} f(x) g(x) dx
\end{equation}
$$

For the sake of simplicity, we will assume the interval is $[-1, 1]$. Any other interval can be mapped to $[-1, 1]$ by a simple change of variables.
In order for $\tilde{f}(x)$ to be a good approximation of $f(x)$ we would like to minimize the squared norm of the error:

$$
\begin{equation}
\left\Vert e \right\Vert^2 = \int_{-1}^{1} \left( f(x) - \tilde{f}(x) \right)^2 dx = \left\Vert f(x) - \sum_{n=0}^{N} a_n P_n(x) \right\Vert^2
\end{equation}
$$

The norm is nothing but the dot product of a vector with itself, so we can rewrite the above expression as:

$$
\begin{equation}
\left\Vert e \right\Vert^2 = \left\langle f(x) - \sum_{n=0}^{N} a_n P_n(x), f(x) - \sum_{n=0}^{N} a_n P_n(x) \right\rangle
\end{equation}
$$

Leveraging the linearity of the dot product, we can expand the above expression:

$$
\begin{equation}
\left\Vert e \right\Vert^2 = \left\Vert f(x) \right\Vert^2 - 2 \sum_{n=0}^{N} a_n \left\langle f(x), P_n(x) \right\rangle + \sum_{n=0}^{N} \sum_{m=0}^{N} a_n a_m \left\langle P_n(x), P_m(x) \right\rangle
\end{equation}
$$

To find a minima for the error, we can simply take the gradient of the above expression with respect to the coefficients $a_i$ and set it to zero:

$$
\begin{equation}
\frac{\partial}{\partial a_i} \left\Vert e \right\Vert^2 = 0
\end{equation}
$$

which gives us the following equation:

$$
\begin{equation}
-2 \left\langle f(x), P_i(x) \right\rangle + 2 \sum_{n=0}^{N} a_n \left\langle P_n(x), P_i(x) \right\rangle = 0
\end{equation}
$$

In general, solving for the coefficients requires solving a system of linear equations of the form:

$$
\begin{equation}
\mathbf{P} \mathbf{a} = \mathbf{b}
\end{equation}
$$

where $\mathbf{P}$ is a squared matrix with all the inner products of the basis functions

$$
\begin{equation}
\mathbf{P} = \begin{bmatrix}
\left\langle P_0(x), P_0(x) \right\rangle & \left\langle P_0(x), P_1(x) \right\rangle & \cdots & \left\langle P_0(x), P_N(x) \right\rangle \\\\
\left\langle P_1(x), P_0(x) \right\rangle & \left\langle P_1(x), P_1(x) \right\rangle & \cdots & \left\langle P_1(x), P_N(x) \right\rangle \\\\
\vdots & \vdots & \ddots & \vdots \\\\
\left\langle P_N(x), P_0(x) \right\rangle & \left\langle P_N(x), P_1(x) \right\rangle & \cdots & \left\langle P_N(x), P_N(x) \right\rangle 
\end{bmatrix}
\end{equation}
$$

and $\mathbf{b}$ is a vector with all the inner products of the function $f(x)$ with the basis functions:

$$
\begin{equation}
\mathbf{b} = \begin{bmatrix}
\left\langle f(x), P_0(x) \right\rangle \\\\
\left\langle f(x), P_1(x) \right\rangle \\\\
\vdots \\\\ 
\left\langle f(x), P_N(x) \right\rangle
\end{bmatrix}
\end{equation}
$$

But what if the set of polynomials $P_i(x)$ were orthogonal? In that case, the matrix $\mathbf{P}$ would be diagonal. Furthermore, 
if the polynomials were orthonormal (orthogonal and with unit norm), the matrix $\mathbf{P}$ would be the identity matrix. 
This would decouple the system of equations and make the solution trivial:

$$
\begin{equation}
a_i = \frac{\left\langle f(x), P_i(x) \right\rangle}{\left\Vert P_i(x) \right\Vert^2}
\end{equation}
$$

So we do we pick our polynomial basis? The first choice that comes to mind is the monomial basis $P_n(x) = x^n$. Nonetheless, if we compute the inner product of two monomials, we get:

$$
\begin{equation}
\begin{split}
\left\langle P_i(x), P_j(x) \right\rangle = \int_{-1}^{1} x^i x^j dx &= \frac{1}{i+j+1} \left( x^{i+j+1} \right) \Big|_{-1}^{1}\\\\
&= \frac{1}{i+j+1} \left( 1 - (-1)^{i+j+1} \right)
\end{split}
\end{equation}
$$  

which is not zero for $i \neq j$. This means the monomial basis is not orthogonal! So how can we find an orthogonal basis that spans the same space as the monomial basis? Time to introduce the Gram-Schmidt orthogonalization process!


# 2. Orthogonalization via Gram-Schmidt

Say we have a set of linearly independent vectors $\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_n$. If our set of vector contains linearly dependent vectors, we can simply remove the redundant vectors and proceed from there. Our goal is to find an orthogonal basis $\mathbf{w}_1, \mathbf{w}_2, \ldots, \mathbf{w}_n$ that spans the same space as the original set of vectors. 

The <strong>Gram-Schmidt</strong> process allows us to do precisely this. We make $\mathbf{v}$ our reference vector and simply normalize it to make it unitary:  

$$
\begin{equation}
\mathbf{w}_1 = \frac{\mathbf{v}_1}{\left\Vert \mathbf{v}_1 \right\Vert}
\end{equation}
$$

Now we want to tweak the second vector $\mathbf{v}_2$ so that it is orthogonal to $\mathbf{w}_1$. It can be decomposed into two components: one parallel to $\mathbf{w}_1$ and one orthogonal to it:

$$
\begin{equation}
\mathbf{v}_2 = \mathbf{v}_2^{\parallel} + \mathbf{v}_2^{\perp}
\end{equation}
$$

$\mathbf{v}_2^{\parallel}$ corresponds to the projection of $\mathbf{v}_2$ onto $\mathbf{w}_1$:

$$
\begin{equation}
\mathbf{v}_2^{\parallel} = \left\langle \mathbf{v}_2, \mathbf{w}_1 \right\rangle \cdot \mathbf{w}_1
\end{equation}
$$

which leads to the orthogonal vector:

$$
\begin{equation}
\mathbf{v}_2^{\perp} = \mathbf{v}_2 - \mathbf{v}_2^{\parallel}
\end{equation}
$$

Finally, we get $\mathbf{w}_2$ by normalizing $\mathbf{v}_2^{\perp}$ to make it unitary:

$$
\begin{equation}
\mathbf{w}_2 = \frac{\mathbf{v}_2^{\perp}}{\left\Vert \mathbf{v}_2^{\perp} \right\Vert}
\end{equation}
$$

This process is illustrated for a set of two vectors in 2D in the following animation:

<figure class="figure" style="text-align: center;">
  <video src="/gram_schmidt_orthogonalization/GramSchmidt2D.mp4" width="90%" controls style="display: block; margin: auto;">
    Orthogonalization of a set of two vectors in 2D using the Gram-Schmidt process
  </video>
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Orthogonalization of a set of two vectors in 2D using the Gram-Schmidt process</figcaption>
</figure>

At this point you may be wondering: why do I need to bother about normalizing the set of original vectors? Why not simply pick the canonical basis, which is orthonormal by design? And you would be absolutely right! In 2D, a set of two vectors spans the whole space. So the canonical basis is a perfectly valid choice. 

Nevertheless, when the dimensionality of the space spanned by the given vectors is smaller than the dimensionality of the space those vectors are embedded in, the Gram-Schmidt process becomes essential. This is illustrated in the animation below, where we have two vectors in 3D. Now, their span is a 2D plane, shown in green. It is not aligned with the canonical basis, so we need to find an orthogonal basis that spans the same space as the original vectors:

<figure class="figure" style="text-align: center;">
  <video src="/gram_schmidt_orthogonalization/GramSchmidt2DSpan3D.mp4" width="90%" controls style="display: block; margin: auto;">
    Orthogonalization of a set of two vectors in 3D using the Gram-Schmidt process
  </video>
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Orthogonalization of a set of two vectors in 3D using the Gram-Schmidt process</figcaption>
</figure>

Alright, so we have orthogonalized the first two vectors. It is now the turn of $\mathbf{v}_3$. We can decompose it into two components: one lying in the plane spanned by $\mathbf{w}_1$ and $\mathbf{w}_2$, and one orthogonal to it:

$$
\begin{equation}
\mathbf{v}_3 = \mathbf{v}_3^{\parallel} + \mathbf{v}_3^{\perp}
\end{equation}
$$

Since $\mathbf{v}_3^{\parallel}$ lies in the plane spanned by $\mathbf{w}_1$ and $\mathbf{w}_2$, it can be expressed as a linear combination of these vectors:

$$
\begin{equation}
\mathbf{v}_3^{\parallel} = c_1 \cdot \mathbf{w}_1 + c_2 \cdot \mathbf{w}_2
\end{equation}
$$

whereas $\mathbf{v}_3^{\perp}$ will define the third orthogonal vector $\mathbf{w}_3$, so it should just be a scaled version of it:

$$
\begin{equation}
\mathbf{v}_3^{\perp} = c_3 \cdot \mathbf{w}_3
\end{equation}
$$

That is, we can express $\mathbf{v}_3$ as:

$$
\begin{equation}
\mathbf{v}_3 = c_1 \cdot \mathbf{w}_1 + c_2 \cdot \mathbf{w}_2 + c_3 \cdot \mathbf{w}_3
\end{equation}
$$

The coefficients for the known vectors $c_1$ and $c_2$ can be computed by computing the dot product of the above expression with the corresponding vectors $\mathbf{w}_1$ and $\mathbf{w}_2$:

$$
\begin{equation}
c_1 = \left\langle \mathbf{v}_3, \mathbf{w}_1 \right\rangle, \quad c_2 = \left\langle \mathbf{v}_3, \mathbf{w}_2 \right\rangle
\end{equation}
$$

That leaves us with the third orthogonal vector $\mathbf{v}_3^{\perp}$, which can be computed as:

$$
\begin{equation}
\mathbf{v}_3^{\perp} = \mathbf{v}_3 - c_1 \cdot \mathbf{w}_1 - c_2 \cdot \mathbf{w}_2
\end{equation}
$$

and we just need to normalize it to get $\mathbf{w}_3$:

$$
\begin{equation}
\mathbf{w}_3 = \frac{\mathbf{v}_3^{\perp}}{\left\Vert \mathbf{v}_3^{\perp} \right\Vert}
\end{equation}
$$

This process is illustrated in the following animation:

<figure class="figure" style="text-align: center;">
  <video src="/gram_schmidt_orthogonalization/GramSchmidt3DSpan3D.mp4" width="90%" controls style="display: block; margin: auto;">
    Orthogonalization of a set of three vectors in 3D using the Gram-Schmidt process
  </video>
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Orthogonalization of a set of three vectors in 3D using the Gram-Schmidt process</figcaption>
</figure>

So to sum up, the Gram-Schmidt process consists of the following steps:

1. Normalize the first vector to make it unitary: $\mathbf{v}_1 \rightarrow \mathbf{w}_1$
2. For each subsequent vector $\mathbf{v}_i$:
    <ol type="a">
        <li>Project $\mathbf{v}_i$ onto $\text{span}(\mathbf{w}_1, \mathbf{w}_2, \ldots, \mathbf{w}_{i-1}) \rightarrow \mathbf{v}_i^{\parallel}$</li>
        <li>Substract projection to orthogonalize: $\mathbf{v}_i^{\perp} = \mathbf{v}_i - \mathbf{v}_i^{\parallel}$</li>
        <li>Normalize $\mathbf{v}_i^{\perp}$ to make it unitary: $\mathbf{v}_i^{\perp} \rightarrow \mathbf{w}_i$</li>
    </ol>
   
# 3. Legendre Polynomials

Now that we have a grasp of the Gram-Schmidt process, let us apply it to find an orthogonal basis that spans the same space 
as the monomial basis $P_n(x) = x^n$ in the interval $[-1, 1]$. These are known as the <strong>Legendre polynomials</strong>,
denoted as $L_n(x)$. Moreover, they emerge in multiple fields of physics and engineering, such as quantum mechanics, fluid dynamics, and electromagnetism.
In order Toget them in their standard form, we need to add an extra step: instead of normalizing the elements to make them unitary, 
we will normalize them to make them so they evaluate to $L_n(x=1) = 1$:

The first polynomial in our basis is simply the constant function $P_0(x) = 1$ and it is already normalized:

$$
\begin{equation}
L_0(x) = P_0(x) = 1
\end{equation}
$$

To compute the second polynomial $L_1(x)$, we need to orthogonalize the monomial $P_1(x) = x$ with respect to $L_0(x) = 1$.

$$
\begin{equation}
L_1(x) = x - \frac{\left\langle x, 1 \right\rangle}{\left\langle 1, 1 \right\rangle} \cdot 1 = x - \frac{\int_{-1}^{1} x dx}{\int_{-1}^{1} dx} = x
\end{equation}
$$

Similarly, we can compute the third polynomial $L_2(x)$ by orthogonalizing $P_2(x) = x^2$ with respect to $L_0(x) = 1$ and $L_1(x) = x$:

$$
\begin{equation}
\begin{split}
\tilde{L_2(x)} &= x^2 - \frac{\left\langle x^2, 1 \right\rangle}{\left\langle 1, 1 \right\rangle} \cdot 1 - \frac{\left\langle x^2, x \right\rangle}{\left\langle x, x \right\rangle} \cdot x \\\\
&= x^2 - \frac{\int_{-1}^{1} x^2 dx}{\int_{-1}^{1} dx} - \frac{\int_{-1}^{1} x^3 dx}{\int_{-1}^{1} x x dx} \cdot x \\\\
&= x^2 - \frac{1}{3} 
\end{split}
\end{equation}
$$

Recall that we want to normalize the polynomials so that they evaluate to $L_n(1) = 1$. This means we need to divide them by their norm:

$$
\begin{equation}
L_2(x) = \frac{\tilde{L_2(x)}}{\tilde{L_2(1)}} = \frac{1}{2} \left( 3 x^2 - 1 \right)
\end{equation}
$$

The first few Legendre polynomials are shown in the following table:

$$
\begin{equation}
\begin{array}{|c|c|}
\hline
\mathbf{n} & \mathbf{L_n(x)} \\\\
\hline
0 & 1 \\\\
1 & x \\\\
2 & \frac{1}{2} \left( 3 x^2 - 1 \right) \\\\
3 & \frac{1}{2} \left( 5 x^3 - 3 x \right) \\\\
4 & \frac{1}{8} \left( 35 x^4 - 30 x^2 + 3 \right) \\\\
5 & \frac{1}{8} \left( 63 x^5 - 70 x^3 + 15 x \right) \\\\
\hline
\end{array}
\end{equation}
$$

The following interactive plot shows the Legendre polynomials up to degree $10$. You can use the slider to change the degree of the polynomial:

<!-- Interactive Legendre Polynomials -->
<input type="range" id="degreeSlider" min="0" max="10" value="0">
<span id="degreeValue">n=0</span>
<div id="plot"></div>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script type="module" src="/js/plotLegendre.js"></script>

Additionally, the following snippet allows you to approximate any user-defined function (i.e.: <code>abs(x)</code>, <code>sin(x)</code>, <code>exp(x)</code>) by expanding it on Legendre polynomial basis up to degree $n$. You can use the input field to enter the function you want to approximate and the slider to change the degree of the polynomial. Once you have entered the function, click the button to plot it:

<!-- Interactive Legendre Polynomials Approximation-->
<input type="text" id="functionInput" value="cos(5x)exp(x)x" placeholder="e.g., cos(x), exp(x)" style="border: 2px solid black; padding: 5px;">
<button id="plotButton" style="background-color: #FFFFE0; border: 2px solid black; box-shadow: 2px 2px 5px grey; padding: 5px 10px;">Plot Function</button>
<br><br>
<input type="range" id="degreeSliderFunction" min="0" max="10" value="7">
<span id="degreeValueFunction">n=7</span>
<div id="functionPlot"></div>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/9.4.4/math.min.js"></script>
<script type="module" src="/js/plotLegendreApprox.js"></script>

# 4. Conclusion

In this article, we have introduced the <strong>Gram-Schmidt</strong> orthogonalization process. This technique allows us to find an <strong>orthogonal basis</strong> that spans the same space as a given set of linearly independent vectors. We have illustrated the process for a set of two and three vectors in 2D and 3D, respectively. We have also applied the Gram-Schmidt process to find the <strong>Legendre polynomials</strong>, which are orthogonal polynomials that span the same space as the monomial basis in the interval $[-1, 1]$. Finally, we have shown how to approximate any user-defined function by expanding it on the Legendre polynomial basis up to a given degree.

# 5. References

1. Approximation Theory. [University of Queensland](https://teaching.smp.uq.edu.au/scims/Num_analysis/Polynomial.html)
2. Gram-Schmidt process. [Wikipedia](https://en.wikipedia.org/wiki/Gram%E2%80%93Schmidt_process)
3. Legendre polynomials. [Wikipedia](https://en.wikipedia.org/wiki/Legendre_polynomials)
