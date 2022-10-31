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
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import FormControl from '@mui/material/FormControl';

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
 
 export default function RequestForm() {
 
 const courses = [
    {
      value: 'CS 180',
    },
    {
      value: 'CS 182',
    },
    {
      value: 'CS 240',
    },
    {
      value: 'CS 250',
    },
    {
      value: 'CS 251',
    },
    {
      value: 'CS 252',
    },
    {
      value: 'CS 307',
    },
    {
      value: 'CS 373',
    },
  ];

  const [course, setCurrency] = React.useState('EUR');

  const [datevalue, setDateValue] = React.useState(null);

  const [value, setValue] = React.useState(1);

  const handleChangeCourseSelection = (event, newValue) => {
    setValue(newValue);
  };

return(
    <FormControl>
              <Stack direction="row" spacing={2}>
              <TextField
                id="filled-select-course"
                select
                label="Select Course"
                value={courses}
                onChange={handleChangeCourseSelection}
                helperText="ex: CS 180 ">
                {courses.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </TextField>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Basic example"
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>

             
             
              </Stack>   

              <Stack direction="row" sx={{ py: 4 }}>
              <TextField
                  id="outlined-multiline-static"
                  label="Description"
                  multiline
                  rows={4}
                  defaultValue="What do you need help with?"
                />
              </Stack>  
              </FormControl>
);




}