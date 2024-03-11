+++
title = '🏷️ Continuous Training: Building a labelling tool'
date = 2024-03-06T11:16:19+01:00
tags = ["machine learning", "data labelling", "webapp", "frontend", "backend", "React"]
draft = false
+++

<span style="background-color: lightgrey; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
  <details>
    <summary><strong>Table of Contents</strong></summary>
      {{< toc >}}
  </details>
</span>

# 1. Data collecetion

A key component of any machine learning project is the **data**. At its core, AI models ingest vast amounts of data and are tasked with recognizing patterns and finding insights. Assuming the data used for training was representative of the real world, one can then expect the trained model to make accurate predictions on unseen scenarios.

But how do you get that data? Well, you may be able to use publicly available datasets. However, you may find it hard to build a moat around your business if you are using the same data as everyone else. Moreover, it is unlikely that you will be able to find a dataset that is perfectly suited to your specific problem. In many cases, you will need to collect your own data.

<figure class="figure" style="text-align: center;">
  <img src="/building_labelling_app/labelling_app.svg" alt="Labelling App" width="100%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Diagram for the Continuous Training System we will be exploring in this series. It highlights the labelling componente we will focus on.</figcaption>
</figure>

This is where data collection comes in. In this blogpost we will build a web application that allows users to label images of cats and dogs. We will be using React and Node.js. This application is only one of the componentes of the Continuous Training system we are
building. It plays a twofold role: 

 - It allows us to <u>collect the data</u> used for training the initial model.
 - It allows to <u>review and correct model predictions</u> that are fed back into the retraining process.

All the code is available at the following public repository:

<span style="background-color: lightblue; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
    <img src="/github.svg" alt="GitHub Icon" style="width: 24px; height: 24px; margin-right: 10px;">
    <a href="https://github.com/InakiRaba91/animal_labeller" style="text-decoration: none; color: blue; line-height: 1;"><strong>Auxiliary repository</strong></a>
</span>

# 2. Frontend

First of all, let's start with a warning. I had never used React before, so bear with me if the code is not as clean as it should be. Luckily, I had the assistance of Copilot, which helped me a lot with the boilerplate code. I still can't get my head around the fact that I was able to build a web application from scratch in just a couple days as a complete newbie.

That clarified, let's start with the frontend. We will be using React, a JavaScript library for building user interfaces. We will assume the images to be labelled are stored in a given folder. Our app will then iterate through the images and display them one by one. The user will then be able to label each image by clicking on a button.

<figure class="figure" style="text-align: center;">
  <img src="/building_labelling_app/animal_laballer_ui.png" alt="Labelling App" width="50%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">UI for our web app.</figcaption>
</figure>

Its use is fairly intuitive: you can mark the image as cat/dog, or mark it to be deleted if it does not correspond to any of the two classes. You can also use the keyboard shortcuts `C` and `D` to mark the image as cat/dog, and `R` to mark it as to be deleted. Once you are done, click on `Save` (Right Arrow) to save the labels to disk and move to the next image. You can also go back to correct mistakes clicking on `Previous` (Left Arrow).

# 3. Backend

The backend is a simple Node.js server that serves the frontend and handles the requests to save the labels. It is built using Express, a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It has three main endpoints:

1. [`/filelist`](https://github.com/InakiRaba91/animal_labeller/blob/main/server.js#L15): it returns a list of the available images to be labelled.
2. [`/files/{filename}`](https://github.com/InakiRaba91/animal_labeller/blob/main/server.js#L13): it serves the image specified by its filename to be labelled.
3. [`/label`](https://github.com/InakiRaba91/animal_labeller/blob/main/server.js#L42): it saves the labels to disk.

Furthermore, if we spin up the model backend, the app will get an initial prediction when a new image is queried. This prediction will be displayed to the user, who can then correct it if necessary.

<figure class="figure" style="text-align: center;">
  <img src="/building_labelling_app/animal_laballer_ui_labelled.png" alt="Labelling App" width="50%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">UI for our web app.</figcaption>
</figure>

And that's it! If you want to give it a try, just clone the repo, drop your images in the `data/frames` folder and label them using the labeler tool. To run it, execute the following command:
```bash
./scripts/serve.sh
```

Then, open your browser and go to `http://localhost:3000/`. The `data/annotations` folder will populate with the labels you have assigned to the images.

# 4. References

1. [MLOps: Continuous delivery and automation pipelines in machine learning](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), by Google Cloud. 