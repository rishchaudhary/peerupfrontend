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
  } from '@mui/material';
  // components
  import Page from '../components/Page';
  // mock
  import account from '../_mock/account';
  
  // ----------------------------------------------------------------------
  
  export default function TutorProfile() {
  
    return (
      <Page title="Profile">
  
        {/* main container holding everything */}
        <Container sx={{mx: 'auto', width: 1000}}> 
  
          {/* Grid for top section of the profile page */}
          <Grid container spacing={2}>
  
            {/* Grid 1: Profile pic */ }
            <Grid item xs={2} sx={{ alignItems: 'center' }}>
              <Avatar 
              alt={account.displayName}
              src={account.photoURL}
              style= {{border: '1px solid lightgray'}}
              sx={{ width: 150, height: 150,}}
              />
            </Grid>
  
            {/* grid 2: Name & rating */}
            <Grid item xs={6}>
              <Stack>
                <Typography variant="h1" gutterBottom>
                  {account.displayName}
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
                  maxRows={5}
                  defaultValue="Default Value"
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
  
