// src/services/firebase.ts
// This file is responsible for initializing Firebase services.

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import '@react-native-firebase/database';
import '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "project-name.firebaseapp.com",
  projectId: "project-name",
  storageBucket: "project-name.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123def456"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

// Export the initialized services for use in other parts of the app.
export const firebaseAuth = auth();
// In the future, we could export other services like this:
// export const firestoreDB = firestore();
// export const realtimeDB = database();
