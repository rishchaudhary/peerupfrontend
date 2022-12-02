import React from 'react';
import {Container, Stack, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Iconify from "../Iconify";
import {DBContext} from "../../App";

const AdditionalDetails = ({nextStep, prevStep, handleChange, values}) => {
    const {userLang} = React.useContext(DBContext)
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
                    5. Enter Additional Session Details (optional)
                </Typography>
                <Stack sx={{ py: 2 }} spacing={2} alignItems={"center"}>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Enter Request Details"
                        multiline
                        rows={4}
                        value={values.description}
                        onChange={handleChange('description')}
                    />
                </Stack>
                <Stack direction="row" sx={{ py: 2 }} spacing={2} alignItems={"center"} justifyContent={"center"}>
                    <div>
                        <TextField
                            disabled
                            id="outlined-disabled"
                            label={"Preferred Language"}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={userLang[0]}
                        />
                    </div>
                    <div>
                        <Button variant="contained" component="label" startIcon={<Iconify icon="eva:plus-fill"/>}>
                            Upload Attachment
                            <input
                                hidden
                                multiple
                                type="file"
                                id="usr_doc"
                                name='usr_doc'
                            />
                        </Button>
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

export default AdditionalDetails