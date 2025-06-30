# 🐝 Beehive Monitor — Project Overview

This repository contains a multi-module system designed for **smart beehive monitoring**, combining a mobile app interface with AI-powered video and audio processing tools.

---

## 📁 Project Structure

The project is organized into separate directories, each containing its own codebase and a dedicated `README.md` file with setup instructions and usage information.

### ▶️ `Phone App/`

Mobile application built with **React Native** using **Expo**.  
It allows real-time monitoring of the hive's:

- Temperature
- Humidity
- Weight
- Alerts
- Multimedia streaming

📄 Go to `Phone App/README.md` for:

- Installation steps (Node.js, Expo)
- Supabase setup
- Running the app on your phone or emulator

---

### ▶️ `AI Video/`

This module processes **video streams** from hive-mounted cameras using AI models (object detection, motion analysis, etc.).

📄 See `AI Video/README.md` for:

- How the AI pipeline works
- Installation and dependencies
- How to run the video analysis

---

### ▶️ `AI Audio/`

This module analyzes **audio recordings** from the hive to detect patterns or anomalies (like stress signals from bees).

📄 See `AI Audio/README.md` for:

- Audio input formats
- Machine learning model setup
- How to train, test, and run the audio analysis tools

---

## 🛠️ Requirements

Each sub-project has its own environment and dependencies. You should:

1. Navigate into each folder (`Phone App`, `AI Video`, `AI Audio`)
2. Follow the instructions inside the corresponding `README.md`

This modular design ensures flexibility and separation of concerns between the **mobile interface**, **audio processing**, and **video analysis** systems.

---

## 🚀 Getting Started

To get started with the project:

```bash
# Clone the repo
git clone <your_repo_url>
cd beehive-monitor

# Go into one of the subfolders to set it up
cd "Phone App"   # or "AI Video" / "AI Audio"
```

Then follow the README instructions in each subfolder.