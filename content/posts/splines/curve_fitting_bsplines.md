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

<link rel="stylesheet" type="text/css" href="/css/quad_sliders.css">

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

<link rel="stylesheet" type="text/css" href="/css/poly_sliders.css">

<script type="module" src="/js/plotPolyCurve.js"></script>

# 2. Bézier curves

# 3. Splines

# 4. Conclusion

# 4. References

1. 