import React, {useState} from 'react';
import {getDatabase, ref, onValue} from "firebase/database";
import {Box, Button, Container, FormControl, Stack, Typography} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import {Requests as REQ} from '../../Controller/Requests';

const SelectCourse = ({nextStep, prevStep, handleChange, values}) => {
    const [courses, setCourses] = useState([]);

    React.useEffect(() => {
        REQ.get_university_courses()
            .then(fetchCourses => {
                console.log("listed Courses", fetchCourses)
                setCourses(fetchCourses)
            })
    }, [])

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
                    2. Select your desired course, choose "Other" if the course is not listed
                </Typography>
                <Stack direction="row" sx={{ py: 2 }} spacing={2}>
                    <Box sx={{ minWidth: 120}}>
                        <FormControl fullWidth>
                            <InputLabel id="Course">Course</InputLabel>
                            <Select
                                id="Course"
                                value={values.course}
                                label="Course"
                                onChange={handleChange('course')}
                            >
                                {courses.map(value => {
                                    return (
                                        <MenuItem value={value}>
                                            {value}
                                        </MenuItem>
                                    )
                                })}
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    {(values.course === "Other") ?
                        <div>
                            <TextField
                                id="outlined-basic"
                                label="Course Name (XX ###)"
                                variant="outlined"
                                onChange={handleChange('otherCourse')}
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

export default SelectCourse