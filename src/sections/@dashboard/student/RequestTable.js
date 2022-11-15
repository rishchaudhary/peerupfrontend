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
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import {getDatabase, ref, onValue} from "firebase/database";
import {getAuth} from "firebase/auth";
import {Requests as REQ} from "../../../Controller/Requests";

function createData(CourseWanted, Time, Length, Location, IsOnline, reqID) {
  return {
    CourseWanted,
    Time,
    Length,
    Location,
    IsOnline,
    reqID
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
    id: 'CourseWanted',
    numeric: false,
    disablePadding: true,
    label: 'Course',
  },
  {
    id: 'Time',
    numeric: false,
    disablePadding: false,
    label: 'Meeting Time',
  },
  {
    id: 'Length',
    numeric: false,
    disablePadding: false,
    label: 'Length',
  },
  {
    id: 'Location',
    numeric: false,
    disablePadding: false,
    label: 'Location',
  },
  {
    id: 'IsOnline',
    numeric: false,
    disablePadding: false,
    label: 'Meeting Format',
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

  const handleDelete = (event) => {
    console.log("Deleted Requests:", checked);
    const deletedIDs = [];
    checked.forEach(value => {
      deletedIDs.push(`${userID}/${value}`);
    });

    REQ.delete_request(deletedIDs);

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
              Active Requests
            </Typography>
        )}

        {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
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

export default function RequestTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('course');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [requests, setRequests] = React.useState(false);

  const database = getDatabase();
  const userID = getAuth().currentUser.uid;

  let userReqIDs = [];
  const reqIdsRef = ref(database, `Users/${userID}/Requests`);
  onValue(reqIdsRef, (snapshot) => {
    userReqIDs = snapshot.val();
  });

  console.log("REQUESTS IDS:", userReqIDs);

  const reqRows = [];

  let userReqObjs = [];
  const reqRef = ref(database, `Requests/${userID}`);
  onValue(reqRef, (snapshot) => {
    userReqObjs = snapshot.val();
  })

   setTimeout(() => {
      console.log("Request objects", userReqObjs);
      for (let i = 1; i < userReqIDs.length; i += 1) {
        const reqObj = userReqObjs[userReqIDs[i]];
        reqRows.push(createData(
            reqObj.CourseWanted,
            reqObj.Time,
            reqObj.Length,
            reqObj.Location,
            reqObj.IsOnline,
            userReqIDs[i]
        ));
      }
    }, 1)


  console.log("newROWS:", reqRows);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = reqRows.map((n,) => n.reqID);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, reqID) => {
    const selectedIndex = selected.indexOf(reqID);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, reqID);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
      );
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

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (reqID) => selected.indexOf(reqID) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - reqRows.length) : 0;

  return (
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar checked={selected} numSelected={selected.length} />
          <TableContainer>
            <Table
                sx={{ minWidth: 750, maxWidth: 800}}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={reqRows.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.sort(getComparator(order, orderBy)).slice() */}
                {stableSort(reqRows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.reqID);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                          <TableRow
                              hover
                              onClick={(event) => handleClick(event, row.reqID)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.reqID}
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
                            <TableCell
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                            >
                              {row.CourseWanted}
                            </TableCell>
                            <TableCell align="right">{row.Time}</TableCell>
                            <TableCell align="right">{row.Length}</TableCell>
                            <TableCell align="right">{row.Location}</TableCell>
                            <TableCell align="right">{row.IsOnline}</TableCell>
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
              count={reqRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
        />
      </Box>
  );
}
