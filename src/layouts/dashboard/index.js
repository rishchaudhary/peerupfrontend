import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import ReactObserver from 'react-event-observer';
// material
import { styled } from '@mui/material/styles';
//
import { getAuth } from 'firebase/auth';
import { onValue, ref, getDatabase } from 'firebase/database';
// import { database } from '../../firebaseConfig/database'
import { DBContext } from '../../App';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import USER from "../../Controller/User";

const database = getDatabase();

const auth = getAuth();

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  const [everythingLoaded, setEverythingLoaded] = useState(false);

  const {
    displayName,
    major,
    userClass,
    userBio,
    userLang,
    userTutorBio,
    hasTutorAcc,
    tutorPFPURL
  } = useContext(DBContext);
  const [, setStateDisplayName] = displayName;
  const [, setStateMajor] = major;
  const [, setStateUserClass ] = userClass;
  const [, setStateUserBio] = userBio;
  const [, setStateUserTutorBio] = userTutorBio;
  const [, setStateLanguage] = userLang;
  const [, setStateTutorAcc] = hasTutorAcc;
  const [, setTutorPFPURL] = tutorPFPURL;


  const [tutorAccLoad, setTutorAccLoad] = useState(false);
  const tutorAccObs = ReactObserver();
  const tutorAccRef = ref(database, `Users/${auth.currentUser.uid}/HasTutorAccount`);
  useEffect(() => {
    tutorAccObs.subscribe('tutorAcc loaded', () => {
      setTutorAccLoad(true);
      if (majorLoaded && classLoaded && bioLoaded && userLangLoaded && tutorBioLoaded && displayNameLoaded && tutorPFPLoaded) {
        setEverythingLoaded(true);
        console.log('everything loaded(tutorAcc)');
      }
    });
    return() => {tutorAccObs.unsubscribe('tutorAcc loaded');}
  }, []);
  onValue(tutorAccRef, (snapshot) => {
    setStateTutorAcc(snapshot.val());
    tutorAccObs.publish('tutorAcc loaded', null);
  });


  const [displayNameLoaded, setDisplayNameLoaded] = useState(false);
  const displayNameObserver = ReactObserver();
  const displayNameRef = ref(database, `Users/${auth.currentUser.uid}/Name`);
  useEffect(() => {
    displayNameObserver.subscribe('displayName loaded', () => {
      setDisplayNameLoaded(true);
      if (majorLoaded && classLoaded && bioLoaded && userLangLoaded && tutorBioLoaded && tutorAccLoad && tutorPFPLoaded) {
        setEverythingLoaded(true);
        console.log('everything loaded(name)');
      }
    });
    return() => {displayNameObserver.unsubscribe('displayName loaded');}
  }, []);
  onValue(displayNameRef, (snapshot) => {
    setStateDisplayName(snapshot.val());
    displayNameObserver.publish('displayName loaded', null);
  });

  const[majorLoaded, setMajorLoaded] = useState(false);
  const majorObserver = ReactObserver();
  const majorRef = ref(database, `Users/${auth.currentUser.uid}/Major`);
  useEffect(() => {
    majorObserver.subscribe('major loaded', () => {
      setMajorLoaded(true);
      if (displayNameLoaded && classLoaded && bioLoaded && userLangLoaded && tutorBioLoaded && tutorAccLoad && tutorPFPLoaded) {
        setEverythingLoaded(true);
        console.log('everything loaded(major)');
      }
    });
    return () => {majorObserver.unsubscribe('major loaded');}
  }, []);
  onValue(majorRef, (snapshot) => {
    setStateMajor(snapshot.val());
    majorObserver.publish('major loaded');
  });

  const[classLoaded, setClassLoaded] = useState(false);
  const classObserver = ReactObserver();
  const userClassRef = ref(database, `Users/${auth.currentUser.uid}/Standing`);
  useEffect(() => {
    classObserver.subscribe('class loaded', () => {
      setClassLoaded(true);
      if (displayNameLoaded && majorLoaded && bioLoaded && userLangLoaded && tutorBioLoaded && tutorAccLoad && tutorPFPLoaded) {
        setEverythingLoaded(true);
        console.log('everything loaded(class)');
      }
    });
    return () => {classObserver.unsubscribe('class loaded');}
  }, []);
  onValue(userClassRef, (snapshot) => {
    setStateUserClass(snapshot.val());
    classObserver.publish('class loaded');
  });

  const[bioLoaded, setBioLoaded] = useState(false);
  const bioObserver = ReactObserver();
  const userBioRef = ref(database, `Users/${auth.currentUser.uid}/Bio`);
  useEffect(() => {
    bioObserver.subscribe('bio loaded', () => {
      setBioLoaded(true);
      if (displayNameLoaded && classLoaded && majorLoaded && userLangLoaded && tutorBioLoaded && tutorAccLoad && tutorPFPLoaded) {
        setEverythingLoaded(true);
        console.log('everything loaded (bio)');
      }
    });
    return () => {bioObserver.unsubscribe('bio loaded');}
  }, []);
  onValue(userBioRef, (snapshot) => {
    setStateUserBio(snapshot.val());
    bioObserver.publish('bio loaded');
  });

  const [userLangLoaded, setLanguageLoaded] = useState(false);
  const langObs = ReactObserver();
  const languageRef = ref(database, `Users/${auth.currentUser.uid}/Language`);
  useEffect(() => {
    langObs.subscribe('Language Loaded', () => {
      setLanguageLoaded(true);
      if (displayNameLoaded && classLoaded && bioLoaded && majorLoaded && tutorBioLoaded && tutorAccLoad && tutorPFPLoaded) {
        setEverythingLoaded(true);
        console.log('everything loaded (language)');
      }
    });
    return () => {langObs.unsubscribe('Language Loaded');}
  }, []);
  onValue(languageRef, (snapshot) => {
    setStateLanguage(snapshot.val());
    langObs.publish('Language Loaded');
  });

  const [tutorBioLoaded, setTutorBioLoaded] = useState(false);
  const tutorBioObserver = ReactObserver();
  const usrTutorBioRef = ref(database, `Users/${auth.currentUser.uid}/TutorBio`);
  useEffect(() => {
    tutorBioObserver.subscribe('tutor bio loaded', () => {
      setTutorBioLoaded(true);
      if (displayNameLoaded && classLoaded && bioLoaded && majorLoaded && userLangLoaded && tutorAccLoad && tutorPFPLoaded) {
        setEverythingLoaded(true);
        console.log('everything loaded (tutor bio)');
      }
    });
    return () => {tutorBioObserver.unsubscribe('tutor bio loaded');}
  }, []);
  onValue(usrTutorBioRef, (snapshot) => {
    setStateUserTutorBio(snapshot.val());
    tutorBioObserver.publish('tutor bio loaded');
  });

  const[tutorPFPLoaded, setTutorPFPLoaded] = useState(false);
  const tutorPFPObserver = ReactObserver();
  const usrTutorPFPRef = ref(database, `Users/${auth.currentUser.uid}/TutorPFPURL`);
  useEffect(() => {
    tutorPFPObserver.subscribe('tutor pfp loaded', () => {
      setTutorPFPLoaded(true);
      if(displayNameLoaded && classLoaded && bioLoaded && majorLoaded && userLangLoaded && tutorAccLoad && tutorBioLoaded) {
        setEverythingLoaded(true);
        console.log('everything loaded (tutor pfp');
      }
    });
    return () => {tutorPFPObserver.unsubscribe('tutor pfp loaded');}
  }, []);
  onValue(usrTutorPFPRef, (snapshot) => {
    setTutorPFPURL(snapshot.val());
    tutorBioObserver.publish('tutor pfp loaded');
  });
  

  return everythingLoaded ? <div /> :
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>;
}
