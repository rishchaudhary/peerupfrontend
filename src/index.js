import { initializeApp } from 'firebase/app';

// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { app } from './firebaseConfig';

//
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';

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


// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
