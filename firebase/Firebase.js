import * as firebase from "firebase";
// import * as all from "firebase/firestore";
import "firebase/auth";
import 'firebase/firestore'


//import fire from "firebase";
// import "firebase/auth";
//import auth from "firebase";

const application = firebase.initializeApp({
    apiKey: "AIzaSyD8D4NYx8-iJ9xS6nElzJFFUc1hKwp2cIk",
    authDomain: "rn-shopping-3e552.firebaseapp.com",
    databaseURL: "https://rn-shopping-3e552.firebaseio.com",
    projectId: "rn-shopping-3e552",
    storageBucket: "rn-shopping-3e552.appspot.com",
    messagingSenderId: "589010561756",
    appId: "1:589010561756:web:ca0047b6ae584de012a219",
    measurementId: "G-0YHWX5KN0F"
});

export const auth = application.auth();
export const db = firebase.firestore();

export default application;