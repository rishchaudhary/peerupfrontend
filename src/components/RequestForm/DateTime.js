import React from 'react';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import {Button, Container, Stack, Typography} from "@mui/material";

const DateTime = ({nextStep, prevStep, handleDateChange, handleTimeChange, handleChange}) => {

    const [dateValue, setDateValue] = React.useState(null);
    const [timeValue, setTimeValue] = React.useState(null);

    const handleDate = (newDate) => {
        setDateValue(newDate)
        handleDateChange(newDate)
    }

    const handleTime = (newTime) => {
        setTimeValue(newTime)
        handleTimeChange(newTime)
    }

    const Continue = e => {
        e.preventDefault()
        nextStep()
    }

    const Previous = e => {
        e.preventDefault();
        prevStep();
    }
    return (
        <Container maxWidth={"sm"}>
            <div>
                <Typography variant={"body1"}>
                    3. Select a date, time, and desired length of your session
                </Typography>
                <Stack direction="row" sx={{ py: 2 }} spacing={2}>
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Select Date"
                                value={dateValue}
                                disablePast
                                onChange={handleDate}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </div>
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                label="Select Time"
                                value={timeValue}
                                onChange={handleTime}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </div>
                    <div>
                        <TextField
                            id="outlined-number"
                            label="Length (hrs)"
                            type="number"
                            onChange={handleChange('length')}
                        />
                    </div>
                </Stack>
                <Stack direction={"row"} spacing={2}>
                    <Button
                        onClick={ Previous }
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={ Continue }
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Next
                    </Button>
                </Stack>
            </div>
        </Container>
    )
}

export default DateTime