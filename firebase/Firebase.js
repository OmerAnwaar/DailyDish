import * as firebase from "firebase";
// import * as all from "firebase/firestore";
import "firebase/auth";
import 'firebase/firestore'


//import fire from "firebase";
// import "firebase/auth";
//import auth from "firebase";

const application = firebase.initializeApp({
    apiKey: "AIzaSyBpPrfCDE4d8352ckKKoca_pQw1bbVbO-E",
    authDomain: "dailydish-adminv2.firebaseapp.com",
    databaseURL: "https://dailydish-adminv2.firebaseio.com",
    projectId: "dailydish-adminv2",
    storageBucket: "dailydish-adminv2.appspot.com",
    messagingSenderId: "740863894800",
    appId: "1:740863894800:web:60504ea1505652c267f195",
    measurementId: "G-NXYMZZYT4E"
});

export const auth = application.auth();
export const db = firebase.firestore();

export default application;