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
import {getDatabase, ref, onValue} from "firebase/database";

// components
import Scrollbar from './Scrollbar';
import SearchNotFound from './SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';

// mock
import USERLIST from '../_mock/user';



const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  {
      field: 'Tutor',
      headerName: 'Tutor Name',
      width: 200,
      editable: false,
  },
  {
    field: 'Date',
    headerName: 'Meeting Day',
    width: 200,
    editable: false,
},
  {
      field: 'StartTime',
      headerName: 'Meeting Time',
      width: 200,
      editable: false,
  },
  {
    field: 'Location',
    headerName: 'Location',
    width: 200,
    editable: false,
},
{
  field: 'Format',
  headerName: 'Meeting Format',
  width: 200,
  editable: false,
},
 
];



export default function StudentCompleted() {

const auth = getAuth();
const database = getDatabase();
const userID = getAuth().currentUser.uid;

console.log(userID);

let userSesIDs = [];
const sessionsIdsRef = ref(database, `Users/${userID}/Sessions`);
onValue(sessionsIdsRef, (snapshot) => {
  userSesIDs = snapshot.val();
});

console.log("Completed Sessions IDS: ", userSesIDs);

const userSesObjs = [];
for(let i = 1; i < userSesIDs.length; i+= 1){
  const sessionID = userSesIDs[i];
  const sesRef = ref(database, `Sessions/${sessionID}`);
  onValue(sesRef, (snapshot) => {
    if(snapshot.toJSON().Completed){
      userSesObjs.push(snapshot.val());
    }
 
  });
}



console.log("Completed User Session Objects", userSesObjs);



    return (
      <Card>
      <Box sx={{ height: 250, width: '100%' }}>
      <DataGrid
          rows={userSesObjs}
          columns={columns}
          pageSize={20}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
      />
  </Box>
  </Card>

    );



}