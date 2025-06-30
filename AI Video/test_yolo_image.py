import os
import numpy as np
import cv2
import torch
from ultralytics import YOLO
from tqdm import tqdm
from sklearn.metrics import precision_score, recall_score, f1_score

def run_on_video_or_image(model_path, input_path, output_path, conf_threshold=0.25):
    model = YOLO(model_path)

    is_video = input_path.endswith(('.mp4', '.avi', '.mov'))
    cap = cv2.VideoCapture(input_path) if is_video else [cv2.imread(input_path)]
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    writer = None

    idx = 0
    while True:
        ret, frame = cap.read() if is_video else (idx < 1, cap[idx])
        if not ret:
            break

        results = model.predict(frame, imgsz=640, conf=conf_threshold, verbose=False)[0]
        for box in results.boxes.xyxy.cpu().numpy():
            x1, y1, x2, y2 = map(int, box[:4])
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        if is_video:
            if writer is None:
                h, w = frame.shape[:2]
                writer = cv2.VideoWriter(output_path, fourcc, 30, (w, h))
            writer.write(frame)
        else:
            cv2.imwrite(output_path, frame)
            break

        idx += 1

    if is_video:
        cap.release()
        writer.release()
    print("✅ Output saved to:", output_path)