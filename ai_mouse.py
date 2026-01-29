import cv2
import mediapipe as mp
import mediapipe.solutions.hands as mp_hands
import mediapipe.solutions.drawing_utils as mp_draw
import pyautogui
import numpy as np
import time

# --- Configuration ---
# Screen size for mapping
SCREEN_WIDTH, SCREEN_HEIGHT = pyautogui.size()

# Camera resolution
CAM_WIDTH, CAM_HEIGHT = 640, 480

# Control parameters
SMOOTHING = 5  # Smoothing factor (higher = smoother but more lag)
PINCH_THRESHOLD = 30  # Distance between finger tips for pinch (pixels)
SCROLL_SENSITIVITY = 10  # Movement required to trigger scroll

# Color constants (BGR)
COLOR_MOVE = (0, 255, 0)      # Green
COLOR_CLICK = (0, 0, 255)     # Red (Left Click)
COLOR_RIGHT = (0, 255, 255)   # Yellow (Right Click)
COLOR_DOUBLE = (255, 0, 255)  # Magenta (Double Click)
COLOR_SCROLL = (255, 165, 0)  # Orange (Scroll)

# Safety feature: Move mouse to any corner to abort PyAutoGUI
pyautogui.FAILSAFE = True

class HandTracker:
    """Class to handle hand tracking using MediaPipe."""
    def __init__(self, static_image_mode=False, max_num_hands=1, 
                 min_detection_confidence=0.7, min_tracking_confidence=0.7):
        # Using direct imports from top level
        self.mp_hands = mp_hands
        self.mp_draw = mp_draw
            
        self.hands = self.mp_hands.Hands(
            static_image_mode=static_image_mode,
            max_num_hands=max_num_hands,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )
        self.results = None
        self.tip_ids = [4, 8, 12, 16, 20] # Thumb, Index, Middle, Ring, Pinky tips

    def find_hands(self, img, draw=True):
        """Detects hands in the image and optionally draws landmarks."""
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.hands.process(img_rgb)
        
        if self.results.multi_hand_landmarks and draw:
            for hand_lms in self.results.multi_hand_landmarks:
                self.mp_draw.draw_landmarks(img, hand_lms, self.mp_hands.HAND_CONNECTIONS)
        return img

    def get_positions(self, img):
        """Lists landmarks with coordinates in pixels."""
        lm_list = []
        if self.results.multi_hand_landmarks:
            my_hand = self.results.multi_hand_landmarks[0]
            for id, lm in enumerate(my_hand.landmark):
                h, w, c = img.shape
                cx, cy = int(lm.x * w), int(lm.y * h)
                lm_list.append([id, cx, cy])
        return lm_list

    def fingers_up(self, lm_list):
        """Returns a list of 5 booleans indicating which fingers are up."""
        fingers = []
        
        # Thumb: Tip should be to the left/right of base depending on hand
        # Simplified: Check if tip is vertical/horizontal relative to joint
        if lm_list[self.tip_ids[0]][1] > lm_list[self.tip_ids[0]-1][1]:
            fingers.append(1)
        else:
            fingers.append(0)
            
        # Other 4 fingers: Tip should be higher (smaller Y) than the joint below it
        for id in range(1, 5):
            if lm_list[self.tip_ids[id]][2] < lm_list[self.tip_ids[id]-2][2]:
                fingers.append(1)
            else:
                fingers.append(0)
        return fingers

def main():
    # Initialize camera
    cap = cv2.VideoCapture(0)
    cap.set(3, CAM_WIDTH)
    cap.set(4, CAM_HEIGHT)

    # Initialize tracker
    tracker = HandTracker()

    # Variables for smoothing
    prev_x, prev_y = 0, 0
    curr_x, curr_y = 0, 0
    
    # State variables
    is_left_down = False
    prev_scroll_y = 0

    print("AI Mouse Controller Started.")
    print("Gestures:")
    print("- Move: INDEX up")
    print("- Left Click/Drag: INDEX + THUMB pinch")
    print("- Right Click: MIDDLE + THUMB pinch")
    print("- Double Click: RING + THUMB pinch")
    print("- Scroll: INDEX + MIDDLE up (move hand up/down)")
    print("- Press 'q' or 'Esc' to quit.")

    while cap.isOpened():
        success, img = cap.read()
        if not success:
            break

        # Flip image for natural 'mirror' interaction
        img = cv2.flip(img, 1)

        # 1. Find hands and landmarks
        img = tracker.find_hands(img)
        lm_list = tracker.get_positions(img)

        mode_text = "IDLE"
        mode_color = COLOR_MOVE

        if len(lm_list) != 0:
            # Get landmarks for tips
            # Thumb: 4, Index: 8, Middle: 12, Ring: 16, Pinky: 20
            p_thumb = lm_list[4][1:3]
            p_index = lm_list[8][1:3]
            p_middle = lm_list[12][1:3]
            p_ring = lm_list[16][1:3]

            # Detect which fingers are up
            fingers = tracker.fingers_up(lm_list)

            # --- MOUSE MOVEMENT (Index finger is up, others are down or middle is up for scroll) ---
            if fingers[1] == 1:
                # Map camera coordinates to screen coordinates
                margin = 100
                screen_x = np.interp(p_index[0], [margin, CAM_WIDTH - margin], [0, SCREEN_WIDTH])
                screen_y = np.interp(p_index[1], [margin, CAM_HEIGHT - margin], [0, SCREEN_HEIGHT])

                # Smoothing
                curr_x = prev_x + (screen_x - prev_x) / SMOOTHING
                curr_y = prev_y + (screen_y - prev_y) / SMOOTHING
                
                # Update Prev for next iteration
                prev_x, prev_y = curr_x, curr_y

                # Check for SCROLL MODE (Index and Middle both UP)
                if fingers[1] == 1 and fingers[2] == 1:
                    mode_text = "SCROLL"
                    mode_color = COLOR_SCROLL
                    cv2.circle(img, tuple(p_index), 10, COLOR_SCROLL, cv2.FILLED)
                    cv2.circle(img, tuple(p_middle), 10, COLOR_SCROLL, cv2.FILLED)
                    
                    # Calculate scroll amount
                    if prev_scroll_y != 0:
                        diff = p_index[1] - prev_scroll_y
                        if abs(diff) > SCROLL_SENSITIVITY:
                            # Invert scroll: hand up = scroll up
                            pyautogui.scroll(-int(diff * 2)) 
                    prev_scroll_y = p_index[1]
                else:
                    # NORMAL MOVE MODE
                    pyautogui.moveTo(curr_x, curr_y)
                    mode_text = "MOVE"
                    mode_color = COLOR_MOVE
                    cv2.circle(img, tuple(p_index), 10, COLOR_MOVE, cv2.FILLED)
                    prev_scroll_y = 0

            # --- GESTURES (Pinches) ---
            
            # 1. LEFT CLICK (Index + Thumb)
            dist_left = np.hypot(p_index[0] - p_thumb[0], p_index[1] - p_thumb[1])
            if dist_left < PINCH_THRESHOLD:
                cv2.line(img, tuple(p_index), tuple(p_thumb), COLOR_CLICK, 3)
                if not is_left_down:
                    pyautogui.mouseDown()
                    is_left_down = True
                mode_text = "LEFT DRAG" if is_left_down else "LEFT CLICK"
                mode_color = COLOR_CLICK
            else:
                if is_left_down:
                    pyautogui.mouseUp()
                    is_left_down = False

            # 2. RIGHT CLICK (Middle + Thumb)
            dist_right = np.hypot(p_middle[0] - p_thumb[0], p_middle[1] - p_thumb[1])
            if dist_right < PINCH_THRESHOLD:
                cv2.line(img, tuple(p_middle), tuple(p_thumb), COLOR_RIGHT, 3)
                pyautogui.rightClick()
                mode_text = "RIGHT CLICK"
                mode_color = COLOR_RIGHT
                time.sleep(0.2) # Prevent multiple clicks

            # 3. DOUBLE CLICK (Ring + Thumb)
            dist_double = np.hypot(p_ring[0] - p_thumb[0], p_ring[1] - p_thumb[1])
            if dist_double < PINCH_THRESHOLD:
                cv2.line(img, tuple(p_ring), tuple(p_thumb), COLOR_DOUBLE, 3)
                pyautogui.doubleClick()
                mode_text = "DOUBLE CLICK"
                mode_color = COLOR_DOUBLE
                time.sleep(0.3) # Prevent multiple clicks

        # Add UI Overlays
        cv2.rectangle(img, (0, 0), (250, 70), (0, 0, 0), -1)
        cv2.putText(img, f"MODE: {mode_text}", (10, 50), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, mode_color, 2)
        
        # Display frame
        cv2.imshow("AI Mouse Controller (Advanced)", img)

        # Exit on 'q' or 'Esc'
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == 27:
            break

    # Cleanup
    cap.release()
    cv2.destroyAllWindows()
    if is_left_down:
        pyautogui.mouseUp()
    print("Application Exited Gracefully.")

if __name__ == "__main__":
    main()
