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
composite Bézier curve of degree $d$ by partitioning the control points into $m$ segments of $d$ points each. Each segment $i$, with $i \in \\{1, \ldots, m \\}$, 
relies on the control points $\\{ \mathbf{c}_{(i-1)\cdot d + j} \\} _{j=0}^{d-1}$ to construct its Bézier curve.


Quadradic Bézier curves are at the core of the TrueType font format, whereas cubic Bézier curves lie at the heart of PostScript. 
The following interactive plot shows how the letter S is constructed using composite cubic Bézier curves in the Times New Roman font. 
You can drag the control points around to see how the curve changes.

<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container-times" style="position: relative; width: 420px; height: 600px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot-times" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing the letter S in the Times New Roman font. The curve is constructed using cubic Bézier curves.</figcaption>
</figure>

<script type="module" src="/js/plotTimesNewRoman.js"></script>

## 3.5. Smoothness

The main issue with composite Bézier curves is that, in general, a composite Bézier curve is not smooth. By careful manipulation of the control points, 
we can enforce $c^1$ smoothness. More precisely, we knoe from the earlier section that the derivative at an endpoint is parallel to the line connecting 
it to its adjacent control point. Therefore, we can enforce $C^1$ continuity across segments by ensuring that the line connecting the last two points 
of a segment is aligned with the line connecting the first two points of the next segment. 

In the plot above, try aligning the <span style="color: green;">green</span>, <span style="color: orange;">orange</span>, and <span style="color: cyan;">cyan</span> points to see how the curve becomes smooth.


The following interactive plot illustrates the construction of a cubic composite Bézier curve from 7 points. You can drag the points around to 
see how the curve changes, and you can see how the control points are partitioned into groups of 4 points each. Notice how the curve is not differentiable
at the intermediate <span style="color: orange;">orange</span> point. You can try aligning the <span style="color: green;">green</span>, 
<span style="color: orange;">orange</span>, and <span style="color: cyan;">cyan</span> points to see how the curve becomes smooth.

<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container-composite-bezier" style="position: relative; width: 600px; height: 400px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot-composite-bezier" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing a cubic composite Bézier curve interpolating seven points. </figcaption>
</figure>

<script type="module" src="/js/plotCompositeBezier.js"></script>

# 4. Splines

## 4.1. Intuition

As we have seen, stitching together Bézier curves requires hand-crafting the control points to ensure smoothness. In order for the curve to be differentiable,
one must ensure the three points centered at each junction are aligned. This can be a cumbersome task, especially for higher degree curves.

Bézier curves are a special case of **spline curves**. Splines are piecewise polynomial curves that are constructed to ensure continuity and smoothness. 
Whereas Bézier curves are constructed as a convex combination of the control points over the whole interval $[0, 1]$, spline curves offer extra flexibility
by allowing different segments to be calculated over different intervals. The key to guarantee subsequent combinations are convex is to ensure they
are computed across a shared subinterval.

Let us start from the simplest scenario. Say we have three **control points** $\\{ c_i \\} _{i=1}^{3}$ and we want to construct a quadratic 
curve ($d=2$) that interpolates them. We can define four auxiliary parameters $\\{ t_i \\} _{i=2}^{5}$. This set of auxiliary parameters are 
denoted as **knots**. The choice for the subindices may seem arbitrary, but it will become clear in a moment. 

In order to construct the curve, let us first build the two line segments that connect $(c_1\,c_2)$ and $(c_2\,c_3)$:

$$
\begin{equation}
\begin{split}
p(t|c_1,c_2;t_2,t_4) = \frac{t_4-t}{t_4-t_2} c_1 + \frac{t-t_2}{t_4-t_2} c_2 \quad \text{for } t \in [t_2, t_4] \\\\
p(t|c_2,c_3;t_3,t_5) = \frac{t_5-t}{t_5-t_3} c_2 + \frac{t-t_3}{t_5-t_3} c_3 \quad \text{for } t \in [t_3, t_5]
\end{split}
\end{equation}
$$

This notation can be a bit cumbersome, specially as the degree of the curve increases. From now on, we will use

$$
\begin{equation}
p_{i,k}^d(t) = p(t|c_{i-k}, \ldots, c_i; t_{i-k+1}, \ldots, t_i, t_{i+d+1-k}, \ldots, t_{i+d})
\end{equation}
$$

where $k$ indicates the polynomial degree of the segment, $i$ indicates the reference control point (the last one of the segment), and $d$ indicates 
the degree of the overall curve the segment belongs to. We will drop the superscript $d$ when it is clear from the context.

Notice the intervals for the above segments are different. Nonetheless, they overlap over $[t_3, t_4]$, so we can construct a convex combination 
of them to form the quadratic curve:

$$
\begin{equation}
p_{3,2}^2(t)  = \frac{t_5-t}{t_5-t_2} p_{2,1}^2(t) + \frac{t-t_2}{t_5-t_2} p_{3,1}^2(t) \quad \text{for } t \in [t_3, t_4]
\end{equation}
$$

You may be wondering, how does this help? The key insight is what happens at the endpoints. The following interactive plot shows a 
quadratic spline curve in <span style="color: blue;">blue</span> over $t \in [t_3,t_4]$. Moreover, nothing prevents us from exploring 
the whole range $[t_2, t_5]$. We display in <span style="color: purple;">purple</span> the curve for $t \in [t_2, t_3]$, and in 
<span style="color: green;">green</span> the curve for $t \in [t_4, t_5]$. We have set $t_2=0$, $t_3=1$, $t_4=2$, $t_5=3$.
Notice how we traverse the curve as we vary $t$.

<div style="text-align: center; margin-bottom: 10px;">
  <label for="tQuadSpline-slider" style="display: inline-block; width: 60px;">t: <span id="tQuadSpline-value">0.00</span></label>
  <input type="range" id="tQuadSpline-slider" min="0" max="3" step="0.05" value="0.00" style="width: 280px;">
</div>
<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container-quad-spline" style="position: relative; width: 600px; height: 400px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot-quad-spline" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing a quadratic Spline curve 
  (<span style="color: blue;">blue</span>) interpolating three points over $t \in [t_3, t_4]$. It also displays the curve for
  $t \in [t_2, t_3]$ (<span style="color: purple;">purple</span>) and $t \in [t_4, t_5]$ (<span style="color: green;">green</span>).</figcaption>
</figure>

<script type="module" src="/js/plotQuadraticSpline.js"></script>

There are several observations to be made from the above plot:
  - The spline curve (<span style="color: blue;">blue</span>) **does not pass through any of the control points** anymore. Notice the 
  start/end points (<span style="color: blue;">blue</span>) do not correspond to the first/last control points. This is because the overall
  interval $[t_2, t_5]$ is wider than the subinterval $[t_3, t_4]$ where the curve is defined.
  - For $t \in [t_3, t_4]$, the point in the spline curve (<span style="color: blue;">blue</span>) results from a **convex combination** of the <span style="color: pink;">pink</span> points in the segments, so it lies in between them.
  - For $t \notin [t_3, t_4]$, the point in the extended curve (<span style="color: purple;">purple</span> , <span style="color: green;">green</span> )
  results from an **affine combination** of the <span style="color: pink;">pink</span> points, so it lies beyond them.
  - Importantly, the curve is **tanget to the segments** at the start/end points (<span style="color: blue;">blue</span>). 
  
So how can we leverage this? Let us say we have four points and we want to construct a composite quadratic spline curve. Since the derivative of the endpoints is tangent to the corresponding segment, we just need to ensure the intermediate segment is part of both quadratic curves. The following interactive plot illustrates this concept with a set of four points. You can drag the points around to see how the curve changes.


<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container-quad-comp-spline" style="position: relative; width: 600px; height: 400px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot-quad-comp-spline" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing a quadratic composite spline curve interpolating four points. It is composed of two quadratic spline curves, displayed in <span style="color: blue;">blue</span> and <span style="color: green;">green</span>.</figcaption>
  </figcaption>
</figure>

<script type="module" src="/js/plotQuadraticCompSpline.js"></script>

## 4.2 Construction

The general construction of a spline curve is described below:

**Algorithm 3**

Let $\\{ c_i \\} _{i=1}^{d+1}$ be a set of $d + 1$ control points and $\\{ t_i \\} _{i=2}^{2d+1}$ be a set of $2d+1$ strictly increasing knots. 

There is a spline curve $p_{d+1,d}^d(t)$ constructed by the following steps:

$p_{j,0}^d(t) \leftarrow c_j \quad \forall i \in \\{1, \ldots, d+1 \\}$

for $1 \leq r \leq d$ do:

&nbsp;&nbsp;&nbsp;&nbsp; for $r+1 \leq j \leq d + 1$ do:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
$p_{j,r}^d(t) \leftarrow \frac{t_{j+d-r+1}-t}{t_{j+d-r+1}-t_j} p_{j-1,r-1}^d(t) + \frac{t-t_j}{t_{j+d-r+1}-t_j} p_{j,r-1}^d(t)$

We illustrate below the algorithm for $n=3$ points:

<figure class="figure" style="text-align: center;">
  <img src="/curve_fitting_bsplines/Splines.svg" alt="Neville Aitken" width="90%" controls style="display: block; margin: auto;">
    Algorithm to construct a Spline curve that interpolates a set of points
  </video>
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Computing a point in a cubic Spline curve according to Algorithm 3. It is depicted for a set of 4 points.</figcaption>
  </figcaption>
</figure>

## 4.3. Convexity

Spline curves are contained within the convex hull by design since all convex combinations are over overlapping intervals. The following interactive plot illustrates the spline curve that interpolates a set of up to 5 points. You can add and remove points, as well as drag them around to see how the curve changes. Furthermore, you try varying the knots $t_i$ and see how much of an impact they make on the curve.

<div style="text-align: center; margin-bottom: 10px;">
  <button id="addPointSplineButton" style="background-color:rgb(187, 228, 163); border: 2px solid black; box-shadow: 2px 2px 5px grey; padding: 5px 10px;">Add Point</button>
  <button id="removePointSplineButton" style="background-color:rgb(228, 165, 163); border: 2px solid black; box-shadow: 2px 2px 5px grey; padding: 5px 10px;">Remove Point</button>
</div>
<div id="sliders-spline-container" style="text-align: center; margin-bottom: 10px;">
</div>
<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container-spline" style="position: relative; width: 600px; height: 400px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot-spline" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing a spline curve interpolating up to 5 points. You can add, drag or remove points. The curve should be contained within the convex hull, shown in <span style="color: purple;">purple</span>.
</figure>

<link rel="stylesheet" type="text/css" href="/css/curve_sliders.css">

<script type="module" src="/js/plotSplineCurve.js"></script>

## 4.4. Composition

We can construct a composite spline curve of degree $d$  with $n$ control points $\\{ c_i \\} _{i=1}^{d+1}$ and knots $\\{ t_i \\} _{i=2}^{n+d}$ by

$$ 
\begin{equation}
f(t) = 
\begin{cases}
p_{d+1,d}^d(t) & \quad t \in [t_{d+1}, t_{d+2}] \\\\
p_{d+2,d}^d(t) & \quad t \in [t_{d+2}, t_{d+3}] \\\\
\vdots & \quad \vdots \\\\
p_{n, d}^d(t) & \quad t \in [t_{n}, t_{n+1}]
\end{cases}
\end{equation}
$$

If we define the piecewise constant function $B_{i,0}(t)$ as

$$
\begin{equation}
B_{i,0}(t) =
\begin{cases}
1 & \quad \text{if } t \in [t_i, t_{i+1}) \\\\
0 & \quad \text{otherwise}
\end{cases}
\end{equation}
$$

we can express the composite spline curve as

$$
\begin{equation}
f(t) = \sum_{i=d+1}^{n} p_{i,d}^d(t) \cdot B_{i,0}(t) 
\end{equation}
$$

The interactive plot below shows a composite quadratic. You can add or remove points, as well as drag them around to see how the curve changes.

<div style="text-align: center; margin-bottom: 10px;">
  <button id="addPointSplineCompButton" style="background-color:rgb(187, 228, 163); border: 2px solid black; box-shadow: 2px 2px 5px grey; padding: 5px 10px;">Add Point</button>
  <button id="removePointSplineCompButton" style="background-color:rgb(228, 165, 163); border: 2px solid black; box-shadow: 2px 2px 5px grey; padding: 5px 10px;">Remove Point</button>
</div>
<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container-quad-comp-spline2" style="position: relative; width: 600px; height: 400px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot-quad-comp-spline2" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing a quadratic composite spline curve interpolating four points. It is composed of several quadratic spline curves, displayed in different colors. Notice how curve is smooth at the junctions.</figcaption>
  </figcaption>
</figure>

<script type="module" src="/js/plotQuadraticCompSpline2.js"></script>


## 4.5. Smoothness

Spline curves are explicitly designed to be smooth at the junctions between its different segments. 
The following theorem serves as a guideline to ensure the curve is $C^n$ continuous at the junctions. 
Proving it is beyond the scope of this post, but you can find a detailed proof in chapter 3 of [12]:

**Theorem 1**

Let us that the multiplicity of a knot $t_i$ is $m$, with $1 \leq m \leq d+1$. That is, the knot $t_i$ appears $m$ times in the knot vector. 
Then, the spline curve 

$$f(t) = p_{i-1,d}^d(t) \cdot B_{i-1,0}(t) + p_{i,d}^d(t) \cdot B_{i,0}(t)$$

is $C^{m-1}$ continuous at $t_i$.

So far we had assume knots were strictly increasing. This introduces a generalization that allows knowts to coalesce. In the standard scenario where knots do not repeat, i.e., $m=1$, our spline curve is $C^d$ continuous at the junctions. Or equivalently, the derivatives $\\{ f^{(i)}(t_i) \\} _{i=0}^{d-1}$ are continuous at the junctions. As we increase the multiplicity of a knot, the degree of smoothness at it decreases.

The following interactive plot shows a quadratic spline composed of three segments. Now we allos knots to coincide, so give it a try and see what happens when you double the multiplicity of the intermediate knot, i.e., try setting $t_4=t_5$.

<div id="sliders-smooth-container" style="text-align: center; margin-bottom: 10px;">
</div>
<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="interactive-container-smooth" style="position: relative; width: 600px; height: 400px; border: 1px solid black; margin: 0 auto;">
    <canvas id="interactive-plot-smooth" style="width: 100%; height: 100%;"></canvas>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing a quadratic spline composed of three segments. You can double the multiplicity of the 
  intermediate knot by setting $t_4=t_5$. The effect is the curve remains continuous at the junction, but is no longer differentiable, allowing for a cusp.</figcaption>
</figure>

<link rel="stylesheet" type="text/css" href="/css/curve_sliders.css">

<script type="module" src="/js/plotSmooth.js"></script>

This flexibility to increase the multiplicity of the knots allows for a wide range of shapes to be constructed. The example above shows a cusp, which allows the curve to change direction abruptly and accomodate for sharp corners.

## 4.6. Expansion in a basis: B-splines

Say we have a set of $n$ control points $\\{ c_i \\} _{i=1}^{n}$ and a set of $n+d-1$ knots $\\{ t_i \\} _{i=2}^{n+d}$. 
As we have seen, we can construct a spline curve of degree $d$ by

$$
\begin{equation}
f(t) = \sum_{i=d+1}^{n} p_{i,d}^d(t) \cdot B_{i,0}(t)
\end{equation}
$$

over the interval $[t_{d+1}, t_{n+1}]$. Bear in mind that we now allow for knots to repeat, i.e., $t_i = t_{i+1}$, so we slightly adjust our definition of the basis function to deal with that case:

$$
\begin{equation}
B_{i,0}(t) =
\begin{cases}
1 & \quad \text{if } t \in [t_i, t_{i+1}) \\\\
0 & \quad \text{if } t \notin [t_i, t_{i+1}) \\\\
0 & \quad \text{if } t_i = t_{i+1}
\end{cases}
\end{equation}
$$

Furthermore, we get a division by zero in $p_{i,d}^d(t)$ when $t_i = t_{i+d+1}$. To avoid this, we will simply declare that in our context, *"dividing by zero results in zero"*.

Let us write $f(t)$ in terms of the control points by applying the recursive definition of the spline curve:

$$
\begin{equation}
\begin{split}
f(t) & = \sum_{i=d+1}^{n} p_{i,d}^d(t) \cdot B_{i,0}(t) \\\\
& = \sum_{i=d+1}^{n} \left(  \frac{t-t_i}{t_{i+1}-t_i} p_{i,d-1}^{d}(t) + \frac{t_{i+1}-t}{t_{i+1}-t_i} p_{i-1,d-1}^{d}(t)  \right) \cdot B_{i,0}(t) \\\\
& = \sum_{i=d+1}^{n-1} \left(  \frac{t-t_i}{t_{i+1}-t_i} B_{i, 0}(t) + \frac{t_{i+2}-t}{t_{i+2}-t_{i+1}} B_{i+1, 0}(t)  \right) \cdot p_{i,d-1}^{d}(t) \\\\
& + \frac{t_{d+2}-t}{t_{d+2}-t_{d+1}} B_{d+1, 0}(t) \cdot p_{d,d-1}^{d}(t) + \frac{t-t_{n}}{t_{n+1}-t_{n}} B_{n, 0}(t) \cdot p_{n,d-1}^{d}(t)
\end{split}
\end{equation}
$$

To avoid carrying to boundary terms, we can introduce two additional terms that are null as long as $t\in [t_{d+1}, t_{n+1}]$:

$$
\begin{equation}
\frac{t-t_{d}}{t_{d+1}-t_{d}} B_{d, 0}(t) p_{d,d-1}^{d}(t)  + \frac{t_{n+2}-t}{t_{n+2}-t_{n+1}} B_{n+1, 0}(t) p_{n,d-1}^{d}(t)
\end{equation}
$$

This is why we indexed the knots from $t_2$ earlier. We can then define

$$
\begin{equation}
B_{i,1}(t) = \frac{t-t_i}{t_{i+1}-t_i} B_{i, 0}(t) + \frac{t_{i+2}-t}{t_{i+2}-t_{i+1}} B_{i+1, 0}(t)
\end{equation}
$$

which allows us to write the spline curve as

$$
\begin{equation}
f(t) = \sum_{i=d}^{n} p_{i,d-1}^{d}(t) \cdot B_{i,1}(t)
\end{equation}
$$

If we proceed with the same logic, we can define the basis functions $B_{i,k}(t)$ from the recursive relation:

$$
\begin{equation}
B_{i,k}(t) = \frac{t-t_i}{t_{i+k}-t_i} B_{i, k-1}(t) + \frac{t_{i+k+1}-t}{t_{i+k+1}-t_{i+1}} B_{i+1, k-1}(t)
\end{equation}
$$

This leads to the following expression for the spline curve in terms of the control points $\\{ c_i \\} _{i=1}^{n}$:

$$
\begin{equation}
f(t) = \sum_{i=d}^{n} c_i \cdot B_{i,d}(t)
\end{equation}
$$

These basis functions are known as **B-splines**. They are a generalization of the basis functions we have seen so far, 
and they are used to construct spline curves. The following interactive plot shows the normalized B-splines up to degree $10$. 
The full basis for a given degree $d$ and a set of $n$ knots is obtained by shifting and dilating these functions accordingly.
You can use the slider to change the degree of the polynomial:

<!-- Interactive Legendre Polynomials -->
<input type="range" id="degreeSlider" min="0" max="5" value="0">
<span id="degreeValue">n=0</span>
<div id="plot"></div>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script type="module" src="/js/plotBSplines.js"></script>

# 5. Practical Applications

In the previous section we focsed on how to construct spline curves by convex combinations in order to minimize the impact of round-off errors. However, spline curves refer to a broader class of piecewise polynomial curves that are constructed to ensure $C^n$ continuity at the junctions.  

Convexity though has its limitations. For instance, it is not possible to construct a spline curve that interpolates a set of points. This is because the convex hull of the control points is not guaranteed to contain the curve.

In some applications like denoising, not passing through the control points is not an issue. In other scenarios, like trajectory interpolation, it is crucial. Luckily, it is possible to construct spline curves that remain $C^n$ continuous at the junctions, while still passing through the control points. In this section we will explore two such applications.

# 5.1. Trajectory interpolation

A popular choice for trajectory interpolation is the **cubic spline**. Given a set of $n + 1$ control points $\\{ c_i \\} _{i=0}^{n}$, we can interpolate
each pair of points with a cubic polynomial ensuring $C^2$ continuity at the junctions. The constraints are:

$$
\begin{equation}
\begin{split}
f(t_i) & = c_i \quad \forall i \in \\{0, \ldots, n \\} \\\\
f^{\prime}(t_i) & = f^{\prime}(t_{i+1}) \quad \forall i \in \\{1, \ldots, n-1 \\} \\\\
f^{\prime\prime}(t_i) & = f^{\prime\prime}(t_{i+1}) \quad \forall i \in \\{1, \ldots, n-1 \\}
\end{split}
\end{equation}
$$

Notice each cubic polynomial requires 4 constraints, so we need $4n$ constraints in total. The previous set of equations provides $4n-2$ constraints, so we need to add two more. There are several choices for these additional constraints, but the most common are:
- **Natural spline**: $f^{\prime\prime}(t_0) = f^{\prime\prime}(t_n) = 0$. This ensures the curve is linear at the endpoints.
- **Clamped spline**: $f^{\prime}(t_0) = v_0, f^{\prime}(t_n) = v_n$. This ensures the curve has a given velocity at the endpoints.
- **Not-a-knot spline**: $f^{\prime\prime\prime}(t_0) = f^{\prime\prime\prime}(t_1), f^{\prime\prime\prime}(t_{n-1}) = f^{\prime\prime\prime}(t_n)$. This effectively imposes the first and last two segments, respectively, to be the same cubic polynomial.

For each segment, we can write the cubic polynomial in the interval $[t_{i-1}, t_i]$ in its symmetric form as

$$
\begin{equation}
f(t) = \left[ 1 - s_i(t) \right] c_{i-1} + s_i(t) c_i + s_i(t) \left[ 1 - s_i(t) \right] \left[ a_i (1 - s_i(t)) + b_i s_i(t) \right]
\end{equation}
$$

where 

$$
\begin{equation}
\begin{split}
s_i(t) & = \frac{t-t_{i-1}}{t_i-t_{i-1}} \\\\
a_i & = k_{i-1} (t_i - t_{i-1}) - (c_i - c_{i-1}) \\\\
b_i & = -k_i (t_i - t_{i-1}) + (c_i - c_{i-1})
\end{split}
\end{equation}
$$

Its first and second derivatives are

$$
\begin{equation}
\begin{split}
f^{\prime}(t) = \frac{c_i - c_{i-1}}{t_i - t_{i-1}} & + (1-2s_i(t)) \frac{a_i(1-s_i(t)) + b_i s_i(t)}{t_i - t_{i-1}} \\\\
& + s_i(t) (1 - s_i(t)) \frac{b_i - a_i}{t_i - t_{i-1}} \\\\
f^{\prime\prime}(t) & = 2 \frac{b_i - 2a_i + (a_i - b_i) 3 s_i(t)}{(t_i - t_{i-1})^2}
\end{split}
\end{equation}
$$

By computing the derivative $f^{\prime}(t)$ you can verify that our unknowns $\\{k_i\\} _{i=0}^{n}$ happen to be the slopes of the curve at the control points:

$$
\begin{equation}
f^{\prime}(t_i) = k_i 
\end{equation}
$$

By imposing the constraints in Eq.(33) and careful manipulation (see [4]), we arrive at the recursive relation

$$
\begin{equation}
\begin{split}
\frac{k_{i-1}}{t_i - t_{i-1}} + \left( \frac{1}{t_i - t_{i-1}} + \frac{1}{t_{i+1} - t_i} \right) 2 k_i + \frac{k_{i+1}}{t_{i+1} - t_i} & = \\\\
3 \left( \frac{c_i - c_{i-1}}{(t_i - t_{i-1})^2} - \frac{c_{i+1} - c_i}{(t_{i+1} - t_i)^2} \right)
\end{split}
\end{equation}
$$

which allows us to form a tridiagonal system of equations to solve for the slopes $\\{k_i\\} _{i=0}^{n}$. The following interactive plot shows a cubic spline interpolating a set of points. You can add or remove points, as well as drag them around to see how the curve changes.

<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div style="display: flex; justify-content: center; align-items: center;">
    <div id="interactive-container-video-cubic" style="position: relative; width: 50%; max-width: 640px; aspect-ratio: 16 / 9; border: 1px solid black; margin: 0 auto;">
      <div id="video-wrapper" style="position: relative; width: 100%; height: 100%;">
        <video id="interactive-video-cubic" style="width: 100%; height: 100%;">
          <source src="/curve_fitting_bsplines/brighton.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <canvas id="interactive-plot-video-cubic" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
      </div>
      <div id="video-controls" style="width: 100%; text-align: center; margin-top: 5px; display: flex; align-items: center; justify-content: center;">
        <button id="play-pause-button" style="font-size: 24px; margin-right: 10px;">
          <img id="play-pause-icon" src="/curve_fitting_bsplines/play.png" alt="Play" style="width: 24px; height: 24px;">
        </button>
        <input type="range" id="time-slider" min="0" max="10" value="0" step="0.066" style="width: 80%;">
      </div>
    </div>
    <div id="interactive-container-image-cubic" style="position: relative; width: 50%; max-width: 640px; aspect-ratio: 16 / 9; border: 1px solid black; margin: 0 auto;">
      <canvas id="interactive-plot-image-cubic" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
      <canvas id="interactive-plot-points-cubic" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
      <canvas id="interactive-plot-ref-cubic" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
    </div>
  </div>
  <figcaption class="caption" style="font-weight: normal; margin-top: 10px;">Interactive plot showing a quadratic spline composed of three segments. You can double the multiplicity of the 
  intermediate knot by setting $t_4=t_5$. The effect is the curve remains continuous at the junction, but is no longer differentiable, allowing for a cusp.</figcaption>
</figure>

<script type="module" src="/js/plotVideo.js"></script>



# 5.2. Surface smoothing

# 6. Conclusion

# 7. References

1. Curve fitting. [Wikipedia](https://en.wikipedia.org/wiki/Curve_fitting)
2. Bezier curve. [Wikipedia](https://en.wikipedia.org/wiki/B%C3%A9zier_curve)
3. Spline (mathematics). [Wikipedia](https://en.wikipedia.org/wiki/Spline_(mathematics))
4. Spline interpolation. [Wikipedia](https://en.wikipedia.org/wiki/Spline_interpolation)
4. Lagrange polynomial. [Wikipedia](https://en.wikipedia.org/wiki/Lagrange_polynomial)
6. Bernstein polynomial. [Wikipedia](https://en.wikipedia.org/wiki/Bernstein_polynomial)
7. B-spline. [Wikipedia](https://en.wikipedia.org/wiki/B-spline)
8. Neville's algorithm. [Wikipedia](https://en.wikipedia.org/wiki/Neville%27s_algorithm)
9. De Casteljau's algorithm. [Wikipedia](https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm)
10. Splines in 5 minutes Series. [YouTube](https://www.youtube.com/watch?v=YMl25iCCRew)
11. Cubic Spline Interpolation Series. [YouTube](https://www.youtube.com/watch?v=LaolbjAzZvg)
12. Spline methods. Teaching Notes INF-MAT5340, [University of Oslo](https://www.uio.no/studier/emner/matnat/ifi/nedlagte-emner/INF-MAT5340/v07/undervisningsmateriale/)
13. Interpolation with cubic splines, [Algorithms and Stuff](https://blog.ivank.net/interpolation-with-cubic-splines.html)