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

doc_ref = db.collection(u'users').document('gwmg2hLSPUxzx3PKbj5r')
log_ref = doc_ref.collection('logs')
# doc_ref.set({
#     u'first': u'Alice',
#     u'last': u'Boomer',
#     u'born': 1945,
# })
state = "standing"
# @app.route('/start-sit', methods=['GET'])
def start_sit():
    global state, doc_ref
    if state != "sitting":
        state = "sitting"
        doc_ref.update({
            u'status': u'Sitting',
        })

# @app.route('/start-stand', methods=['GET'])
def start_stand():
    global state, doc_ref
    if state != "standing":
        state = "standing"
        doc_ref.update({
            u'status': u'Standing',
        })

def start_fall():
    global state, doc_ref, log_ref
    if state != "fallen":
        state = "fallen"
        doc_ref.update({
            u'status': u'Fallen',
        })
        log_ref.document().set({
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


# def minute_updates():
#     while True:
#         print("updating stats")

#         time.sleep(60)
 


# x = threading.Thread(target=minute_updates)
# x.start()