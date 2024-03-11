+++
title = '🏋️ Continuous Training: Building a model training pipeline'
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

# 1. Continuous Training

The process of generating a machine learning model usually consists of training on a dataset, evaluating its performance and then
deploying it to a production environment. In certain scenarios, the trained model may perform consistently over a long period of time. However, that is not always the case. There are multiple reasons you may want to retrain it periodically, such as:

  - **Stay competitive**: as more data becomes available, the model can be retrained to take advantage of it, gaining a competitive edge thanks to the improved performance.
  - **Data drift**: in training a model, it is assumed that the training data is representative of future unseen data. Nevertheless, this may not always hold. For instance, we trained a model to estimate the camera parameters for broadcast soccer games. But when the pandemic led to camera angle changes in order to avoid showing empty stadiums, the data distribution changed.
  - **Concept drift**: the relationship between the input features and the target variable can evolve. We trained our camera model to predict the camera pinhole parametrisation. The model we trained our model to predict the parametrisation given by the camera pinhole paradigm. However, if TV producers switch to fish-eye lenses for a different viewer experience, the input/output mapping is no longer be valid. 

 The process of retraining a model on a regular basis is known as **Continuous Training**. It is a key component of a machine learning system that aims to keep the model's performance at an optimal level over time. The following diagram depicts the different components that make up a Continuous Training System:

<figure class="figure" style="text-align: center;">
  <img src="/building_training_pipeline/continuous_training.svg" alt="Continuous Training Diagram" width="100%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Diagram for the Continuous Training System we will be exploring in this article. It depicts the different components it is comprised of, and the tasks they carry out.</figcaption>
</figure>

We have the following agents/components:
1. **User**: customer that sends requests to the endpoint in order to get predictions back.
2. **Endpoint**: the model's API, which receives forwards the requests to the model and sends back the predictions. Furthermore, it stores both the pairs of queries and predictions to the data lake.
3. **Labelling**: process used to manually annotate the data and review the model's predictions. This allows us to have high quality data on a continuous basis that we can use to capture the data drift and retrain the model.
4. **Data Lake**: storage system that stores the high quality data used for training.
5. **Orchestrator**: component that watches the data lake and triggers the retraining process when certain conditions are met.
6. **Training**: process that takes the data in the data lake and generates a new model as an output artifact.

In this article we will focus on the **Training** and **Endpoint** components. All the code is available at the following public repository:

<span style="background-color: lightblue; border: 1px solid black; padding: 2px 10px; display: inline-flex; align-items: center;">
    <img src="/github.svg" alt="GitHub Icon" style="width: 24px; height: 24px; margin-right: 10px;">
    <a href="https://github.com/InakiRaba91/animal_classifier" style="text-decoration: none; color: blue; line-height: 1;"><strong>Auxiliary repository</strong></a>
</span>
<br><br>
<div style="border: 1px solid black; padding: 10px; background-color: #DAF7A6; border-radius: 5px;">
  <strong><u>Note</u></strong>: in this series we will build from scratch a Continuous Training System. However, to keep things simple, we will use a toy example and run the system <strong>locally</strong>. In a real-world scenario, the system would be deployed in a cloud environment and the data would be stored in a distributed storage system.
</div>

# 2. Training Pipeline

In this section we will focus on the **Training** component. It carries out a sequence of steps that takes the data in the data lake and generates a new model as an output artifact. The pipeline is composed of the following steps:

1. **Training**: the process of learning the best weights that minimize the error between the predictions and the ground truth in the training set, while being able to generalize to unseen data.
2. **Evaluation**: the process of comparing the performance of the newly trained model against a baseline model in order to find out if there is an improvement.
3. **Validation**: a final step to ensure that the model is able to generalize to unseen data. 
4. **Registry**: if all previous steps are successful, the model is stored, ready to be deployed.

<figure class="figure" style="text-align: center;">
  <img src="/building_training_pipeline/training_pipeline.svg" alt="Continuous Training Diagram" width="100%" style="display: block; margin: auto;">
  <figcaption class="caption" style="font-weight: normal; max-width: 80%; margin: auto;">Diagram for the Continuous Training System we will be exploring in this article. It highlights the different steps that make up the training pipeline.</figcaption>
</figure>

Lets us now focus on the two key components that carry out the core functionality of the pipeline:

## 2.1. Training

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

Then make sure you have `poetry` installed and set up the environment running:

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

## 2.2. Evaluation

Before deploying the model, we need to evaluate its performance. For that purpose, we have an evaluation module that receives a model and a dataset. It computes a summary metric, the average binary cross-entropy loss. We will carry out two steps:

1. **Comparison against a baseline model**: to ensure the new model outperforms the current one, we compare the metric on the same dataset. As an example, we can compare the two models provided by the training step in previous section: `latest` (all epochs) and `best` (early stopping). 
```bash
poetry run python -m animal_classifier evaluation base_model_latest.pth base_model.pth data/test.csv --annotations-dir data/cats_and_dogs/annotations --model-dir models/cats_and_dogs
```

2. **Validation**: to ensure the model is able to generalize to unseen data. 
```bash
poetry run python -m animal_classifier validation base_model.pth data/test.csv --annotations-dir data/cats_and_dogs/annotations --model-dir models/cats_and_dogs --max-loss-validation 5
```

# 3. Deployment

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
```json
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
  <strong><u>Note</u></strong>: we have reformated the `config.properties` for clarity. However, the model_snapshot must be a single line without spaces, as in the original <a href="https://github.com/InakiRaba91/animal_classifier/blob/main/config.properties"> file</a>.
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

# 4. References

1. [MLOps: Continuous delivery and automation pipelines in machine learning](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), by Google Cloud. 