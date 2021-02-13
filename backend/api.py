import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
# from flask import Flask
from datetime import datetime
import time
import threading

# app = Flask(__name__)

cred = credentials.Certificate("firebaseservice.json")
firebase_admin.initialize_app(cred)


db = firestore.client()

doc_ref = db.collection(u'users').document('gwmg2hLSPUxzx3PKbj5r')
# doc_ref.set({
#     u'first': u'Alice',
#     u'last': u'Boomer',
#     u'born': 1945,
# })
start = 0

# @app.route('/start-sit', methods=['GET'])
def start_sit():
    doc_ref.update({
        u'status': u'SITTING',
    })
    return 'SUCCESS'

# @app.route('/start-stand', methods=['GET'])
def end_sit():
    doc_ref.update({
        u'status': u'STANDING',
    })
    return 'SUCCESS'


# def minute_updates():
#     while True:
#         print("updating stats")

#         time.sleep(60)
 


# x = threading.Thread(target=minute_updates)
# x.start()