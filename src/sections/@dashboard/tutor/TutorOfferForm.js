import * as React from 'react';
import PropTypes from "prop-types";
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
import {Offers as OFFER} from '../../../Controller/Offers';

TutorOfferForm.propTypes = {
    open: PropTypes.bool.isRequired,
    checked: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
};

export default function TutorOfferForm(props) {
    const { open, checked, onClose, items } = props;
    const [dateValue, setDateValue] = React.useState(null);
    const [timeValue, setTimeValue] = React.useState(null);
    const [requestLocation, setLocation] = React.useState('');
    const [counter, setCounter] = React.useState(false);


    const handleCounter = () => {
        console.log(items)
        console.log("Creating Offer:",checked.at(0), dateValue, timeValue, requestLocation)
        // OFFER.create_offer(checked.at(0), )
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