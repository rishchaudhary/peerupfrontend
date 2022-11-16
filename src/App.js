import { createContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
import { AuthContextProvider, firebaseConfig, firebaseObserver, loggedIn } from './firebaseConfig/firebaseConfig';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';




// ----------------------------------------------------------------------


export const DBContext = createContext();

const DBContextProvider = props => {
  const [displayName, setDisplayName] = useState("display name");
  const [major, setMajor] = useState("major");
  const [userClass, setUserClass] = useState("standing");
  const [userBio, setUserBio] = useState("bio");
  const [userLang, setLanguage] = useState("language");
  const [tutorLang, setTutorLang] = useState("tutor language")
  const [userTutorBio, setUserTutorBio] = useState("tutor bio");
  const [hasTutorAcc, setTutorAccount] = useState(false);
  const [tutorPFPURL, setTutorPFPURL] = useState(false);

  return (
    <DBContext.Provider
      value={{
        displayName: [displayName, setDisplayName],
        major: [major, setMajor],
        userClass: [userClass, setUserClass],
        userBio: [userBio, setUserBio],
        userLang: [userLang, setLanguage],
        tutorLang: [tutorLang, setTutorLang],
        userTutorBio: [userTutorBio, setUserTutorBio],
        hasTutorAcc: [hasTutorAcc, setTutorAccount],
        tutorPFPURL: [tutorPFPURL, setTutorPFPURL]
      }}
    >
      {props.children}
    </DBContext.Provider>
  );
};

export default function App() {
  const [ authenticated, setAuthenticated ] = useState(loggedIn());
  const [ isLoading, setIsLoading ] = useState(true);
  useEffect(() => {
    firebaseObserver.subscribe('authStateChanged', data => {
      setAuthenticated(data);
      setIsLoading(false);
    });
    return () => { firebaseObserver.unsubscribe('authStateChanged'); }
  }, []);
  return isLoading ? <div/> :
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <DBContextProvider>
        <Router />
      </DBContextProvider>
    </ThemeProvider>;
  
}