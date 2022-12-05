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
    Popover,
    TextField,
    IconButton
  } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
  import VerifiedIcon from '@mui/icons-material/Verified';
  import { PhotoCamera } from '@mui/icons-material';
  import StarsIcon from '@mui/icons-material/Stars';
  import {useContext, useEffect, useState} from 'react';
  import { getAuth } from 'firebase/auth';
  import { ref, onValue, set, getDatabase } from 'firebase/database';
  import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
  
  
  import { DBContext } from '../App';
// components
import Page from '../components/Page';
  import Iconify from '../components/Iconify';
  import ReviewCard from '../components/ReviewCard';
  
// mock
import account from '../_mock/account';
import { Tutor as TUTOR } from "../Controller/Tutor";
// ----------------------------------------------------------------------

const auth = getAuth();
const database = getDatabase();
const storage = getStorage();

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


const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

export default function TutorProfile() {
    const {displayName, major, userClass, tutorLang, userTutorBio, tutorPFPURL} = useContext(DBContext);
    const [stateDisplayName] = displayName;
    const [stateMajor] = major;
    const [stateUserClass] = userClass;
    const [stateUserTutorBio] = userTutorBio;
    const [usrProfilePicURL] = tutorPFPURL;
    const [badges, setBadges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [days, setDays] = useState([]);
    const [times, setTimes] = useState([]);

    useEffect(() => {
        TUTOR.get_days(auth.currentUser.uid)
            .then(fetchDays => {
                console.log("Preferred Days:", fetchDays)
                setDays(fetchDays)
            })
        TUTOR.get_times(auth.currentUser.uid)
            .then(fetchTimes => {
                console.log("Preferred Times:",fetchTimes)
                setTimes(fetchTimes)
            })
        TUTOR.get_courses(auth.currentUser.uid)
            .then(fetchCourses => {
                console.log("Offered Courses", fetchCourses)
                setCourses(fetchCourses)
            })
        TUTOR.get_badges(auth.currentUser.uid)
            .then(fetchBadges => {
                console.log("Badges", fetchBadges)
                setBadges(fetchBadges)
            })

    }, [])

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

    const updatePFP = () => {
      const newPFPFile = document.getElementById("newpfp").files[0];
      const newPFPRef = storageRef(storage, `User_data/${auth.currentUser.uid}/${newPFPFile.name}`);
      uploadBytes(newPFPRef, newPFPFile).then((snapshot) => {
          console.log('Uploaded file', snapshot);
          getDownloadURL(newPFPRef)
          .then((url) => {
              console.log(url);
              set(ref(database,`Users/${auth.currentUser.uid}/TutorPFPURL`),url);
          }).catch((error) => {
              console.log('error getting download url ', error);
          })
      }).catch((error) => {
          console.log('error uploading new pfp ', error);
      })
    }

    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);


    if (days.length === 0 || times.length === 0 || courses.length === 0 || badges.length === 0) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        );
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
                    </Typography>
                    <VerifiedIcon/>
                </Stack>
                  {badges.map((value, index) => {
                      if (value.value) {
                          return (
                              <div key={index}>
                                  <Chip
                                      label={value.badge}
                                      icon={<StarsIcon />}
                                      size={"small"}
                                      sx={{bgcolor: 'primary.dark', fontWeight: 'light'}}
                                      aria-owns={open ? 'mouse-over-popover' : undefined}
                                      aria-haspopup="true"
                                      onMouseEnter={handlePopoverOpen}
                                      onMouseLeave={handlePopoverClose}
                                  />
                                  <Popover
                                      id="mouse-over-popover"
                                      sx={{
                                          pointerEvents: 'none',
                                      }}
                                      open={open}
                                      anchorEl={anchorEl}
                                      anchorOrigin={{
                                          vertical: 'bottom',
                                          horizontal: 'left',
                                      }}
                                      transformOrigin={{
                                          vertical: 'top',
                                          horizontal: 'left',
                                      }}
                                      onClose={handlePopoverClose}
                                      disableRestoreFocus
                                  >
                                      <Typography variant="body2" sx={{ p: 1 }}>{value.description}</Typography>
                                  </Popover>
                              </div>
                          );
                      }
                      return null
                  })}
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
            
            <Stack direction={"row"} spacing={2} alignItems="left">
              <IconButton color="primary" aria-label="upload profile picture" component="label">
                <input hidden accept="image/*" type="file" id="newpfp" onChange={updatePFP} />
                <PhotoCamera />
              </IconButton>
            </Stack>

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
                  defaultValue={stateUserTutorBio}
                  minRows={5}
                  maxRows={5}
                  margin="dense"
                  variant="outlined"
                  InputProps={{readOnly: true}}
                />
              </Stack>
            </Paper>
  
            {/* stack for class currently taking */}
            <Stack spacing={1} direction="row" pt={3} sx={{ alignContent: 'center'}}>
              <Typography variant="body" gutterBottom sx={{pl: 2, pt: 1, fontWeight: 'medium'}}>
                Offering tutoring:
              </Typography>
                {courses.map(mapToggle)}
            </Stack>
  
            <Stack spacing={1} direction="row" pt={3} sx={{ alignItems: 'center'}}>
              <Typography variant="body" gutterBottom sx={{pl: 2, pt: 1, fontWeight: 'medium'}}>
                Preffered Day:
              </Typography>
                {days.map(mapToggle)}
            </Stack>
  
            <Stack spacing={1} direction="row" pt={3} sx={{ alignItems: 'center' }}>
              <Typography variant="body" gutterBottom sx={{pl: 2, pt: 1, fontWeight: 'medium'}}>
                Preffered Time:
              </Typography>
                {times.map(mapToggle)}
            </Stack>
          <Stack spacing={1} direction="row" pt={3} sx={{ alignItems: 'center' }}>
              <Typography variant="body" gutterBottom sx={{pl: 2, pt: 1, fontWeight: 'medium'}}>
                  Preferred Language:
              </Typography>
              <Chip
                  label={tutorLang}
                  sx={{bgcolor: 'primary.main', fontWeight: 'bold'}}
              />
          </Stack>

            <Stack spacing={1} direction="row" pt={3} sx={{ alignItems: 'center' }}>
            <Typography variant="body" gutterBottom sx={{pl: 2, pt: 1, fontWeight: 'medium'}}>
              Reviews
            </Typography>
          </Stack>

          <Stack spacing={1} direction="col" pt={3} sx={{ alignItems: 'center' }}>
            <ReviewCard/>
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
  
