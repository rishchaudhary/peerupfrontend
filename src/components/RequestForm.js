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
import { LoadingButton } from '@mui/lab';

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


async function createSession(courseName, requestDay, requestTime, description){

    const userID = auth.currentUser.uid;
    const course = courseName.toString();
    const day = requestDay.toString();
    const time = requestTime.toString();
    const descriptionText = description.toString();
    const requestID = Math.random();
    
    REQUESTS.create_request(requestID, time, day, descriptionText, userID, course);
}

async function printData(courseValue,dateValue,timeValue, requestDescription){
    console.log(courseValue.toString());
    console.log(dateValue);
    console.log(timeValue);
    console.log(requestDescription);
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

    const [courseValue, setCourse] = React.useState('CS 180');

    const [dateValue, setDateValue] = React.useState(null);

    const [timeValue, setTimeValue] = React.useState(1);

    const [requestDescription, setDescription] = React.useState("");

    const [requestData, setRequestData] = useState({
        // course: React.useState('CS 180'),
        // date: React.useState(null),
        // time: React.useState(1),
        description: "",
    })

    requestData.course = React.useState('CS 180');
    requestData.date = React.useState(null);
    requestData.time =  React.useState(1);
    requestData.description = React.useState("");

    function handle(e) {
        // const newdata = {...requestData}
        
        // const newCourse = {... courseValue}
        // const newDate = {...dateValue}
        // const newTime = {...timeValue}
        const newDescription = {...requestDescription}

        // newdata[e.target.id] = e.target.value
        // newCourse[e.target.id] = e.target.value
        // newDate[e.target.id] = e.target.value
        // newTime[e.target.id] = e.target.value
        newDescription[e.target.id] = e.target.value
        console.log(newDescription);
        
        // setRequestData(newdata)
        /*
        handleChangeCourseSelection(newCourse)
        handleDateSelection(newDate)
        handleTimeSelection(newTime)
        handleDescription(newDescription)
        */

    }



    const handleChangeCourseSelection = (event, newValue) => {
        setCourse(newValue);
        console.log(courseValue.toString());
    };
    const handleDateSelection = (event, newValue) => {
        setDateValue(newValue);
        console.log(dateValue.toString());
    };

    const handleTimeSelection = (event, newValue) => {
        setTimeValue(newValue);
        console.log(timeValue.toString());
    };

    const handleDescription = (event, newValue) => {
        setDescription(newValue);
        console.log(requestDescription.toString());
    };


    return (
        <FormControl>



            <Stack direction="row" spacing={2}>

                <input onChange={handleDescription} id="description" value={requestDescription} placeholder="description" type="text"/>

                <TextField
                    id="courseValue"
                    select
                    label="Select Course"
                    value={courseValue}
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
                        id="dateValue"
                        value={dateValue}
                        onChange={handleDateSelection}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        label="Select Time"
                        id="timeValue"
                        value={timeValue}
                        onChange={handleTimeSelection}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>

            </Stack>

            <Stack direction="row" sx={{ py: 4 }}>
                <TextField
                    id="requestDescription"
                    label="Request Description3"
                    multiline
                    rows={4}
                    defaultValue={requestDescription}
                    onChange={handleDescription}
                />
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" >
                Submit Request
            </LoadingButton>

        </FormControl>
    );




}