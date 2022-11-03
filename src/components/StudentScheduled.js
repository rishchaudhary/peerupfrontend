// tabs
import * as React from 'react';
import { useState } from 'react';

// ratings
import Rating from '@mui/material/Rating';
// button
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { filter } from 'lodash';
import { DataGrid } from '@mui/x-data-grid';
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

// User data 
import { getAuth } from 'firebase/auth';
import { User as USER } from '../Controller/User';
import { Requests as REQUESTS } from '../Controller/Requests';

// components
import Scrollbar from './Scrollbar';
import SearchNotFound from './SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';

// mock
import USERLIST from '../_mock/user';

const auth = getAuth();

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
    // data2 is the object representing the request data
    const data2 = await requestData.then(val => { return val; });
    console.log(data2); 
  }
  /* eslint-disable no-await-in-loop */
}


const columns = [
  { field: 'id', headerName: 'ID', width: 50 },
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
    field: 'meetingDay',
    headerName: 'Meeting Day',
    width: 200,
    editable: false,
},
  {
      field: 'meetingTime',
      headerName: 'Meeting Time',
      width: 200,
      editable: false,
  },
  {
    field: 'location',
    headerName: 'Location',
    width: 200,
    editable: false,
},
{
  field: 'rate',
  headerName: 'Rate($/hr)',
  width: 200,
  editable: false,
},
 
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', meetingDay:'Tues Jun 26' , meetingTime:'3:00pm', location: 'PMU' , rate: '26.00'},
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', meetingDay:'Tues Jun 26' , meetingTime:'3:00pm', location: 'PMU' , rate: '26.00' },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', meetingDay:'Tues Jun 26' , meetingTime:'3:00pm', location: 'PMU' , rate: '26.00'},
  { id: 4, lastName: 'Stark', firstName: 'Arya', meetingDay:'Tues Jun 26' , meetingTime:'3:00pm', location: 'PMU' , rate: '26.00'},
  {id: 5, lastName: 'Targaryen', firstName: 'Daenerys', meetingDay:'Tues Jun 26' , meetingTime:'3:00pm', location: 'PMU' , rate: '26.00'},
  { id: 6, lastName: 'Melisandre', firstName: null, meetingDay:'Tues Jun 26' , meetingTime:'3:00pm', location: 'PMU' , rate: '26.00' },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', meetingDay:'Tues Jun 26' , meetingTime:'3:00pm', location: 'PMU' , rate: '26.00' },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', meetingDay:'Tues Jun 26' , meetingTime:'3:00pm', location: 'PMU' , rate: '26.00'},
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', meetingDay:'Tues Jun 26' , meetingTime:'3:00pm', location: 'PMU' , rate: '26.00'},

];

export default function StudentScheduled() {

  
    const userData = printUserData();


    return (

      <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
          rows={rows}
          columns={columns}
          pageSize={20}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
      />
  </Box>


    );



}