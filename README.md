# AI Mouse Controller using Hand Gestures

A real-time, AI-powered mouse controller that uses your webcam and hand gestures to interact with your computer. Built with OpenCV and MediaPipe.

## ✨ Features

- **Smooth Mouse Movement**: Cursor follows your index finger tip with jitter reduction.
- **Natural Gestures**:
    - **Left Click**: Pinch Thumb + Index Finger.
    - **Right Click**: Pinch Thumb + Middle Finger.
    - **Double Click**: Pinch Thumb + Ring Finger.
    - **Scrolling**: Raise Index + Middle fingers and move hand vertically.
    - **Left Drag**: Hold the Index + Thumb pinch to drag items.
- **On-Screen Display**: Real-time feedback monitor showing the current mode and gesture status.
- **Safety Failsafe**: Move your physical mouse to any corner of the screen to stop the script instantly.

## 🛠️ Installation

1. **Clone or Download** this repository.
2. **Install Python 3.12+** (if not already installed).
3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## 🚀 How to Run

### 1. Local Python Controller (Full OS Control)
Run the main script from the root folder:
```bash
python ai_mouse.py
```

### 2. Futuristic Web Demo (Browser Only)
Navigate to the `web` folder first:
```bash
cd web
npm run dev
```

## 🎮 Gesture Guide

| Action | Gesture | Visual Feedback |
| :--- | :--- | :--- |
| **Move Cursor** | Index Finger Up | Green Circle |
| **Left Click** | Index + Thumb Pinch | Red Line |
| **Right Click** | Middle + Thumb Pinch | Yellow Line |
| **Double Click**| Ring + Thumb Pinch | Magenta Line |
| **Scroll Mode** | Index + Middle Both Up | Orange Circles |

## 📦 Creating an Executable (.exe)

To share this app with someone who doesn't have Python installed:

1. Install PyInstaller:
   ```bash
   pip install pyinstaller
   ```
2. Build the EXE:
   ```bash
   pyinstaller --noconsole --onefile ai_mouse.py
   ```
3. Your standalone app will be in the `dist/` folder!

## 📜 Requirements

- Python 3
- OpenCV
- MediaPipe (specific version included in requirements)
- PyAutoGUI
- NumPy

## ⚖️ License
MIT License
