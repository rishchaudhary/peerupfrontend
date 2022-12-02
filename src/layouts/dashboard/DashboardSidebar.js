import PropTypes from 'prop-types';
import { useEffect, useContext } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';

import { getAuth } from 'firebase/auth';
import * as React from 'react';
import { ref, onValue, getDatabase } from 'firebase/database';

// toggle
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

// mock
import account from '../../_mock/account';
// hooks
import useResponsive from '../../hooks/useResponsive';
import { DBContext } from '../../App';
import { useAuthState } from '../../firebaseConfig/firebaseConfig';

// components
import Logo from '../../components/Logo';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
// import navConfig from './NavConfig';

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;



// ----------------------------------------------------------------------

const auth = getAuth();
const database = getDatabase();


const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
 
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  

  const {hasTutorAcc} = useContext(DBContext);
  const { pathname } = useLocation();
  const {displayName} = useContext(DBContext);
  const [stateDisplayName, setStateDisplayName] = displayName;
  const isDesktop = useResponsive('up', 'lg');

  const navConfig = [

    {
      title: 'Student Home',
      path: '/dashboard/app',
      icon: getIcon('eva:home-fill'),
    },
    {
      title: 'Student Profile',
      path: '/dashboard/profile',
      icon: getIcon('eva:person-outline'),
    },
    {
      title: 'Documents',
      path: '/dashboard/document',
      icon: getIcon('eva:file-text-outline'),
    },
    {
      title: 'Settings',
      path: '/dashboard/settings',
      icon: getIcon('eva:settings-fill'),
    },
    
  ];

  const navConfigStudent =  [
   
    {
      title: 'Tutor Home',
      path: '/dashboard/tutorapp',
      icon: getIcon('eva:home-fill'),
    },
    {
      title: 'Tutor Profile',
      path: '/dashboard/tutorProfile',
      icon: getIcon('eva:person-outline'),
    },
    {
      title: 'Documents',
      path: '/dashboard/document',
      icon: getIcon('eva:file-text-outline'),
    },
    {
      title: 'Settings',
      path: '/dashboard/settings',
      icon: getIcon('eva:settings-fill'),
    },
    
  ];
 

  const usrProfilePicURL = auth.currentUser.photoURL;
  

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={usrProfilePicURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {stateDisplayName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {account.role}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={checked ?
        navConfig
        : navConfigStudent
      } />

      {hasTutorAcc[0] ?
            <Stack alignItems={"center"} mb={5}>
              <FormControlLabel control={
              <Switch
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />} label= {checked ?
                " Current Mode: Student"
                 : " Current Mode: Tutor"
             } />
            </Stack>
            : null
          }


      <Box sx={{ flexGrow: 1 }} />

    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
