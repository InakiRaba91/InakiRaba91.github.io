+++
title = '🏋️ Continuous Training: Data Collection and Model Training'
date = 2024-02-02T11:16:19+01:00
tags = ["machine learning", "model training", "model evaluation", "continuous training"]
draft = false
+++

<span style="background-color: lightgrey; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
  <details>
    <summary><strong>Table of Contents</strong></summary>
      {{< toc >}}
  </details>
</span>
<br><br>
In this series we will build from scratch a Continuous Training System. However, to keep things simple, we will use a toy example and run the system <strong>locally</strong>. In a real-world scenario, the system would be deployed in a cloud environment and the data would be stored in a distributed storage system.

# 1. Continuous Training

The process of generating a machine learning model usually consists of training on a dataset, evaluating its performance and then
deploying it to a production environment. In certain scenarios, the trained model may perform consistently over a long period of time. However, that is not always the case. There are multiple reasons you may want to retrain it periodically, such as:

  - **Stay competitive**: as more data becomes available, the model can be retrained to take advantage of it, gaining a competitive edge thanks to the improved performance.
  - **Data drift**: in training a model, it is assumed that the training data is representative of future unseen data. Nevertheless, this may not always hold. For instance, we trained a model to estimate the camera parameters for broadcast soccer games. But when the pandemic led to camera angle changes in order to avoid showing empty stadiums, the data distribution changed.
  - **Concept drift**: the relationship between the input features and the target variable can evolve. We trained our camera model to predict the camera pinhole parametrisation. The model we trained our model to predict the parametrisation given by the camera pinhole paradigm. However, if TV producers switch to fish-eye lenses for a different viewer experience, the input/output mapping would no longer be valid. 

 The process of automatically retraining a model on a regular basis is known as **Continuous Training**. It is a key component of a machine learning system that aims to keep the model's performance at an optimal level over time. The following diagram depicts the different components that make up a Continuous Training System:

<figure class="figure" style="text-align: center;">
  <img src="/building_training_pipeline/continuous_training.svg" alt="Continuous Training Diagram" width="100%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Diagram for the Continuous Training System we will be exploring in this article. It depicts the different components it is comprised of, and the tasks they carry out.</figcaption>
</figure>

We have the following agents/components:
1. **User**: customer that sends requests to the endpoint in order to get predictions back.
2. **Endpoint**: the model's API, which forwards the requests to the model and sends back the predictions. Furthermore, it stores both the pairs of queries and predictions to the data lake.
3. **Labelling**: process used to manually annotate the data and review the model's predictions. This allows us to have high quality data on a continuous basis that we can use to capture the data drift and retrain the model.
4. **Data Lake**: storage system that stores the high quality data used for training.
5. **Orchestrator**: component that watches the data lake and triggers the retraining process when certain conditions are met.
6. **Training**: process that takes the data in the data lake and generates a new model as an output artifact.

In this article we will focus on the **Labelling**,  **Training** and **Endpoint** components. 

# 2. Data collection

A key element of any machine learning project is the **data**. At its core, AI models ingest vast amounts of data and are tasked with recognizing patterns and finding insights. Assuming the data used for training was representative of the real world, one can then expect the trained model to make accurate predictions on unseen scenarios.

But how do you get that data? Well, you may be able to use publicly available datasets. However, you may find it hard to build a moat around your business if you are using the same data as everyone else. Moreover, it is unlikely that you will be able to find a dataset that is perfectly suited to your specific problem. In many cases, you will need to collect your own data.

<figure class="figure" style="text-align: center;">
  <img src="/building_labelling_app/labelling_app.svg" alt="Labelling App" width="100%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Diagram for the Continuous Training System we will be exploring in this series. It highlights the labelling component we will focus on.</figcaption>
</figure>

This is where data collection comes in. In this blogpost we will build a web application that allows users to label images of cats and dogs. We will be using React and Node.js. This application plays a twofold role: 

 - It allows us to <u>collect the data</u> used for training the initial model.
 - It allows to <u>review and correct model predictions</u> that are fed back into the retraining process.

All the code is available at the following public repository:

<span style="background-color: lightblue; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
    <img src="/github.svg" alt="GitHub Icon" style="width: 24px; height: 24px; margin-right: 10px;">
    <a href="https://github.com/InakiRaba91/animal_labeller" style="text-decoration: none; color: blue; line-height: 1;"><strong>Auxiliary repository</strong></a>
</span>

## 2.1. Frontend

First of all, let's start with a warning. I had never used React before, so bear with me if the code is not as clean as it should be. Luckily, I had the assistance of Copilot, which helped me a lot with the boilerplate code. I still can't get my head around the fact that I was able to build a web application from scratch in just a couple days as a complete newbie.

That clarified, let's start with the frontend. We will be using React, a JavaScript library for building user interfaces. We will assume the images to be labelled are stored in a given directory. Our app will then iterate through the images and display them one by one. The user will then be able to label each image by clicking on a button.

<figure class="figure" style="text-align: center;">
  <img src="/building_training_pipeline/animal_laballer_ui.png" alt="Labelling App" width="50%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">UI for our web app.</figcaption>
</figure>

Its use is fairly intuitive: you can mark the image as cat/dog, or mark it to be deleted if it does not correspond to any of the two classes. You can also use the keyboard shortcuts `C` and `D` to mark the image as cat/dog, and `R` to mark it as to be deleted. Once you are done, click on `Save` (Right Arrow) to save the labels to disk and move to the next image. You can also go back to correct mistakes clicking on `Previous` (Left Arrow).

## 2.2. Backend

The backend is a simple Node.js server that serves the frontend and handles the requests to save the labels. It is built using Express, a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It has three main endpoints:

1. [`/filelist`](https://github.com/InakiRaba91/animal_labeller/blob/main/server.js#L15): it returns a list of the available images to be labelled.
2. [`/files/{filename}`](https://github.com/InakiRaba91/animal_labeller/blob/main/server.js#L13): it serves the image specified by its filename to be labelled.
3. [`/label`](https://github.com/InakiRaba91/animal_labeller/blob/main/server.js#L42): it saves the labels to disk.

And that's it! If you want to give it a try, just clone the repo, drop your images in the `data/frames` folder and label them using the labeler tool. To run it, execute the following command:
```bash
./scripts/serve.sh
```

Then, open your browser and go to `http://localhost:3000/`. The `data/annotations` folder will populate with the labels you have assigned to the images.

# 3. Training Pipeline

In this section we will focus on the **Training** component. It carries out a sequence of steps that takes the data in the data lake and generates a new model as an output artifact. The pipeline is composed of the following steps:

1. **Training**: the process of learning the best weights that minimize the error between the predictions and the ground truth in the training set, while being able to generalize to unseen data.
2. **Evaluation**: the process of comparing the performance of the newly trained model against a baseline model in order to find out if there is an improvement.
3. **Validation**: a final step to ensure that the model is able to generalize to unseen data. 
4. **Registry**: if all previous steps are successful, the model is stored, ready to be deployed.

<figure class="figure" style="text-align: center;">
  <img src="/building_training_pipeline/training_pipeline.svg" alt="Continuous Training Diagram" width="100%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Diagram for the Continuous Training System we will be exploring in this article. It highlights the different steps that make up the training pipeline.</figcaption>
</figure>

Lets us now focus on the two key components that carry out the core functionality of the pipeline. All the code is available at the following public repository:

<span style="background-color: lightblue; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
    <img src="/github.svg" alt="GitHub Icon" style="width: 24px; height: 24px; margin-right: 10px;">
    <a href="https://github.com/InakiRaba91/animal_classifier" style="text-decoration: none; color: blue; line-height: 1;"><strong>Auxiliary repository</strong></a>
</span>

## 3.1. Training

We will try to keep things as simple as possible. In that spirit, our aim is to build a Dog & Cat classifier. The starting dataset can be found in the `data` folder consisting of:
 - <u>Images</u>: 10  comprised of 10 photos of cats and dogs, located in `data` subfolder.
 - <u>Labels</u>: 10 corresponding labels stored as `.json`, located in `annotations` subfolder.

<figure class="figure" style="text-align: center;">
  <img src="/building_training_pipeline/cat_and_dog.png" alt="Cat and Dog" width="70%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Example of a cat and a dog images in our dataset.</figcaption>
</figure>

We will be using the `torch` library. The main components we defined are:
 - <a href="https://github.com/InakiRaba91/animal_classifier/blob/main/animal_classifier/datasets/dataset.py">`Dataset`</a>: reads the images and labels from the disk and returns them as a tuple. It resizes the images to a fixed size, converts them to grayscale and normalizes them.
  - <a href="https://github.com/InakiRaba91/animal_classifier/blob/main/animal_classifier/models/model.py">`Model`</a>: defines the model architecture, which consists of a simple fully connected layer followed by a sigmoid activation function.
  - <a href="[gttps://github.com/InakiRaba91/animal_classifier/blob/main/animal_classifier/datasets/dataset.py](https://github.com/InakiRaba91/animal_classifier/blob/main/animal_classifier/losses/loss.py)">`Loss`</a>: we will use the binary cross-entropy loss.

To see the training in practice, you can download a sample dataset [here](https://drive.google.com/file/d/1R_mxTnZfXkqBF-QgXuW3XNA2rjkbnmqn/view?usp=sharing). Extract the contents of the file in the `data` directory. To do so, run:

```bash
tar -zxf cats_and_dogs.tar.gz -C data/
```

Then make sure you have [`poetry`](https://python-poetry.org/) installed and set up the environment running:

```bash
poetry install
```

First, we need prepare the dataset by creating the 3 splits for train/val/test:
```bash
poetry run python -m animal_classifier dataset-split data/train.csv data/val.csv data/test.csv --train-frac 0.6 --val-frac 0.2 --test-frac 0.2
```

We will use the train set to fine tune the model weights, and the val set for early stopping. Run the following command to get the trained model, which will be stored in the `models` folder:
```bash
poetry run python -m animal_classifier training data/train.csv data/val.csv --annotations-dir data/cats_and_dogs/annotations --model-dir models/cats_and_dogs
```

The model is now ready to be used for inference. To test it on an image, simply run
```bash
poetry run python -m animal_classifier inference 1.png base_model.pth --frames-dir data/cats_and_dogs/frames --model-dir models/cats_and_dogs --threshold 0.5
```

## 3.2. Evaluation

Before deploying the model, we need to evaluate its performance. For that purpose, we have an evaluation module that receives a model and a dataset. It computes a summary metric, the average binary cross-entropy loss. We will carry out two steps:

1. **Comparison against a baseline model**: to ensure the new model outperforms the current one, we compare the metric on the same dataset. As an example, we can compare the two models provided by the training step in previous section: `latest` (all epochs) and `best` (early stopping). 
```bash
poetry run python -m animal_classifier evaluation base_model_latest.pth base_model.pth data/test.csv --annotations-dir data/cats_and_dogs/annotations --model-dir models/cats_and_dogs
```

2. **Validation**: to ensure the model is able to generalize to unseen data. 
```bash
poetry run python -m animal_classifier validation base_model.pth data/test.csv --annotations-dir data/cats_and_dogs/annotations --model-dir models/cats_and_dogs --max-loss-validation 5
```

# 3.3. Model Deployment

So after training our model, making sure it outperforms the baseline and gaining confidence about its generalization to unseen data, what's next? It's time to deploy it!

<figure class="figure" style="text-align: center;">
  <img src="/building_training_pipeline/deployment.svg" alt="Deployment Diagram" width="100%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Diagram for the Continuous Training System we will be exploring in this article. It highlights the deployment step.</figcaption>
</figure>

Bear in mind that our model is simply an artifact, a file that contains the weights of the model. In order to make predictions, we need to wrap it in an API. We will use the <a href="https://pytorch.org/serve/">`torchserve`</a> library. The process goes as follows:

1. **Model Archiver**: we need to create a `.mar` file that contains the model and the code to run it: 
```bash
poetry run torch-model-archiver --model-name animal --version 1.0 --model-file animal_classifier/models/model.py --serialized-file ./models/cats_and_dogs/base_model.pth --handler animal_classifier/api/torchserve/handler.py --export-path ./model_store/
```
2. **Settings**: we define the settings for the server in a `config.properties` file, like the one below:
```yml
inference_address=http://127.0.0.1:8080
inference_address=http://0.0.0.0:8080
management_address=http://0.0.0.0:8081
metrics_address=http://0.0.0.0:8082
model_store=./model_store/
load_models=animal.mar
min_workers=1
max_workers=1
default_workers_per_model=1
model_snapshot={
    "name":"startup.cfg", 
    "modelCount":1, 
    "models":{
        "animal":{
            "1.0":{
                "defaultVersion":true, 
                "marName":"animal.mar", 
                "minWorkers":1, 
                "maxWorkers":1, 
                "batchSize":2, 
                "maxBatchDelay":100, 
                "responseTimeout":30000,
            }
        }
    }
}
```

<div style="border: 1px solid black; padding: 10px; background-color: #DAF7A6; border-radius: 5px;">
  <strong><u>Note</u></strong>: we have reformated the <code>config.properties</code> for clarity. However, the model_snapshot must be a single line without spaces, as in the original <a href="https://github.com/InakiRaba91/animal_classifier/blob/main/config.properties"> file</a>.
</div> <br>

Torchserve provides a batching mechanism out of the blue. It tries to group the incoming requests until one of the following conditions is met:
  - The batch is filled with `batchSize` requests.
  - The time since the first request in the batch exceeds `maxBatchDelay` milliseconds.

3. **Containerization**: we can use Docker to containerize the server. You can check the details in the `docker/Dockerfile.torchserve` file. To build it, simply run

```bash
docker build -t animal_classifier_torchserve:latest -f docker/Dockerfile.torchserve .
```

4. **Deployment**: we can deploy the container by running:
```bash
docker run --rm -p 8080:8080 -p 8081:8081 -p 8082:8082 -v ./model_store:/source/model_store animal_classifier_torchserve:latest
```

And that's it we're done! You can check the model is running by executing the following command:
```bash
curl http://localhost:8081/models/animal
```

We can now send requests to the endpoint and get predictions back:
- <u>Single request</u>
    ```bash
    curl http://localhost:8080/predictions/animal -T ./data/cats_and_dogs/frames/1.png
    ```
- <u>Concurrent requests</u> for batch processing:
    ```bash
    curl -X POST http://localhost:8080/predictions/animal -T ./data/cats_and_dogs/frames/1.png & curl -X POST http://localhost:8080/predictions/animal -T ./data/cats_and_dogs/frames/2.png
    ```

## 3.4. Proxy Deployment

There's one last issue though. When we try to hit the torchserve endpoint from the labelling app, we get a [CORS error](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors) indicating it
has been blocked by CORS policy. We will solve it by adding a FastAPI server that acts as a proxy to the torchserve endpoint. This will come handy since it gives as a WebUI to interact with the model. Furthermore, we will also leverage it for canary rollouts as we will see in a future post.

To deploy it, simply run:
```bash
docker run --rm -p 8000:8000 -v ./config:/source/config animal_classifier_fastapi:latest
```

Now you can go to `http://localhost:8000/docs` in your browser, where you'll get a UI that allows you to upload images and get predictions back.

<figure class="figure" style="text-align: center;">
  <img src="/building_training_pipeline/fastapi_endpoint.png" alt="FastAPI Proxy" width="100%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Web UI for FastAPI endpoint. It allows to upload an image and returns the prediction.</figcaption>
</figure>

# 4. Putting it all together

Once we have a trained model, we can point the Labelling App to it. In this fashion, when a new image is queried, the app will hit 
the model to get an initial prediction. This prediction will be displayed to the user, who can then correct it if necessary. 

This requires spinning up the three components we have discussed: labelling app, model predictor and proxy. You can do so by cloning both repos into a folder and adding the following manifest in there:

```yaml
version: '3'
services:
  fastapi:
    container_name: fastapi_container
    image: animal_classifier_fastapi:latest
    ports:
      - "8000:8000"
    volumes:
      - ./animal_classifier/config:/source/config
    networks:
      - mynetwork

  torchserve:
    container_name: torchserve_container
    image: animal_classifier_torchserve:latest
    ports:
      - "8080:8080"
      - "8081:8081"
      - "8082:8082"
    volumes:
      - ./animal_classifier/model_store:/source/model_store
    networks:
      - mynetwork

  labeller:
    container_name: labeller_container
    image: animal_labeller:latest
    ports:
      - "3000:3000"
      - "3001:3001"
    volumes:
      - ./animal_labeller/data:/usr/src/app/data
    networks:
      - mynetwork

networks:
  mynetwork:
```

Then, run the following command to start the services:

```bash
docker-compose up -d
```

And go to `http://localhost:3000/` in your browser. You will be able get predictions back from the model and review them. 

<figure class="figure" style="text-align: center;">
  <img src="/building_training_pipeline/animal_laballer_ui_labelled.png" alt="Labelling App" width="50%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">UI for our web app.</figcaption>
</figure>

# 5. References

1. [MLOps: Continuous delivery and automation pipelines in machine learning](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), by Google Cloud. 