import cv2
from ultralytics import YOLO
import os

# Configurations
onnx_model_path = "best.onnx" # Path to your exported ONNX model
input_path = "miel-abeilles.jpg" # Replace with your input image or video path
output_path = "output.mp4" # Output filename if using a video
conf_threshold = 0.25 # Confidence threshold for detections

model = YOLO(onnx_model_path)

# Case 1 : Image input
if input_path.lower().endswith((".jpg", ".png", ".jpeg")):
    results = model(input_path, conf=conf_threshold, imgsz=640)
    res_plotted = results[0].plot()
    cv2.imwrite("output_image.jpg", res_plotted)
    print("✅ Image saved as: output_image.jpg")

# Case 2 : Video input
else:
    cap = cv2.VideoCapture(input_path)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Run detection on each frame
        results = model(frame, conf=conf_threshold, imgsz=640)
        res_plotted = results[0].plot()  # Draw bounding boxes
        out.write(res_plotted)           # Write frame to output video

    cap.release()
    out.release()
    print(f"✅ Video saved as: {output_path}")
