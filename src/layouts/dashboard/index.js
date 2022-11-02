import { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import { getAuth } from 'firebase/auth';
import { onValue, ref, getDatabase } from 'firebase/database';
// import { database } from '../../firebaseConfig/database'
import { DBContext } from '../../App';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

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

  const {displayName, major, userClass, userBio, userTutorBio} = useContext(DBContext);
  const [, setStateDisplayName] = displayName;
  const [, setStateMajor] = major;
  const [, setStateUserClass ] = userClass;
  const [, setStateUserBio] = userBio;
  const [, setStateUserTutorBio] = userTutorBio;

  const displayNameRef = ref(database, `Users/${auth.currentUser.uid}/Name`);
  onValue(displayNameRef, (snapshot) => {
    setStateDisplayName(snapshot.val());
  });

  const majorRef = ref(database, `Users/${auth.currentUser.uid}/Major`);
  onValue(majorRef, (snapshot) => {
    setStateMajor(snapshot.val());
  });

  const userClassRef = ref(database, `Users/${auth.currentUser.uid}/Standing`);
  onValue(userClassRef, (snapshot) => {
    setStateUserClass(snapshot.val());
  });

  const userBioRef = ref(database, `Users/${auth.currentUser.uid}/Bio`);
  onValue(userBioRef, (snapshot) => {
    setStateUserBio(snapshot.val());
  });

  const usrTutorBioRef = ref(database, `Users/${auth.currentUser.uid}/TutorBio`);
  onValue(usrTutorBioRef, (snapshot) => {
    setStateUserTutorBio(snapshot.val());
  })
  

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
