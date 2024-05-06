+++
title = '🗜️ Compressed Sensing: Sparsity and the l1-norm'
date = 2024-05-02T11:16:19+01:00
tags = ["compressed sensing", "compressive sampling", "sparsity", "l1 norm"]
draft = false
+++

<span style="background-color: lightgrey; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
  <details>
    <summary><strong>Table of Contents</strong></summary>
      {{< toc >}}
  </details>
</span>
<br><br>

In this series we will focus on the topic of <strong>Compressed Sensing</strong>. We will start by motivating the interest in this recent field. Sparse signals are ubiquitous in nature, and the ability to recover them from a small number of measurements has a wide range of applications. We will try and understand the mathematical underpinnings of the theory, and why the l1-norm is used as a proxy for sparsity.

# 1. Data compression

These days, the amount of data generated every day is staggering, and it is only increasing. We mostly deal with data that aims at capturing the natural world around us. Take images for example. An image can be thought of as a $W \times H$ 2D array of pixels, where each pixel is a 3-tuple of RGB values represented with $B$ bits per channel. That means there are $2^{3 \cdot B \cdot W \cdot H}$ possible images we could have., which is a mind-boggling number. However, that begs the question: how many of these images are actually interesting?

<figure class="figure" style="text-align: center;">
  <img src="/compressed_sensing_sparsity/random_image.png" alt="Random image" width="70%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Random image.</figcaption>
</figure>

The answer is not many. If you were to generate images at random, you could spend an eternity doing so, and chances are you would never generate one that looks like nothing but noise. This is because natural images are not random, they have structure and patterns that make them interesting. 

<figure class="figure" style="text-align: center;">
  <img src="/compressed_sensing_sparsity/abstract_image.png" alt="Random image" width="70%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Abstract image.</figcaption>
</figure>

The number of natural images (and by this we mean not only images that one could observe in the real world, but also any image inspired by it that may only live in one's imagination) is inmensely vast. However, it's still a tiny fraction of the total number of possible images. That suggests natural images should be highly compressible. We just need to find a suitable basis to represent them in a more compact way.

<figure class="figure" style="text-align: center;">
  <img src="/compressed_sensing_sparsity/sampling.svg" alt="Random image" width="90%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Natural image capturing. We use a sensor such as a camera to take a sample of the world. This sample is then compressed and stored in a digital format. Finally, the image can be restored from its compressed counterpart using a reconstruction algorithm.</figcaption>
</figure>

The diagram above shows the standard procedure we follow to capture images. We use a device such as a camera to take a sample of the world around us. Then this sample is processed in order to compress it. Finally, the compressed data is stored in a digital format. The goal of this process is to minimize the amount of data we need to store while preserving the most important information.

Nevertheless, this process seems inefficient at first sight. Why do we need to sample so much image data (all pixels in the image) if we can represent it with far fewer samples after compression? Can we not directly sample in a compressed way in order to speed up the process? This is the question that Compressed Sensing tries to answer.

<figure class="figure" style="text-align: center;">
  <img src="/compressed_sensing_sparsity/compressive_sampling.svg" alt="Random image" width="90%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Natural image capturing via compressive sampling. We use a sensor that is able to sample the world in a compressed way. This compressed representation of the image can then be stored. Finally, in order to retrieve the original image, we need to run a reconstruction algorithm on the compressed data.</figcaption>
</figure>

# 5. References

1. [MLOps: Continuous delivery and automation pipelines in machine learning](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), by Google Cloud. 