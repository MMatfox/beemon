\# 🐝 Bee Detection System – Installation and Usage Guide



This README provides all necessary instructions to install, train, and use a YOLO-based bee detection model. It is designed to help future students reproduce the environment, run detection on images/videos, and convert the trained model to ONNX format for further deployment.



---



\## 1️⃣ Installation



\### 💻 1.1 Local Installation



\#### ✅ Prerequisites

\- \*\*Python 3.10\*\* (recommended)

\- \*\*pip\*\* (Python package manager)



\#### 🧰 Steps

1\. \*\*Download Python 3.10\*\*:

&nbsp;  - \[Download here](https://www.python.org/downloads/release/python-3100/)

2\. \*\*Install Python\*\*:

&nbsp;  - During installation, \*\*check the box\*\* to add Python to your PATH.

3\. \*\*Verify pip\*\*:

&nbsp;  - Ensure "pip" is selected during installation.



\#### 🧠 IDE Recommendation

You can use any IDE of your choice. Recommended:

\- Spyder (used during development)

\- Visual Studio Code

\- PyCharm



\#### ⚡ GPU Support (Optional)

If you wish to train the model locally with an NVIDIA GPU:

\- Install \*\*CUDA\*\* toolkit compatible with your GPU.

\- This allows faster training using GPU acceleration.

\- ⚠️ It is simpler and more reliable to use Google Colab for training.



\#### 📦 Install Required Packages

```bash

pip install ultralytics onnxruntime opencv-python matplotlib tqdm

```

Explanation:

\- `ultralytics`: train and export YOLOv8 models

\- `onnxruntime`: inference with ONNX models

\- `opencv-python`, `matplotlib`: image/video processing and visualization

\- `tqdm`: progress bars



---



\### ☁️ 1.2 Google Colab Installation



Recommended for training or working with larger models.



\#### ✅ Benefits

\- Free access to \*\*powerful GPUs\*\*

\- Simplified setup (pre-installed dependencies)

\- No installation needed on your local computer



\#### 🪜 How to Use

1\. Open \[Google Colab](https://colab.research.google.com)

2\. Create a new notebook

3\. Select GPU: `Runtime` > `Change runtime type` > Hardware accelerator: `GPU`

4\. Install missing packages (if needed):

```bash

!pip install ultralytics onnxruntime opencv-python matplotlib tqdm

```

5\. Mount your dataset (uploaded to Google Drive):

```python

from google.colab import drive

drive.mount('/content/drive')

```

Then access files via `/content/drive/MyDrive/YOUR\_FOLDER`.



To download the dataset used in this project:

\[Download Dataset (Google Drive)](https://drive.google.com/file/d/1XKQnBn8HOk8DX7q79m6z6lm22bU5Ke7o/view?usp=sharing)



---



\## 2️⃣ Dataset Structure



The project expects the dataset in the following structure:



```

dataset/

├── data.yaml

├── train/

│   ├── images/

│   └── labels/

├── valid/

│   ├── images/

│   └── labels/

└── test/

&nbsp;   ├── images/

&nbsp;   └── labels/

```



\### 📄 `data.yaml` Example

```yaml

train: ../train/images

val: ../valid/images

test: ../test/images



nc: 1

names: \['bee']

```

\- `nc`: number of classes (1 class: bee)

\- `names`: class names



\### 🧼 Dataset Cleaning

If your dataset contains labels unrelated to bees:

\- Use the script `Cleaning dataset.py`

\- It removes unwanted classes and deletes images with no bees

\- Run it separately for `train/`, `valid/`, and `test/` folders



---



\## 3️⃣ YOLOv8 – Training \& Evaluation



\### 🏋️‍♂️ Train a Model

```bash

yolo task=detect mode=train model=yolov8n.pt data=../dataset/data.yaml epochs=100 imgsz=640 batch=16 patience=20 device=0

```

Key options:

\- `model=yolov8n.pt`: start from pretrained YOLOv8 Nano model

\- `epochs=100`: 100 full passes over training data

\- `batch=16`: batch size of 16 images per step

\- `imgsz=640`: images resized to 640x640

\- `patience=20`: early stopping after 20 stagnant epochs

\- `device=0`: use GPU 0 (if available)



\### 📊 Test the Model



Use your trained model on:



\#### 📈 Statistics (Precision / Recall / F1)



To evaluate the model on the test dataset and compute performance metrics:



\- Open the script `test\_yolo\_stats.py` in your IDE or editor.

\- Inside the script, modify the following variables according to your setup:



```python

model\_path = "best.pt"  # Path to your trained YOLO model

data\_dir = "./dataset/test/images"  # Directory containing test images

label\_dir = "./dataset/test/labels"  # Directory containing corresponding label files



\#### 🖼️ Image or Video Detection

```python

\# Use this call in your script

run\_on\_video\_or\_image("best.pt", "video.mp4", "output.mp4")

```

Parameters:

\- `best.pt`: trained model (our best-performing model)

\- `video.mp4`: input file (can be an image)

\- `output.mp4`: output file with bounding boxes



---



\## 🔄 Convert to ONNX



Export YOLOv8 to ONNX:

```bash

yolo export model=best.pt format=onnx dynamic=False opset=12 simplify=True nms=True

```

Explanation:

\- `format=onnx`: export to ONNX format

\- `nms=True`: adds Non-Max Suppression to remove overlapping boxes

\- `dynamic=False`: disables dynamic input shape

\- `simplify=True`: simplify graph for better performance



You can then test your model using the `test\_onnx.py` script on:

\- a single image

\- a video file



The `best.onnx` file included in the project is the ONNX export of the best YOLOv8 model trained.

