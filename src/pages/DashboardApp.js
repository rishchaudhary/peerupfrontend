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
import RequestForm from '../components/RequestForm';
import RequestTable from '../components/RequestTable';
import MatchedView from '../components/StudentMatched';
import CompletedView from '../components/StudentCompleted';
import ScheduledView from '../components/StudentScheduled';
import Page from '../components/Page';


// mock
import USERLIST from '../_mock/user';
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

export default function DashboardApp() {

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
            <Tab label="Request" {...a11yProps(0)} />
            <Tab label="Matched" {...a11yProps(1)} />
            <Tab label="Scheduled" {...a11yProps(2)} />
            <Tab label="Completed" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h3" gutterBottom>
                Request
              </Typography>
            </Stack>
            <Card sx={{ px: 7, py: 4 }}>
              <RequestForm />
              <RequestTable/>
            </Card>

            
            
          </Container>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h3" gutterBottom>
                Matched
              </Typography>

            </Stack>

            <MatchedView />

          </Container>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h3" gutterBottom>
                Scheduled
              </Typography>
            </Stack>

            <ScheduledView/>

          </Container>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h3" gutterBottom>
                Completed
              </Typography>
            </Stack>

          <CompletedView/>

          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{ py: 2 }}>
              <Typography variant="h3" gutterBottom>
                Reviews
              </Typography>
            </Stack>

            <CompletedView/>

          </Container>
        </TabPanel>
      </Box>

    </Page>
  );
}
