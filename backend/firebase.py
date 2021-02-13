import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use the application default credentials
cred = credentials.Certificate("firebaseservice.json")
firebase_admin.initialize_app(cred)


db = firestore.client()

doc_ref = db.collection(u'users').document()
doc_ref.set({
    u'first': u'Alice',
    u'last': u'Boomer',
    u'born': 1945,
})

