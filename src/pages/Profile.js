import { useNavigate } from 'react-router-dom';
// material
import {
  Avatar,
  Container,
  Chip,
  Divider,
  Grid,
  Rating,
  Paper,
  Typography,
  Stack,
  TextField,
  IconButton,
} from '@mui/material';

// Firebase

import { ref, onValue, set, getDatabase } from "firebase/database";
import { getAuth, updateProfile } from 'firebase/auth';

import { ref as refStorage, getDownloadURL, uploadBytes } from 'firebase/storage';

import {useContext, useEffect, useState} from 'react';
import { DBContext } from '../App';
// components
import Page from '../components/Page';
// mock
import account from '../_mock/account';
// data 


import { storage } from '../firebaseConfig/storage';
import { User as USER } from '../Controller/User';
// import { PhotoCamera } from '@mui/icons-material';


const auth = getAuth();
const database = getDatabase();


// ----------------------------------------------------------------------


function mapToggle(value, index) {
  // console.log(value);
  if (value.value) {
    return (
        <div key={index}>
          <Chip
              label={value.key}
              sx={{bgcolor: 'primary.main', fontWeight: 'bold'}}
          />
        </div>
    );
  }
    return (
        <div key={index}>
          <Chip
              label={value.key}
              sx={{bgcolor: 'primary.light', fontWeight: 'bold'}}
          />
        </div>
    );
}

export default function Profile() {
  const {displayName, major, userClass, userBio, userLang} = useContext(DBContext);
  const [stateDisplayName] = displayName;
  const [stateMajor] = major;
  const [stateUserClass] = userClass;
  const [stateUserBio] = userBio;
  const [days, setDays] = useState([]);
  const [times, setTimes] = useState([]);

  useEffect(() => {
    USER.get_days(auth.currentUser.uid)
        .then(fetchDays => {
          console.log(fetchDays)
          setDays(fetchDays)
        })
    USER.get_times(auth.currentUser.uid)
        .then(fetchTimes => {
          console.log(fetchTimes)
          setTimes(fetchTimes)
        })
  }, [])

  
  const usrProfilePicURL = auth.currentUser.photoURL;

  if (days.length === 0 || times.length === 0) {
    return <h1>Fetching data.....</h1>;
  }


  return (
    <Page title="Profile">

      {/* main container holding everything */}
      <Container sx={{mx: 'auto', width: 1000}}>

        {/* Grid for top section of the profile page */}
        <Grid container spacing={2}>

          {/* Grid 1: Profile pic */ }
          <Grid item xs={2} sx={{ alignItems: 'center' }}>
            <Avatar
            alt={stateDisplayName}
            src={usrProfilePicURL}
            style= {{border: '1px solid lightgray'}}
            sx={{ width: 150, height: 150,}}
            />
          </Grid>

          {/* grid 2: Name & rating */}
          <Grid item xs={6}>
            <Stack>
              <Typography variant="h2" gutterBottom>
                {stateDisplayName}
              </Typography>
              <Rating
                name="read-only" 
                value={account.ratingVal} 
                precision={0.5}
                size="large"
                readOnly 
              />
            </Stack>
          </Grid>
          {/* end of top section */}
        </Grid>
        
        {/* Stack for bottom section of profile page */}
        <Stack spacing={0.5} mt={3} mx={3}>
          {/* Stack 1: major */}
          <Stack spacing = {0.5} direction="row">
            <Typography variant="body" gutterBottom sx={{fontWeight: 'medium'}}>
              Major: 
            </Typography>
            <Typography variant="body" gutterBottom>
              {stateMajor}
            </Typography>
          </Stack>
          
          {/* Stack 1: Class/year */}
          <Stack spacing = {0.5} direction="row">
            <Typography variant="body" gutterBottom sx={{fontWeight: 'medium'}}>
              Class: 
            </Typography>
            <Typography variant="body" gutterBottom>
              {stateUserClass}
            </Typography>
          </Stack>
          <Paper elevation={2} sx={{ height: 200}}>
            <Stack 
            spacing = {0.5} 
            mx={'auto'} 
            divider={<Divider orientation="horizontal" flexItem />}
            >
              <Typography variant="body" gutterBottom sx={{pl: 2, pt: 1, fontWeight: 'medium'}}>
                Bio:
              </Typography>
              <TextField
                id="userBio"
                multiline
                defaultValue={stateUserBio}
                minRows={5}
                maxRows={5}
                margin="dense"
                variant="outlined"
                InputProps={{readOnly: true}}
              />
            </Stack>
          </Paper>

          <Stack spacing={1} direction="row" pt={3} sx={{ alignItems: 'center'}}>
            <Typography variant="body" gutterBottom sx={{pl: 2, pt: 1, fontWeight: 'medium'}}>
              Preferred Day:
            </Typography>
            {days.map(mapToggle)}
          </Stack>

          <Stack spacing={1} direction="row" pt={3} sx={{ alignItems: 'center' }}>
            <Typography variant="body" gutterBottom sx={{pl: 2, pt: 1, fontWeight: 'medium'}}>
              Preferred Time:
            </Typography>
            {times.map(mapToggle)}
          </Stack>
          <Stack spacing={1} direction="row" pt={3} sx={{ alignItems: 'center' }}>
            <Typography variant="body" gutterBottom sx={{pl: 2, pt: 1, fontWeight: 'medium'}}>
              Preferred Language:
            </Typography>
            <Chip
                label={userLang}
                sx={{bgcolor: 'primary.main', fontWeight: 'bold'}}
            />
          </Stack>
        

        </Stack>
      </Container>
    </Page>
  );
}
