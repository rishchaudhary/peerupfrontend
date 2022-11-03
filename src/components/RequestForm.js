import * as React from 'react';
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
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
// material
import {
    Stack,
} from '@mui/material';

import { ReadMoreTwoTone } from '@mui/icons-material';
import { getAuth } from 'firebase/auth';
import AlertModal from "./AlertModal";

// User data 
import { Requests as REQUESTS } from '../Controller/Requests';


const auth = getAuth();

async function createSession(courseName, dateValue, timeValue, requestDescription, requestLocation, meetingFormat, sessionLength) {

    const userID = (auth.currentUser.uid).toString();
    const course = courseName;
    const date = dateValue.toString();
    const time = `${timeValue.toString()} hrs`;
    const descriptionText = requestDescription.toString();
    const requestID = "69-420";
    let sessionFormat = "";

    if (meetingFormat === 0) {
        requestLocation = "";
        sessionFormat = "Online";
    } else {
        sessionFormat = "In-Person"
    }
    const length = sessionLength.toString();
    const format = meetingFormat.toString();
    REQUESTS.create_request(requestID, time, length, date, descriptionText, userID, course, requestLocation, sessionFormat);
}


export default function RequestForm() {

    const [open, setOpen] = React.useState(false);

    const [courseValue, setCourse] = React.useState('CS 180');

    const [showAlert, setAlert] = React.useState(false);

    const [sessionLength, setSessionLength] = React.useState(0);

    const [dateValue, setDateValue] = React.useState(null);

    const [timeValue, setTimeValue] = React.useState(null);

    const [requestDescription, setDescription] = React.useState('');

    const [requestLocation, setLocation] = React.useState('');

    const [meetingFormat, setFormat] = React.useState(0);



    return (


        <FormControl>
            <Stack direction="row" spacing={2}> 
            
                <Box sx={{ width: '100%' }}>
                    <Collapse in={open}>
                        <Alert
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="medium"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                        >
                            Request Posted
                        </Alert>
                    </Collapse>
                  
                </Box>
            </Stack>
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
                        label="Session Length"
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


            <Stack direction="row" sx={{ py: 2 }}>
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

                {meetingFormat
                    ? <div><TextField id="outlined-basic" label="Location" value={requestLocation} variant="outlined" onChange={(event) => {
                        setLocation(event.target.value);
                    }} /></div>
                    : null
                }
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={() => {
                console.log("Creating session");
                setOpen(true);
                createSession(courseValue, dateValue, timeValue, requestDescription, requestLocation, meetingFormat, sessionLength);
            }} >
                Submit Request
            </LoadingButton>

        </FormControl>
    );

}