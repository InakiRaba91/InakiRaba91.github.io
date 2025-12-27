+++
title = '⚽ Projective Geometry: Retrieving 3D Ball Trajectory'
date = 2025-12-26T09:16:19+01:00
tags = ["computer vision", "projective geometry", "3d ball trajectory"]
draft = false
+++

<span style="background-color: lightgrey; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
  <details>
    <summary><strong>Table of Contents</strong></summary>
      {{< toc >}}
  </details>
</span>

# 1. Introduction


# 2. Simulating a goal kick in 3D

# 2.1. Gravity

<figure class="figure" style="text-align: center;">
  <div style="width: 80%; max-width: 800px; margin: 20px auto;">
    <label for="ballTrajGravityPosSlider" style="display: block; margin-bottom: 10px;">y0: <span id="ballTrajGravityPosValue">0.0</span>yds</label>
    <input type="range" id="ballTrajGravityPosSlider" min="-8" max="8" step="1" value="0" style="width: 100%;">
  </div>
  <div style="width: 80%; max-width: 800px; margin: 20px auto;">
    <label for="ballTrajGravityVelSlider" style="display: block; margin-bottom: 10px;">|v|: <span id="ballTrajGravityVelValue">25.0</span>yds/s</label>
    <input type="range" id="ballTrajGravityVelSlider" min="20" max="30" step="1" value="25" style="width: 100%;">
  </div>
  <canvas id="ballTrajGravityCanvas" width="640" height="360" style="border: 1px solid #ccc; display: block; margin: auto;"></canvas>
  <div style="width: 80%; max-width: 800px; margin: 20px auto;">
    <label for="ballTrajGravityTSlider" style="display: block; margin-bottom: 10px;">t: <span id="ballTrajGravityTValue">0.0</span>s</label>
    <input type="range" id="ballTrajGravityTSlider" min="0" max="5" step="0.1" value="0" style="width: 100%;">
  </div>
  <figcaption class="caption" style="font-weight: normal; max-width: 90%; margin: auto;">Interactive visualization: move the slider to change the ball's position along the camera axis and observe how its projection (ellipse) changes in the image.</figcaption>
</figure>

<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/9.4.4/math.min.js"></script>
<script type="module" src="/js/ballTrajGravity.js"></script>

# 2.2. Bouncing

<figure class="figure" style="text-align: center;">
  <div style="width: 80%; max-width: 800px; margin: 20px auto;">
    <label for="ballTrajBouncePosSlider" style="display: block; margin-bottom: 10px;">y0: <span id="ballTrajBouncePosValue">0.0</span>yds</label>
    <input type="range" id="ballTrajBouncePosSlider" min="-8" max="8" step="1" value="0" style="width: 100%;">
  </div>
  <div style="width: 80%; max-width: 800px; margin: 20px auto;">
    <label for="ballTrajBounceVelSlider" style="display: block; margin-bottom: 10px;">|v|: <span id="ballTrajBounceVelValue">25.0</span>yds/s</label>
    <input type="range" id="ballTrajBounceVelSlider" min="20" max="30" step="1" value="25" style="width: 100%;">
  </div>
  <canvas id="ballTrajBounceCanvas" width="640" height="360" style="border: 1px solid #ccc; display: block; margin: auto;"></canvas>
  <div style="width: 80%; max-width: 800px; margin: 20px auto;">
    <label for="ballTrajBounceTSlider" style="display: block; margin-bottom: 10px;">t: <span id="ballTrajBounceTValue">0.0</span>s</label>
    <input type="range" id="ballTrajBounceTSlider" min="0" max="5" step="0.1" value="0" style="width: 100%;">
  </div>
  <figcaption class="caption" style="font-weight: normal; max-width: 90%; margin: auto;">Interactive visualization: move the slider to change the ball's position along the camera axis and observe how its projection (ellipse) changes in the image.</figcaption>
</figure>

<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/9.4.4/math.min.js"></script>
<script type="module" src="/js/ballTrajBounce.js"></script>

# 2.2. Friction and drag

<figure class="figure" style="text-align: center;">
  <div style="width: 80%; max-width: 800px; margin: 20px auto;">
    <label for="ballTrajSlowPosSlider" style="display: block; margin-bottom: 10px;">y0: <span id="ballTrajSlowPosValue">0.0</span>yds</label>
    <input type="range" id="ballTrajSlowPosSlider" min="-8" max="8" step="1" value="0" style="width: 100%;">
  </div>
  <div style="width: 80%; max-width: 800px; margin: 20px auto;">
    <label for="ballTrajSlowVelSlider" style="display: block; margin-bottom: 10px;">|v|: <span id="ballTrajSlowVelValue">70.0</span>yds/s</label>
    <input type="range" id="ballTrajSlowVelSlider" min="60" max="80" step="1" value="70" style="width: 100%;">
  </div>
  <canvas id="ballTrajSlowCanvas" width="640" height="360" style="border: 1px solid #ccc; display: block; margin: auto;"></canvas>
  <div style="width: 80%; max-width: 800px; margin: 20px auto;">
    <label for="ballTrajSlowTSlider" style="display: block; margin-bottom: 10px;">t: <span id="ballTrajSlowTValue">0.0</span>s</label>
    <input type="range" id="ballTrajSlowTSlider" min="0" max="20" step="0.1" value="0" style="width: 100%;">
  </div>
  <figcaption class="caption" style="font-weight: normal; max-width: 90%; margin: auto;">Interactive visualization: move the slider to change the ball's position along the camera axis and observe how its projection (ellipse) changes in the image.</figcaption>
</figure>

<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/9.4.4/math.min.js"></script>
<script type="module" src="/js/ballTrajSlow.js"></script>


# 2.3. Magnus effect

# 2.4. Putting it all together

# 3. Estimating the 3D ball trajectory

# 3.1. Cost function
# 3.1.1. Ellipse fitting
# 3.1.2. Bounding box fitting

# 3.2. Optimization

# 4. Conclusion


# 5. References

1. Richard Hartley and Andrew Zisserman (2000), Page 143, *Multiple View Geometry in Computer Vision*, Cambridge University Press.
2. Wikipedia. [Cone](https://en.wikipedia.org/wiki/Cone_(geometry))
3. Wikipedia. [Von Neumann's trace inequality](https://en.wikipedia.org/wiki/Trace_inequality#Von_Neumann's_trace_inequality_and_related_results)
4. Wikipedia. [Procrustes problem](https://en.wikipedia.org/wiki/Orthogonal_Procrustes_problem)