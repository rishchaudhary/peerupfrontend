// tabs
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
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
import { LoadingButton } from '@mui/lab';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';


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
import { ReadMoreTwoTone } from '@mui/icons-material';

// User data 
import { User as USER } from '../Controller/User';
import { Requests as REQUESTS } from '../Controller/Requests';
import { auth } from '../firebaseConfig/auth';

//create_request(requestID, startTime, length, date, description, userID, course, location, format)
async function createSession(courseName, dateValue, timeValue, requestDescription, requestLocation, meetingFormat, sessionLength) {

    const userID = auth.currentUser.uid;
    const course = courseName;
    const date = dateValue.toString();
    const time = timeValue.toString();
    const descriptionText = requestDescription.toString();
    const requestID = Math.random();

    REQUESTS.create_request(requestID, time, sessionLength, date, descriptionText, userID, course, requestLocation, meetingFormat);
}

function printData(courseValue, dateValue, timeValue, requestDescription, requestLocation, meetingFormat, sessionLength) {
    console.log("Button clicked");
    console.log(courseValue);
    console.log(dateValue.toString());
    console.log(timeValue.toString());
    console.log(requestDescription);
    console.log(requestLocation);
    console.log(meetingFormat);
}

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

    const format = [
        {
            value: 'Online',
        },
        {
            value: 'In-person',
        },
        
    ];

    const [courseValue, setCourse] = React.useState('CS 180');

    const [sessionLength, setSessionLength] = React.useState(0); 

    // change this to null
    const [dateValue, setDateValue] = React.useState("");

    // change this to null
    const [timeValue, setTimeValue] = React.useState("");

    const [requestDescription, setDescription] = React.useState('');

    const [requestLocation, setLocation] = React.useState('');

    const [meetingFormat, setFormat] = React.useState(0);

    function printData() {
        console.log(setCourse.toString());
    }

   


    return (
        <FormControl>
            <Stack direction="row" spacing={2}>
                <div>
                    <InputLabel id="demo-simple-select-label">Course</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={courseValue}
                        label="Course"
                        onChange={(e) => setCourse(e.target.value)}
                    >
                        <MenuItem value="CS 180">CS 180</MenuItem>
                        <MenuItem value="CS 182">CS 182</MenuItem>
                        <MenuItem value="CS 240">CS 240</MenuItem>
                    </Select>
                </div>

                <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Select Date"
                            value={dateValue}
                            onChange={(newValue) => {
                                setDateValue(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>

                <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            label="Select Time"
                            value={timeValue}
                            onChange={(newValue) => {
                                setTimeValue(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>


                <div>
                    <TextField
                        id="outlined-number"
                        label="Number"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(event) => {
                            setSessionLength(event.target.value);
                        }}
                    />
                </div>


            </Stack>

        
            <Stack direction="row" sx={{ py: 2}}>

    
                <div>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Enter Request Details"
                        multiline
                        maxRows={4}
                        value={requestDescription}
                        onChange={(event) => {
                            setDescription(event.target.value);
                        }}
                    />
                </div>
            </Stack>

            <Stack direction="row" sx={{ py: 1 }} spacing={2}>

                <div>
                    <Select
                        value={meetingFormat}
                        onChange={(e) => setFormat(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                    >

                        <MenuItem value={0}>Online</MenuItem>
                        <MenuItem value={1}>In-person</MenuItem>
                    </Select>
                </div>
              
                
                { meetingFormat
                    ? <div><TextField id="outlined-basic" label="Location" value={requestLocation} variant="outlined"  onChange={(event) => {
                        setLocation(event.target.value);}}/></div>
                    : null
                }
            
            </Stack>

           
            
            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={() => {
                /*
                console.log(courseValue);     
                console.log(dateValue.toString()); 
                console.log(timeValue.toString()); 
                console.log(requestDescription); 
                console.log(requestLocation); 
                console.log(meetingFormat); 
                */
            }} >
                Submit Request
            </LoadingButton>

        </FormControl>
    );




}