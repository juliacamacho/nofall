import math
from typing import List, Tuple, Union

import cv2
import dataclasses
import numpy as np

from mediapipe.framework.formats import landmark_pb2

import cv2
import mediapipe as mp

from imutils.video import FileVideoStream
import imutils
import numpy as np
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose


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



# For webcam input:
pose = mp_pose.Pose(
    min_detection_confidence=0.5, min_tracking_confidence=0.5)

fvs = FileVideoStream("VID_20210212_212511_Trim.mp4").start()
image = fvs.read()

if image.shape[1]<image.shape[0]: #width is smaller than height
    image = imutils.resize(image, height=640)
    image = cv2.copyMakeBorder( image, 0, 0, int((image.shape[0]-image.shape[1])/2), int((image.shape[0]-image.shape[1])/2), cv2.BORDER_CONSTANT)
          
if image.shape[1]>image.shape[0]: #height is smaller than width
    image = imutils.resize(image, width=640)
    image = cv2.copyMakeBorder( image, int((image.shape[1]-image.shape[0])/2), int((image.shape[1]-image.shape[0])/2),0, 0, cv2.BORDER_CONSTANT)
          
frameWidth = image.shape[1]
frameHeight = image.shape[0]

aspect_ratio = frameWidth/frameHeight

vid_writer = cv2.VideoWriter("output.avi",cv2.VideoWriter_fourcc('M','J','P','G'), 15, (image.shape[1],image.shape[0]))

idx_to_coordinates = {}
#entire_list = []
while fvs.more():
  image = fvs.read()
  if image is None:
        cv2.waitKey(1)
        break
  if cv2.waitKey(1) & 0xFF == ord('q'):
        break
  if image.shape[1]<image.shape[0]: #width is smaller than height
    image = imutils.resize(image, height=640)
    image = cv2.copyMakeBorder( image, 0, 0, int((image.shape[0]-image.shape[1])/2), int((image.shape[0]-image.shape[1])/2), cv2.BORDER_CONSTANT)
          
  if image.shape[1]>image.shape[0]: #height is smaller than width
    image = imutils.resize(image, width=640)
    image = cv2.copyMakeBorder( image, int((image.shape[1]-image.shape[0])/2), int((image.shape[1]-image.shape[0])/2),0, 0, cv2.BORDER_CONSTANT)

  # Flip the image horizontally for a later selfie-view display, and convert
  # the BGR image to RGB.
  image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
  # To improve performance, optionally mark the image as not writeable to
  # pass by reference.
  image.flags.writeable = False
  results = pose.process(image)

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
  #entire_list.append(idx_to_coordinates)
  #print(idx_to_coordinates[LEFT_SHOULDER])
  mid_shoulder = np.divide(np.add(idx_to_coordinates[LEFT_SHOULDER],idx_to_coordinates[RIGHT_SHOULDER]),2)
  print(mid_shoulder)
  mid_hip = np.divide(np.add(idx_to_coordinates[LEFT_HIP],idx_to_coordinates[RIGHT_HIP]),2)
  mid_knee = np.divide(np.add(idx_to_coordinates[LEFT_KNEE],idx_to_coordinates[RIGHT_KNEE]),2)
  ratio = math.sqrt(sum(np.square(np.subtract(mid_hip,mid_knee))))/math.sqrt(sum(np.square(np.subtract(mid_shoulder,mid_hip))))#distance between hip and knee/distance between hip and shoulder
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
  if ratio<0.5:
      image = cv2.putText(image, "Sitting down", (20,50), font,  
                   fontScale, color, thickness, cv2.LINE_AA)
  else:
      image = cv2.putText(image, "Standing up", (20,50), font,  
                   fontScale, color, thickness, cv2.LINE_AA)
  cv2.imshow('MediaPipe Pose', image)
  vid_writer.write(image)
  if cv2.waitKey(5) & 0xFF == 27:
    break
pose.close()
vid_writer.release()