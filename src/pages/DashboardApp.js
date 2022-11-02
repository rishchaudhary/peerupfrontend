// tabs
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// tabs
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
// ratings
import Rating from '@mui/material/Rating';
// button
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

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
import MatchedView from '../components/StudentMatched';
import CompletedView from '../components/StudentCompleted';
import ScheduledView from '../components/StudentScheduled';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';

// mock
import USERLIST from '../_mock/user';
import StudentCompleted from '../components/StudentCompleted';


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



// ----------------------------------------------------------------------
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

// ----------------------------------------------------------------------

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

  printUserData();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);


  const [formValue, setFormValue] = React.useState('Controlled');

  const handleChangeForm = (event) => {
    setFormValue(event.target.formValue);
  };

  // tabs
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;


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

          <StudentCompleted/>
            
          </Container>
        </TabPanel>
      </Box>

    </Page>
  );
}
