import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
//
const firebaseConfig = {
    apiKey: "AIzaSyBDY8kkoyGnr5BJOap6e9RZcRJf2xjvT9Q",
    authDomain: "peerup-431d6.firebaseapp.com",
    databaseURL: "https://peerup-431d6-default-rtdb.firebaseio.com",
    projectId: "peerup-431d6",
    storageBucket: "peerup-431d6.appspot.com",
    messagingSenderId: "659640437070",
    appId: "1:659640437070:web:bebb5fbf6f69b2de1af61f",
    measurementId: "G-8984NE8NQ3"
  };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();