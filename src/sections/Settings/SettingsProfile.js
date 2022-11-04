import * as Yup from 'yup';
import {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Paper,
    Divider,
    Collapse,
    IconButton, Box, Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import {Alert} from "@mui/joy";

import {onValue, ref, getDatabase} from "firebase/database";
import { getAuth } from 'firebase/auth';
import { storage } from '../../firebaseConfig/storage';
// components
import { FormProvider } from '../../components/hook-form';

import {User as UserController} from '../../Controller/User';
import {DBContext} from "../../App";


// ----------------------------------------------------------------------

function mapToggles(value, index) {
    // console.log(value);
    return (
        <ToggleButton value={index} selected={value.value} aria-label={value.key}>
            {value.key}
        </ToggleButton>
    );
}

export default function SettingsProfile() {
    const navigate = useNavigate();
    const database = getDatabase();
    const auth = getAuth();
    const userID = auth.currentUser.uid;

    const {displayName, major, userClass, userBio, userLang} = useContext(DBContext);
    const [standing, setStanding] = useState(() => userClass);
    const [updatedBio, setBio] = useState(() => userBio);
    const [updatedName, setName] = useState(() => displayName);
    const [updatedMajor, setMajor] = useState(() => major);
    const [updatedLang, setLanguage] = useState("English");

    let currDays = [];
    const usrDaysRef = ref(database, `Users/${auth.currentUser.uid}/PreferredDays`);
    onValue(usrDaysRef, (snapshot) => {
        currDays = snapshot.val();
    })

    const initDays = [];
    for (let i = 0; i < currDays.length; i += 1) {
        if (currDays[i].value) {
            initDays.push(i);
        }
    }

    let currTimes = [];
    const usrTimesRef = ref(database, `Users/${auth.currentUser.uid}/PreferredTimings`);
    onValue(usrTimesRef, (snapshot) => {
        currTimes = snapshot.val();
    })

    const initTimes = [];
    for (let i = 0; i < currTimes.length; i += 1) {
        if (currTimes[i].value) {
            initTimes.push(i);
        }
    }

    const [days, setPrefDay] = useState(() => initDays);
    const [times, setPrefTime] = useState(() => initTimes);

    const handlePrefDay = (event, newDay) => {
        setPrefDay(newDay);
        UserController.update_preferred_days(userID, newDay);
    }

    const handlePrefTime = (event, newTime) => {
        setPrefTime(newTime);
        UserController.update_preferred_times(userID, newTime);
    }

    const handleName = (event) => {
        setName(event.target.value);
        UserController.update_name(userID, event.target.value);
    }

    const handleMajor = (event) => {
        setMajor(event.target.value);
        UserController.update_major(userID, event.target.value);
    }

    const handleStanding = (event) => {
        setStanding(event.target.value);
        UserController.update_standing(userID, event.target.value);
    }

    const handleUpdateBio = (event) => {
        setBio(event.target.value);
        UserController.update_bio(userID, event.target.value);
    }

    const handleLanguage = (event) => {
        setLanguage(event.target.value);
        UserController.update_language(userID, event.target.value);
    }


    const RegisterSchema = Yup.object().shape({
        Name: Yup.string(),
        Major: Yup.string(),
        standing: Yup.string(),
        bio: Yup.string(),
        prefDays: Yup.array(),
        prefTimes: Yup.array(),
        Language: Yup.string()
    });

    const defaultValues = {
        Name: {displayName},
        Major: {major},
        standing: {userClass},
        bio: {userBio},
        prefDays: [],
        prefTimes: [],
        Language: {userLang}
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
        console.log(data);

        data.Name = updatedName;
        data.Major = updatedMajor;
        data.standing = standing;
        data.bio = updatedBio;
        data.prefDays = days;
        data.prefTimes = times;
        data.Language = updatedLang;

        navigate('/profile', {replace: true});
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} sx={{pl: 5}} mb={5}>
                <Stack direction={"row"} spacing={2} alignItems="center">
                    <Typography variant={"h6"} fontWeight={'medium'}>
                        {"Edit Name:"}
                    </Typography>
                    <TextField name="firstName" label={displayName} onBlur={handleName} />
                </Stack>

                <Stack direction={"row"} spacing={2} alignItems="center">
                    <Typography variant={"h6"} fontWeight={'medium'}>
                        {"Edit Major:"}
                    </Typography>
                    <TextField name="major" label={major} onBlur={handleMajor} />
                </Stack>

                <Stack direction={"row"} spacing={2} alignItems="center">
                    <Typography variant={"h6"} fontWeight={'medium'}>
                        {"Edit Class:"}
                    </Typography>
                    <FormControl sx={{m: 1, width: 300}} size={"small"}>
                        <InputLabel id={"classStanding"}>Class</InputLabel>
                        <Select
                            name={"standing"}
                            label={"Class"}
                            value={userClass}
                            onChange={handleStanding}
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <em>{userClass}</em>;
                                }
                                return selected;
                            }}
                        >
                            <MenuItem disabled value="">
                                <em>{userClass}</em>
                            </MenuItem>
                            <MenuItem value={'Freshman'}>Freshman</MenuItem>
                            <MenuItem value={'Sophomore'}>Sophomore</MenuItem>
                            <MenuItem value={'Junior'}>Junior</MenuItem>
                            <MenuItem value={'Senior'}>Senior</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
                <Paper elevation={2} sx={{ height: 200}}>
                    <Stack
                        spacing = {0.5}
                        mx={'auto'}
                        divider={<Divider orientation="horizontal" flexItem />}
                    >
                        <Typography variant="body1" gutterBottom sx={{pl: 2, pt: 1, fontWeight: 'medium'}}>
                            Edit Bio:
                        </Typography>
                        <TextField
                            id="userBio"
                            multiline
                            label={"Enter new Bio"}
                            minRows={5}
                            maxRows={5}
                            margin="dense"
                            variant="outlined"
                            onBlur={handleUpdateBio}
                        />
                    </Stack>
                </Paper>
                <Stack direction={"row"} spacing={3} alignItems="center">
                    <Typography variant="h6" fontWeight={"medium"}>
                        New Preferred Days:
                    </Typography>
                    <ToggleButtonGroup value={days} name={'prefDays'} onChange={handlePrefDay} aria-label={'Preferred Days'}>
                        {currDays.map(mapToggles)}
                    </ToggleButtonGroup>
                </Stack>

                <Stack direction={"row"} spacing={3} alignItems="center" >
                    <Typography variant="h6" fontWeight={"medium"}>
                        New Preferred Times:
                    </Typography>

                    <ToggleButtonGroup value={times} name={'prefTimes'} onChange={handlePrefTime} aria-label={'Preferred Times'}>
                        {currTimes.map(mapToggles)}
                    </ToggleButtonGroup>
                </Stack>

                <Stack direction={"row"} spacing={2} alignItems="center">
                    <Typography variant={"h6"} fontWeight={'medium'}>
                        {"Preferred Language:"}
                    </Typography>
                    <TextField name="Language" label={userLang} onBlur={handleLanguage} />
                </Stack>

                <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    Save Changes
                </LoadingButton>
            </Stack>
        </FormProvider>
    );
}
