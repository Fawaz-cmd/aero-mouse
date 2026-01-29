import React, { useRef, useEffect, useState } from 'react';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

const HandController = ({ onGesture }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [activeGesture, setActiveGesture] = useState('move'); // 'move', 'click', 'right-click', 'double-click', 'scroll'
    const prevScrollY = useRef(0);

    useEffect(() => {
        const hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
        });

        hands.onResults((results) => {
            if (!canvasRef.current || !videoRef.current) return;

            const canvasCtx = canvasRef.current.getContext('2d');
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            // Draw video frame to canvas
            canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                const landmarks = results.multiHandLandmarks[0];

                // Draw landmarks
                drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00f3ff', lineWidth: 2 });
                drawLandmarks(canvasCtx, landmarks, { color: '#bc13fe', lineWidth: 1, radius: 2 });

                // Logic for Cursor (Index Finger Tip is landmark 8)
                const indexTip = landmarks[8];
                const thumbTip = landmarks[4];
                const middleTip = landmarks[12];
                const ringTip = landmarks[16];

                // Map landmark coordinates to screen
                const x = (1 - indexTip.x) * window.innerWidth; // Mirrored
                const y = indexTip.y * window.innerHeight;

                setCursorPos({ x, y });

                // Helper for finger-up detection
                const isIndexUp = indexTip.y < landmarks[6].y;
                const isMiddleUp = middleTip.y < landmarks[10].y;

                // Pinch Thresholds
                const pinchThreshold = 0.05;

                // 1. SCROLL DETECTION (Index + Middle Up move)
                if (isIndexUp && isMiddleUp) {
                    const distIndexMiddle = Math.hypot(indexTip.x - middleTip.x, indexTip.y - middleTip.y);
                    if (distIndexMiddle > 0.05) { // Fingers separated
                        const currentY = indexTip.y;
                        if (prevScrollY.current !== 0) {
                            const diff = (currentY - prevScrollY.current) * 1000;
                            if (Math.abs(diff) > 10) {
                                onGesture?.('scroll', { delta: diff });
                                setActiveGesture('scroll');
                            }
                        }
                        prevScrollY.current = currentY;
                        canvasCtx.fillStyle = '#2563eb';
                        canvasCtx.beginPath();
                        canvasCtx.arc(indexTip.x * canvasRef.current.width, indexTip.y * canvasRef.current.height, 5, 0, 2 * Math.PI);
                        canvasCtx.arc(middleTip.x * canvasRef.current.width, middleTip.y * canvasRef.current.height, 5, 0, 2 * Math.PI);
                        canvasCtx.fill();
                    }
                } else {
                    prevScrollY.current = 0;

                    // 2. PINCH GESTURES
                    const distIndex = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y);
                    const distMiddle = Math.hypot(middleTip.x - thumbTip.x, middleTip.y - thumbTip.y);
                    const distRing = Math.hypot(ringTip.x - thumbTip.x, ringTip.y - thumbTip.y);

                    if (distIndex < pinchThreshold) {
                        if (activeGesture !== 'click') {
                            setActiveGesture('click');
                            onGesture?.('click', { x, y });
                        }
                    } else if (distMiddle < pinchThreshold) {
                        if (activeGesture !== 'right-click') {
                            setActiveGesture('right-click');
                            onGesture?.('right-click', { x, y });
                        }
                    } else if (distRing < pinchThreshold) {
                        if (activeGesture !== 'double-click') {
                            setActiveGesture('double-click');
                            onGesture?.('double-click', { x, y });
                        }
                    } else {
                        setActiveGesture('move');
                    }
                }
            }
            canvasCtx.restore();
        });

        if (videoRef.current) {
            const camera = new Camera(videoRef.current, {
                onFrame: async () => {
                    await hands.send({ image: videoRef.current });
                    if (!isLoaded) setIsLoaded(true);
                },
                width: 640,
                height: 480,
            });
            camera.start();
        }

        return () => {
            hands.close();
        };
    }, [onGesture, isLoaded]);

    return (
        <div className="hand-controller-wrapper">
            <div className={`virtual-cursor ${activeGesture !== 'move' ? 'active' : ''} ${activeGesture}`}
                style={{ left: cursorPos.x, top: cursorPos.y }}>
            </div>

            <div className="webcam-container glass">
                <video ref={videoRef} style={{ display: 'none' }} />
                <canvas ref={canvasRef}
                    width={640}
                    height={480}
                    style={{ width: '100%', borderRadius: '15px' }} />
                {!isLoaded && (
                    <div className="loader-overlay">
                        <div className="loader"></div>
                        <p>Initializing Neural Engine...</p>
                    </div>
                )}
            </div>

            <style jsx>{`
        .hand-controller-wrapper {
          position: relative;
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
        }
        .webcam-container {
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(0, 243, 255, 0.2);
        }
        .loader-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.8);
          z-index: 10;
        }
        .loader {
          width: 40px;
          height: 40px;
          border: 3px solid transparent;
          border-top-color: var(--neon-blue);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default HandController;
