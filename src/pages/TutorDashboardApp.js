import * as React from 'react';
// tabs
import { filter } from 'lodash';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { getAuth } from 'firebase/auth';

// User data 
import { User as USER } from '../Controller/User';
import { Requests as REQUESTS } from '../Controller/Requests';

// components
import RequestForm from '../sections/@dashboard/student/RequestForm';
import RequestTable from '../sections/@dashboard/student/RequestTable';
import MatchedView from '../sections/@dashboard/student/StudentMatched';
import CompletedView from '../sections/@dashboard/student/StudentCompleted';
import ScheduledView from '../sections/@dashboard/student/StudentScheduled';
import TutorReview from '../sections/@dashboard/tutor/TutorReview';
import TutorScheduled from '../sections/@dashboard/tutor/TutorScheduled';
import TutorCompleted from '../sections/@dashboard/tutor/TutorCompleted';
import Page from '../components/Page';


// mock
import USERLIST from '../_mock/user';
import TutorMatched from "../sections/@dashboard/tutor/TutorMatched";
// import {onValue, ref} from "firebase/database";
//
// let requests = [];
// const reqRef = ref(database, `Requests/${userID}`);
// onValue(reqRef, (snapshot) => {
//   requests = snapshot.val();
// })
// console.log(requests);
// console.log(requests);
//
// const TABLE_HEAD = [
//
//   { id: 'Status', label: 'Status', alignRight: false },
//   { id: 'Course', label: 'Course', alignRight: false },
//   { id: 'Meeting Time', label: 'Meeting Time', alignRight: false },
//   { id: 'Session Length', label: 'Session Length', alignRight: false },
//   { id: 'Location', label: 'Location', alignRight: false },
//   { id: 'Meeting Format', label: 'Meeting Format', alignRight: false },
//
// ];


const auth = getAuth();

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


async function printUserData() {
  // test2 is the id, pass in currently logged in userid
  const userId = auth.currentUser.uid;
  const userData = USER.get_information(userId);
  const data = await userData.then(val => { return val; });
  const requests = data.Requests;
  const result = Object.keys(requests).map((key) => requests[key]);
  /* eslint-disable no-await-in-loop */
  for (let i = 1; i < result.length; i += 1) {
    const requestData = REQUESTS.get_information(result[i]);
    const data2 = await requestData.then(val => { return val; });
    console.log(data2);
  }
  /* eslint-disable no-await-in-loop */
}

export default function TutorDashboardApp() {

  // tabs
  const [value, setValue] = React.useState(1);

  const userRequests = USER.get_user_requests(auth.currentUser.uid);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // ----------------------------------------------------------------------------------
  return (
    <Page title="User">

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
            <Tab label="Matched" {...a11yProps(0)} />
            <Tab label="Scheduled" {...a11yProps(2)} />
            <Tab label="Completed" {...a11yProps(3)} />
          </Tabs>
        </Box>
      
        <TabPanel value={value} index={0}>
          <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h3" gutterBottom>
                Matched
              </Typography>

            </Stack>

            <TutorMatched />

          </Container>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h3" gutterBottom>
                Scheduled
              </Typography>
            </Stack>

            <TutorScheduled/>

          </Container>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h3" gutterBottom>
                Completed
              </Typography>
            </Stack>

            <TutorCompleted/>

            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h3" gutterBottom>
                Reviews
              </Typography>
            </Stack>

            <TutorReview/>

          </Container>
        </TabPanel>
      </Box>

    </Page>
  );
}
