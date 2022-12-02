import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
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
import { LoadingButton } from '@mui/lab';


// Firebase
import { ref, getDownloadURL, getStorage } from 'firebase/storage';
import {ref as refDatabase, get, set, getDatabase } from 'firebase/database';

import {useContext, useState} from 'react';
import { DBContext } from '../App';
// components
import Page from '../components/Page';
import UserTable from '../sections/admin/UserAdminTable';
import TranscriptTable from '../sections/admin/TranscriptVerificationTable';
import DisputedReviewTable from '../sections/admin/DisputedReviewTable';
import TicketTable from '../sections/admin/TicketTable';
import UserList from '../sections/admin/UserList';
// mock
import account from '../_mock/account';
// data 
import { User as USER } from '../Controller/User';
import { Tutor as TUTOR } from '../Controller/Tutor';



const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    {
        field: 'firstName',
        headerName: 'First name',
        width: 200,
        editable: false,
    },
    {
        field: 'lastName',
        headerName: 'Last name',
        width: 200,
        editable: false,
    },
    {
        field: 'emailAddress',
        headerName: 'Email Address',
        width: 200,
        editable: false,
    },
];



function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
  
  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', emailAddress:'Jon.Snow@purdue.edu' },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei',emailAddress:'Lannister.Cersei@purdue.edu' },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', emailAddress:'Lannister.Jaime@purdue.edu'  },
    { id: 4, lastName: 'Stark', firstName: 'Arya', emailAddress:'Arya.Stark@purdue.edu'  },
    {id: 5, lastName: 'Targaryen', firstName: 'Daenerys', emailAddress:'Daenerys.Targaryen@purdue.edu'  },
    { id: 6, lastName: 'Melisandre', firstName: null, emailAddress:'Melisandre@purdue.edu' },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', emailAddress:'Ferrara.Clifford@purdue.edu'  },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', emailAddress:'Rossini.Frances@purdue.edu' },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', emailAddress:'Harvey.Roxie@purdue.edu'  },
  ];

export default function AdminPanel() {
    const [inputUid, setInputUid ] = useState();
    const [inputCourse, setInputCourse ] = useState();

    async function verifyTutorCourses() {
      const notVerifiedRef = refDatabase(getDatabase(), `TutorAccounts/${inputUid}/NotVerifiedCourses`);
      let oldNotVerified = [];
      await get(notVerifiedRef).then((snapshot) => {
        oldNotVerified = snapshot.val();
        console.log(`oldNotVerified: ${oldNotVerified}`);
      }).catch((error) => {
        console.log(error);
      });

      const verifiedRef = refDatabase(getDatabase(), `TutorAccounts/${inputUid}/VerifiedCourses`);
      let oldVerified = [];
      await get(verifiedRef).then((snapshot) => {
        oldVerified = snapshot.val();
        console.log(`oldVerified: ${oldVerified}`);
      }).catch((error) => {
        console.log(error);
      });

      const indexNotVerified = oldNotVerified.indexOf(inputCourse);
      if (indexNotVerified > -1) {
        const notVerifiedRemoved = oldNotVerified.splice(indexNotVerified, 1);

        console.log(`Removed ${notVerifiedRemoved} from array`);
      }
      console.log(`newNotVerified: ${oldNotVerified}`);
      const indexVerified = oldVerified.indexOf(inputCourse);
      if (indexVerified === -1 ) {
        const elemsPushed = oldVerified.push(inputCourse);
        console.log(`new Verified length: ${elemsPushed}`);
        const indexNA = oldVerified.indexOf('N/A');
        if (indexNA > -1) {
          oldVerified.splice(indexNA, 1);
        }
      }
      console.log(`new oldVerified: ${oldVerified}`);

      TUTOR.update_by_admin(inputUid, oldVerified, oldNotVerified);
    }

    // Tabs
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
    <Page title="Admin">

      {/* main container holding everything */}
      <Container sx={{mx: 'auto', width: 1000}}>  
        {/* Stack for bottom section of profile page */}

        <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
            <Tab label="Transcripts" {...a11yProps(0)} />
            <Tab label="Reviews" {...a11yProps(1)} />
            <Tab label="Support Ticket" {...a11yProps(2)} />
          </Tabs>
        </Box>
        
        <TabPanel value={value} index={0}>
          <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h3" gutterBottom>
               Transcript Verification
              </Typography>

            </Stack>

            <Stack spacing={0.5} mt={3} mx={3}>

{/* User ID */}
<Stack spacing={0.5} direction="row">
    <TextField
        id="outlined-multiline-flexible"
        label="Enter User ID"
        multiline
        maxRows={4}
        onChange={(event) => {
            setInputUid(event.target.value);
        }}
    />
    <LoadingButton size="large" type="submit" variant="contained" onClick={() => {
      // View transcript
      getDownloadURL(ref(getStorage(), `User_data/${inputUid}/Transcript/transcript.pdf`))
      .then((url) => {
        const element = document.createElement("a");
        element.href = url;
        element.target = "_blank";
        element.click();
      }).catch((error) => {
        console.log(error);
      })
    }} >
        View Transcript
    </LoadingButton>
    <TextField 
      id="outlined-multiline-flexible"
      label="Enter course to verify"
      multiline
      maxRows={4}
      onChange={(event) => {
        setInputCourse(event.target.value);
      }}
    />
    <LoadingButton size="large" type="submit" variant="contained" onClick={() => verifyTutorCourses()}>
      Verify user for course
    </LoadingButton>
</Stack>
</Stack>                       

            <TranscriptTable/>
          </Container>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h3" gutterBottom>
               Disputed Review
              </Typography>
            
            </Stack>
                <Stack spacing={0.5} mt={3} mx={3}>
                <DisputedReviewTable/>
                </Stack>
          </Container>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h3" gutterBottom>
                Support Tickets
              </Typography>
            
            </Stack>
                <Stack spacing={0.5} mt={3} mx={3}>
                <TicketTable/>
                </Stack>
          </Container>
        </TabPanel>

        
      
      </Box>
      </Container>
    </Page>
    )
}