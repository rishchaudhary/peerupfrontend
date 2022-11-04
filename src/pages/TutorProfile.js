// material
import {
    Avatar,
    Badge,
    Box,
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
  import VerifiedIcon from '@mui/icons-material/Verified';
  import { useContext } from 'react';
  import { getAuth } from 'firebase/auth';
  import { ref, onValue, set, getDatabase } from 'firebase/database';
  import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
  
  
  import { DBContext } from '../App';
  // components
  import Page from '../components/Page';
  import Iconify from '../components/Iconify';
  
  // mock
  import account from '../_mock/account'; 
  // ----------------------------------------------------------------------

  const auth = getAuth();
  const database = getDatabase();

  const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

  export default function TutorProfile() {
    const {displayName, major, userClass, userBio, userTutorBio} = useContext(DBContext);
    const [stateDisplayName, setStateDisplayName] = displayName;
    const [stateMajor, setStateMajor] = major;
    const [stateUserClass, setStateUserClass] = userClass;
    const [stateUserTutorBio, setStateUserTutorBio] = userTutorBio;
    const usrProfilePicURL = auth.currentUser.photoURL;

    const handleUpdateTutorBio = () => {
      set(ref(database, `Users/${auth.currentUser.uid}/TutorBio`), document.getElementById('usrTutorBio').value);
      // console.log(`user bio: ${document.getElementById('userBio').value}`);
    }

    const uploadTranscript = () => {
      const storage = getStorage();
      const selectedFile = document.getElementById('transcript').files[0];
      const transcriptRef = storageRef(storage, `User_data/${auth.currentUser.uid}/Transcript/transcript.pdf`);
      uploadBytes(transcriptRef, selectedFile).then(() => {
        console.log('Uploaded transcript');
      }).catch(() => {
        console.log('Error uploading transcript');
      });
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
                <Stack direction="row" spacing={2}>
                    <Typography variant="h1" gutterBottom>
                        {stateDisplayName}
                        {}
                    </Typography>
                    <VerifiedIcon/>
                </Stack>
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
                  id="usrTutorBio"
                  multiline
                  minRows={5}
                  maxRows={5}
                  defaultValue={stateUserTutorBio}
                  margin="dense"
                  variant="outlined"
                  onBlur={handleUpdateTutorBio}
                />
              </Stack>
            </Paper>
  
            {/* stack for class currently taking */}
            <Stack spacing={1} direction="row" pt={3} sx={{ alignContent: 'center'}}>
              <Typography variant="body" gutterBottom sx={{pl: 2, pt: 1, fontWeight: 'medium'}}>
                Offering tutoring:
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

            <Stack spacing={1} direction="row" pt={3} sx={{ alignItems: 'center' }}>
            <Typography variant="body" gutterBottom sx={{pl: 2, pt: 1, fontWeight: 'medium'}}>
              Reviews
            </Typography>
          </Stack>

        



            <Box pt={5} sx={{ alignItems: 'center', alignContent: 'center'}} >
                <Button 
                variant="contained" 
                component="label" 
                startIcon={<Iconify icon="eva:plus-fill" />}
                color="secondary"
                >
                Upload Transcript
                <input hidden accept=".pdf" type="file" id="transcript" onChange={uploadTranscript} />
                </Button>
            </Box>
  
          </Stack>
        </Container>
      </Page>
    );
  }
  
