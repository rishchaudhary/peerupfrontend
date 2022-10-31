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

// forms
import TextField from '@mui/material/TextField';

//User data 
import USER from '../../src/Controller/User';

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

// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';



// mock
import USERLIST from '../_mock/user';


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

 async function printUserData(){
  //test2 is the id, pass in currently logged in userid
  const userData = user.get_information('test2');
    const data = await userData.then(val => {return val;});
    const requests = data.Requests;
    const result = Object.keys(requests).map((key) => requests[key]);

    for(let i = 1; i < result.length; i++){
      const requestData = Requests.get_information(result[i]);
      const data2 = await requestData.then(val => {return val;});
      console.log(data2);
    }
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
//----------------------------------------------------------------------------------

window.onload = function() {
  yourFunction(param1, param2);
};







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
            <Card sx={{px:3, py:4}}>
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
              >
                <div>

                <TextField id="outlined-search" label="Course Name" type="search" />
                <TextField id="outlined-search" label="Location" type="search" />
                  <TextField
                    id="outlined-number"
                    label="Session Length"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                <TextField id="outlined-search" label="Date" type="search" />
                <TextField id="outlined-search" label="Time" type="search" />
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Description"
                    multiline
                    rows={4}
                    value={formValue}
                    onChange={handleChangeForm}
                  />
                  
                  
                </div>
                
                
              </Box>
              <Box sx={{ px: 2 }}>
                <Button variant="contained" component="label" startIcon={<Iconify icon="eva:plus-fill" />}>
                  Add Attachments
                  <input hidden accept="image/*" multiple type="file" />
                </Button>
               
              </Box>

              
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

            <Card>

              <Scrollbar>
                <TableContainer sx={{ minWidth: 1000 }}>
                  <Table>
                    <UserListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={USERLIST.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        const { id, tutorName, dateuploaded, avatarUrl, dateAndTime, location, rate, sessionsHosted, rating } = row;
                        const isItemSelected = selected.indexOf(tutorName) !== -1;

                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                          >
                            <TableCell />
                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={tutorName} src={avatarUrl} />
                                <Typography variant="subtitle2" noWrap>
                                  {tutorName}

                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="left"> <Rating name="read-only" value={rating} readOnly /></TableCell>
                            <TableCell align="left">{dateAndTime}</TableCell>
                            <TableCell align="left">{location}</TableCell>
                            <TableCell align="left">{rate}</TableCell>
                            <TableCell align="left">{sessionsHosted}</TableCell>
                            <TableCell align="left"><IconButton aria-label="delete" size="large"><CheckCircleIcon fontSize="inherit" />
                            </IconButton></TableCell>
                            <TableCell align="left"><IconButton aria-label="delete" size="large"><CancelIcon fontSize="inherit" />
                            </IconButton></TableCell>
                          </TableRow>
                        );
                      })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>

                    {isUserNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <SearchNotFound searchQuery={filterName} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={USERLIST.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Container>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h3" gutterBottom>
                Scheduled
              </Typography>

            </Stack>

            <Card>

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <UserListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={USERLIST.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        const { id, tutorName, dateuploaded, avatarUrl, dateAndTime, location, rate, sessionsHosted, rating } = row;
                        const isItemSelected = selected.indexOf(tutorName) !== -1;

                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            selected={isItemSelected}
                            aria-checked={isItemSelected}>
                            <TableCell padding="checkbox" />
                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={tutorName} src={avatarUrl} />
                                <Typography variant="subtitle2" noWrap>
                                  {tutorName}

                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="left"> <Rating name="read-only" value={rating} readOnly /></TableCell>
                            <TableCell align="left">{dateAndTime}</TableCell>
                            <TableCell align="left">{location}</TableCell>
                            <TableCell align="left">{rate}</TableCell>
                            <TableCell align="left">{sessionsHosted}</TableCell>

                          </TableRow>
                        );
                      })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>

                    {isUserNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <SearchNotFound searchQuery={filterName} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={USERLIST.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Container>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h3" gutterBottom>
                Completed
              </Typography>

            </Stack>

            <Card>

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <UserListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={USERLIST.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        const { id, tutorName, dateuploaded, avatarUrl, dateAndTime, location, rate, sessionsHosted, rating } = row;
                        const isItemSelected = selected.indexOf(tutorName) !== -1;

                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            selected={isItemSelected}
                            aria-checked={isItemSelected}>
                            <TableCell padding="checkbox" />
                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={tutorName} src={avatarUrl} />
                                <Typography variant="subtitle2" noWrap>
                                  {tutorName}

                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="left"> <Rating name="read-only" value={rating} readOnly /></TableCell>
                            <TableCell align="left">{dateAndTime}</TableCell>
                            <TableCell align="left">{location}</TableCell>
                            <TableCell align="left">{rate}</TableCell>
                            <TableCell align="left">{sessionsHosted}</TableCell>

                          </TableRow>
                        );
                      })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>

                    {isUserNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <SearchNotFound searchQuery={filterName} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={USERLIST.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Container>
        </TabPanel>
      </Box>

    </Page>
  );
}
