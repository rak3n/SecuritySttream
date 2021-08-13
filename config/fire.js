import firebase from "firebase";
var config = {
    ////PASTE YOUR FIREBASE CONFIG HERE
  };
firebase.initializeApp(config);
export const database = firebase.database();
