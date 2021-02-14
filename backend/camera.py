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
import json

config = json.load(open('config.json'))

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
vs = VideoStream(config["camera"]).start()
time.sleep(2.0)


idx_to_coordinates = {}
history_cache = deque([])              # max size will be 20, stores past 20 frame statuses
drink_cache = deque([])              # max size will be 20, stores past 20 frame statuses
position_cache = (-1,-1)
isTesting = False #test 2 is to ask user to sit down, stand up, and walk for 20 seconds, test 1 is to ask the user to sit down and stand up for 20 seconds
testNum = -1 # This stores test 1 or test 2
frameRate = 25
speedThresh = 3*10*frameRate*1.5
speedCounter=0 #once this counter reaches X, the user has walked enough (10 m) and we can stop the timer
test_cache = [] # max size will be 20*framerate, stores past 20 seconds statuses
prevStatus = "unknown"
test_start = None

startingPos = (-1,-1)
endingPos = (-1,-1)

changes=0 #stores number of changes for task 1

recordCounter = 0 #records number of frames the vid recorder is recording
def startTest(num): #num is test num
    global isTesting
    global vid_writer
    global testNum
    global testCounter, history_cache
    history_cache=deque([])
    testCounter=0
    vid_writer = cv2.VideoWriter("{}.avi".format(datetime.now().strftime('%f')),cv2.VideoWriter_fourcc('M','J','P','G'), 15, (640,640))
    # vid_writer = cv2.VideoWriter("{}.mp4".format(datetime.now().strftime('%f')) , 0x7634706d , 22, (640,640))
    isTesting = True
    testNum = num
    global speedCounter
    speedCounter=0
    global changes
    changes=0
    global recordCounter
    recordCounter=0

def endTest():
    global isTesting
    global vid_writer
    global test_cache
    global testCounter
    testCounter=0
    vid_writer.release()
    test_cache = []
    isTesting = False
    
def allSame(): # analyze the past 20 frames
    global history_cache
    prev = None
    for status in history_cache:
        if prev == None:
            prev = status
        elif prev != status:
            return False
    return True

def drinkSame(): # analyze the past 20 frames
    global drink_cache
    prev = None
    for status in drink_cache:
        if prev == None:
            prev = status
        elif prev != status:
            return False
    return True

def cache(status):
    global history_cache, isTesting
    history_cache.append(status)
    if isTesting:
        if len(history_cache) == 5:
            history_cache.popleft()
    else:
        if len(history_cache) == 10:
            history_cache.popleft()

def cacheDrink(status):
    global drink_cache, isTesting
    drink_cache.append(status)
    if len(drink_cache) == 5:
        drink_cache.popleft()

def task1_analysis(status,image):
    global test_cache
    global changes
    global recordCounter, test_start
    if status!="moving":# and status!="falling":
        test_cache.append(status)
        if len(test_cache)>=2 and (test_cache[len(test_cache)-2]=="standing" and status=="sitting") or (test_cache[len(test_cache)-2]=="sitting" and status=="standing"):
            changes+=1
            print(changes)
    '''
    if changes>=12:
        endTest()
        score=100
        updateTask(1,score) #low risk, score of 100
    '''
    image = cv2.putText(image, "Number of sits: "+str(changes/2), (20,80), cv2.FONT_HERSHEY_SIMPLEX ,  
                    1, (0,0,255), 1, cv2.LINE_AA)
    # if recordCounter == 30*frameRate:#code to analyze the test_cache for evidence of task completion
    if dif_sec(test_start, datetime.now()) >= 30:
        endTest()
        updateTask(1,changes/2) #higher risk, score decreases linearly
        # sit up and sit down repeatedly
    return image

def task2_analysis(speed,image):
    global speedCounter
    global test_cache
    global recordCounter
    #test_cache.append(status)
    speedCounter+=speed
    print(speedCounter)
    score = speedCounter/speedThresh*10 #This is in meters
    
    '''
    if speedCounter>=speedThresh:
        endTest()
        score=100
        updateTask(2,score)#low risk
        image = cv2.putText(image, "Score: "+str(score), (20,80), cv2.FONT_HERSHEY_SIMPLEX ,  
                    1, (0,0,255), 1, cv2.LINE_AA)
    '''
    image = cv2.putText(image, "Meters traveled: "+str(score), (20,80), cv2.FONT_HERSHEY_SIMPLEX ,  
                    1, (0,0,255), 1, cv2.LINE_AA)
    if score>=10:
        endTest()
        
        updateTask(2,dif_sec(test_start, datetime.now()))#higher risk, 
    # if recordCounter>=12*frameRate:
    if dif_sec(test_start, datetime.now()) >= 30:
        endTest()
        
        updateTask(2,30)#higher risk, 
        
    return image

def test_cache_add(status, image, speed):
    global testNum
    if status=="fallen":
        updateTask(testNum,0)
        global isTesting
        isTesting=False
        return
    
    
    global recordCounter
    recordCounter+=1
    # print(recordCounter)
    if testNum==1:
        image = task1_analysis(status,image)
    if testNum==2:
        image = task2_analysis(speed,image)     
    
    global vid_writer
    vid_writer.write(image)
    return image
            
def add_position(tup):
    global position_cache
    position_cache=tup

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
    
    #This will test lying down frontal
    # compare dist btwn shoulder and knee to previous frames? This part doesn't matter too much
    
    #This will test lying down, where legs are angled
    knee_shoulder_vector = np.subtract(mid_shoulder,mid_knee)
    knee_shoulder_angle=90
    if knee_shoulder_vector[0]!=0:
        knee_shoulder_angle = abs(180*np.arctan(knee_shoulder_vector[1]/knee_shoulder_vector[0])/math.pi)
    hip_shoulder_vector = np.subtract(mid_shoulder,mid_hip)
    hip_shoulder_angle=90
    if hip_shoulder_vector[0]!=0:
        hip_shoulder_angle = abs(180*np.arctan(hip_shoulder_vector[1]/hip_shoulder_vector[0])/math.pi)
    
    #Determines center of torso, uses this for velocity determination
    cm = np.divide(np.add(mid_shoulder,mid_hip),2)
    global position_cache
    vec = (-999,-999)
    speed = -1
    if position_cache[0]!=-1:
        vec = (np.subtract(cm,position_cache))
        speed = math.sqrt(sum(np.square(vec)))
    add_position(cm)
    
    mp_drawing.draw_landmarks(
        image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

    # font 
    font = cv2.FONT_HERSHEY_SIMPLEX 
    
    # org 
    org = (20, 20) 
    
    # fontScale 
    fontScale = 1
    
    # Blue color in BGR 
    color = (0, 0, 255) 
    
    # Line thickness of 2 px 
    thickness = 2
    #Determine if hand is close to mouth for water
    mid_mouth = np.divide(np.add(idx_to_coordinates[MOUTH_LEFT],idx_to_coordinates[MOUTH_RIGHT]),2)
    l_hand_dist = math.sqrt(sum(np.square(np.subtract(mid_mouth,idx_to_coordinates[LEFT_WRIST]))))
    r_hand_dist = math.sqrt(sum(np.square(np.subtract(mid_mouth,idx_to_coordinates[RIGHT_WRIST]))))
    # print(l_hand_dist, r_hand_dist)
    if l_hand_dist<25 or r_hand_dist<25:
        cacheDrink("Drinking")
        if drinkSame() and isTesting==False:
            # print("drinking")
            server_drink()
            image = cv2.putText(image, "Drinking", (20,80), font,  
                    fontScale, color, thickness, cv2.LINE_AA)
    else:
        cacheDrink("Not Drinking")
    
    '''
    image = cv2.putText(image, "vel[1]: "+str(vec[1]), org, font,  
                    fontScale, color, thickness, cv2.LINE_AA)
    image = cv2.putText(image, "Speed: "+str(speed), (20,500), font,  
                    fontScale, color, thickness, cv2.LINE_AA)
    
    image = cv2.putText(image, "L leg angle: "+str(l_leg_angle), (20,500), font,  
                    fontScale, color, thickness, cv2.LINE_AA)
    image = cv2.putText(image, "R leg angle: "+str(r_leg_angle), (20,530), font,  
                    fontScale, color, thickness, cv2.LINE_AA)
    image = cv2.putText(image, "knee shoulder angle: "+str(knee_shoulder_angle), (20,560), font,  
                    fontScale, color, thickness, cv2.LINE_AA)
    image = cv2.putText(image, "hip shoulder angle: "+str(hip_shoulder_angle), (20,590), font,  
                    fontScale, color, thickness, cv2.LINE_AA)
    '''
    status =""
    '''
    if vec[1]>3:
        #In the act of falling
        # image = cv2.putText(image, "Falling", (20,120), font,  
        #             fontScale, color, thickness, cv2.LINE_AA)
        status="falling"
        cache(status)
    
    if abs(vec[0])>2:# Ideally the speed should be normalized to some reference, like the distance between the eyes (but this changes with rotation too). Also this doesn't work with frontal walking, only side walking. In fact frontal walking will be detected as falling
        #walking/moving
        # image = cv2.putText(image, "Moving", (20,80), font,  
        #             fontScale, color, thickness, cv2.LINE_AA)
        status="moving"
        cache(status)
        #@Steven need to create endpoint for movement
    '''
    if knee_shoulder_angle<45 and hip_shoulder_angle<45:
        # image = cv2.putText(image, "Fallen over", (20,80), font,  
        #             fontScale, color, thickness, cv2.LINE_AA)
        status="fallen"
        cache(status)
        if allSame():
            start_fall()
    elif ratio<0.5 or (l_leg_angle<60 and r_leg_angle<60):
        # image = cv2.putText(image, "Sitting down", (20,50), font,  
        #             fontScale, color, thickness, cv2.LINE_AA)
        status="sitting"
        cache(status)
        if allSame():
            start_sit()
    else:
        # image = cv2.putText(image, "Standing up", (20,50), font,  
        #             fontScale, color, thickness, cv2.LINE_AA)
        status="standing"
        cache(status)
        if allSame():
            start_stand()
    
    global prevStatus
    if allSame():
        prevStatus = status
    
    image = cv2.putText(image, prevStatus, (20,50), font,  
             fontScale, color, thickness, cv2.LINE_AA)
    if isTesting:
        '''
        global startingPos
        global endingPos
        global testCounter
        if testCounter==0:
            startingPos = cm
        if testCounter>=3*frameRate and speed<25: #assuming the person moves within 3 seconds
            endingPos = cm
        '''
        image = test_cache_add(prevStatus,image, speed)
        # testCounter+=1
    
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
            if allSame():
                global prevStatus
                prevStatus = "unknown"
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

@app.route("/start_task1")
def start_task1():
    global test_start
    test_start = datetime.now()
    startTest(1)
    server_test1()
    return 'Success'

@app.route("/start_task2")
def start_task2():
    global test_start
    test_start = datetime.now()
    startTest(2)
    server_test2()
    return 'Success'

if __name__ == '__main__':
    # start a thread that will perform motion detection
    t = threading.Thread(target=start_monitor)
    t.daemon = True
    analytics = threading.Thread(target=minute_updates)
    analytics.daemon = True

    t.start()
    analytics.start()

    # start the flask app
    app.run(debug=True, threaded=True, use_reloader=False)

# release the video stream pointer
vs.stop()