import * as React from 'react';
import {useEffect, useState} from "react";

import PropTypes from 'prop-types';
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
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
import LoopIcon from '@mui/icons-material/Loop';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { visuallyHidden } from '@mui/utils';
import {getDatabase, ref, onValue} from "firebase/database";
import {getAuth} from "firebase/auth";
import {Card, Chip, Popover, Stack} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {User as USER} from "../../../Controller/User";
import {Tutor as TUTOR} from "../../../Controller/Tutor"
import {Sessions as SESS} from "../../../Controller/Sessions";





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
    id: 'Student',
    numeric: false,
    disablePadding: false,
    label: 'Student Name'
  },
  {
    id: 'Date',
    numeric: false,
    disablePadding: false,
    label: 'Date',
  },
  {
    id: 'Time',
    numeric: false,
    disablePadding: false,
    label: 'Time',
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
    id: 'Recurring',
    numeric: false,
    disablePadding: false,
    label: "",
  }
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
  const [completed, setCompleted] = React.useState(false);
  const [showAlert, setAlert] = React.useState(false);

  const handleComplete = (event) => {
    console.log("Completed Sessions:", checked);
    checked.forEach(value => {
      SESS.session_completed(`${userID}/${value}`);
    });
    setCompleted(numSelected)
    setAlert(!showAlert)
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
          alignItems={"center"}
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
              Active Sessions
            </Typography>
        )}

        <Box sx={{ width: '100%' }}>
          <Collapse in={showAlert}>
            <Alert
                action={
                  <IconButton
                      aria-label="close"
                      color="inherit"
                      size="medium"
                      onClick={() => {
                        setAlert(false);
                      }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
            >
              Session Completed
            </Alert>
          </Collapse>
        </Box>

        {numSelected > 0 ? (
            <Tooltip title="Mark as Completed!">
              <IconButton onClick={handleComplete}>
                <TaskAltIcon />
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



export default function TutorScheduled() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('course');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sessions, setSessions] = React.useState([]);
  const userID = getAuth().currentUser.uid;

  useEffect(() => {
    TUTOR.get_sessions(userID)
        .then(fetchSessions => {
          console.log("SESSIONS TUTOR HERE:", fetchSessions)
          setSessions(fetchSessions)
        })
  }, [])

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = sessions.map((n,) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, sessID) => {
    const selectedIndex = selected.indexOf(sessID);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, sessID);
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
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sessions.length) : 0;

  if (sessions.length === 0) {
    return (
        <Typography variant="body2" sx={{ p: 1 }}>Your matches will appear here once you create some!</Typography>
    )
  }

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
                  rowCount={sessions.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                     rows.sort(getComparator(order, orderBy)).slice() */}
                {stableSort(sessions, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      const preferredDays = Object.values(row.rDays)

                      let prefDays = `For ${row.weeks} Weeks, On: `
                      preferredDays.forEach(value => {
                        if (value.value) {
                          prefDays += `${value.key}, `
                        }
                      })


                      return (
                          <TableRow
                              hover
                              onClick={(event) => handleClick(event, row.id)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.id}
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
                            <TableCell align="center">{row.tutor}</TableCell>
                            <TableCell align="center">{row.date}</TableCell>
                            <TableCell align="center">{row.time}</TableCell>
                            <TableCell align="center">{row.length}</TableCell>
                            <TableCell align="center">{row.location}</TableCell>
                            <TableCell
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                            >
                              {(row.recurring)
                                  ?
                                  <div key={index}>
                                    <Chip
                                        label={"Rec"}
                                        icon={<LoopIcon />}
                                        size={"small"}
                                        sx={{bgcolor: 'primary.dark', fontWeight: 'light'}}
                                        aria-owns={open ? 'mouse-over-popover' : undefined}
                                        aria-haspopup="true"
                                        onMouseEnter={handlePopoverOpen}
                                        onMouseLeave={handlePopoverClose}
                                    />
                                    <Popover
                                        id="mouse-over-popover"
                                        sx={{
                                          pointerEvents: 'none',
                                        }}
                                        open={open}
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                          vertical: 'bottom',
                                          horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                          vertical: 'top',
                                          horizontal: 'left',
                                        }}
                                        onClose={handlePopoverClose}
                                        disableRestoreFocus
                                    >
                                      <Typography variant="body2" sx={{ p: 1 }}>{prefDays}</Typography>
                                    </Popover>
                                  </div>
                                  :
                                  <Chip
                                      label={"One"}
                                      icon={<LooksOneIcon />}
                                      size={"small"}
                                      sx={{bgcolor: 'primary.dark', fontWeight: 'light'}}
                                      aria-owns={open ? 'mouse-over-popover' : undefined}
                                      aria-haspopup="true"
                                      onMouseEnter={handlePopoverOpen}
                                      onMouseLeave={handlePopoverClose}
                                  />
                              }


                            </TableCell>
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
              count={sessions.length}
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