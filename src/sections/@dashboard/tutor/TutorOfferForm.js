import * as React from 'react';
import PropTypes from "prop-types";
import {getAuth} from "firebase/auth";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Stack,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import {Requests as REQUEST} from '../../../Controller/Requests';


TutorOfferForm.propTypes = {
    open: PropTypes.bool.isRequired,
    checked: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
};

export default function TutorOfferForm(props) {
    const tutorID = getAuth().currentUser.uid;

    const { open, checked, onClose, items } = props;
    const [dateValue, setDateValue] = React.useState(null);
    const [timeValue, setTimeValue] = React.useState(null);
    const [requestLocation, setLocation] = React.useState(items.at(0).location);
    const [counter, setCounter] = React.useState(false);


    const handleCounter = () => {

        const dateData = dateValue.$d.toString();
        const dateVal = dateData.split(' ').slice(0, 4);
        const finalDate = `${dateVal[0]}, ${dateVal[1]} ${dateVal[2]}, ${dateVal[3]}`;

        const timeData = timeValue.$d.toString();
        const timeVal = timeData.split(' ')[4];
        const timeVals = timeVal.split(':');
        let finalTime = '';
        if (Number(timeVals[0]) < 12) {
            finalTime = `${timeVals[0]}:${timeVals[1]} AM`
        } else if (Number(timeVals[0]) > 12) {
            finalTime = `${Number(timeVals[0]) - 12}:${timeVals[1]} PM`
        } else {
            finalTime = `${timeVals[0]}:${timeVals[1]} PM`
        }
        console.log("Creating Offer:",checked.at(0), finalDate, finalTime, requestLocation)
        REQUEST.create_offer(checked.at(0), tutorID, finalTime, finalDate, requestLocation)
        setCounter(true);
    };

    const handleClose = () => {
        onClose()
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Enter New Offer</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date"
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
                                    label="Time"
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
                                id="outlined-basic"
                                label="Location"
                                value={items.at(0).location}
                                variant="outlined"
                                onChange={(event) => {setLocation(event.target.value)}}
                            />
                        </div>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" endIcon={<SendIcon />} onClick={handleCounter}>
                        Send Offer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}