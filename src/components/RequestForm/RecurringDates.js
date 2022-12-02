import React, {useState} from 'react';
import {Button, Container, Stack, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";

const RecurringDates = ({jumpStep, handleDateChange, handleTimeChange, handleRecurringDays, handleChange}) => {
    const [dateValue, setDateValue] = React.useState(null);
    const [timeValue, setTimeValue] = React.useState(null);
    const [days, setPrefDay] = useState(false);

    const handlePrefDay = (event, newDays) => {
        setPrefDay(newDays);
        handleRecurringDays(newDays)
    }

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
        jumpStep(4)
    }

    const Previous = e => {
        e.preventDefault();
        jumpStep(2);
    }
    return (
        <Container maxWidth={"sm"}>
            <div>
                <Typography variant={"body1"}>
                    3. Select a starting date, recurring time, and desired length of your sessions
                </Typography>
                <Stack direction="row" sx={{ py: 2 }} spacing={2}>
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Start Date"
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
                                label="Recurring Time"
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

                <div>
                    <Typography variant={"body1"}>
                        Select your preferred days, and number of weeks you would like follow this schedule
                    </Typography>
                    <Stack direction={"row"} spacing={3} alignItems="center" sx={{pb: 4}}>
                        <ToggleButtonGroup value={days} name={'prefDays'} onChange={handlePrefDay} aria-label={'Preferred Days'}>
                            <ToggleButton value={0} aria-label = 'Mon'>
                                Mon
                            </ToggleButton>
                            <ToggleButton value={1} aria-label = 'Tue'>
                                Tue
                            </ToggleButton>
                            <ToggleButton value={2} aria-label = 'Wed'>
                                Wed
                            </ToggleButton>
                            <ToggleButton value={3} aria-label = 'Thu'>
                                Thu
                            </ToggleButton>
                            <ToggleButton value={4} aria-label = 'Fri'>
                                Fri
                            </ToggleButton>
                            <ToggleButton value={5} aria-label = 'Sat'>
                                Sat
                            </ToggleButton>
                            <ToggleButton value={6} aria-label = 'Sun'>
                                Sun
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <div>
                            <TextField
                                id="outlined-number"
                                label="# of Weeks"
                                type="number"
                                onChange={handleChange('rNumWeeks')}
                            />
                        </div>
                    </Stack>
                </div>




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

export default RecurringDates