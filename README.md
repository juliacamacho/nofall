# NoFall

NoFall is the all-in-one solution for remote caregiving for the elderly, with smart ambient activity monitoring, proactive risk assessments, fall detection, and mobile alerts.

![](https://i.imgur.com/nPR68Fj.png)

# About the project

## Inspiration

Falls are the leading cause of injury and death among seniors in the US and cost over $60 billion in medical expenses every year. With every one in four seniors in the US experiencing a fall each year, attempts at prevention are badly needed and are currently implemented through careful monitoring and caregiving. However, in the age of COVID-19 (and even before), remote caregiving has been a difficult and time-consuming process: caregivers must either rely on updates given by the senior themselves or monitor a video camera or other device 24/7. Tracking day-to-day health and progress is nearly impossible, and maintaining and improving strength and mobility presents unique challenges.

Having personally experienced this exhausting process in the past, our team decided to create an all-in-one tool that helps prevent such devastating falls from happening and makes remote caregivers' lives easier.

## What it does

NoFall enables smart ambient activity monitoring, proactive risk assessments, a mobile alert system, and a web interface to tie everything together.

### **Ambient activity monitoring**

NoFall continuously watches and updates caregivers with the condition of their patient through an online dashboard. The activity section of the dashboard provides the following information:

- Current action: sitting, standing, not in area, fallen, etc.
- How many times the patient drank water and took their medicine
- Graph of activity throughout the day, annotated with key events
- Histogram of stand-ups per hour
- Daily activity goals and progress score
- Alerts for key events

### **Proactive risk assessment**

Using the powerful tools offered by Google Cloud, a proactive risk assessment can be activated with a simple voice query to a smart speaker like Google Home. When starting an assessment, our algorithms begin analyzing the user's movements against a standardized medical testing protocol for screening a patient's risk of falling. The screening consists of two tasks:

1. Timed Up-and-Go (TUG) test. The user is asked to sit up from a chair and walk 10 feet. The user is timed, and the timer stops when 10 feet has been walked. If the user completes this task in over 12 seconds, the user is said to be of at a high risk of falling.
2. 30-second Chair Stand test: The user is asked to stand up and sit down on a chair repeatedly, as fast as they can, for 30 seconds. If the user not is able to sit down more than 12 times (for females) and 14 times (for males), they are considered to be at a high risk of falling.

The videos of the tests are recorded and can be rewatched on the dashboard. The caregiver can also view the results of tests in the dashboard in a graph as a function of time.

### **Mobile alert system**

When the user is in a fallen state, a warning message is displayed in the dashboard and texted using SMS to the assigned caregiver's phone. 

## How we built it

### **Frontend**

The frontend was built using React and styled using TailwindCSS. All data is updated from Firestore in real time using listeners, and new activity and assessment goals are also instantly saved to the cloud. 

Alerts are also instantly delivered to the web dashboard and caretakers' phones using IFTTT's SMS Action. 

We created voice assistant functionality through Amazon Alexa skills and Google home routines. A voice command triggers an IFTTT webhook, which posts to our Flask backend API and starts risk assessments.

### **Backend**

**Model determination and validation**

To determine the pose of the user, we utilized Google's MediaPipe library in Python. We decided to use the BlazePose model, which is lightweight and can run on real-time security camera footage. The BlazePose model is able to determine the pixel location of 33 landmarks of the body, corresponding to the hips, shoulders, arms, face, etc. given a 2D picture of interest. We connected the real-time streaming from the security camera footage to continuously feed frames into the BlazePose model. Our testing confirmed the ability of the model to determine landmarks despite occlusion and different angles, which would be commonplace when used on real security camera footage. 

**Ambient sitting, standing, and falling detection**

To determine if the user is sitting or standing, we calculated the angle that the knees make with the hips and set a threshold, where angles (measured from the horizontal) less than that number are considered sitting. To account for the angle where the user is directly facing the camera, we also determined the ratio of the hip-to knee length to the hip-to-shoulder length, reasoning that the 2D landmarks of the knees would be closer to the body when the user is sitting. To determine the fallen status, we determined if the center of the shoulders and the center of the knees made an angle less than 45 degrees for over 20 frames at once. If the legs made an angle greater than a certain threshold (close to 90 degrees), we considered the user to be standing. Lastly, if there was no detection of landmarks, we considered the status to be unknown (the user may have left the room/area). Because of the different possible angles of the camera, we also determined the perspective of the camera based on the convergence of straight lines (the straight lines are determined by a Hough transformation algorithm). The convergence can indicate how angled the camera is, and the thresholds for the ratio of lengths can be mathematically transformed accordingly.

[Fall detection video](https://i.imgur.com/oKNJVfr.mp4)

![](https://i.imgur.com/Cjyohos.gif)

**Proactive risk assessment analysis**

To analyze timed up-and-go tests, we first determined if the user is able to change his or her status from sitting to standing, and then determined the distance the user has traveled by determining the speed from finite difference calculation of the velocity from the previous frame. The pixel distance was then transformed based on the distance between the user's eyes and the height of the user (which is pre-entered in our website) to determine the real-world distance the user has traveled. Once the user reaches 10 meters cumulative distance traveled, the timer stops and is reported to the server.

To analyze 30-second chair stand tests, the number of transitions between sitting and standing were counted. Once 30 seconds has been reached, the number of times the user sat down is half of the number of transitions, and the data is sent to the server.

## Challenges we ran into

- Figuring out port forwarding with barebones IP camera, then streaming the video to the world wide web for consumption by our model.
- Calibrating the tests (time limits, excessive movements) to follow the standards outlined by research. We had to come up with a way to mitigate random errors that could trigger fast changes in sitting and standing.
- Converting recorded videos to a web-compatible format. The videos saved by python's video recording package was only compatible with saving .avi videos, which was not compatible with the web. We had to use scripted ffmpeg to dynamically convert the videos into .mp4
- Live streaming the processed Python video to the front end required processing frames with ffmpeg and a custom streaming endpoint.
- Determination of a model that works on realtime security camera data: we tried Openpose, Posenet, tf-pose-estimation, and other models, but finally we found that MediaPipe was the only model that could fit our needs

## Accomplishments that we're proud of

- Making the model ignore the noisy background, bad quality video stream, dim lighting
- Fluid communication from backend to frontend with live updating data
- Great team communication and separation of tasks

## What we learned

- How to use IoT to simplify and streamline end-user processes.
- How to use computer vision models to analyze pose and velocity from a reference length
- How to display data in accessible, engaging, and intuitive formats

## What's next for NoFall

We're proud of all the features we have implemented with NoFall and are eager to implement more. In the future, we hope to generalize to more camera angles (such as a bird's-eye view), support lower-light and infrared ambient activity tracking, enable obstacle detection, monitor for signs of other conditions (heart attack, stroke, etc.) and detect more therapeutic tasks, such as daily cognitive puzzles for fighting dementia. 

## Built with

*What languages, frameworks, platforms, cloud services, databases, APIs, or other technologies did you use?*

React, Tailwind CSS, Firestore, Python, Flask, TensorFlow, MediaPipe, IFTTT
