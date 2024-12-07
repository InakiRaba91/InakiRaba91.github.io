+++
title = '🔁 Integration and Differentiation: Inverse Operations'
date = 2024-05-02T11:16:19+01:00
tags = ["integral", "area under curve", "derivative", "tangent", "Riemann sum"]
draft = false
+++

<span style="background-color: lightgrey; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
  <details>
    <summary><strong>Table of Contents</strong></summary>
      {{< toc >}}
  </details>
</span>
<br><br>

Back in high school, I remember being introduced to the key concepts in calculus. First, the  <strong>derivative</strong> was presented as the slope of the tangent line to a curve at a given point. Then the  <strong>integral</strong> was defined as the area under the curve. And finally the leap of faith: both operations were inverses of each other. 

I remember being confused about this statement we were asked to blindly accept. And college did not help much in that regard. We were given a bunch of rules to compute derivatives and integrals, but the connection between them was never made clear. And that is precisely what we are going to do in this post. We will start by revisiting the definitions of the <strong>derivative</strong> and the <strong>integral</strong>, and then we will try to gain some geometric intuition about why they reverse each other.

All the <strong>code</strong> used to generate the animations in this article is available at the following public repository:

<span style="background-color: lightblue; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
    <img src="/github.svg" alt="GitHub Icon" style="width: 24px; height: 24px; margin-right: 10px;">
    <a href="https://github.com/InakiRaba91/integration_and_differentiation" style="text-decoration: none; color: blue; line-height: 1;"><strong>Auxiliary repository</strong></a>
</span>
<br><br>


# 1. Derivative: The slope of the tangent line

The <strong>derivative</strong> $f'(x_0)$ of a function $f(x)$ at a point $x_0$ was introduced to us as the slope of the tangent line to a curve at $x_0$. In order to estimate it, we would take two points on the curve, $x_0$ and $x_0 + \Delta x$, and calculate the slope of the secant line between them:

$$
\begin{equation}
s(x)\approx \frac{f(x_0 + \Delta x) - f(x_0)}{\Delta x}
\end{equation}
$$

As the distance between the points decreases, our approximation of the slope of the tangent line would improve. And in the limit, as $\Delta x$ approaches zero, we would obtain the exact slope $s(x)$ of the tangent line at the point $x_0$. This is the definition of the derivative:

$$
\begin{equation}
s(x) = f'(x) = \frac{\partial f(x)}{\partial x} = \lim_{\Delta x \to 0} \frac{f(x + \Delta x) - f(x)}{\Delta x}
\end{equation}
$$

The following animation illustrates how the derivative is built geometrically as the slope of the secant line between two points on the curve. 

<figure class="figure" style="text-align: center;">
  <video src="/integration_differentiation/DerivativeApproximation.mp4" width="90%" controls style="display: block; margin: auto;">
    Derivative approximation as the slope of the secant line
  </video>
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Derivative approximation as the slope of the secant line. As the distance between the points decreases, the secant line approaches the tangent line</figcaption>
</figure>

# 2. Integral: The area under the curve

Then things got a bit more complicated when we were introduced to the <strong>integral</strong>. The integral of a function $f(x)$ over an interval $[a, b]$ was defined as the area under the curve $A$. In order to estimate it, one would divide the interval into $n$ subintervals of equal width $\Delta x$, where n is given by:

$$
\begin{equation}
n = \frac{b - a}{\Delta x}
\end{equation}
$$

Then we would sum the areas of the rectangles formed by the function values at the left endpoint of each subinterval. This is known as the <strong>left Riemann sum</strong>:

$$
\begin{equation}
A \approx \sum_{i=0}^{n-1} f(a + i\cdot \Delta x) \cdot \Delta x
\end{equation}
$$

As the width of the subintervals decreases, the approximation of the area under the curve would improve. And in the limit, as $\Delta x$ approaches zero, we would obtain the exact area $A(x)$ under the curve. This is the definition of the integral:

$$
\begin{equation}
A(x) = \int_{a}^{x} f(y) \cdot dy = \lim_{\Delta x \to 0} \sum_{i=0}^{n-1} f(a + i\cdot \Delta x) \cdot \Delta x
\end{equation}
$$

The following animation illustrates how the integral is built geometrically as the area under the curve. 

<figure class="figure" style="text-align: center;">
  <video src="/integration_differentiation/IntegralApproximation.mp4" width="90%" controls style="display: block; margin: auto;">
    Integral approximation as the area under the curve
  </video>
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Integral approximation as the area under the curve. As the width of the subintervals decreases, the rectangles approach the curve, and the sum of their areas converges to the area under the curve</figcaption>
</figure>

# 3. Differentiating the area under the curve

And here is where magic happened! In order to show us how to compute the <strong>derivative</strong> of a function, the teacher started by applying the definition in Eq.(2) for a set of simple functions, such as polynomials. Then we were given a set of rules to compute the derivative of more complex functions.

Nonetheless, for computing the <strong>integral</strong>, we were simply told that it was the inverse operation of the derivative. So if we wanted to compute the integral of a function, we should find a function whose derivative is the one we are interested in. And that was it!

I remember wondering: <strong>how come the area under the curve is the inverse operation of the slope of the tangent line?</strong> It was not intuitive to me at all!"

Luckily, it turns out that there is a very simple geometric explanation for this. In order to understand it, we will resort to the geometric approximation of the derivative and the integral as defined them in the previous sections.
 * The <strong>derivative</strong> is approximated by the slope of the secant line between two points on the curve.
 * The <strong>integral</strong> is approximated by partitioning the interval into subintervals and summing the areas of the rectangles formed by the function values at the left endpoint of each subinterval.

So say we want to differentiate the function that corresponds to the area under the curve $A(x)$ in the interval $[a, x]$. According to Eq.(1), its derivative $A'(x)$ would be approximated by:

$$
\begin{equation}
A'(x) \approx \frac{A(x + \Delta x) - A(x)}{\Delta x}
\end{equation}
$$

We can expand the numerator using Eq.(4):

$$
\begin{equation}
A'(x) \approx \frac{\sum_{i=1}^{n} f(a + i\cdot \Delta x) \cdot \Delta x - \sum_{i=0}^{n-1} f(a + i\cdot \Delta x) \cdot \Delta x}{\Delta x}
\end{equation}
$$

And as we observe, all the terms in the sum cancel out except for the last one:

$$
\begin{equation}
A'(x) \approx f(a + n\cdot \Delta x) = f(x)
\end{equation}
$$

So the derivative of the area under the curve $A(x)$ is the function $f(x)$ itself! This is illustrated in the following animation:

<figure class="figure" style="text-align: center;">
  <video src="/integration_differentiation/DifferentiatingArea.mp4" width="90%" controls style="display: block; margin: auto;">
    Differentiating the area under the curve
  </video>
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Differentiating the area under the curve can be approximated by substracting the rectangles at $x$ (<span style="color:#00D100;">green</span>) from the rectangles at $x + \Delta x$ in (<span style="color:#FFA500;">orange</span>), then dividing by $\Delta x$. The only remaining rectangle (<span style="color:#800080;">purple</span>) has width $\Delta x$ and height $f(x)$</figcaption>
</figure>

# 4. Integrating the slope of the tangent line

How about going the other way? Say we want to integrate the function that corresponds to the slope of the tangent line $s(x)$ at a point $x$. 

First of all, notice how adding a constant to the function $f(x)$ does not change its derivative $f'(x)$, as illustrated below:

<figure class="figure" style="text-align: center;">
  <video src="/integration_differentiation/Ambiguity.mp4" width="90%" controls style="display: block; margin: auto;">
    Adding a constant to the function does not change its derivative
  </video>
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Adding a constant to the function does not change its derivative. The slope of the tangent line remains the same</figcaption>
</figure>

That implies that information is lost, so we will only be able to recover the function up to a constant. According to Eq.(4), area under the slope curve $s(x)$ in the interval $[x_0, x]$ can be approximated by:

$$
\begin{equation}
\int_{x_0}^{x} s(y) \cdot dy \approx \sum_{i=0}^{n-1} s(x_0 + i\cdot \Delta x) \cdot \Delta x
\end{equation}
$$

where $n=\frac{x - x_0}{\Delta x}$. We can expand the sum using Eq.(1):

$$
\begin{equation}
\int_{x_0}^{x} s(y) \cdot dy \approx \sum_{i=0}^{n-1} \frac{f(x_0 + (i+1)\cdot \Delta x) - f(x_0 + i\cdot \Delta x)}{\Delta x} \cdot \Delta x
\end{equation}
$$

or splitting it in two sums:

$$
\begin{equation}
\int_{x_0}^{x} s(y) \cdot dy \approx \sum_{i=1}^{n} f(x_0 + i\cdot \Delta x) - \sum_{i=0}^{n-1} f(x_0 + i\cdot \Delta x)
\end{equation}
$$

Most terms in the sum cancel out except for the first and last ones, so the expression simplifies to:

$$
\begin{equation}
\int_{x_0}^{x} s(y) \cdot dy \approx f(x_0 + n\cdot \Delta x) - f(x_0) = f(x) - f(x_0)
\end{equation}
$$

So the integral of the slope of the tangent line $s(x)$ is the function $f(x)$ itself, up to a constant! That constant is the value of the function at the starting point $x_0$, which is an arbitrary choice.

This is illustrated in the following animation:

<figure class="figure" style="text-align: center;">
  <video src="/integration_differentiation/IntegratingSlope.mp4" width="90%" controls style="display: block; margin: auto;">
    Integrating the slope of the tangent line
  </video>
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">We start from function <span style="color:yellow;">f(x)</span> and compute the slope of the tangen line given by its derivative <span style="color:pink;">$s(x)$</span>. Integrating the slope can be approximated by summing the rectangles below the curve (<span style="color:purple;">purple</span>). The height of each rectangle corresponds to the derivative at that point. That in turn is given by substracting f$f(x+)$ (<span style="color:red;">$\downarrow$</span>) from $f(x+\Delta x)$ (<span style="color:green;">$\uparrow$</span>) and dividing by $\Delta x$. As we add a new rectangle, it contributes with a new $\uparrow$ and $\downarrow$ pair, so the sum cancels out except for the first and last terms.</figcaption>
</figure>

# 5. Conclusion

In this post, we revisited the definitions of the <strong>derivative</strong> and the <strong>integral</strong>, and we tried to gain some geometric intuition about why they reverse each other. We have shown this can be visually understood by using the geometric approximations of the derivative and the integral. So hopefully, you will not need to accept this concept on blind trust as I had to back in high school!

# 6. References

1. Fundamental Theorem of Calculus. Geometric meaning/Proof [Wikipedia](https://en.wikipedia.org/wiki/Fundamental_theorem_of_calculus#Geometric_meaning/Proof)
2. Riemann sum [Wikipedia](https://en.wikipedia.org/wiki/Riemann_sum)
3. 3Blue1Brown (Grant Sanderson). [Integration and the fundamental theorem of calculus. Chapter 8, Essence of calculus](https://www.youtube.com/watch?v=rfG8ce4nNh0)