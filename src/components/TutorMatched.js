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
} from '@mui/material';

// firebase
import {getDatabase, onValue, ref} from "firebase/database";
import {getAuth} from "firebase/auth";

// components
import Scrollbar from './Scrollbar';
import SearchNotFound from './SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';

// mock
import USERLIST from '../_mock/user';
import {Requests as REQ} from "../Controller/Requests";

function createData(matchID, Name, Course, MeetingDate, MeetingTime, Location, Description) {
    return {
        matchID,
        Name,
        Course,
        MeetingDate,
        MeetingTime,
        Location,
        Description
    };
}


export default function TutorMatched() {


    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [deleteReq, setDelete] = useState(false);
    const [acceptReq, setAccept] = useState(true);

    const database = getDatabase();
    const tutorID = getAuth().currentUser.uid;

    let matchIDs = [];
    const matchIdsRef = ref(database, `TutorAccounts/${tutorID}/Requests`);
    onValue(matchIdsRef, (snapshot) => {
        matchIDs = snapshot.val();
    });
    // console.log("MatchIDs: ", matchIDs);
    const matchRows = [];

    matchIDs.slice(1).forEach((match,) => {
        let reqMatch;
        const reqMatchRef = ref(database, `Requests/${match}`);
        onValue(reqMatchRef, (snapshot) => {
            reqMatch = snapshot.val();
        });
        if (reqMatch != null) {
            matchRows.push(createData(
                match,
                reqMatch.Name,
                reqMatch.CourseWanted,
                reqMatch.Date,
                reqMatch.Time,
                reqMatch.Location,
                reqMatch.Description,
            ));
        }
    })

    console.log("Match Objects", matchRows);


    const TABLE_HEAD = [
        {id: 'Name', label: 'Student Name', alignRight: false},
        {id: 'Course', label: 'Course', alignRight: false},
        {id: 'MeetingDate', label: 'Date', alignRight: false},
        {id: 'MeetingTime', label: 'Time', alignRight: false},
        {id: 'Location', label: 'Location', alignRight: false},
        {id: 'Description', label: 'More info', alignRight: false},
        {id: 'Accept', label: '', alignRight: false},
        {id: 'Reject', label: '', alignRight: false},
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - matchRows.length) : 0;

    const filteredUsers = applySortFilter(matchRows, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    const handleAccept = (event) => {
        console.log("Accepted request:", event.target.parentElement.parentElement.id);
        // REQ.add_tutor_to_request(event.target.parentNode.parentNode.id, tutorID);
    }

    const handleDelete = (event) => {
        console.log("Rejected request:", event.target.parentElement.parentElement.id);

        // REQ.reject_request(event.target.parentNode.parentNode.id);
    }


    return (

        <Card>
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
                                    Name,
                                    Course,
                                    MeetingDate,
                                    MeetingTime,
                                    Location,
                                    Description,
                                } = row;
                                const isItemSelected = selected.indexOf(Name) !== -1;

                                return (
                                    <TableRow
                                        id={matchID}
                                        hover
                                        key={matchID}
                                        tabIndex={-1}
                                    >
                                        <TableCell/>
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
                                        <TableCell align="left">{Description}</TableCell>
                                        <TableCell align="left">
                                            <IconButton aria-label="accept" size="large" onClick={handleAccept}>
                                                <CheckCircleIcon fontSize="inherit"/>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="left">
                                            <IconButton aria-label="delete" size="large" onClick={handleDelete}>
                                                <CancelIcon fontSize="inherit"/>
                                            </IconButton>
                                        </TableCell>
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





