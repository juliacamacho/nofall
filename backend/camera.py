import cv2
from imutils.video import VideoStream
import time
from datetime import datetime
import time
from flask import Flask
from flask import Response
import threading

app = Flask(__name__)

outputFrame = None
lock = threading.Lock()

print("[INFO] opening ip camera feed...")
vs = VideoStream("http://admin:750801@98.199.131.202/videostream.cgi?rate=0").start()
time.sleep(2.0)

def start_monitor(): 
    global vs, outputFrame, lock

    while True:
        # show the output frame
        frame = vs.read()
        # cv2.imshow("Frame", frame)
        # key = cv2.waitKey(1) & 0xFF

        # # if the `q` key was pressed, break from the loop
        # if key == ord("q"):
        #     break

        time.sleep(0.025)
        with lock:
            outputFrame = frame.copy()

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