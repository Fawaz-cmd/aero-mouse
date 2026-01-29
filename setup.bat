@echo off
title Aero Mouse - One Click Setup
echo.
echo ===========================================
echo    Aero Mouse AI - Initializing...
echo ===========================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed!
    echo Please install Python 3.12 or higher from python.org
    pause
    exit /b
)

echo [1/2] Installing required AI libraries...
python -m pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo [ERROR] Installation failed. Check your internet connection.
    pause
    exit /b
)

echo [2/2] Starting Aero Mouse...
echo.
echo TIP: Move your hand into the camera view to control your mouse.
echo.
echo [HOW TO STOP]
echo 1. Move your PHYSICAL MOUSE to any corner of the screen.
echo 2. OR press the 'Esc' key on your keyboard.
echo 3. OR close this window.
echo.
python ai_mouse.py
pause
