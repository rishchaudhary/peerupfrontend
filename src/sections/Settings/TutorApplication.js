import * as Yup from 'yup';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import * as React from "react";
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
    Stack,
    ToggleButton,
    Typography,
    FormControl,
    OutlinedInput,
    Box,
    Chip,
    Select,
    MenuItem,
    useTheme,
    ToggleButtonGroup,
    InputLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { getAuth } from 'firebase/auth';
// components
import { FormProvider, RHFTextField } from '../../components/hook-form';
import {Tutor as TUTOR} from '../../Controller/Tutor';


// ----------------------------------------------------------------------

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const courseNames = [
    'CS 180',
    'CS 182',
    'CS 240',
];

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function TutorApplication() {
    const navigate = useNavigate();
    const auth = getAuth();
    const userID = auth.currentUser.uid;

    const theme = useTheme();
    const [selectedCourses, setSelectedCourses] = React.useState([]);

    const [days, setPrefDay] = useState([]);
    const [times, setPrefTime] = useState([]);

    const handlePrefDay = (event, newDay) => {
        console.log(newDay);
        setPrefDay(newDay);
    }

    const handlePrefTime = (event, newTime) => {
        setPrefTime(newTime);
    }

    const handleCourseSelect = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedCourses(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const RegisterSchema = Yup.object().shape({
        price: Yup.number().required("Please enter your default rate"),
        courses: Yup.array().required("Choose at least 1 course to tutor"),
        prefDays: Yup.array().required("Choose at least 1 preferred day"),
        prefTimes: Yup.array().required("Choose at least 1 preferred Time")
    });

    const defaultValues = {
        price: 0,
        courses: [],
        prefDays: [],
        prefTimes: []
    };

    const methods = useForm({
        resolver: yupResolver(RegisterSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async data => {
        data.courses = selectedCourses;
        data.prefDays = days;
        data.prefTimes = times;
        console.log(data);
        console.log('Success!');
        TUTOR.create_profile(userID, data.price, data.courses, data.prefDays, data.prefTimes);

    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} sx={{pl: 5}} mb={5}>
                <Stack direction={"row"} spacing={2} alignItems="center">
                    <Typography variant={"h6"} fontWeight={"medium"}>
                        Enter Price:
                    </Typography>
                    <RHFTextField name="price" label={"Enter Price"} sx={{width: 300}} />
                </Stack>
                <Stack direction={"row"} spacing={2} alignItems="center">
                    <Typography variant={"h6"} fontWeight={"medium"}>
                        Select Courses:
                    </Typography>
                    <div>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="courseSelection">Courses</InputLabel>
                            <Select
                                labelId="multiChipSelect"
                                id="courses"
                                multiple
                                value={selectedCourses}
                                onChange={handleCourseSelect}
                                input={<OutlinedInput id="select-multiple-chip" label="Courses" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {courseNames.map((name) => (
                                    <MenuItem
                                        key={name}
                                        value={name}
                                        style={getStyles(name, selectedCourses, theme)}
                                    >
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </Stack>

                <Stack direction={"row"} spacing={3} alignItems="center">
                    <Typography variant="h6" fontWeight={"medium"} >
                        Preferred Tutoring Days:
                    </Typography>
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
                </Stack>

                <Stack direction={"row"} spacing={3} alignItems="center" >
                    <Typography variant="h6" fontWeight={"medium"}>
                        Preferred Tutoring Times:
                    </Typography>

                    <ToggleButtonGroup value={times} name={'prefTimes'} onChange={handlePrefTime} aria-label={'Preferred Times'}>
                        <ToggleButtonGroup value={times} name={'prefTimes'} onChange={handlePrefTime} aria-label={'Preferred Times'}>
                            <ToggleButton value={0} aria-label = 'Morning'>
                                Morning
                            </ToggleButton>
                            <ToggleButton value={1} aria-label = 'Afternoon'>
                                Afternoon
                            </ToggleButton>
                            <ToggleButton value={2} aria-label = 'Evening'>
                                Evening
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </ToggleButtonGroup>
                </Stack>

                <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    Save Changes
                </LoadingButton>
            </Stack>
        </FormProvider>
    );
}