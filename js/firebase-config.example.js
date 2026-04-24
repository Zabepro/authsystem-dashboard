/* ============================================================
   FIREBASE-CONFIG.JS — Initialize Firebase
   
   1. Copy this file and rename it to: firebase-config.js
   2. Fill in your Firebase project credentials below
   3. Get credentials from: console.firebase.google.com
      → Your Project → Project Settings → Your Apps
   ============================================================ */

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",
  measurementId:     "YOUR_MEASUREMENT_ID",
};

firebase.initializeApp(firebaseConfig);

const FDB   = firebase.firestore();
const FAUTH = firebase.auth();

/* Enable offline persistence */
FDB.enablePersistence({ synchronizeTabs: true }).catch(() => {});

window.FDB   = FDB;
window.FAUTH = FAUTH;
