import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyBnC2lrj8PdB1j1QX3Q_EIdqN7rXy5PBtY',
  authDomain: 'metabolism-salo.firebaseapp.com',
  databaseURL: 'https://metabolism-salo.firebaseio.com',
  projectId: 'metabolism-salo',
  storageBucket: 'metabolism-salo.appspot.com',
  messagingSenderId: '2456773126',
};

const firebaseApp = firebase.initializeApp(config);
const settings = {
  /* your settings... */ timestampsInSnapshots: true,
};
firebase.firestore().settings(settings);

// Enables offline data, which is required for PWA's.
firebase.firestore().enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  });
// Subsequent queries will use persistence, if it was enabled successfully

export default firebaseApp.firestore();
