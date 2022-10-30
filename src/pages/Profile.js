import { useNavigate } from 'react-router-dom';
// material
import {
  Avatar,
  Button,
  Container,
  Chip,
  Divider,
  Grid,
  Rating,
  Paper,
  Typography,
  Stack,
  TextField,
} from '@mui/material';

// Firebase
import { ref, onValue  } from "firebase/database";
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { ref as refStorage, getDownloadURL, uploadBytes } from 'firebase/storage';

// components
import Iconify from '../components/Iconify';
import Page from '../components/Page';
// mock
import account from '../_mock/account';
// Controller
import {NewUser} from "../Controller/NewUser";
import { auth } from '../firebaseConfig/auth';
import { database } from '../firebaseConfig/database';
import { storage } from '../firebaseConfig/storage';


// ----------------------------------------------------------------------
// const db = getDatabase();
// const user = db.ref(`Users/${auth.currentUser.uid}/Name`);





export default function Profile() {
  const navigate = useNavigate();
  const uploadPfp = () => {
    if (auth.currentUser != null) {
      const selectedFile = document.getElementById('pfp').files[0];
      const storageRef = refStorage(storage, `User_data/${auth.currentUser.uid}/${selectedFile.name}`);
      uploadBytes(storageRef, selectedFile).then((snapshot) => {
        console.log('Uploaded file');
        getDownloadURL(storageRef)
        .then((url) => {
          console.log(`url: ${url}`);
          updateProfile(auth.currentUser, {
            photoURL: url
          }).then(() => {
            console.log(`profile picture updated to ${auth.currentUser.photoURL}`);
            navigate('/dashboard/profile', { replace: true });
          }).catch((error) => {
            console.log('error occurred updating profile picture');
          });
        }).catch((error) => {
          console.log('error getting download url');
        });
      }).catch(() => {
        console.log('error occured uploading file');
      });
    }
  }
  
  let usrDisplayName = '';
  let usrProfilePicURL = '';
  if (auth.currentUser != null) {
    usrProfilePicURL = auth.currentUser.photoURL;
    const usrDisplayNameRef = ref(database, `Users/${auth.currentUser.uid}/Name`); // get database reference to path you want
    onValue(usrDisplayNameRef, (snapshot) => { // create listener for the db reference
      usrDisplayName = snapshot.val(); // use the snapshot.val() method to return the value in that reference
    });
  } else {
    usrProfilePicURL = account.photoURL;
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
            alt={usrDisplayName}
            src={usrProfilePicURL}
            style= {{border: '1px solid lightgray'}}
            sx={{ width: 150, height: 150,}}
            />
          </Grid>

          {/* grid 2: Name & rating */}
          <Grid item xs={6}>
            <Stack>
              <Typography variant="h1" gutterBottom>
                {usrDisplayName}
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
          
          {/* Stack for upload profile pic button */}
          <Stack spacing = {0.5} direction="row">
            <Button variant="contained" component="label" startIcon={<Iconify icon="eva:plus-fill"/>}>
              Upload profile picture
              <input hidden type="file" id="pfp" name='pfp' accept="image/*" onChange={uploadPfp} />
            </Button>
          </Stack>

          {/* Stack 1: major */}
          <Stack spacing = {0.5} direction="row">
            <Typography variant="body" gutterBottom sx={{fontWeight: 'medium'}}>
              Major: 
            </Typography>
            <Typography variant="body" gutterBottom>
              {account.major}
            </Typography>
          </Stack>
          
          {/* Stack 1: Class/year */}
          <Stack spacing = {0.5} direction="row">
            <Typography variant="body" gutterBottom sx={{fontWeight: 'medium'}}>
              Class: 
            </Typography>
            <Typography variant="body" gutterBottom>
              {account.year}
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
                id="outlined-multiline-static"
                multiline
                minRows={5}
                maxRows={5}
                defaultValue="Enter bio here"
                margin="dense"
                variant="outlined"
              />
            </Stack>
          </Paper>

          {/* stack for class currently taking */}
          <Stack spacing={1} direction="row" pt={3} sx={{ alignItems: 'center'}}>
            <Typography variant="body" gutterBottom sx={{pl: 2, pt: 1, fontWeight: 'medium'}}>
              Currently Taking:
            </Typography>

            {account.enrolled.map(item => (
              <div key={item.id}>
                <Chip 
                label={item.class} 
                color="primary"
                sx={{fontWeight: 'bold'}}
                />
              </div>
            ))}
          </Stack>

          <Stack spacing={1} direction="row" pt={3} sx={{ alignItems: 'center'}}>
            <Typography variant="body" gutterBottom sx={{pl: 2, pt: 1, fontWeight: 'medium'}}>
              Preffered Day:
            </Typography>

            {account.dayPref.map(item => (
              <div key={item.id}>
                <Chip 
                label={item.class} 
                color="primary"
                sx={{fontWeight: 'bold'}}
                />
              </div>
            ))}
          </Stack>

          <Stack spacing={1} direction="row" pt={3} sx={{ alignItems: 'center' }}>
            <Typography variant="body" gutterBottom sx={{pl: 2, pt: 1, fontWeight: 'medium'}}>
              Preffered Time:
            </Typography>

            {account.timePref.map(item => (
              <div key={item.id}>
                <Chip 
                label={item.class} 
                color="primary"
                sx={{fontWeight: 'bold'}}
                />
              </div>
            ))}
          </Stack>

        </Stack>
      </Container>
    </Page>
  );
}
