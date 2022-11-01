import { createContext, useState } from 'react';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
import { AuthContextProvider } from './firebaseConfig/firebaseConfig';
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
  const [userTutorBio, setUserTutorBio] = useState("tutor bio");

  return (
    <DBContext.Provider
      value={{ displayName: [displayName, setDisplayName], major: [major, setMajor], userClass: [userClass, setUserClass],
      userBio: [userBio, setUserBio], userTutorBio: [userTutorBio, setUserTutorBio] }}
    >
      {props.children}
    </DBContext.Provider>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthContextProvider>
        <ScrollToTop />
        <BaseOptionChartStyle />
        <DBContextProvider>
          <Router />
        </DBContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
}
