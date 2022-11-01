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
import Select from '@mui/material/Select';

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

    function printData(){
        console.log(setCourse);
    }
   


    return (
        <FormControl>
            <Stack direction="row" spacing={2}>

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

               

            </Stack>

            <Stack direction="row" sx={{ py: 4 }}>
            <p>{courseValue}</p>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" onChange={console.log(courseValue)} >
                Submit Request
            </LoadingButton>

        </FormControl>
    );




}