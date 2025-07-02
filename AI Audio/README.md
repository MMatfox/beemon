
# 🐝 Queen Presence Detection Using CNNs on Beehive Audio

This project focuses on detecting the presence of a queen bee in a hive using short audio recordings (3 seconds).  
The audio files are transformed into mel spectrograms, which are then classified by convolutional neural networks (CNNs).

---

## 📁 Project Structure

```
.
├── sounds/
│   ├── Queen_Spectrograms/          # Training images (queen present)
│   ├── NonQueen_Spectrograms/       # Training images (no queen)
│   ├── testQueen_spectrogram/       # Test images (queen)
│   └── testNonQueen_spectrogram/    # Test images (no queen)
├── generate_spectrograms.py         # Script to convert .wav to .png spectrograms
├── train_cnn.py                     # Train CNN from scratch
├── train_finetune.py                # Fine-tune MobileNetV2
├── evaluate_models.py               # Run prediction & evaluation on all models
├── model_CNN.h5                     # CNN from scratch (trained model)
├── model_CNN.tflite                 # CNN converted to TensorFlow Lite
├── model_tuned.tflite               # Fine-tuned MobileNetV2 (TFLite)
└── README.md
```

---

## 🧠 Model Architectures

| Model            | Description                                   |
|------------------|-----------------------------------------------|
| CNN from Scratch | Custom CNN trained only on spectrograms       |
| Fine-tuned CNN   | MobileNetV2 pre-trained on ImageNet and adapted |
| CNN (old)        | First version of custom CNN                   |

---

## 📊 Performance Summary

| Model           | Accuracy | Precision | Recall | F1-score |
|----------------|----------|-----------|--------|----------|
| **CNN (final)** | 0.675    | 0.818     | 0.466  | 0.594    |
| Fine-tuned CNN | 0.514    | 0.866     | 0.056  | 0.105    |
| CNN (old)      | 0.673    | 0.656     | 0.751  | 0.700    |

- The fine-tuned model failed to generalize, likely due to the domain gap between natural images (ImageNet) and spectrograms.
- The CNN from scratch outperformed all models, showing that training directly on spectrograms is more effective in this specific task.

---

## 🎼 Spectrogram Generation

Raw `.wav` files were converted into 128×128 mel spectrograms using librosa.  
Each spectrogram is saved as a `.png` image and used as CNN input.

```python
S = librosa.feature.melspectrogram(y=signal, sr=sr, n_mels=128)
S_dB = librosa.power_to_db(S, ref=np.max)
```

---

## ✅ Pros and Cons Comparison

### CNN from Scratch
- ✅ Tailored to your dataset  
- ✅ No pre-learned image bias  
- ✅ Better performance on spectrograms  
- ❌ Requires more training time  
- ❌ Needs large dataset  
- ❌ Risk of overfitting  

### Fine-tuned CNN (MobileNetV2)
- ✅ Faster training convergence  
- ✅ Works with small datasets  
- ✅ Easy to implement  
- ❌ Not optimized for spectrograms  
- ❌ Irrelevant features transferred  
- ❌ Fine-tuning can be tricky  

---

## 💻 Requirements

- Python 3.9+
- TensorFlow 2.x
- Keras
- NumPy
- Librosa
- Matplotlib
- scikit-learn

```bash
pip install -r requirements.txt
```

---

## 🚀 How to Train

```bash
python train_cnn.py       # Train CNN from scratch
python train_finetune.py  # Fine-tune MobileNetV2
```

---

## 🔍 How to Evaluate

```bash
python evaluate_models.py
```

All models are tested on separate test spectrogram folders.  
Metrics include accuracy, precision, recall and F1-score.

---

## 📦 Deployment

The final CNN is exported in TensorFlow Lite format (`.tflite`) for use on edge devices.

