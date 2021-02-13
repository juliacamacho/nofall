import cv2
from imutils.video import VideoStream

import math
from typing import List, Tuple, Union
import dataclasses
import numpy as np

from mediapipe.framework.formats import landmark_pb2

import mediapipe as mp

from imutils.video import FileVideoStream
import imutils

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    min_detection_confidence=0.5, min_tracking_confidence=0.5)
import time
from datetime import datetime
import time
from flask import Flask
from flask import Response
import threading
from collections import deque
from api import *

NOSE = 0
RIGHT_EYE_INNER = 1
RIGHT_EYE = 2
RIGHT_EYE_OUTER = 3
LEFT_EYE_INNER = 4
LEFT_EYE = 5
LEFT_EYE_OUTER = 6
RIGHT_EAR = 7
LEFT_EAR = 8
MOUTH_RIGHT = 9
MOUTH_LEFT = 10
RIGHT_SHOULDER = 11
LEFT_SHOULDER = 12
RIGHT_ELBOW = 13
LEFT_ELBOW = 14
RIGHT_WRIST = 15
LEFT_WRIST = 16
RIGHT_PINKY = 17
LEFT_PINKY = 18
RIGHT_INDEX = 19
LEFT_INDEX = 20
RIGHT_THUMB = 21
LEFT_THUMB = 22
RIGHT_HIP = 23
LEFT_HIP = 24
RIGHT_KNEE = 25
LEFT_KNEE = 26

def _normalized_to_pixel_coordinates(
    normalized_x: float, normalized_y: float, image_width: int,
    image_height: int) -> Union[None, Tuple[int, int]]:
    """Converts normalized value pair to pixel coordinates."""

    # Checks if the float value is between 0 and 1.
    def is_valid_normalized_value(value: float) -> bool:
        return (value > 0 or math.isclose(0, value)) and (value < 1 or
                                                        math.isclose(1, value))

    if not (is_valid_normalized_value(normalized_x) and
            is_valid_normalized_value(normalized_y)):
        # TODO: Draw coordinates even if it's outside of the image bounds.
        return None
    x_px = min(math.floor(normalized_x * image_width), image_width - 1)
    y_px = min(math.floor(normalized_y * image_height), image_height - 1)
    return x_px, y_px


app = Flask(__name__)

outputFrame = None
lock = threading.Lock()

print("[INFO] opening ip camera feed...")
vs = VideoStream("http://admin:750801@98.199.131.202/videostream.cgi?rate=0").start()
time.sleep(2.0)


idx_to_coordinates = {}
history_cache = deque([])              # max size will be 20, stores past 20 statuses

def allSame():
    global history_cache
    prev = None
    for status in history_cache:
        if prev == None:
            prev = status
        elif prev != status:
            return False
    return True

def cache(status):
    global history_cache

    history_cache.append(status)
    if len(history_cache) == 20:
        history_cache.popleft()
            

def analyze_frames(image):
    
    
    # To improve performance, optionally mark the image as not writeable to
    # pass by reference.
    image.flags.writeable = False
    results = pose.process(image)
    if results.pose_landmarks is None:
        return None
    # Draw the pose annotation on the image.
    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    
    image_rows, image_cols, _ = image.shape
    for idx, landmark in enumerate(results.pose_landmarks.landmark):
        if landmark.visibility < 0 or landmark.presence < 0:
            continue
        landmark_px = _normalized_to_pixel_coordinates(landmark.x, landmark.y,
                                                    image_cols, image_rows)
        if landmark_px:
            idx_to_coordinates[idx] = landmark_px
    
    #This will test a frontal sit
    mid_shoulder = np.divide(np.add(idx_to_coordinates[LEFT_SHOULDER],idx_to_coordinates[RIGHT_SHOULDER]),2)
    # print(mid_shoulder)
    mid_hip = np.divide(np.add(idx_to_coordinates[LEFT_HIP],idx_to_coordinates[RIGHT_HIP]),2)
    mid_knee = np.divide(np.add(idx_to_coordinates[LEFT_KNEE],idx_to_coordinates[RIGHT_KNEE]),2)
    ratio = math.sqrt(sum(np.square(np.subtract(mid_hip,mid_knee))))/math.sqrt(sum(np.square(np.subtract(mid_shoulder,mid_hip))))#distance between hip and knee/distance between hip and shoulder
    
    #This will test side sit, where legs are angled
    l_leg_vector = np.subtract(idx_to_coordinates[LEFT_HIP],idx_to_coordinates[LEFT_KNEE])
    l_leg_angle=90
    if l_leg_vector[0]!=0:
        l_leg_angle = abs(180*np.arctan(l_leg_vector[1]/l_leg_vector[0])/math.pi)
    
    r_leg_vector = np.subtract(idx_to_coordinates[RIGHT_HIP],idx_to_coordinates[RIGHT_KNEE])
    r_leg_angle=90
    if r_leg_vector[0]!=0:
        r_leg_angle = abs(180*np.arctan(r_leg_vector[1]/r_leg_vector[0])/math.pi)
    
    #This will test lying down
    knee_shoulder_vector = np.subtract(mid_shoulder,mid_knee)
    knee_shoulder_angle=90
    if knee_shoulder_vector[0]!=0:
        knee_shoulder_angle = abs(180*np.arctan(knee_shoulder_vector[1]/knee_shoulder_vector[0])/math.pi)
    hip_shoulder_vector = np.subtract(mid_shoulder,mid_hip)
    hip_shoulder_angle=90
    if hip_shoulder_vector[0]!=0:
        hip_shoulder_angle = abs(180*np.arctan(hip_shoulder_vector[1]/hip_shoulder_vector[0])/math.pi)
    
    mp_drawing.draw_landmarks(
        image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
    # font 
    font = cv2.FONT_HERSHEY_SIMPLEX 
    
    # org 
    org = (20, 20) 
    
    # fontScale 
    fontScale = 1
    
    # Blue color in BGR 
    color = (255, 0, 0) 
    
    # Line thickness of 2 px 
    thickness = 2
    '''
    image = cv2.circle(image, (int(mid_shoulder[0]),int(mid_shoulder[1])), 2, (255, 0, 0) , -1)
    image = cv2.circle(image, (int(mid_hip[0]),int(mid_hip[1])), 2, (0, 255, 0) , -1)
    image = cv2.circle(image, (int(mid_knee[0]),int(mid_knee[1])), 2, (0, 0, 255) , -1)
    '''
    image = cv2.putText(image, "Ratio: "+str(ratio), org, font,  
                    fontScale, color, thickness, cv2.LINE_AA)
    image = cv2.putText(image, "L leg angle: "+str(l_leg_angle), (20,500), font,  
                    fontScale, color, thickness, cv2.LINE_AA)
    image = cv2.putText(image, "R leg angle: "+str(r_leg_angle), (20,530), font,  
                    fontScale, color, thickness, cv2.LINE_AA)
    image = cv2.putText(image, "knee shoulder angle: "+str(knee_shoulder_angle), (20,560), font,  
                    fontScale, color, thickness, cv2.LINE_AA)
    image = cv2.putText(image, "hip shoulder angle: "+str(hip_shoulder_angle), (20,590), font,  
                    fontScale, color, thickness, cv2.LINE_AA)
    if knee_shoulder_angle<45 and hip_shoulder_angle<45:
        image = cv2.putText(image, "Fallen over", (20,80), font,  
                    fontScale, color, thickness, cv2.LINE_AA)
        cache("fallen")
        if allSame():
            start_fall()
    elif ratio<0.5 or l_leg_angle<60 or r_leg_angle<60:
        image = cv2.putText(image, "Sitting down", (20,50), font,  
                    fontScale, color, thickness, cv2.LINE_AA)
        cache("sitting")
        if allSame():
            start_sit()
    else:
        image = cv2.putText(image, "Standing up", (20,50), font,  
                    fontScale, color, thickness, cv2.LINE_AA)
        cache("standing")
        if allSame():
            start_stand()
    return image

def start_monitor(): 
    global vs, outputFrame, lock

    while True:
        # show the output frame
        image = vs.read()
        if image is None:
            continue
        # cv2.imshow("Frame", frame)
        if image.shape[1]<image.shape[0]: #width is smaller than height
            image = imutils.resize(image, height=640)
            image = cv2.copyMakeBorder( image, 0, 0, int((image.shape[0]-image.shape[1])/2), int((image.shape[0]-image.shape[1])/2), cv2.BORDER_CONSTANT)
            
        if image.shape[1]>image.shape[0]: #height is smaller than width
            image = imutils.resize(image, width=640)
            image = cv2.copyMakeBorder( image, int((image.shape[1]-image.shape[0])/2), int((image.shape[1]-image.shape[0])/2),0, 0, cv2.BORDER_CONSTANT)
    
        # Flip the image horizontally for a later selfie-view display, and convert
        # the BGR image to RGB.
        image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
        image1 = analyze_frames(image)
        if image1 is None:
            cache("unknown")
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            if allSame():
                unknown_status()
            with lock:
                outputFrame = image.copy()
            continue
        # cv2.imshow('MediaPipe Pose', image)

        # time.sleep(0.025)
        with lock:
            outputFrame = image1.copy()

def generate():
	# grab global references to the output frame and lock variables
	global outputFrame, lock
	# loop over frames from the output stream
	while True:
		# wait until the lock is acquired
		with lock:
			# check if the output frame is available, otherwise skip
			# the iteration of the loop
			if outputFrame is None:
				continue
			# encode the frame in JPEG format
			(flag, encodedImage) = cv2.imencode(".jpg", outputFrame)
			# ensure the frame was successfully encoded
			if not flag:
				continue
		# yield the output frame in the byte format
		yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + 
			bytearray(encodedImage) + b'\r\n')

@app.route("/video_feed")
def video_feed():
	# return the response generated along with the specific media
	# type (mime type)
	return Response(generate(),
		mimetype = "multipart/x-mixed-replace; boundary=frame")

if __name__ == '__main__':
	# start a thread that will perform motion detection
	t = threading.Thread(target=start_monitor)
	t.daemon = True
	t.start()
	# start the flask app
	app.run(debug=True, threaded=True, use_reloader=False)

# release the video stream pointer
vs.stop()