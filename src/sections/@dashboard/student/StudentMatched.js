import PropTypes from "prop-types";

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
  Toolbar,
  alpha,
  Tooltip,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
// firebase
import {getDatabase, onValue, ref} from "firebase/database";
import {getAuth} from "firebase/auth";

// components
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../user';

// mock
import {Sessions as SESSION} from "../../../Controller/Sessions";





function createData(matchID, sessionID, Name, Course, MeetingDate, MeetingTime, Location, Rate) {
  return {
    matchID,
    sessionID,
    Name,
    Course,
    MeetingDate,
    MeetingTime,
    Location,
    Rate
  };
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_match) => _match.Name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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


function EnhancedTableToolbar(props) {
  const { numSelected, checked } = props;
  const userID = getAuth().currentUser.uid
  const [deleteItem, setDelete] = React.useState(false);
  const [acceptItem, setAccepted] = React.useState(false);
  const tutorID = getAuth().currentUser.uid;


  const handleAccept = (event) => {
    console.log("Accepted Requests:", checked);
    // checked.forEach(requestID => SESSION.create_session(checked, tutorID));
    setAccepted(true);
  }


  const handleDelete = (event) => {
    console.log("Deleted Requests:", checked);

    // checked.forEach(requestID => REQ.reject_request(requestID, tutorID));

    setDelete(true);
  }

  return (
      <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
              bgcolor: (theme) =>
                  alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
          }}
      >
        {numSelected > 0 ? (
            <Typography
                sx={{ flex: '1 1 100%' }}
                color="inherit"
                variant="subtitle1"
                component="div"
            >
              {numSelected} selected
            </Typography>
        ) : (
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
              Select Match
            </Typography>
        )}

        {numSelected > 0 ? (
            <Stack direction={"row"} spacing={5}>
              <Tooltip title="Accept">
                <IconButton onClick={handleAccept}>
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
        ) : (
            <Tooltip title="Filter list">
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
        )}
      </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  checked: PropTypes.array.isRequired
};


export default function TutorMatched() {


  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);


  const database = getDatabase();
  const userID = getAuth().currentUser.uid;



  let userReqIDs = [];
  const reqIdsRef = ref(database, `Users/${userID}/Requests`);
  onValue(reqIdsRef, (snapshot) => {
    userReqIDs = snapshot.val();
  });

  console.log("REQUESTS IDS:", userReqIDs);

  const matchRows = [];
  // setTimeout(() => {
    userReqIDs.slice(1).forEach( (reqID) => {
      let reqObject;
      const reqRef = ref(database, `Requests/${userID}/${reqID}`)
      onValue(reqRef, (snapshot) => {
        reqObject = snapshot.val();
        console.log("Request:", reqObject)
        if (reqObject !== null) {
          const tutorsAcc = reqObject.TutorsWhoAccepted
          if (tutorsAcc.length > 1) {
            tutorsAcc.slice(1).forEach((tutorID, index) => {
              let tutorName;
              const tutorNameRef = ref(database, `Users/${tutorID}/Name`)
              onValue(tutorNameRef, (snapshot) => {
                tutorName = snapshot.val()
              })

              let tutorPrice;
              const tutorPriceRef = ref(database, `TutorAccounts/${tutorID}/Price`)
              onValue(tutorPriceRef, (snapshot) => {
                tutorPrice = snapshot.val()
              })

              if (tutorName != null && reqObject != null && tutorPrice != null) {
                console.log("Request", reqObject)
                console.log("Name", tutorName)
                console.log("Tutor rate", tutorPrice)
                matchRows.push(createData(
                    index,
                    `${userID}/${reqID}`,
                    tutorName,
                    reqObject.CourseWanted,
                    reqObject.Date,
                    reqObject.Time,
                    reqObject.Location,
                    tutorPrice,
                ))
              }
            })
          }
        }
      })
      
    })
  // }, 1)


  console.log("Match Objects", matchRows);


  const TABLE_HEAD = [
    {id: 'Name', label: 'Tutor Name', alignRight: false},
    {id: 'Course', label: 'Course', alignRight: false},
    {id: 'MeetingDate', label: 'Date', alignRight: false},
    {id: 'MeetingTime', label: 'Time', alignRight: false},
    {id: 'Location', label: 'Location', alignRight: false},
    {id: 'Rate', label: 'Rate($/hr)', alignRight: false},
  ];


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = matchRows.map((n) => n.matchID);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, matchID) => {
    const selectedIndex = selected.indexOf(matchID);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, matchID);
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
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - matchRows.length) : 0;

  const filteredUsers = applySortFilter(matchRows, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;


  return (

      <Card>
        <EnhancedTableToolbar checked={selected} numSelected={selected.length} />

        <Scrollbar>
          <TableContainer sx={{minWidth: 800}}>
            <Table>
              <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={matchRows.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const {
                    matchID,
                    SessionID,
                    Name,
                    Course,
                    MeetingDate,
                    MeetingTime,
                    Location,
                    Rate,
                  } = row;
                  const selectedMatch = selected.indexOf(matchID) !== -1;

                  return (
                      <TableRow
                          hover
                          key={matchID}
                          tabIndex={-1}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedMatch} onChange={(event) => handleClick(event, matchID)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            { /* <Avatar alt={tutorName} src={avatarUrl}/> */ }
                            <Typography variant="subtitle2" noWrap>
                              {Name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{Course}</TableCell>
                        <TableCell align="left">{MeetingDate}</TableCell>
                        <TableCell align="left">{MeetingTime}</TableCell>
                        <TableCell align="left">{Location}</TableCell>
                        <TableCell align="left">{Rate}</TableCell>
                        {/* <TableCell align="left"> */}
                        {/*    <IconButton aria-label="accept" size="large" onClick={handleAccept}> */}
                        {/*        <CheckCircleIcon fontSize="inherit"/> */}
                        {/*    </IconButton> */}
                        {/* </TableCell> */}
                        {/* <TableCell align="left"> */}
                        {/*    <IconButton value={index} aria-label="delete" size="large" onClick={handleDelete}> */}
                        {/*        <CancelIcon fontSize="inherit"/> */}
                        {/*    </IconButton> */}
                        {/* </TableCell> */}
                      </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                    <TableRow style={{height: 53 * emptyRows}}>
                      <TableCell colSpan={6}/>
                    </TableRow>
                )}
              </TableBody>

              {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{py: 3}}>
                        <SearchNotFound searchQuery={filterName}/>
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
            count={matchRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
  );
}





