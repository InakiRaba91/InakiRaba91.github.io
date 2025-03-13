+++
title = '🕺 Projective Geometry: Camera pose retrieval'
date = 2025-03-10T11:16:19+01:00
tags = ["computer vision", "projective geometry", "camera calibration", "intrinsic matrix", "pinhole camera"]
draft = false
+++

<span style="background-color: lightgrey; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
  <details>
    <summary><strong>Table of Contents</strong></summary>
      {{< toc >}}
  </details>
</span>

# 1. Introduction: Perspective-n-Point (PnP) problem

We have seen in an earlier <a href="https://inakiraba91.github.io/posts/projective_geometry/estimating_homography_matrix/" style="text-decoration: none; color: blue; line-height: 1;">post</a> how we can estimate the homography matrix $H$ that characterizes the projective transform between two images. This matrix takes the form:

$$
\begin{equation}
H= K \cdot \left[\\; R\\;\\; | \\;\\;\ T\\;\\;\right ]
\end{equation}
$$

In our previous <a href="https://inakiraba91.github.io/posts/projective_geometry/camera_calibration/" style="text-decoration: none; color: blue; line-height: 1;">post</a>, we then studied how to calibrate the camera by retrieving the intrinsic matrix $K$, parametrised by the focal length, the skew coefficient, and the principal point. 

In this article we will focus on the camera pose retrieval problem, which consists of retrieving the extrinsic matrix $E=\left[\\; R\\;\\; | \\;\\;\ T\\;\\;\right ]$, where $R$ is the rotation matrix that describes the camera orientation and $T$ is the translation vector that describes the camera position. 

Our goal then is to estimate the camera pose given a set of $n$ 3D points and their corresponding 2D projections in the image. This problem is known as the Perspective-n-Point (PnP) problem, and it is a fundamental problem in computer vision.

<span style="background-color: lightblue; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
    <img src="/github.svg" alt="GitHub Icon" style="width: 24px; height: 24px; margin-right: 10px;">
    <a href="https://github.com/InakiRaba91/ProjectiveGeometry" style="text-decoration: none; color: blue; line-height: 1;"><strong>Auxiliary repository</strong></a>
</span>

# 2. Degrees of freedom

The first question that comes to mind is: how many points do we need to retrieve the camera pose? To gain some intuition, we can think of a 3D cube in the world coordinate system. Varying the camera pose, i.e., its location and orientation, is equivalent to keeping still the camera and applying a rigid transformation to the cube. 

Without any constraints (**P0P** problem), the rigid transformation has 6 degrees of freedom (DOF), 3 for the rotation and 3 for the translation. This is illustrated below, where you can tweak the different parameters.

<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
    <div style="flex: 1; margin-right: 5px; display: flex; align-items: center;">
      <label for="tx-p0p-slider" style="margin-right: 10px;">tx: <span id="tx-p0p-value">0</span></label>
      <input type="range" id="tx-p0p-slider" min="0" max="20" value="0" step="1" style="flex: 1;">
    </div>
    <div style="flex: 1; margin-left: 5px; display: flex; align-items: center;">
      <label for="rx-p0p-slider" style="margin-right: 10px;">θx: <span id="rx-p0p-value">0</span></label>
      <input type="range" id="rx-p0p-slider" min="-20" max="20" value="0" step="1" style="flex: 1;">
    </div>
  </div>
  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
    <div style="flex: 1; margin-right: 5px; display: flex; align-items: center;">
      <label for="ty-p0p-slider" style="margin-right: 10px;">ty: <span id="ty-p0p-value">0</span></label>
      <input type="range" id="ty-p0p-slider" min="0" max="20" value="0" step="1" style="flex: 1;">
    </div>
    <div style="flex: 1; margin-left: 5px; display: flex; align-items: center;">
      <label for="ry-p0p-slider" style="margin-right: 10px;">θy: <span id="ry-p0p-value">0</span></label>
      <input type="range" id="ry-p0p-slider" min="-20" max="20" value="0" step="1" style="flex: 1;">
    </div>
  </div>
  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
    <div style="flex: 1; margin-right: 5px; display: flex; align-items: center;">
      <label for="tz-p0p-slider" style="margin-right: 10px;">tz: <span id="tz-p0p-value">0</span></label>
      <input type="range" id="tz-p0p-slider" min="0" max="20" value="0" step="1" style="flex: 1;">
    </div>
    <div style="flex: 1; margin-left: 5px; display: flex; align-items: center;">
      <label for="rz-p0p-slider" style="margin-right: 10px;">θz: <span id="rz-p0p-value">0</span></label>
      <input type="range" id="rz-p0p-slider" min="-20" max="20" value="0" step="1" style="flex: 1;">
    </div>
  </div>
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <div style="width: calc(50% - 5px); text-align: center;">
      <h4 style="margin-bottom: 5px;">(a) 3D World View</h4>
      <div id="interactive-container-p0p-camera-view" style="position: relative; width: 100%; max-width: 1280px; aspect-ratio: 16 / 9; border: 1px solid black; margin: 0 auto;">
        <canvas id="interactive-plot-p0p-camera-view-bg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
        <canvas id="interactive-plot-p0p-camera-view" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
      </div>
    </div>
    <div style="width: calc(50% - 5px); text-align: center;">
      <h4 style="margin-bottom: 5px;">(b) Camera View</h4>
      <div id="interactive-container-p0p-frame-view" style="position: relative; width: 100%; max-width: 1280px; aspect-ratio: 16 / 9; border: 1px solid black; margin: 0 auto;">
        <canvas id="interactive-plot-p0p-frame-view-bg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
        <canvas id="interactive-plot-p0p-frame-view" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
      </div>
    </div>
  </div>
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">(a) 3D scene reconstruction showing a 3D cube (<span style="color: blue;">blue</span>) captured from a pinhole camera (<span style="color: red;">red</span> cube). You can observe how the rigid transformation affects the cube as you tweak the parameters. (b) Frame captured from the camera as we vary the rigid transform parameters</figcaption>
</figure>
<script type="module" src="/js/p0p.js"></script>

Now say we are able to map one point in the 3D world to its corresponding 2D projection in the image. This is known as the **P1P** problem. In our case, this would be the corner highlighted in <span style="color: green;">green</span> in the 3D cube. With the constraint that the <span style="color: green;">green</span> point cannot move in the image, how many degrees of freedom do we have left? Well, we can rotate the cube around any axis, that is 3 DOFs. We can also move the cube along the <span style="color: orange;">orange</span> ray from that <span style="color: green;">green</span> corner to the pinhole, which is another DOF. But we can not shift the cube in the plane perpendicular to the ray, so we have removed 2 DOFs. This leaves us with 4 DOFs for the P1P problem, as illustrated below.

<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div style="margin-bottom: 10px; display: flex; align-items: center;">
    <label for="t-p1p-slider" style="margin-right: 10px;">t: <span id="t-p1p-value">0</span></label>
    <input type="range" id="t-p1p-slider" min="0" max="20" value="0" step="1" style="flex: 1;">
  </div>
  <div style="margin-bottom: 10px; display: flex; align-items: center;">
    <label for="rx-p1p-slider" style="margin-right: 10px;">θx: <span id="rx-p1p-value">0</span></label>
    <input type="range" id="rx-p1p-slider" min="-20" max="20" value="0" step="1" style="flex: 1;">
  </div>
  <div style="margin-bottom: 10px; display: flex; align-items: center;">
    <label for="ry-p1p-slider" style="margin-right: 10px;">θy: <span id="ry-p1p-value">0</span></label>
    <input type="range" id="ry-p1p-slider" min="-20" max="20" value="0" step="1" style="flex: 1;">
  </div>
  <div style="margin-bottom: 10px; display: flex; align-items: center;">
    <label for="rz-p1p-slider" style="margin-right: 10px;">θz: <span id="rz-p1p-value">0</span></label>
    <input type="range" id="rz-p1p-slider" min="-20" max="20" value="0" step="1" style="flex: 1;">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <div style="width: calc(50% - 5px); text-align: center;">
      <h4 style="margin-bottom: 5px;">(a) 3D World View</h4>
      <div id="interactive-container-p1p-camera-view" style="position: relative; width: 100%; max-width: 1280px; aspect-ratio: 16 / 9; border: 1px solid black; margin: 0 auto;">
        <canvas id="interactive-plot-p1p-camera-view-bg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
        <canvas id="interactive-plot-p1p-camera-view" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
      </div>
    </div>
    <div style="width: calc(50% - 5px); text-align: center;">
      <h4 style="margin-bottom: 5px;">(b) Camera View</h4>
      <div id="interactive-container-p1p-frame-view" style="position: relative; width: 100%; max-width: 1280px; aspect-ratio: 16 / 9; border: 1px solid black; margin: 0 auto;">
        <canvas id="interactive-plot-p1p-frame-view-bg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
        <canvas id="interactive-plot-p1p-frame-view" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
      </div>
    </div>
  </div>
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">(a) 3D scene reconstruction showing a 3D cube (<span style="color: blue;">blue</span>) captured from a pinhole camera (<span style="color: red;">red</span> cube). The world-image correspondence is known for the <span style="color: green;">green</span> corner. (b) Frame captured from the camera as we vary the rigid transform parameters. Notice how that point remains fixed in the image as you vary them, leaving us with 4 DOFs.</figcaption>
</figure>
<script type="module" src="/js/p1p.js"></script>

Let us add a second point, displayed in <span style="color: green;">green</span>. This is the **P2P** problem. We still can not shift the cube along the plane perpendicular to the rays any of the marked corners to the pinhole, so those 2 DOFs remain gone. Furthermore, we can only rotate the cube around the axis given by the line connecting the two green points. Any other rotation would move the green points in the image, so that is another 2 DOFs gone. 

How about shifting, do you see any way to do that? This one is a bit tricky, but if you think about it, you will see the only way to shift the cube without the <span style="color: green;">green</span> corners moving in the image is by doing so along the <span style="color: orange;">orange</span> rails defined by the rays from the green corners to the pinhole. Since those rays are not parallel (they intersect in the pinhole), we need to rotate slightly the cube as we shift it so both corners stay in their corresponding rail. Play around with the sliders below to convince yourself!

<figure class="figure" style="text-align: center; margin: 0 auto;">
  <div style="margin-bottom: 10px; display: flex; align-items: center;">
    <label for="t-p2p-slider" style="margin-right: 10px;">t: <span id="t-p2p-value">0</span></label>
    <input type="range" id="t-p2p-slider" min="0" max="20" value="0" step="1" style="flex: 1;">
  </div>
  <div style="margin-bottom: 10px; display: flex; align-items: center;">
    <label for="r-p2p-slider" style="margin-right: 10px;">θ: <span id="r-p2p-value">0</span></label>
    <input type="range" id="r-p2p-slider" min="-20" max="20" value="0" step="1" style="flex: 1;">
  </div>
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <div style="width: calc(50% - 5px); text-align: center;">
      <h4 style="margin-bottom: 5px;">(a) 3D World View</h4>
      <div id="interactive-container-p2p-camera-view" style="position: relative; width: 100%; max-width: 1280px; aspect-ratio: 16 / 9; border: 1px solid black; margin: 0 auto;">
        <canvas id="interactive-plot-p2p-camera-view-bg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
        <canvas id="interactive-plot-p2p-camera-view" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
      </div>
    </div>
    <div style="width: calc(50% - 5px); text-align: center;">
      <h4 style="margin-bottom: 5px;">(b) Camera View</h4>
      <div id="interactive-container-p2p-frame-view" style="position: relative; width: 100%; max-width: 1280px; aspect-ratio: 16 / 9; border: 1px solid black; margin: 0 auto;">
        <canvas id="interactive-plot-p2p-frame-view-bg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
        <canvas id="interactive-plot-p2p-frame-view" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
      </div>
    </div>
  </div>
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">(a) 3D scene reconstruction showing a 3D cube (<span style="color: blue;">blue</span>) captured from a pinhole camera (<span style="color: red;">red</span> cube). The world-image correspondence is known for the two <span style="color: green;">green</span> corners. (b) Frame captured from the camera as we vary the rigid transform parameters. Notice how that points remains fixed in the image as you vary them, leaving us with 2 DOFs.</figcaption>
</figure>
<script type="module" src="/js/p2p.js"></script>

You can see the pattern now, each additional point seems to remove 2 DOFs. With a third non-collinear point we get the **P3P** problem, which removes almost entirely the freedom to move the cube. There is a slight caveat we will discuss later on, but this is the problem we will focus on in this article.

# 3. Mapping 3D points to camera coordinates

The **P3P** problem can be stated as follows. We have 3 non-collinear points in the 3D world, $p_1$, $p_2$, and $p_3$, and their corresponding 2D projections in the image, $P_1$, $P_2$, and $P_3$. The image is captured with a calibrated camera, i.e., with known focal length $f$. The goal is to retrieve the camera pose, i.e., the rotation matrix $R$ and the translation vector $T$. 

The set up is illustrated below. Notice we define three different coordinate systems:
 - The **world coordinate system**, with origin $O$ and axes $\hat{x}$, $\hat{y}$, and $\hat{z}$.
 - The **camera coordinate system**, with origin at the camera center $T$ and axes $\hat{x'}$, $\hat{y'}$, and $\hat{z'}$ aligned so that $\hat{z'}$ is the optical axis.
 - The **image coordinate system**, with origin at the top left corner of the image and axes $\hat{X}$ and $\hat{Y}$.

<figure class="figure" style="text-align: center;">
  <img src="/camera_pose_retrieval/p3p_setup.svg" alt="P3P setup" width="50%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">P3P problem setup. We have 3 non-collinear points in the world coordinate system, $p_1$, $p_2$, and $p_3$, and their corresponding 2D projections in the image, $P_1$, $P_2$, and $P_3$. We have three different coordinate systems: the world coordinate system (<span style="color: magenta;">magenta</span>), the camera coordinate system (<span style="color: green;">green</span>), and the image coordinate system (<span style="color: red;">red</span>).</figcaption> 
</figure>

For the time being, we wills operate in the camera coordinate system. Our first stepp will be ton compute the angles between the rays from the camera center to the 3D points, $[\alpha, \beta, \gamma]$, as shown below:

<figure class="figure" style="text-align: center;">
  <img src="/camera_pose_retrieval/p3p_rays.svg" alt="P3P rays" width="40%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Rays from the camera center to the 3D points, which also pass through the image points. We define the angles $[\alpha, \beta, \gamma]$ between the rays.</figcaption>
</figure>

The image points can be expressed in the world coordinate system. The image below illustrates the setup, where the image plane is aligned with the $\hat{X'}\hat{Y'}$ plane, and the optical axis is aligned with the $\hat{Z'}$ axis. Without loss of generality, we will assume the principal point is at the center of the image.

<figure class="figure" style="text-align: center;">
  <img src="/camera_pose_retrieval/p3p_image_setup.svg" alt="P3P image setup" width="60%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Image plane setup in the camera coordinate system. The image coordinates of point $P_1$ are given by $[u, v]$. We can also express it in the camera system as $[u-\frac{W}{2}, v-\frac{H}{2}, f]$, where $W$ and $H$ are the image width and height.</figcaption>
</figure>

We can therefore express

# 4. Retrieving the camera pose

# 5. References

1. Richard Hartley and Andrew Zisserman (2000), *Multiple View Geometry in Computer Vision*, Cambridge University Press.
2. Stefen Lavalle, Lecture on "Perspective n-point problem": [YouTube](https://www.youtube.com/watch?v=0JGC5hZYCVE)
3. Huang, T. S. et. al. (1986). “Least-squares estimation of motion parameters from 3-D point correspondences.” Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition. Vol. 10.
4. K. S. Arun et. al. (1987) "Least-Squares Fitting of Two 3-D Point Sets," IEEE Transactions on Pattern Analysis and Machine Intelligence, vol. PAMI-9, no. 5, pp. 698-700.
5. Cyrill Stachniss, Lecture on "Projective 3-Point Algorithm using Grunert's Method": [YouTube](https://www.youtube.com/watch?v=N1aCvzFll6Q) and [slides](https://www.ipb.uni-bonn.de/html/teaching/photo12-2021/2021-pho1-23-p3p.pptx.pdf)
6. Jingnan Shi, ["Arun’s Method for 3D Registration"](https://jingnanshi.com/blog/arun_method_for_3d_reg.html)
7. Jingnan Shi, ["Perspective-n-Point: P3P"](https://jingnanshi.com/blog/pnp_minimal.html)
8. [OpenCV Libary: Basic concepts of the homography explained with code](https://docs.opencv.org/3.4/d9/dab/tutorial_homography.html)
9. Law of Cosines: [Wikipedia](https://en.wikipedia.org/wiki/Law_of_cosines)