+++
title = '➰ Curve fitting: Polynomial, Bézier and Spline curves'
date = 2025-01-04T11:09:19+01:00
tags = ["curve fitting", "splines", "b-splines", "bezier curves", "polynomial curves"]
draft = false
+++

<span style="background-color: lightgrey; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
  <details>
    <summary><strong>Table of Contents</strong></summary>
      {{< toc >}}
  </details>
</span>
<br><br>

In this article we will explore how one one can construct a curve that approximates a set of given points. We will start by discussing the concept of convex sets and how they can be used to define a curve that interpolates a set of points. We will then move on to polynomial curves, Bézier curves and splines.

# 1. Convex sets

As we will see in the following sections, we will construct our curves by weighted sums of the given points. A challenge in floating point arithmetic is the numerical instabilities introduced by round-off errors, which is further amplified by chaining multiple operations. 

A weighted sum of points $\\{ \mathbf{c}_i \\} _{i=1}^n$ is given by

$$
\begin{equation}
\mathbf{c} = \sum_{i=1}^n \lambda_i \mathbf{c}_i
\end{equation}
$$

One way to mitigate the numerical instabilities is to ensure that the weights $\lambda_i$ are non-negative and sum to one

$$
\begin{equation}
\sum_{i=1}^n \lambda_i = 1
\end{equation}
$$

This is equivalent to saying our weighted sums are **convex combinations** of the given points. 

A **convex set** $S$ is a set where for any two points $\mathbf{c}_1, \mathbf{c}_2 \in S$ the line segment connecting $\mathbf{c}_1$ and $\mathbf{c}_2$ is also contained in $S$. The **convex hull** of a set of points is the smallest convex set that contains all the points, and it is precisely given by the set of all convex combinations of the points as defined in Eq.(1). 

Furthermore, the convex hull of a set of points corresponds to the $n$-sided polygon with its vertices at the given points. However, if any point is a convex combination of the other points, then the number of sides of the polygon is reduced by one. 

The following animation illustrates the convex hull of a set of points. You can add and remove points, as well as drag them around to see how the convex hull changes.

<div style="text-align: center; margin-bottom: 10px;">
  <button id="addPointButton" style="background-color:rgb(187, 228, 163); border: 2px solid black; box-shadow: 2px 2px 5px grey; padding: 5px 10px;">Add Point</button>
  <button id="removePointButton" style="background-color:rgb(228, 165, 163); border: 2px solid black; box-shadow: 2px 2px 5px grey; padding: 5px 10px;">Remove Point</button>
</div>
<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container" style="position: relative; width: 600px; height: 400px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing the convex hull of a set of points. You can add, remove, and drag points to see how the convex hull changes.</figcaption>
</figure>

<style>
  button:disabled {
    background-color: grey;
    cursor: not-allowed;
    box-shadow: none;
  }
</style>


<script type="module" src="/js/plotConvexHull.js"></script>

# 2. Polynomial curves

## 2.1. Linear interpolation

Say we have two points $\mathbf{c}_0$ and $\mathbf{c}_1$. We can be rewrite the convex combination of these points as

$$
\begin{equation}
\mathbf{q}(t|\mathbf{c}_0, \mathbf{c}_1; t_0, t_1) = \frac{t-t_0}{t_1-t_0} \mathbf{c}_0 + \frac{t_1-t}{t_1-t_0} \mathbf{c}_1
\end{equation}
$$

where $t_0$ and $t_1$ are two arbitrary numbers such that $t_0 < t < t_1$. Notice that the weights add up to one as required

$$
\begin{equation}
\frac{t-t_0}{t_1-t_0} + \frac{t_1-t}{t_1-t_0} = 1
\end{equation}
$$

One way to interpret the auxiliary parameter $t$ is as a time parameter. As such, we can compute the velocity through the curve as

$$
\begin{equation}
\mathbf{v}(t|\mathbf{c}_0, \mathbf{c}_1; t_0, t_1) = \frac{d}{dt} \mathbf{q}(t|\mathbf{c}_0, \mathbf{c}_1; t_0, t_1) = \frac{\mathbf{c}_1 - \mathbf{c}_0}{t_1-t_0}
\end{equation}
$$

No matter our choice of $t_0$ and $t_1$, the parametric curve $\mathbf{q}(t|\mathbf{c}_0, \mathbf{c}_1; t_0, t_1)$ is the straight line from $\mathbf{c}_0$ to $\mathbf{c}_1$. 
However, the choice of $t_0$ and $t_1$ can be used to control the speed at which we traverse the line.

## 2.2. Quadratic interpolation

Say we have three points $\\{ \mathbf{c}_i \\} _{i=0}^2$ . We can define threee auxiliary parameters $\\{ t_i \\} _{i=0}^2$. Then we can construct 
a quadratic curve that interpolates these points by taking two steps:

1. Construct a convex combination of $(\mathbf{c}_0\,\mathbf{c}_1)$, and $(\mathbf{c}_1\,\mathbf{c}_2)$ respectively:

  $$
  \begin{equation}
  \mathbf{q}_0^1(t)=\mathbf{q}_0^1(t|\mathbf{c}_0, \mathbf{c}_1; t_0, t_1) = \frac{t-t_0}{t_1-t_0} \mathbf{c}_0 + \frac{t_1-t}{t_1-t_0} \mathbf{c}_1
  \end{equation}
  $$

  $$
  \begin{equation}
  \mathbf{q}_1^1(t)=\mathbf{q}_1^1(t|\mathbf{c}_1, \mathbf{c}_2; t_1, t_2) = \frac{t-t_1}{t_2-t_1} \mathbf{c}_1 + \frac{t_2-t}{t_2-t_1} \mathbf{c}_2
  \end{equation}
  $$

2. Construct a convex combination of $(\mathbf{q}_0^1, \mathbf{q}_1^1)$:

  $$
  \begin{equation}
  \mathbf{q}_0^2(t|\mathbf{c}_0, \mathbf{c}_1, \mathbf{c}_2; t_0, t_1, t_2) = 
  \frac{t-t_0}{t_2-t_0} \mathbf{q}_0^1(t) + \frac{t_2-t}{t_2-t_0} \mathbf{q}_1^1(t)
  \end{equation}
  $$

You can convince yourself that $\mathbf{q}_0^2(t)$ interpolates the three points by verifying that $\mathbf{q}_0^2(t_i) = \mathbf{c}_i$ for $i \in \\{0, 1, 2 \\}$.

Importantly, the choice of $t_0$, $t_1$ and $t_2$ impacts the shape of the curve. To illustrate it we provide the following interactive plot, where we set $t_0=0$, $t_2=1$. Notice how the curve changes as you vary $t_1$: as the ratio $\frac{t_1-t_0}{t_2-t_1}$ increases, the curve takes a longer path to traverse $(\mathbf{c}_0\,\mathbf{c}_1)$ w.r.t. $(\mathbf{c}_1\,\mathbf{c}_2)$.

<div style="text-align: center; margin-bottom: 10px;">
  <label for="t0-slider" style="display: inline-block; width: 60px;">t0: <span id="t0-value">0</span></label>
  <input type="range" id="t0-slider" min="0" max="1" step="0.01" value="0" style="width: 280px;" disabled>
</div>
<div style="text-align: center; margin-bottom: 10px;">
  <label for="t1-slider" style="display: inline-block; width: 60px;">t1: <span id="t1-value">0.50</span></label>
  <input type="range" id="t1-slider" min="0.01" max="0.99" step="0.01" value="0.50" style="width: 280px;">
</div>
<div style="text-align: center; margin-bottom: 10px;">
  <label for="t2-slider" style="display: inline-block; width: 60px;">t2: <span id="t2-value">1</span></label>
  <input type="range" id="t2-slider" min="0" max="1" step="0.01" value="1" style="width: 280px;" disabled>
</div>
<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container-quad" style="position: relative; width: 600px; height: 400px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot-quad" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing a quadratic curve interpolating three points. You can vary the parameter $t_1$ to see how the curve changes.</figcaption>
</figure>

<link rel="stylesheet" type="text/css" href="/css/curve_sliders.css">

<script type="module" src="/js/plotQuadraticCurve.js"></script>

## 2.3 Polynomial interpolation

Hopefully, the pattern is clear by now. We can construct a polynomial curve that interpolates $n$ points according to the following algorithm, the **Neville-Aitken method**:

**Algorithm 1: Neville-Aitken method**

Let $\\{ \mathbf{c}_i \\} _{i=0}^{n}$ be a set of $n + 1$ points and $\\{ t_i \\} _{i=0}^{n}$ be a set of $n+1$ strictly increasing auxiliary parameters. There is a polynomial curve $\mathbf{q}_0^n(t)$ that passes through all the points, i.e.,

$$
\begin{equation}
\mathbf{q}_0^n(t_i) = \mathbf{c}_i \quad \forall i \in \\{0, \ldots, n \\}
\end{equation}
$$

and for any number $t$ such that $t_0 < t < t_n$, the polynomial curve $\mathbf{q}_0^n(t)$ is given by the following steps:

$\mathbf{q}_i^0(t) \leftarrow \mathbf{c}_i \quad \forall i \in \\{0, \ldots, n \\}$

for $0 \leq k < n$ do:

&nbsp;&nbsp;&nbsp;&nbsp; for $0 \leq i < n-k$ do:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
$q_i^{k+1}(t) \leftarrow \frac{t-t_i}{t_{i+k+1}-t_i} q_i^{k}(t) + \frac{t_{i+k+1}-t}{t_{i+k+1}-t_i} q_{i+1}^{k}(t)$

We illustrate below the algorithm for $n=3$ points:

<figure class="figure" style="text-align: center;">
  <img src="/curve_fitting_bsplines/NevilleAitken.svg" alt="Neville Aitken" width="90%" controls style="display: block; margin: auto;">
    Neville-Aitken method for polynomial interpolation
  </video>
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Computing a point in a cubic curve according to Neville-Aitken method. The algorithm is applied to a set of 4 points.</figcaption>
  </figcaption>
</figure>

The following interactive plot illustrates the polynomial curve that interpolates a set of up to 5 points. You can add and remove points, as well as drag them around to see how the curve changes. Furthermore, you can vary the auxiliary parameters $t_i$ to see how the curve changes.

<div style="text-align: center; margin-bottom: 10px;">
  <button id="addPointPolyButton" style="background-color:rgb(187, 228, 163); border: 2px solid black; box-shadow: 2px 2px 5px grey; padding: 5px 10px;">Add Point</button>
  <button id="removePointPolyButton" style="background-color:rgb(228, 165, 163); border: 2px solid black; box-shadow: 2px 2px 5px grey; padding: 5px 10px;">Remove Point</button>
</div>
<div id="sliders-container" style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 10px;">
    <label for="t0Poly-slider" style="display: inline-block; width: 60px;">t0: <span id="t0Poly-value">0</span></label>
    <input type="range" id="t0Poly-slider" min="0" max="1" step="0.01" value="0" style="width: 280px;" disabled>
  </div>
  <div style="margin-bottom: 10px;">
    <label for="t1Poly-slider" style="display: inline-block; width: 60px;">t1: <span id="t1Poly-value">1</span></label>
    <input type="range" id="t1Poly-slider" min="0" max="1" step="0.01" value="1" style="width: 280px;" disabled>
  </div>
</div>
<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container-poly" style="position: relative; width: 600px; height: 400px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot-poly" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing a polynomial curve interpolating up to 5 points. You can vary the parameter $t_i$ to see how the curve changes, as well as add, drag or remove points.</figcaption>
</figure>

<link rel="stylesheet" type="text/css" href="/css/curve_sliders.css">

<script type="module" src="/js/plotPolyCurve.js"></script>

## 2.4. Convexity

The main issue with polynomial curves is that they are not contained within the convex hull of the given points, so they can oscillate wildly. 
This may seem counterintuitive at first, given that we are constructing the curve as a convex combination of the points. To understand
what is happening, let us focus on the quadratic case. Recall that a convex combination of two points $\mathbf{a}$ and $\mathbf{b}$ is given by:

$$
\begin{equation}
\frac{t_b-t}{t_b-t_a} \mathbf{a} + \frac{t-t_a}{t_b-t_a} \mathbf{b}
\end{equation}
$$

with $t \in [t_a, t_b]$, which geometrically corresponds to the line segment that connects $\mathbf{a}$ and $\mathbf{b}$. However, one could compute it for any $t \in \mathbb{R}$, which would extend to the whole straight line passing thhrough $\mathbf{a}$ and $\mathbf{b}$. The following animation illustrates this concept, where we have set $t_a=0$, $t_b=1$. See where the point lands as you vary $t$.

<div style="text-align: center; margin-bottom: 10px;">
  <label for="tAffine-slider" style="display: inline-block; width: 60px;">t: <span id="tAffine-value">0.50</span></label>
  <input type="range" id="tAffine-slider" min="-0.25" max="1.25" step="0.01" value="0.50" style="width: 280px;">
</div>
<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container-affine" style="position: relative; width: 600px; height: 400px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot-affine" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing a straight line passing through two points. You can vary the parameter $t$ to see where the point lands.</figcaption>
</figure>

<script type="module" src="/js/plotAffine.js"></script>

The first step in building a quadratic curve from three points $\\{ \mathbf{c}_i \\} _{i=0}^2$ is to build the two line segments that connect $(\mathbf{c}_0\,\mathbf{c}_1)$ and $(\mathbf{c}_1\,\mathbf{c}_2)$:

$$
\begin{equation}
\begin{split}
\mathbf{q}_0^1(t) = \frac{t_1-t}{t_1-t_0} \mathbf{c}_0 + \frac{t-t_0}{t_1-t_0} \mathbf{c}_1 \\\\
\mathbf{q}_1^1(t) = \frac{t_2-t}{t_2-t_1} \mathbf{c}_1 + \frac{t-t_1}{t_2-t_1} \mathbf{c}_2
\end{split}
\end{equation}
$$

And here we start to get into trouble. The first combination is convex in the range $t \in [t_0, t_1]$, whereas the second one is convex for $t \in [t_1, t_2]$. The second and final step is to build the convex combination of the two line segments:

$$
\begin{equation}
\mathbf{q}_0^2(t) = \frac{t_2-t}{t_2-t_0} \mathbf{q}_0^1(t) + \frac{t-t_0}{t_2-t_0} \mathbf{q}_1^1(t)
\end{equation}
$$

which is defined for $t \in [t_0, t_2]$. Therefore, the only point in that range where we're combining points from the convex hull is $t=t_1$. Take a look at the following animation to better understand it. We have set $t_0=0$, $t_1=0.5$, $t_2=1$. See where the point lands as you vary $t$.

<div style="text-align: center; margin-bottom: 10px;">
  <label for="tNonConvex-slider" style="display: inline-block; width: 60px;">t: <span id="tNonConvex-value">0.00</span></label>
  <input type="range" id="tNonConvex-slider" min="0" max="1" step="0.01" value="0" style="width: 280px;">
</div>
<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container-nonconvex" style="position: relative; width: 600px; height: 400px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot-nonconvex" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing a quadratic curve interpolating three points. We have three points, $\mathbf{c}_0$ (<span style="color: red;">red</span>), $\mathbf{c}_1$ (<span style="color: blue;">blue</span>), and $\mathbf{c}_2$ (<span style="color: green;">green</span>). The black segments tor $t \in [t_0, t_1]$ and $t \in [t_1, t_2]$ respectively represent the convex hull of each pair. Both are extended in <span style="color: grey;">grey</span> to show the affine range for $t \in [t_1, t_2]$ and $t \in [t_0, t_1]$ respectively. The quadratic curve is shown in <span style="color: purple;">purple</span>, and corresponds to the convex combination of the <span style="color: pink;">pink</span> dots along both lines.</figcaption>
</figure>

<script type="module" src="/js/plotNonConvex.js"></script>


# 3. Bézier curves

## 3.1. Construction

The polynomial curves we have seen so far are not contained within the convex hull of the given points. The reason lies in the fact we construct them by convex combinations over non-overlapping intervals. Bézier curves fix this issue by constructing the curve as a convex combination of the points over the whole interval.

Withouth loss of generality, we will set the interval to be $[0, 1]$. Convex combinations take the form

$$
\begin{equation}
\mathbf{p}(t) = (1-t)\cdot \mathbf{a} + t \cdot \mathbf{b}
\end{equation}
$$

with $t \in [0, 1]$. We can apply the following algorithm to construct a Bézier curve that interpolates a set of $n+1$ points:

**Algorithm 2**

Let $\\{ \mathbf{c}_i \\} _{i=0}^{n}$ be a set of $n + 1$ points. We can construct a Bézier curve $\mathbf{p}_0^n(t)$ by the following steps:

$\mathbf{p}_i^0(t) \leftarrow \mathbf{c}_i \quad \forall i \in \\{0, \ldots, n \\}$

for $0 \leq k < n$ do:

&nbsp;&nbsp;&nbsp;&nbsp; for $0 \leq i < n-k$ do:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
$p_i^{k+1}(t) \leftarrow (1-t) \cdot p_i^{k}(t) + t \cdot p_{i+1}^{k}(t)$

We illustrate below the algorithm for $n=3$ points:

<figure class="figure" style="text-align: center;">
  <img src="/curve_fitting_bsplines/Bezier.svg" alt="Neville Aitken" width="90%" controls style="display: block; margin: auto;">
    Algorithm to construct a Bézier curve that interpolates a set of points
  </video>
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Computing a point in a cubic Bézier curve according to Algorithm 2. It is depicted for a set of 4 points.</figcaption>
  </figcaption>
</figure>

It can be shown by induction that the Bézier curve can be expressed as a linear combination of a set of polynomials:

$$
\begin{equation}
p_0^n(t) = \sum_{i=0}^n b_i^d(t) \cdot \mathbf{c}_i
\end{equation}
$$

where $b_i^d(t)$ are the Bernstein polynomials, a basis for the space of polynomials of degree $d$ that are non-negative and sum to one. They are given by

$$
\begin{equation}
b_i^d(t) = \binom{n}{i} t^i (1-t)^{n-i}
\end{equation}
$$

The following interactive plot illustrates the Bézier curve that interpolates a set of up to 5 points. You can add and remove points, as well as drag them around to see how the curve changes. Notice how the curve is contained within the convex hull of the given points.

<div style="text-align: center; margin-bottom: 10px;">
  <button id="addPointBezierButton" style="background-color:rgb(187, 228, 163); border: 2px solid black; box-shadow: 2px 2px 5px grey; padding: 5px 10px;">Add Point</button>
  <button id="removePointBezierButton" style="background-color:rgb(228, 165, 163); border: 2px solid black; box-shadow: 2px 2px 5px grey; padding: 5px 10px;">Remove Point</button>
</div>
<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container-bezier" style="position: relative; width: 600px; height: 400px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot-bezier" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing a polynomial curve interpolating up to 5 points. You can add, drag or remove points. The curve should be contained within the convex hull, shown in <span style="color: purple;">purple</span>.
  </figcaption>
</figure>

<link rel="stylesheet" type="text/css" href="/css/curve_sliders.css">

<script type="module" src="/js/plotBezierCurve.js"></script>

## 3.2. Convexity

By construction, given that all convex combinations are computed over the whole interval $[0, 1]$, Bézier curves are contained within the convex hull of the given points.  That in turn implies that, except for the first and last one, the curve does not pass through the points anymore. For that reason, we refer to them as **control points**.

The following interactive plot illustrates how the quadratic Bézier curve is built from three points. See how varying $t$ results in the traversal along the curve.

<div style="text-align: center; margin-bottom: 10px;">
  <label for="tConvexBezier-slider" style="display: inline-block; width: 60px;">t: <span id="tConvexBezier-value">0.50</span></label>
  <input type="range" id="tConvexBezier-slider" min="0" max="1" step="0.01" value="0.50" style="width: 280px;">
</div>
<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container-convex-bezier" style="position: relative; width: 600px; height: 400px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot-convex-bezier" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing a quadratic Bézier curve interpolating three points. We have three points, $\mathbf{c}_0$ (<span style="color: red;">red</span>), $\mathbf{c}_1$ (<span style="color: blue;">blue</span>), and $\mathbf{c}_2$ (<span style="color: green;">green</span>). The black segments correspond to the convex combinations of $(\mathbf{c}_0\,\mathbf{c}_1)$ and $(\mathbf{c}_1\,\mathbf{c}_2)$ respectively. The quadratic Bézier curve is shown in <span style="color: purple;">purple</span>, and corresponds to the convex combination of the <span style="color: pink;">pink</span> dots along both segments.</figcaption>
</figure>

<script type="module" src="/js/plotConvexBezier.js"></script>

## 3.3. Direction at the endpoints

Recall that we can express the Bézier curve as a linear combination of polynomials
$$
\begin{equation}
p_0^n(t) = \sum_{i=0}^n \binom{n}{i} t^i (1-t)^{n-i} \cdot c_i
\end{equation}
$$

The derivative of the Bézier curve is given by

$$
\begin{equation}
\frac{d}{dt} p_0^n(t) = \sum_{i=0}^n \binom{n}{i} \left( i t^{i-1} (1-t)^{n-i} - (n-i) t^i (1-t)^{n-i-1} \right) \cdot c_i
\end{equation}
$$

Evaluating the derivative at $t=0$ and $t=1$ we get

$$
\begin{equation}
\begin{split}
\frac{d}{dt} p_0^n(0) = n \cdot \left( c_1 - c_0 \right) \\\\
\frac{d}{dt} p_0^n(1) = n \cdot \left( c_n - c_{n-1} \right)
\end{split}
\end{equation}
$$

This means that the derivative at the endpoints is parallel to the line connecting the first and second control points, and the second to last and last control points, respectively. The following interactive plot illustrates this concept. You can drag the control points around to see how the derivative aligns with the lines connecting the control points.

<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container-derivative-bezier" style="position: relative; width: 600px; height: 400px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot-derivative-bezier" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing a cubic Bézier curve interpolating four points. We have $\mathbf{c}_0$ (<span style="color: red;">red</span>), $\mathbf{c}_1$ (<span style="color: blue;">blue</span>), $\mathbf{c}_2$ (<span style="color: green;">green</span>) and $\mathbf{c}_3$ (<span style="color: orange;">orange</span>). The derivative at the endpoints is shown as purple arrow, and you can see it aligns with the line connecting the first and second control points, and the second to last and last control points, respectively.</figcaption>
</figure>

<script type="module" src="/js/plotDerivativeBezier.js"></script>

## 3.4. Composition

Given $n$ points, we can construct a Bézier curve of degree $n-1$. However, as the number of points grows, so does the degree of the curve. 
This results in several issues, namely:
  - Increasing the degree results in increased complexity, and consequently, increased **computational cost**.
  - Due to the increased complexity, the curve becomes much more sensitive to **round-off errors**.
  - Since the curve is not guaranteed to pass through the control points, its relationship to the data becomes **less intuitive**.

One way to mitigate these issues is through **composite Bézier curves**. Given a set of $n=(d-1)\cdot m + 1$ control points, we can construct a 
composite Bézier curve of degree $d$ by partitioning the control points into $m$ segments of $d$ points each. Each segment $i$, with $i \in \\{1, \ldots, m \\}$, relies on the control points $\\{ \mathbf{c}_{(i-1)\cdot d + j} \\} _{j=0}^{d-1}$ to construct its Bézier curve.

The following interactive plot illustrates the construction of a cubic composite Bézier curve from 7 points. You can drag the points around to 
see how the curve changes, and you can see how the control points are partitioned into groups of 4 points each.

<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container-composite-bezier" style="position: relative; width: 600px; height: 400px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot-composite-bezier" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing a cubic composite Bézier curve interpolating seven points. </figcaption>
</figure>

<script type="module" src="/js/plotCompositeBezier.js"></script>

Notice that in general, a composite Bézier curve is not smooth. Nonetheless, we can make it smoothness relying on the direction of the derivative at the endpoints that we provided in the earlier section. In particular, we can enforce $C^0$ continuity across segments by ensuring that the line connecting the last two points of a segment is aligned with the line connecting the first two points of the next segment. In the plot above, try aligning the <span style="color: green;">green</span>, <span style="color: orange;">orange</span>, and <span style="color: cyan;">cyan</span> points to see how the curve becomes smooth.

Cubic Bézier curves are at the core of PostScript. The following interactive plot shows how the letter S is constructed using cubic Bézier curves in the Times New Roman font. You can drag the control points around to see how the curve changes.

<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container-times" style="position: relative; width: 420px; height: 600px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot-times" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing the letter S in the Times New Roman font. The curve is constructed using cubic Bézier curves.</figcaption>
</figure>

<script type="module" src="/js/plotTimesNewRoman.js"></script>

<!-- <div id="image-container">
  <img id="image" src="/curve_fitting_bsplines/TimesS.png" alt="Image" width="420" height="600">
</div>
<script type="module" src="/js/Prueba.js"></script> -->

# 4. Conclusion

# 4. References

1. 