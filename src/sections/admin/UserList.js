import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import {HelpForm as SUP} from "../../Controller/HelpForm";
import {Review as REV} from "../../Controller/Review";
import {User as USER} from "../../Controller/User";


function createData(Name,Email,Rating,Major, Bio, Language, userID) {
    return {
        Name,
        Email,
        Rating,
        Major,
        Bio,
        Language,
        userID
    };
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

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'Name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
    },
    {
        id: 'Email',
        numeric: false,
        disablePadding: true,
        label: 'Email',
    },
    {
        id: 'Rating',
        numeric: false,
        disablePadding: true,
        label: 'Rating',
    },
    
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all requests',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={"center"}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected, checked } = props;
    const userID = getAuth().currentUser.uid
    const [deleteItem, setDelete] = React.useState(false);


    // Delete support ticket 
    const handleDelete = (event) => {

        console.log("Deleted Requests:", checked);
        const deletedIDs = [];
        console.log("Checked ids:", deletedIDs);
        checked.forEach(value => {
            deletedIDs.push(`${value}`);
        });
        console.log("Delete id:", deletedIDs);
        USER.delete_account(deletedIDs);

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
                  List of all users
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={handleDelete}>
                        Delete User: <PersonRemoveIcon />
                    </IconButton>
                </Tooltip>
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

export default function UserList() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('CreatedBy');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [requests, setRequests] = React.useState(false);
    const [checked, setCheck] = React.useState(false);
    
    const [Name, setName ] = React.useState('Name');
    const [Major, setMajor] = React.useState('Major');
    const [Language, setLanguage] = React.useState('Language');
    const [Bio, setBio] = React.useState('Bio');

    const database = getDatabase();
    const userID = getAuth().currentUser.uid;

    let userIDs = [];
    const userIdsRef = ref(database, `Users`);
    onValue(userIdsRef, (snapshot) => {
       /* userSupIDs = snapshot.val(); */
       userIDs = Object.keys(snapshot.val());
    });

    // console.log("SUPPORT IDS:", userSupIDs);

    const userRows = [];
    const userObjs = [];


    for(let i=0; i < userIDs.length; i+= 1){
        const userID = userIDs[i];
        const userRef = ref(database, `Users/${userID}`);
        onValue(userRef,(snapshot) => {
            userObjs.push(snapshot.val());
        });
    }

    console.log("User objects", userObjs);

        for (let i = 0; i < userIDs.length; i += 1) {
            const userObj = userObjs[i];
            /* console.log("Support ticket created by", supObj.CreatedBy); */
            /* console.log("Support ticket email", supObj.Email); */
            /* console.log("Support ticket description", supObj.Description); */
            /* console.log("Support ticket id:", userSupIDs[i]); */
            // console.log("Table id:", i);
            userRows.push(createData(
              userObj.Name,  
              userObj.Email,
                userObj.Rating,
                userObj.Major,
                userObj.Bio,
                userObj.Language,
                userIDs[i]
            ));
        
        }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = userRows.map((n,) => n.userID);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, userID) => {
        const selectedIndex = selected.indexOf(userID);
        let newSelected = [];
        if (selectedIndex === -1) {
            console.log("case 1");
            newSelected = newSelected.concat(selected, userID);
        } else if (selectedIndex === 0) {
            console.log("case 2");
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            console.log("case 3");
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            console.log("case 4");
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        console.log("Currently selected:", newSelected);
        console.log("Inside handle click:", userRows);
        setSelected(newSelected);

        if (selectedIndex === -1) {
        for (let i = 0; i < userRows.length; i += 1) {
            if((userRows[i].userID).toString() === (newSelected.toString())){
                setName(userRows[i].Name.toString());
                setMajor(userRows[i].Major.toString());
                setBio(userRows[i].Bio.toString());
                setLanguage(userRows[i].Langauge.toString());

                console.log("Major:", userRows[i].Major);
                console.log("Major:", Major);

            }
        }
    }

       //  setCheck(true);
        // setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (userID) => selected.indexOf(userID) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userRows.length) : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar checked={selected} numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750, maxWidth: 800 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={userRows.length}
                        />
                        <TableBody>
                            
                            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.sort(getComparator(order, orderBy)).slice() */}
                            {stableSort(userRows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.userID);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                           
                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.userID)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.userID}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                
                                            </TableCell>
                                            <TableCell align="center">{row.Name}</TableCell>
            
                                            <TableCell align="center">{row.Email}</TableCell>
                                            <TableCell align="center">{row.Rating}</TableCell>

                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
               
              

        
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={userRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Paper>
                Name: {Name}
            </Paper>

            <Paper>
                Major: {Major}
            </Paper>

          

            <Paper>
                Bio: {Bio}
            </Paper>

        </Box>

        
    );
}
