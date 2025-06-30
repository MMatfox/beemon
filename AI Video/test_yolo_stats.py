import os
import numpy as np
import cv2
import torch
from ultralytics import YOLO
from tqdm import tqdm
from sklearn.metrics import precision_score, recall_score, f1_score

# Path to the model used to make the test
model_path = "best.pt"
# Path to the test dataset used for the test
data_dir = "./dataset/test/images"
label_dir = "./dataset/test/labels"
imgsz = 640
conf_threshold = 0.25

def xywh_to_xyxy(xc, yc, w, h, img_w, img_h):
    x1 = int((xc - w / 2) * img_w)
    y1 = int((yc - h / 2) * img_h)
    x2 = int((xc + w / 2) * img_w)
    y2 = int((yc + h / 2) * img_h)
    return [x1, y1, x2, y2]

model = YOLO(model_path)

all_preds = []
all_gts = []

for fname in tqdm(os.listdir(data_dir)):
    if not fname.endswith(".jpg") and not fname.endswith(".png"):
        continue

    image_path = os.path.join(data_dir, fname)
    label_path = os.path.join(label_dir, os.path.splitext(fname)[0] + ".txt")

    img = cv2.imread(image_path)
    h, w = img.shape[:2]

    results = model.predict(image_path, imgsz=imgsz, conf=conf_threshold, verbose=False)
    preds = results[0].boxes.xyxy.cpu().numpy() if results[0].boxes else []

    gt_boxes = []
    if os.path.exists(label_path):
        with open(label_path, "r") as f:
            for line in f:
                cls, xc, yc, bw, bh = map(float, line.strip().split())
                gt_boxes.append(xywh_to_xyxy(xc, yc, bw, bh, w, h))

    all_preds += [1] * len(preds)
    all_gts += [1] * len(gt_boxes)

precision = precision_score(all_gts, all_preds, zero_division=0)
recall = recall_score(all_gts, all_preds, zero_division=0)
f1 = f1_score(all_gts, all_preds, zero_division=0)

print("\n\U0001F4CA Model Evaluation:")
print(f"Precision : {precision:.3f}")
print(f"Recall    : {recall:.3f}")
print(f"F1-score  : {f1:.3f}")