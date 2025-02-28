+++
title = '🔭  Projective Geometry: Camera calibration'
date = 2025-02-22T11:16:19+01:00
tags = ["computer vision", "projective geometry", "camera calibration", "intrinsic matrix", "pinhole camera"]
draft = false
+++

<span style="background-color: lightgrey; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
  <details>
    <summary><strong>Table of Contents</strong></summary>
      {{< toc >}}
  </details>
</span>

# 1. Introduction

We have seen in a previous <a href="https://inakiraba91.github.io/posts/projective_geometry/estimating_homography_matrix/" style="text-decoration: none; color: blue; line-height: 1;">post</a> how we can estimate the homography matrix that characterizes the projective transform between two images. In this 
article, we will focus on the camera calibration problem, which consists of retrieving the intrinsic matrix $K$of the camera. This matrix characterizes the internal parameters of the camera, such as the focal length, the principal point, and the skew factor:

$$
\begin{equation}
K=\begin{bmatrix}
f_x & s & \frac{W}{2}\\\\
0 & f_y & \frac{H}{2}\\\\
0 & 0 & 1
\end{bmatrix} 
\end{equation}
$$

where $f_x$ and $f_y$ are the focal lengths in the x and y directions, $s$ is the skew factor, and $W$ and $H$ are the width and height of the image in pixels. 

<span style="background-color: lightblue; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
    <img src="/github.svg" alt="GitHub Icon" style="width: 24px; height: 24px; margin-right: 10px;">
    <a href="https://github.com/InakiRaba91/ProjectiveGeometry" style="text-decoration: none; color: blue; line-height: 1;"><strong>Auxiliary repository</strong></a>
</span>

# 2. Conics

We can express conics in homogeneous coordinates as the set of points $x$ that satisfy the equation:

$$
\begin{equation}
x^T\cdot C\cdot x=0
\end{equation}
$$

where $C$ is a symmetric matrix. Depending on whether it has full rank or not, the conic is non degenerate or degenerate. 

As we saw in our previous <a href="https://inakiraba91.github.io/posts/projective_geometry/projecting_between_domains/" style="text-decoration: none; color: blue; line-height: 1;">post</a>, 
a conic gets mapped to another conic under a projective transformation:

$$
\begin{equation}
C' = H^{-T}\cdot C\cdot H^{-1}
\end{equation}
$$

where $H$ is the homography matrix. In this section, we will introduce some conic properties that will be useful for understanding the camera calibration problem.

## 2.1. Tangency

The line $l$ tangent to a conic at a point $x$ is defined by the equation:

$$
\begin{equation}
l=C\cdot x
\end{equation}
$$

In order to prove it, we need to verify that the point $x$:

1. <ins>Lies on the line</ins>. That is true if $l^T\cdot x=0$:
$$
\begin{equation}
l^T\cdot x = (C\cdot x)^T\cdot x = x^T\cdot C^T\cdot x = x^T\cdot C\cdot x = 0
\end{equation}
$$
2. <ins>Is the only point of intersection between the conic and the line</ins>. We can prove its uniqueness by contradiction. 
Suppose there is another point $q$ on the line that lies on the conic $q^T\cdot C\cdot q = 0$. 
We can then take a linear combination $r = x + \alpha y$. For every $\alpha$, the point $r$ lies on the line:
$$
\begin{equation}
l^T\cdot r = l^T\cdot x + \alpha l^T\cdot y = 0
\end{equation}
$$
But it also happens to lie on the conic:
$$
\begin{equation}
\begin{split}
r^T\cdot C\cdot r  & = (x + \alpha y)^T\cdot C\cdot (x + \alpha y) \\\\
& = x^T\cdot C\cdot x + 2\alpha x^T\cdot C\cdot y + \alpha^2 y^T\cdot C\cdot y \\\\
& = x^T\cdot C\cdot x + 2\alpha l^T\cdot y        + \alpha^2 y^T\cdot C\cdot y \\\\
& = 0 
\end{split}
\end{equation}
$$

<strong>Tangency is preserved under the projective transformation</strong>. That is, if $l$ is tangent to the conic $C$ at point $x$, 
then $l'$ is tangent to the conic $C'$ at point $x'$. Recall that we can project each item under the homography matrix $H$ by:

$$
\begin{equation}
\begin{split}
x' & = H\cdot x \\\\
l' & = H^{-T}\cdot l \\\\
C' & = H^{-T}\cdot C\cdot H^{-1}
\end{split}
\end{equation}
$$

In order for $l'$ to be tangent to $C'$ at $x'$, it must satisfy $l'^T=C'\cdot x'$:

$$
\begin{equation}
\begin{split}
C'\cdot x' & = H^{-T}\cdot C\cdot H^{-1}\cdot H\cdot x \\\\
& = H^{-T}\cdot C\cdot x \\\\
& = H^{-T}\cdot l \\\\
&= l'
\end{split}
\end{equation}
$$

<figure class="figure" style="text-align: center;">
  <img src="/camera_calibration/tangent_conic.svg" alt="Conic tangent" width="50%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Line $l=C\cdot p$ is tangent to the conic $C$ at point $p$.</figcaption>
</figure>

## 2.2. Duality

There is a duality between lines and points in the projective space that shows up everywhere. We can observe it in the way points/lines relate
to conics.

As we have seen in the previous section, for every point in the conic that satisfy $x^T\cdot C\cdot x = 0$, there is a unique tangent
line $l=C\cdot x$ that passes through it. If C has full rank, we can invert it so $x=C^{-1}\cdot l$, which leads to

$$
\begin{equation}
\begin{split}
x^T\cdot C\cdot x &= x^T\cdot C^T \cdot C^{-T}\cdot C\cdot x \\\\
&= (C\cdot x)^T\cdot C^{-T}\cdot C\cdot x \\\\
&= l^T\cdot C^{-T}\cdot C\cdot l \\\\
&= 0 
\end{split}
\end{equation}
$$

In the general case, it can be proven that the dual conic is given by the adjoint matrix $C^*$, up to scale:

$$
\begin{equation}
l^T\cdot C^*\cdot l = 0
\end{equation}
$$

which can be interpreted as the conic built from the set of lines tangent to it. This also implies given a line $l$ tangent to a 
conic $C*$, the point $x$ where it intersects the conic satisfies 

$$
\begin{equation}
x = C^*\cdot l
\end{equation}
$$

<figure class="figure" style="text-align: center;">
  <img src="/camera_calibration/dual_conic.png" alt="Dual conic" width="70%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">(a) Points $x$ satisfying $x^T\cdot C\cdot x=0$ lie on a point conic. (b) Lines $l$ satisfying $l^T\cdot C^*\cdot l=0$ are tangent to the point conic C.</figcaption>
</figure>


To simplify the notation, we will denote point conics as $C$ and line conics as $D$. The projection $D'$ of a line conic $D$ under a homography matrix $H$ satisfies:

$$
\begin{equation}
\begin{split}
l'^T\cdot D'\cdot l' &= l^T\cdot H^{-1}\cdot D'\cdot H^{-T}\cdot l \\\\
&= l^T\cdot D\cdot l \\\\
&= 0
\end{split}
\end{equation}
$$

which implies

$$
\begin{equation}
D' = H\cdot D\cdot H^T
\end{equation}
$$

## 2.3. Pole-polar relationship

The equation $l=C\cdot x$ determines the tangent line whenever $x$ lies on the conic $C$. However, it defines a broader relationship between 
lines and points with respect to the conic. This relationship is known as the <strong>pole-polar relationship</strong>.

Assuming the point $x$ lies outside the conic, we can build two lines $l_1$ and $l_2$ passing through it that are tangent to 
the conic at $x_1$ and $x_2$, respectively. We know from the previous section, those lines are given by:

$$
\begin{equation}
l_i = C\cdot x_i
\end{equation}
$$

Furthermore, the intersection point ($x$ by construction) between two lines in homogenous coordinates is given by the cross product:

$$
\begin{equation}
\begin{split}
x &= l_1\times l_2 \\\\
&= (C\cdot x_1) \times (C\cdot x_2)
\end{split}
\end{equation}
$$

From the properties of the cross product, this simplifies to:-

$$
\begin{equation}
x = (C^*)^T\cdot (x_1\times x_2)
\end{equation}
$$

where $C^*$ is the adjoint matrix, whose transpose is the cofactor matrix. For conics, it is a symmetric matrix. Notice that the 
cross-product of two points in homogenous coordinates is the line passing through them, so the previous equation becomes:

$$
\begin{equation}
x = C^*\cdot l 
\end{equation}
$$

Therefore, the polar $l=C^*\cdot x$ of a point $x$ with respect to a conic $C$ intersects the conic at two points. The two lines tangent to the conic
at these points intersect at the pole $x$.

<figure class="figure" style="text-align: center;">
  <img src="/camera_calibration/polar_pole_out.svg" alt="Polar-pole relationship" width="50%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">To obtain the polar $l$ (<span style="color:red;">red</span>) of
  a pole $x$ (<span style="color:blue;">blue</span>) w.r.t. a conic C, we just need to trace two lines from $x$ tangent to the conic (<span style="color:green;">green</span>), then trace the line passing through the points of tangency (<span style="color:orange;">orange</span>)</figcaption>
  </figcaption>
</figure>

The polar-pole relationship is also valid when a point lies inside the conic, as illustrated below

<figure class="figure" style="text-align: center;">
  <img src="/camera_calibration/polar_pole_in.svg" alt="Polar-pole relationship" width="50%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">To obtain the polar $l$ (<span style="color:red;">red</span>) of a pole $x$ (<span style="color:blue;">blue</span>) inside the conic C we: (1) first trace two lines (<span style="color:green;">green</span>) passing through $x$, (2) then, for each line, we trace a pair of lines passing through the two points (<span style="color:orange;">orange</span> and <span style="color:purple;">purple</span>, respectively) of intersection with the conic and (3) finally, we trace the line $l$ passing through the points of intersection between each pair of lines.
  </figcaption>
</figure>

The pole-polar relationship is preserved under projective transformations. If $l=C\cdot x$ is the polar of $x$ with respect to the conic $C$, then:

$$
\begin{equation}
\begin{split}
l' &= H^{-T}\cdot l \\\\
&= H^{-T}\cdot C\cdot x \\\\
&= H^{-T}\cdot H^{T} \cdot C \cdot H \cdot H^{-1}\cdot x' \\\\
&= C'\cdot x'
\end{split}
\end{equation}
$$

so $l'$ is the polar of $x'$ with respect to the conic $C'$.

## 2.4. Conjugacy

Two points $x$ and $y$ are said to be conjugate with respect to a conic $C$ if one lies on the polar of the other. For instance, if $x$ lies on the polar $l=C\cdot y$, then:

$$
\begin{equation}
l^T\cdot x = 0 \Rightarrow y^T\cdot C\cdot d = 0
\end{equation}
$$

This relationship is symmetric, so if $x$ lies on the polar of $y$, then $y$ lies on the polar of $x$.

<figure class="figure" style="text-align: center;">
  <img src="/camera_calibration/conjugate_points.svg" alt="Conjugate points" width="50%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">A point $x$ (<span style="color:blue;">blue</span>) is conjugate to another point $y$ (<span style="color:magenta;">magenta</span>) w.r.t. conic $C$ if it lies in its polar $m=C\cdot y$ (<span style="color:purple;">purple</span>). The relationship is symmetric, so $y$ necessarily lies on the polar $l=C\cdot x$ (<span style="color:red;">red</span>) of $x$.</figcaption>
  </figcaption>
</figure>

Due to duality, thereis an analogous concept for lines. Two lines $l$ and $m$ are said to be conjugate with respect to a conic $C$ if each passes through the pole of the other. This implies, the following is sastisfied:

$$
\begin{equation}
l^T\cdot C^*\cdot m = 0
\end{equation}
$$

Importantly, <strong>the operation $\mathbf{l^T\cdot C^*\cdot m}$ is invariant under projective transformations</strong>:

$$
\begin{equation}
\begin{split}
l'^T\cdot C'^*\cdot m' & = (H^{-T}\cdot l)^T\cdot (H^{-T}\cdot C\cdot H^{-1})^T\cdot H^{-T}\cdot m \\\\
& = l^T\cdot H^{-1}\cdot H\cdot C\cdot H^T\cdot H^{-T}\cdot m \\\\
& = l^T\cdot C\cdot m
\end{split}
\end{equation}
$$

which obviously implies conjugacy is also preserved under projective transformations.

# 3. Undoing the projective distortion

One of the most important concepts in Euclidean geometry is the angle between two lines. However, the projective transformation does not preserve angles, preventing us from measuring them directly through the observed projections. This is illustrated below:

<figure class="figure" style="text-align: center;">
  <img src="/camera_calibration/angle_distortion.svg" alt="Angle distortion" width="90%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Comparison of a zenithal view of a football pitch, where the angle between intersecting lines is $90\degree$ (<strong>left</strong>), and its projection into the image plane, where the angles are distorted (<strong>right</strong>).</figcaption>
</figure>

In this section, we will see how we can tackle this problem.

## 3.1. 2D projective space

We will start by focusing on the 2D projective space, which is a generalization of the Euclidean 2D space. 
Two 2D planes are related by a projective transformation, which can be represented by an invertible 3x3 matrix homography matrix $H$. 

### 3.1.1. Angles between rays

Say we want to measure the angle between two lines $l=[l_1, l_2, l_3]^T$ and $m=[m_1, m_2, m_3]^T$ in the Euclidean plane. 
We know that the angle between two lines is given by the equation:

$$
\begin{equation}
\cos(\theta) = \frac{l_1m_1 + l_2m_2}{\sqrt{(l_1^2 + l_2^2)(m_1^2 + m_2^2)}}
\end{equation}
$$

where the normal vectors of the lines are $n_l=[l_1, l_2]^T$ and $n_m=[m_1, m_2]^T$.

Can we express the angle between the two lines $l$ and $m$ in terms of the observed projections $l'$ and $m'$? 
We know that the projections are related by the homography matrix $H$:

$$
\begin{equation}
\begin{split}
l' & = H^{-T}\cdot l \\\\
m' & = H^{-T}\cdot m
\end{split}
\end{equation}
$$

As discussed before, if we were to compute the angle from lines $l'$ and $m'$ using the previous equation, we would get a different result.

But look carefully at the equation. Notice we have not used the product of the line vectors $l$ and $m$ at all. 
Instead, we have used the product of the normal vectors $n_l$ and $n_m$. 
Can you think of any way to manipulate the equation so that we can express the angle in terms of $l$ and $m$?

Maybe the following matrix will help you:

$$
\begin{equation}
D=\begin{bmatrix}
1 & 0 & 0 \\\\
0 & 1 & 0 \\\\
0 & 0 & 0
\end{bmatrix}
\end{equation}
$$

We can now rewrite the equation as:

$$
\begin{equation}
\cos(\theta) = \frac{l^T\cdot D\cdot m}{\sqrt{(l^T\cdot D\cdot l)(m^T\cdot D\cdot m)}}
\end{equation}
$$

Leveraging the invariance of the product $l^T\cdot D\cdot m$ under projective transformations, we can measure the angle by:

$$
\begin{equation}
\cos(\theta) = \frac{l'^T\cdot D'\cdot m'}{\sqrt{(l'^T\cdot D\cdot l')(m'^T\cdot D\cdot m')}}
\end{equation}
$$

where $D'=H\cdot D\cdot H^T$. This implies we can measure the angle between two lines from their projections!

This result may seem trivial, what's the big deal? If the homography matrix is known, you can just project back all observed lines to the 
Euclidean plane and measure the angle there. And that is absolutely true! But this derivation sets the stage for 3D case, where things are
not as straightforward.

### 3.1.2. The line at infinity

Wait a second, so how do we interpret the matrix $D$? What does it represent? To answer these questions, we need to jump into the realm of infinity!

Although Euclidean 2D and 3D spaces are very useful for representing objects in the real world, they have some limitations. 
For instance, they do not include points at infinity, which are essential for the representation of parallel lines and planes.
On the other hand, projective spaces are a more general representation of spaces that indeed include points at infinity.

A point $p_E=[x,y]^T$ in the Euclidean plane is represented as a 3D vector in homogeneous coordinates as:

$$
\begin{equation}
p=[x, y, 1]^T
\end{equation}
$$

Any scaled version of this vector represents the same point in the Euclidean plane:

$$
\begin{equation}
p = [\lambda x, \lambda y, \lambda]^T
\end{equation}
$$

So we can easily retrieve the Euclidean coordinates of a point by dividing the first two components by the third one:

$$
\begin{equation}
p_E = \left[\frac{p_x}{p_z}, \frac{p_y}{p_z}\right]^T
\end{equation}
$$

This representation allows us to include points at infinity:
$$
\begin{equation}
p_{\infty} = [x, y, 0]^T
\end{equation}
$$

Notice that a line in the Euclidean plane is represented by the equation $ax+by+c=0$. In the projective space, 
the line is parametrised by the vector

$$
\begin{equation}
l=[a, b, c]^T
\end{equation}
$$

and the point $p$ lies on the line if it satisfies:

$$
\begin{equation}
l^T\cdot p=0
\end{equation}
$$

As a result, the line at infinity is represented by the vector 

$$
\begin{equation}
l_{\infty}=[0, 0, 1]^T
\end{equation}
$$

### 3.1.3. The circular points

Say we have a circle, whose conic matrix is given by:

$$
\begin{equation}
C=\begin{bmatrix}
1 & 0 & 0 \\\\
0 & 1 & 0 \\\\
0 & 0 & k
\end{bmatrix}
\end{equation}
$$

The circle grows larger as $k$ increases, so in the limit $k\rightarrow \infty$, it must be composed of points at the infinity line. 
We can characterize it by its dual conic $C^*_{\infty}$:

$$
\begin{equation}
C^*_{\infty}=\begin{bmatrix}
1 & 0 & 0 \\\\
0 & 1 & 0 \\\\
0 & 0 & 0
\end{bmatrix}
\end{equation}
$$

which describes a degenrate conic, since it has rank 2. And this is precisely the matrix $D$!. Points on it must satisfy

$$
\begin{equation}
\begin{split}
x_1^2 + x_2^2 = 0 \\\\
x_3 = 0
\end{split}
\end{equation}
$$

so a basis for the <strong>circular points</strong> $\\{ \mathbf{I}, \mathbf{J} \\}$ is given by the vectors:

$$
\begin{equation}
\mathbf{I}=\begin{bmatrix}
1 \\\\
i \\\\
0
\end{bmatrix},
\mathbf{J}=\begin{bmatrix}
1 \\\\
-i \\\\
0
\end{bmatrix}
\end{equation}
$$

<id="circular_points"></a>
The term "circular points" comes from the fact that all circles intersect with the infinity line at these points. Recall a circle is defined 
by the equation:

$$
\begin{equation}
x_1^2 + x_2^2 + d x_1 x_3 + e x_2 x_3 + f x_3^2 = 0
\end{equation}
$$

For a point in the circle to lie on the infinity line, it must satisfy $x_3=0$, so the equation simplifies to:

$$
\begin{equation}
\begin{split}
x_1^2 + x_2^2 & = 0 \\\\
x_3 & = 0
\end{split}
\end{equation}
$$

which is exactly the same system!

At this point you may be wondering: what on earth are we doing? After all, this conic consists of imaginary points that lie at the infinity line,
so it can not be observed. The important thing to notice is that it is a conic, and it can therefore be mapped under any projective transformation 
as any other conic. 

For now, just think of it as a mathematical artifact that plays a key role in determining the angle between lines.


## 3.2. 3D projective space

Let us now focus on the 3D projective space, where a point $p_E=[x, y, z]^T$ in the Euclidean space is represented by a 4D vector in homogeneous coordinates as:

$$
\begin{equation}
p=[x, y, z, 1]^T
\end{equation}
$$

### 3.2.1. The plane at infinity

Similarly to the 2D case, points at infinity take the form:

$$
\begin{equation}
p_{\infty}=[x, y, z, 0]^T
\end{equation}
$$

The equation for a plane in the Euclidean space is given by $ax+by+cz+d=0$. We parametrize the plane by the vector:

$$
\begin{equation}
\Pi=[a, b, c, d]^T
\end{equation}
$$

So a point $p$ lies on the plane if it satisfies:

$$
\begin{equation}
\Pi^T\cdot p=0
\end{equation}
$$

Points at infinity are represented by the vector:

$$
\begin{equation}
p_{\infty}=[x, y, z, 0]^T
\end{equation}
$$

The plane at infinity must satisfy

$$
\begin{equation}
\Pi_{\infty}^T\cdot p_{\infty}=0
\end{equation}
$$

which leads to:

$$
\begin{equation}
\Pi_{\infty}=[0, 0, 0, 1]^T
\end{equation}
$$

### 3.2.2. The absolute conic

We can follow a similar logic to the 2D case. Say we have a sphere, whose conic matrix is given by:

$$
\begin{equation}
Q=\begin{bmatrix}
1 & 0 & 0 & 0 \\\\
0 & 1 & 0 & 0 \\\\
0 & 0 & 1 & 0 \\\\
0 & 0 & 0 & k 
\end{bmatrix}
\end{equation}
$$

As we increase $k$, the sphere grows larger, and in the limit $k\rightarrow \infty$ we get the <strong>absolute conic</strong> $\Omega_\infty$.

This conic must be composed of points at the infinity plane, so it can be described by two equations:

$$
\begin{equation}
\begin{split}
x_1^2 + x_2^2 + x_3^2 & = 0 \\\\
x_4 & = 0
\end{split}
\end{equation}
$$

Even though this is a pretty abstract concept, we can make an interesting observation about the absolute conic: <ins>all circles intersect
with the absolute conic at two points</ins>. This is because a circlelie in a plane, whose intersection with the infinity plane is a line. 
This line will in turn intersect with the absolute conic at precisely two points!

### 3.2.3. Angles between rays

Say we have two rays in 3D whose direction vectors are $d=[d_x, d_y,d_z]^T$ and $e=[e_x,e_y,e_z]^T$. The angle between them is given by:

$$
\begin{equation}
\cos(\theta) = \frac{d^T\cdot e}{\sqrt{(d^T\cdot d)(e^T\cdot e)}}
\end{equation}
$$

A ray with direction vector $d$ intersects the infinity plane at the point $p_d=[d_x, d_Y, d_z, 0]^T$. Since the fourth component is zero,
we can write the product with the absolute conic as:

$$
\begin{equation}
p_d^T\cdot \Omega_{\infty}\cdot p_e = 
\begin{bmatrix}
d_x & d_y & d_z
\end{bmatrix}
\cdot
\begin{bmatrix}
1 & 0 & 0 \\\\
0 & 1 & 0 \\\\
0 & 0 & 1
\end{bmatrix}
\cdot
\begin{bmatrix}
e_x \\\\
e_y \\\\
e_z
\end{bmatrix}
\end{equation}
$$

So we can compute the angle between the rays from their intersection with the infinity plane by:

$$
\begin{equation}
\cos(\theta) = \frac{p_d^T\cdot \Omega_{\infty}\cdot p_e}{\sqrt{(p_d^T\cdot \Omega_{\infty}\cdot p_d)(p_e^T\cdot \Omega_{\infty}\cdot p_e)}}
\end{equation}
$$

This may seem too abstract, we are dealing with points at infinity that can not be observed. But remember, the absolute conic is a conic,
and it can be projected under any projective transformation as any other conic. We will see in a later section how this can be used to
measure the angles between 3D rays passing through the camera center, from just their observed point projections.

For instance, notice that <ins>if two rays with direction $d_1$ and $d_2$ are orthogonal, their points of intersection with the infinity plane $\Pi_{\infty}$
will be conjugate points with respect to the absolute conic $\Omega_{\infty}$</ins>. And conjugacy is preserved under projective transformations! 

Furthermore, say we have a plane $\Pi_1$. It intersects with the plane at infinity $\Pi_{\infty}$ at a line $l$. The ray normal to it does so 
at the point $d_1T$. We can now take two planes $\Pi_2$ and $\Pi_3$ orthogonal to it, whose normal rays intersect with $\Pi_{\infty}$ at 
$d_2$ and $d_3$, respectively. Two important remarks:

1. Since the $\Pi_2$ and $\Pi_3$ are orthogonal to $\Pi_1$, both $d_2$ and $d_3$ are conjugate points w.r.t. $\Omega_{\infty}$. Or equivalently, they must 
lie on the polar of $d_1$. 
2. Since the rays $d_2$ and $d_3$ are orthogonal their corresponding planes $\Pi_2$ and $\Pi_3$, they must be parallel to $\Pi_1$. We will see in a following section that all parallel rays intersect with the $\Pi_{\infty}$ at the same vanishing point. So the intersection of the rays $d_2$ and $d_3$ with $\Pi_{\infty}$ will lie in the line $l$.

<a id="pole_polar_plane"></a>
As a result, <ins>the line $l$ of intersection between a plane and $\Pi_{\infty}$ is in polar-pole relationship with the point of intersection $d$ between the ray normal to the plane and $\Pi_{\infty}$</ins>! And once again, this relationship is preserved under projective transformations.

<figure class="figure" style="text-align: center;">
  <img src="/camera_calibration/relationships_infinity_plane.svg" alt="Relationships at the infinity plane" width="90%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">(a) Two planes with normal rays given by $d_1$ and $d_2$ intersect with $\Pi_{\infty}$ at conjugate points. (b) The line $l$ of intersection between a plane and $\Pi_{\infty}$ is in polar-pole relationship with the point of intersection $d$ between the ray normal to the plane and $\Pi_{\infty}$.</figcaption>
</figure>

### 3.2.4. The dual absolute quadric

Since the absolute conic is defined in the limit $k\rightarrow \infty$, we can not write a explicit matrix parametrizing it. However, we can resort
to its dual, termed the <strong>dual absolute quadric</strong> $Q^*_{\infty}$, which fully defines it:

$$
\begin{equation}
Q^*_{\infty}=\begin{bmatrix}
1 & 0 & 0 & 0 \\\\
0 & 1 & 0 & 0 \\\\
0 & 0 & 1 & 0 \\\\
0 & 0 & 0 & 0
\end{bmatrix}
\end{equation}
$$

For simplicity, we will just term it $W=Q^*_{\infty}$.

### 3.2.5. Angles between planes

The angle between two planes $\Pi_1=[a_1, b_1, c_1, d_1]^T$ and $\Pi_2=[a_2, b_2, c_2, d_2]^T$ in the Euclidean space is given by:

$$
\begin{equation}
\cos(\theta) = \frac{n_1^T\cdot n_2}{\sqrt{(n_1^T\cdot n_1)(n_2^T\cdot n_2)}}
\end{equation}
$$

where $n_i=[a_i, b_i, c_i]^T$ is the normal vector of the plane $\Pi_i$. Given the expression for the dual absolute quadric $W$, we can tweak this equation to directly measure the angle in terms of $p_1$ and $p_2$:

$$
\begin{equation}
\cos(\theta) = \frac{p_1^T\cdot W\cdot p_2}{\sqrt{(p_1^T\cdot W\cdot p_1)(p_2^T\cdot W\cdot p_2)}}
\end{equation}
$$

# 4. Camera calibration

We have seen in a previous <a href="https://inakiraba91.github.io/posts/projective_geometry/building_homograpahy_matrix/" style="text-decoration: none; color: blue; line-height: 1;">post</a> 
that the mapping between the 3D world and the 2D image plane can be represented by a projective transformation, characterized by the homography matrix $H$.

$$
\begin{equation}
H= K \cdot \left[\\; R\\;\\; | \\;\\;\ T\\;\\;\right ]
\end{equation}
$$

where $K$ is the intrinsic matrix, $R$ is a rotation matrix, and $T$ is a translation vector. 

In this section we will focus on how we can retrieve the intrinsic matrix $K$, which takes the form:

$$
\begin{equation}
K=\begin{bmatrix}
f_x & s & c_x \\\\
0 & f_y & c_y \\\\
0 & 0 & 1
\end{bmatrix}
\end{equation}
$$

## 4.1 Angle between rays

Say we have two points in the observed 2D image, $x_1$ and $x_2$. They back-project to two rays with direction vectors $d_1$ and $d_2$, passing through the camera center and each of them, respectively. 

The angle between the two rays in the Euclidean space is given by:

$$
\begin{equation}
\cos(\theta) = \frac{d_1^T\cdot d_2}{\sqrt{(d_1^T\cdot d_1)(d_2^T\cdot d_2)}}
\end{equation}
$$

We can choose the camera coordinate system so its origin is at the camera center, and the $z$-axis is aligned with the optical axis. This makes computations much easier, since the homography matrix simplifies to 

$$
\begin{equation}
H= K \cdot \left[\\; I\\;\\; | \\;\\;\ 0\\;\\;\right ]
\end{equation}
$$

Any point in the ray $\tilde{x} = [\lambda d^T, 1]^T$ can be projected to the image plane by:

$$
\begin{equation}
x = H \cdot \tilde{x} = K \cdot \left[\\; I\\;\\; | \\;\\;\ 0\\;\\;\right ] \cdot \begin{bmatrix} d \\\\ 1 \end{bmatrix} = K \cdot d
\end{equation}
$$

<a id="angle_camera_center"></a>
where we got rid of $\lambda$ since the projection is defined up to scale. As a result, the angle can be expressed as

$$
\begin{equation}
\begin{split}
\cos(\theta) &= \frac{d_1^T\cdot d_2}{\sqrt{(d_1^T\cdot d_1)(d_2^T\cdot d_2)}} \\\\
&= \frac{x_1^T\cdot (K^{-T}\cdot K^{-1})\cdot x_2}{\sqrt{x_1^T\cdot (K^{-T}\cdot K^{-1})\cdot x_1} \sqrt{x_2^T\cdot (K^{-T}\cdot K^{-1})\cdot x_2}}
\end{split}
\end{equation}
$$

<figure class="figure" style="text-align: center;">
  <img src="/camera_calibration/angle_camera_center.svg" alt="Angle camera center" width="70%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Two points $x_1$ and $x_2$ in the image plane back-project to rays $d_1$ and $d_2$ passing through the camera center. The angle between the rays can be computed from the points in the image plane.</figcaption>
  </figcaption>
</figure>

## 4.2. The image of the absolute conic

In order to find the image of the absolute conic, denoted by $\omega$, we first need to figure out how the plane at infinity $\Pi_{\infty}$ is mapped to the image plane $\Pi$.

Points at infinity take the form $X_{\infty}=[d^T, 0]^T$ and are mapped to:

$$
\begin{equation}
x_{\infty} = K \cdot \left[\\; R\\;\\; | \\;\\;\ T\\;\\;\right ] \cdot \begin{bmatrix} d \\\\ 0 \end{bmatrix} = K \cdot R \cdot d
\end{equation}
$$

which implies the mapping between $\Pi_{\infty}$ and $\Pi$ is given by the homography matrix:

$$
\begin{equation}
H = K \cdot R
\end{equation}
$$

which does not depend on the camera position at all!

Since the absolute conic $\Omega_{\infty}$ lies in $\Pi_{\infty}$, its image $\omega$ must lie in $\Pi$. Points in the absolute conic satisfy:

$$
\begin{equation}
\begin{split}
x_1^2 + x_2^2 + x_3^2 = 0
x_4 = 0
\end{split}
\end{equation}
$$

so they satisfy the conic relationship $d^T\cdot I \cdot d = 0$, i.e., $\Omega_{\infty}=U$ for points at infinity. We know how to project a conic under the homography transform, so we get

$$
\begin{equation}
\begin{split}
\omega &= H^{-T}\cdot I\cdot H^{-1} \\\\
&= (K\cdot R)^{-T}\cdot I\cdot (K\cdot R)^{-1} \\\\
&= K^{-T}\cdot R\cdot R^{-1}\cdot K^{-1} \\\\
\end{split}
\end{equation}
$$

<a id="iac"></a>
So we finally make sense of why we cared about the absolute conic in the first place: it is the image of the absolute conic under the homography transform!

$$
\begin{equation}
\omega = K^{-T}\cdot K^{-1}
\end{equation}
$$

Or equivalently:

$$
\begin{equation}
\omega ^{-1} = K\cdot K^T
\end{equation}
$$

where $\omega^*=\omega^{-1}$ is the dual image of the absolute conic.

Once we find out $\omega$, we can retrieve the intrinsic matrix $K$. To do so, we simply need to decompose $\omega$ into a product of an upper-triangular matrix with positive diagonal entries and its transpose. This is precisely what the Cholesky decomposition guarantees to provide a unique solution for!

There's still one missing piece though: how do we find $\omega$? Let us see a few important relationships that will help us in this task.

### 4.2.1. Angles and orthogonality

Combining the equations for the angle between <a href="#angle_camera_center">two rays passing through the camera center</a> and the definition of <a href="#iac">$\omega$</a>, we get:

$$
\begin{equation}
\cos(\theta) = \frac{x_1^T\cdot \omega \cdot x_2}{\sqrt{x_1^T\cdot \omega \cdot x_1} \sqrt{x_2^T\cdot \omega \cdot x_2}}
\end{equation}
$$

Thus, two points $x_1$ and $x_2$ are orthogonal if and only if they satisfy:

$$
\begin{equation}
x_1^T\cdot \omega \cdot x_2 = 0
\end{equation}
$$

which means they are conjugate points with respect to the image of the absolute conic $\omega$.

A line $l$ in the image back projects to a plane $\Pi$ passing through the camera center. The normal ray to the plane, with direction $d$, intersects
the image at point $x$, as illustrated below.

<figure class="figure" style="text-align: center;">
  <img src="/camera_calibration/line_plane_camera.svg" alt="Conic tangent" width="40%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">A line $l$ in the image plane back-projects to a plane $\Pi$ passing through the camera center. The normal ray to the plane, with direction $d$, intersects the image at point $x$.</figcaption>
  </figcaption>
</figure>

We saw earlier that there is a <a href="#pole_polar_plane">pole-polar relationship</a> w.r.t. the absolute conic $\Omega_infty$
between:
* The line $l_\infty$ of intersection between a plane $\Pi$ with $\Pi_{\infty}$ 
* The point of intersection $x_\infty$ between the normal ray $d$ to the plane and $\Pi_{\infty}$

Since the pole-polar relationship is preserved under projective transformations, we can write:

$$
\begin{equation}
l_\infty = \omega \cdot x_\infty
\end{equation}
$$

So to sum up:
* Two points back projecting to orthogonal rays are <strong>conjugate</strong> points w.r.t. the image of the absolute conic $\omega$.
* A point and a line back projectingto a ray and plane orthogonal to each other are in <strong>pole-polar</strong> relationship w.r.t. $\omega$.

<figure class="figure" style="text-align: center;">
  <img src="/camera_calibration/orthogonality_iac.svg" alt="Orthogonality relationships" width="90%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">(a) Two points $x_1$ and $x_2$ in the image back project to orthogonal rays if they are conjugate points w.r.t. $\omega$. (b) A point $x$ and a line $l$ in the image back project to an orthogonal ray and plane if they are in pole-polar relationship w.r.t. $\omega$.</figcaption>
  </figcaption>
</figure>

### 4.2.2. Planes and circular points

The absolute canic can be interpreted as the intersection between any sphere and the plane at infinity $\Pi_{\infty}$. 
A sphere is defined by points $x=[x_1, x_2, x_3, x_4]^T$ that satisfy:

$$
\begin{equation}
x^T \cdot S \cdot x = x^T \cdot
\begin{bmatrix} 
1 & 0 & 0 & 0 \\\\
0 & 1 & 0 & 0 \\\\
0 & 0 & 1 & 0 \\\\
0 & 0 & 0 & -r^2
\end{bmatrix}
\cdot x = 0
\end{equation}
$$

There is a set of points that satisfy this equation while lying at the infinity plane $\Pi_{\infty}$:

$$
\begin{equation}
\begin{split}
x_1^2 + x_2^2 + x_3^2 = 0
x_4 = 0
\end{split}
\end{equation}
$$

which happens to match the definition of $\Omega_{\infty}$. So we can interpret the absolute conic as the intersection between 
any sphere and the infinity plane.

Say we take a plane $\Pi$ that instersects with the shpere at a circle parametrized by conic $C$. We know that:
 - The intersection between the circle and $\Pi_{\infty}$ must lie in the intersection between the sphere and $\Pi_{\infty}$, i.e., the absolute conic $\Omega_{\infty}$.
 - The intersection between the circle and $\Pi_{\infty}$ must lie in the intersection between the plane and $\Pi_{\infty}$, i.e., the line $l_{\infty}$.
 - Any circle intersects with the line at infinity $l_\infty$ at the <a href="#circular_points">circular points</a> $\mathbf{I}$ and $\mathbf{J}$.

As a result, the circular points $\mathbf{I}=[1, i, 0]^T$ and $\mathbf{J}=[1, -i, 0]^T$ are the intersection between $\Omega_{\infty}$ and $\l_{\infty}$. 
Consequently, <strong>the circular points lie in the absolute conic $\omega$</strong>!

<figure class="figure" style="text-align: center;">
  <img src="/camera_calibration/plane_circular_points.svg" alt="Circular points in the image of the absolute conic" width="90%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">The circular points $\mathbf{I}$ and $\mathbf{J}$ lie in the image of the absolute conic $\omega$.</figcaption>
  </figcaption>
</figure>
 
So say we are able to find the homography matrix $H = [\mathbf{h_1}, \mathbf{h_2}, \mathbf{h_3}]$ that maps a plane in the 3D world to the image. 
We can treat that plane as a 2D space and project its circular points to the image:

$$
\begin{equation}
\begin{split}
\mathbf{i} & = H\cdot \mathbf{I} = [\mathbf{h_1}, \mathbf{h_2}, \mathbf{h_3}]\cdot \begin{bmatrix} 1 \\\\ i \\\\ 0 \end{bmatrix} = \mathbf{h_1} + i\mathbf{h_2} \\\\
\mathbf{j} & = H\cdot \mathbf{J} = [\mathbf{h_1}, \mathbf{h_2}, \mathbf{h_3}]\cdot \begin{bmatrix} 1 \\\\ -i \\\\ 0 \end{bmatrix} = \mathbf{h_1} - i\mathbf{h_2}
\end{split}
\end{equation}
$$

Since the circular points lie in the absolute conic, their projection must lies in $\omega$. Thus it will satisfy:

$$
\begin{equation}
(\mathbf{h_1} \pm i\mathbf{h_2})\cdot \omega \cdot (\mathbf{h_1} \pm i\mathbf{h_2}) = 0
\end{equation}
$$

which implies both the real and imaginary parts of the equation satisfy:

$$
\begin{equation}
\begin{split}
\mathbf{h_1}^T\cdot \omega \cdot \mathbf{h_1} &= \mathbf{h_2}^T\cdot \omega \cdot \mathbf{h_2} \\\\
\mathbf{h_1}^T\cdot \omega \cdot \mathbf{h_2} &= 0
\end{split}
\end{equation}
$$



### 4.2.3. The vanishing points

<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div id="cube-container">
    <div id="cube">
      <div class="face"></div>
      <div class="face"></div>
      <div class="face"></div>
      <div class="face"></div>
      <div class="face"></div>
      <div class="face"></div> 
    </div>
  </div>
  <div style="margin-top: 20px;">
    <label for="rotation-slider-x">Rotate X:</label>
    <input type="range" id="rotation-slider-x" min="10" max="20" value="10" step="1" style="width: 200px;">
  </div>
  <div style="margin-top: 20px;">
    <label for="rotation-slider-y">Rotate Y:</label>
    <input type="range" id="rotation-slider-y" min="-20" max="20" value="0" step="1" style="width: 200px;">
  </div>
  
</figure>

<link rel="stylesheet" type="text/css" href="/css/cube.css">

<script type="module" src="/js/vanishingPoints.js"></script>

## 4.3. Retrieving the intrinsic matrix

# 5. Application

# 6. Conclusion

# 7. References

1. Richard Hartley and Andrew Zisserman (2000), *Multiple View Geometry in Computer Vision*, Cambridge University Press.
2. Henri P. Gavin (2017), CEE 629 Lecture Notes. System Identification Duke University, *Total Least Squares*
3. Richard Szeliski (2010), *Computer Vision: Algorithms and Applications*, Springer
4. [OpenCV Libary: Basic concepts of the homography explained with code](https://docs.opencv.org/3.4/d9/dab/tutorial_homography.html)
5. Juho Kannala et. al. (2006), *Algorithms for Computing a Planar Homography from Conics in Correspondence,* Proceedings of the British Machine Vision Conference 2006.
6. Simon Baker and Iain Matthews (2004), *Lucas-Kanade 20 years on: A unifying framework*. International Journal of Computer Vision.
7. Lucilio Cordero Grande et. al. (2013), *Groupwise Elastic Registration by a New Sparsity-Promoting Metric: Application to the Alignment of Cardiac Magnetic Resonance Perfusion Images,* IEEE Transactions on Pattern Analysis and Machine Intelligence.
8. Detone et.al. (2016), *[Deep Image Homography Estimation](https://arxiv.org/abs/1606.03798)*, arXiv.
9. Ty Nguyen et. al. (2018), *[Unsupervised Deep Homography: A Fast and Robust Homography Estimation Model](https://arxiv.org/abs/1709.03966),* arXiv.
10. Wei Jiang et. al. (2019), *Optimizing Through Learned Errors for Accurate Sports Field Registration*, 2020 IEEE Winter Conference on Applications of Computer Vision (WACV)
11. Xiaohan Nie et. al. (2021), *A Robust and Efficient Framework for Sports-Field Registration,* 2021 IEEE Winter Conference on Applications of Computer Vision (WACV)
12. James McCaffrey (2013), *[Why You Should Use Cross-Entropy Error Instead Of Classification Error Or Mean Squared Error For Neural Network Classifier Training](https://jamesmccaffrey.wordpress.com/2013/11/05/why-you-should-use-cross-entropy-error-instead-of-classification-error-or-mean-squared-error-for-neural-network-classifier-training/)*
