import firebase from "firebase";
var config = {
    apiKey: "AIzaSyDn-HvUfAziiHBoiJoWFs3lMq83_m2Wo3E",
    authDomain: "tusc-91a8b.firebaseapp.com",
    databaseURL: "https://tusc-91a8b.firebaseio.com/",//"https://tusc-91a8b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tusc-91a8b",
    storageBucket: "tusc-91a8b.appspot.com",
    messagingSenderId: "457922047997",
    appId: "1:457922047997:web:0d4b34a140fff9f5b3b394",
  };
firebase.initializeApp(config);
export const database = firebase.database();
