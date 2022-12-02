import React from 'react';
import {Box, Button, Container, FormControl, Stack, Typography} from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";

const FormatDetails = ({nextStep, prevStep, handleChange, values}) => {

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
                    4. Select your desired format
                </Typography>
                <Stack direction="row" sx={{ py: 1 }} spacing={2}>
                    <div>
                        <Box sx={{ minWidth: 120}}>
                            <FormControl fullWidth>
                                <InputLabel id="Format">Format</InputLabel>
                                <Select
                                    label={"Format"}
                                    value={values.format}
                                    onChange={handleChange('format')}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >

                                    <MenuItem value={"Online"}>Online</MenuItem>
                                    <MenuItem value={"In-Person"}>In-person</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </div>

                    {(values.format === "In-Person") ?
                        <div>
                            <TextField
                                id="outlined-basic"
                                label="Location"
                                variant="outlined"
                                onChange={handleChange('location')}
                            />
                        </div>
                        : null
                    }
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

export default FormatDetails