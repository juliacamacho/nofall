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
from camera import analyze_frames


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

fvs = FileVideoStream("VID_20210213_100011_Trim.mp4").start()
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

vid_writer = cv2.VideoWriter("output3.avi",cv2.VideoWriter_fourcc('M','J','P','G'), 15, (image.shape[1],image.shape[0]))

idx_to_coordinates = {}
  
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
  image1 = analyze_frames(image)
  if image1 is None:
      continue
  cv2.imshow('MediaPipe Pose', image1)
  vid_writer.write(image1)
  if cv2.waitKey(5) & 0xFF == 27:
    break
pose.close()
vid_writer.release()