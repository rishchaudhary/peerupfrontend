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

function createData(StudentName, Course, MeetingDate, MeetingTime, Location, Description) {
    return {
        StudentName,
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

    const database = getDatabase();
    const tutorID = getAuth().currentUser.uid;

    let matchIDs = [];
    const matchIdsRef = ref(database, `TutorAccounts/${tutorID}/Requests`);
    onValue(matchIdsRef, (snapshot) => {
        matchIDs = snapshot.val();
    });
    // console.log("MatchIDs: ", matchIDs);
    const reqMatchObjs = [];

    matchIDs.slice(1).forEach((match,) => {
        let reqMatch;
        const reqMatchRef = ref(database, `Requests/${match}`);
        onValue(reqMatchRef, (snapshot) => {
            reqMatch = snapshot.val();
        });
        reqMatchObjs.push(reqMatch);
    })

    console.log("Match Objects", reqMatchObjs);

    // const matchRows = [];
    // reqMatchObjs.forEach((match) => {
    //     let student;
    //     console.log(match.CreatedBy);
    //     const studentRef = ref(database, `Users/${match.CreatedBy}`);
    //     onValue(studentRef, (snapshot) => {
    //         student = snapshot.val();
    //     });
    //     console.log("Name:", student);
    //     // matchRows.push(createData(
    //     //     studentName,
    //     //     match.CourseWanted,
    //     //     match.MeetingDate,
    //     //     match.MeetingTime,
    //     //     match.Location,
    //     //     match.Description
    //     //     ));
    // })
    // console.log("Match Rows", matchRows);







    const TABLE_HEAD = [
        {id: 'StudentName', label: 'Student Name', alignRight: false},
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


    return (

        <Card>
            <Scrollbar>
                <TableContainer sx={{minWidth: 1000}}>
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
                                const {
                                    id,
                                    tutorName,
                                    dateuploaded,
                                    avatarUrl,
                                    dateAndTime,
                                    location,
                                    rate,
                                    sessionsHosted,
                                    rating
                                } = row;
                                const isItemSelected = selected.indexOf(tutorName) !== -1;

                                return (
                                    <TableRow
                                        hover
                                        key={id}
                                        tabIndex={-1}
                                    >
                                        <TableCell/>
                                        <TableCell component="th" scope="row" padding="none">
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Avatar alt={tutorName} src={avatarUrl}/>
                                                <Typography variant="subtitle2" noWrap>
                                                    {tutorName}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="left"> <Rating name="read-only" value={rating}
                                                                         readOnly/></TableCell>
                                        <TableCell align="left">{dateAndTime}</TableCell>
                                        <TableCell align="left">{location}</TableCell>
                                        <TableCell align="left">{rate}</TableCell>
                                        <TableCell align="left">{sessionsHosted}</TableCell>
                                        <TableCell align="left"><IconButton aria-label="delete"
                                                                            size="large"><CheckCircleIcon
                                            fontSize="inherit"/>
                                        </IconButton></TableCell>
                                        <TableCell align="left"><IconButton aria-label="delete" size="large"><CancelIcon
                                            fontSize="inherit"/>
                                        </IconButton></TableCell>
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
                count={USERLIST.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Card>
    );
}





