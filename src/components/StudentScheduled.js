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

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');
  
    const [selected, setSelected] = useState([]);
  
    const [orderBy, setOrderBy] = useState('name');
  
    const [filterName, setFilterName] = useState('');
  
    const [rowsPerPage, setRowsPerPage] = useState(5);
  
  
    const TABLE_HEAD = [
      { id: 'Tutor Name', label: 'Tutor Name', alignRight: false },
      { id: 'Ratings', label: '', alignRight: false },
      { id: 'Meeting Time', label: 'Meeting Time', alignRight: false },
      { id: 'Location', label: 'Location', alignRight: false },
      { id: 'Rate($/hr)', label: 'Rate($/hr)', alignRight: false },
      { id: 'Sessions', label: 'Sessions', alignRight: false },
      { id: 'Accept', label: '', alignRight: false },
      { id: 'Reject', label: '', alignRight: false },
    ];
  
  
  
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
  
    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = USERLIST.map((n) => n.name);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    };
  
    function applySortFilter(array, comparator, query) {
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
      if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
      }
      return stabilizedThis.map((el) => el[0]);
    }
  
    function descendingComparator(a, b, orderBy) {
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    }
  
    function getComparator(order, orderBy) {
      return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;
  
    const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);
  
    const isUserNotFound = filteredUsers.length === 0;

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