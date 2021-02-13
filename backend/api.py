import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin.firestore import SERVER_TIMESTAMP
# from flask import Flask
from datetime import datetime
import time
import threading

# app = Flask(__name__)

cred = credentials.Certificate("firebaseservice.json")
firebase_admin.initialize_app(cred)


db = firestore.client()

min_total_sit = 0
min_sit_start = None
min_times_stood = 0

doc_ref = db.collection(u'users').document('gwmg2hLSPUxzx3PKbj5r')
alerts_ref = doc_ref.collection('alerts')
logs_ref = doc_ref.collection('logs')
# doc_ref.set({
#     u'first': u'Alice',
#     u'last': u'Boomer',
#     u'born': 1945,
# })
state = "standing"

def dif_sec(time1, time2):
    elapsed = time2-time1
    # dayseconds = 24 *60 *60
    
    # timedelta(0, 8, 562000)

    # minute, sec = divmod(elapsed.seconds, 60)
    return elapsed.seconds

# @app.route('/start-sit', methods=['GET'])
def start_sit():
    global state, doc_ref, alerts_ref, min_total_sit, min_sit_start
    if state != "sitting":
        if state == "fallen":
            alerts_ref.document().set({
                "message": "James has sat back up",
                "newStatus": "Sitting",
                "timestamp": SERVER_TIMESTAMP,
                "type": "recovered"
            })

        min_sit_start = datetime.now()
        state = "sitting"
        doc_ref.update({
            u'status': u'Sitting',
        })


# @app.route('/start-stand', methods=['GET'])
def start_stand():
    global state, doc_ref, alerts_ref, min_total_sit, min_sit_start, min_times_stood
    if state != "standing":
        if state == "fallen":
            # send alert that stood up
            alerts_ref.document().set({
                "message": "James has stood back up",
                "newStatus": "Standing",
                "timestamp": SERVER_TIMESTAMP,
                "type": "recovered"
            })
        if state == "sitting":
            # went from sitting to standing, update the time this minute spent sitting
            if min_sit_start != None:
                end = datetime.now()
                min_total_sit += dif_sec(min_sit_start, end)
                min_sit_start = None
        min_times_stood += 1
        state = "standing"
        doc_ref.update({
            u'status': u'Standing',
        })

def start_fall():
    global state, doc_ref, alerts_ref
    if state != "fallen":
        state = "fallen"
        doc_ref.update({
            u'status': u'Fallen',
        })
        alerts_ref.document().set({
            "message": "James appears to have fallen down!",
            "newStatus": "fallen",
            "timestamp": SERVER_TIMESTAMP,
            "type": "alert"
        })

def unknown_status():
    global state, doc_ref
    if state != "unknown":
        state = "unknown"
        doc_ref.update({
            u'status': u'Unknown',
        })


def minute_updates():
    global state, doc_ref, min_total_sit, min_sit_start, logs_ref, min_times_stood

    minutely_history = [0]
    stood_history = [0] * 24
    for i in range(1440):
        print("updating stats")
        
        if min_sit_start != None:
            # we ended the minute sitting
            end = datetime.now()
            min_total_sit += dif_sec(min_sit_start, end)

            if state == "unknown":
                min_sit_start = None
            else:
                min_sit_start = datetime.now()
        
        # if we ended standing, we already accounted for the minute
        cul_seconds = minutely_history[-1]
        minutely_history.append(cul_seconds+ min(min_total_sit, 60))

        # times stood up
        hr = int(i/60)
        stood_history[hr] += min_times_stood

        logs_ref.document('LYFQJFgzO0vsij7DBXqy').update({
            u'minutely': minutely_history,
            u'standFreq': stood_history,
        })
        min_total_sit = 0
        min_times_stood = 0
        time.sleep(60)
 
if __name__ == "__main__":
    start = datetime.now()
    time.sleep(61)
    end = datetime.now()
    print(dif_sec(start, end))

# x = threading.Thread(target=minute_updates)
# x.start()