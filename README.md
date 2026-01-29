# AI Mouse Controller using Hand Gestures

A real-time, AI-powered mouse controller that uses your webcam and hand gestures to interact with your computer. Built with OpenCV and MediaPipe.
# AI Mouse Controller (Aero Mouse) 🚀🌌

A futuristic AI-powered hand tracking ecosystem that allows you to control your computer and browser using simple hand gestures. 

## 🌟 Features
- **Real-time Hand Tracking**: Powered by MediaPipe.
- **System-Wide Control**: Control your OS mouse, perform clicks, and scroll.
- **Futuristic Web Demo**: A high-end React-based landing page with a neural interface.
- **Advanced Gestures**: Support for Right Click, Double Click, and Smooth Scrolling.

---

## � Getting Started

### 1. Local Python Controller (Full OS Control)
This script runs on your machine and controls your actual Windows mouse cursor.

**Installation:**
```bash
pip install -r requirements.txt
```

**Run:**
```bash
python ai_mouse.py
```

---

### 2. Futuristic Web Demo (Browser Only)
A stunning website to showcase the technology.

**Setup:**
```bash
cd web
npm install
npm run dev
```

---

## 🎮 Gesture Guide

| Action | Gesture | Feedback Color |
| :--- | :--- | :--- |
| **Move Cursor** | Raised Index Finger | Green |
| **Left Click** | Index + Thumb Pinch | Red / Purple |
| **Right Click** | Middle + Thumb Pinch | Yellow |
| **Double Click**| Ring + Thumb Pinch | Magenta / Pink |
| **Scroll** | Index + Middle Both Up | Orange / Green |

---

## 🛠️ Tech Stack
- **Python**: OpenCV, MediaPipe, PyAutoGUI, NumPy.
- **Web**: React, Vite, MediaPipe JS, Framer Motion, Lucide React.

---

## 👨‍💻 Developed by
**Fawaz** - [GitHub](https://github.com/Fawaz-cmd/aero-mouse)

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
