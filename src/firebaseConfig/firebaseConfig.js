import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState, useContext, createContext } from 'react';
import ReactObserver from 'react-event-observer';
//
export const firebaseConfig = {
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

export const AuthContext = createContext();

export const firebaseObserver = ReactObserver();

const auth = getAuth();

export function loggedIn() {
  return !!auth.currentUser;
}

auth.onAuthStateChanged((user) => {
  firebaseObserver.publish("authStateChanged", loggedIn())
});

export const AuthContextProvider = props => {
  const [user, setUser] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), setUser, setError)
    return () => unsubscribe()
  }, [])
  return <AuthContext.Provider value={{ user, error }} {...props} />
}

export const useAuthState = () => {
  const auth = useContext(AuthContext)
  return { ...auth, isAuthenticated: auth.user != null }
}