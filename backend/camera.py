import cv2
from imutils.video import VideoStream
import time

print("[INFO] opening ip camera feed...")
vs = VideoStream("http://admin:750801@98.199.131.202/videostream.cgi?rate=0").start()
time.sleep(2.0)

while True:
    # show the output frame
    frame = vs.read()
    cv2.imshow("Frame", frame)
    key = cv2.waitKey(1) & 0xFF

    # if the `q` key was pressed, break from the loop
    if key == ord("q"):
        break
    time.sleep(0.025)

vs.stop()
cv2.destroyAllWindows()