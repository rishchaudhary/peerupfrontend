
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {Stack,
    IconButton,
    InputAdornment,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { ref, uploadString } from 'firebase/storage';
import { auth } from '../../../firebaseConfig/auth';
import { storage } from '../../../firebaseConfig/storage';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

import { User as UserController } from '../../../Controller/User';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [days, setPrefDay] = useState(false);
  const [times, setPrefTime] = useState(false);
  const [standing, setStanding] = useState('');

  const handlePrefDay = (event, newDay) => {
      setPrefDay(newDay);
  }

  const handlePrefTime = (event, newTime) => {
        setPrefTime(newTime);
  }

  const handleStanding = (event) => {
      setStanding(event.target.value);
  }

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    major: Yup.string().required('Major is required'),
    standing: Yup.string(),
    prefDays: Yup.array(),
    prefTimes: Yup.array(),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    major: '',
    standing: '',
    prefDays: [],
    prefTimes: [],
    email: '',
    password: '',
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
      console.log(standing);
      data.standing = standing;
      data.prefDays = days;
      data.prefTimes = times;

    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // Registration was successful
        const {user} = userCredential;
        updateProfile(user, {displayName: `${data.firstName} ${data.lastName}`});
        sendEmailVerification(user);
        const userPath = `User_data/${user.uid}/usrconfig.txt`;
        const userRef = ref(storage, userPath);
        const userInfo = `Email: ${user.email} First name: ${data.firstName} Last name: ${data.lastName}`;
        UserController.create_account(
          user.uid,
          data.email,
          `${data.firstName} ${data.lastName}`,
          `${data.major}`,
          `${data.standing}`,
          data.prefDays, data.prefTimes);


        uploadString(userRef, userInfo).then((snapshot) => {
          console.log('Uploaded user config data.', snapshot);
        });
        console.log('User registered:', user.email);
        // ...
      })
      .catch((error) => {
        // Registration was unsuccessful
        const errorCode = error.code;
        const errorMessage = error.message;
        // inspect error and do stuff
        console.log(errorMessage);
        console.log('Error code:', errorCode);
        // If email already in use error code will be auth/email-already-in-use
      });
    navigate('/dashboard/app', { replace: true });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>

        <RHFTextField name={"major"} label={"Major"} />

        <FormControl >
            <InputLabel id={"classStaning"}>Class </InputLabel>
            <Select name={"standing"} label={"Class"} value={standing} onChange={handleStanding} >
              <MenuItem value={'Freshman'}>Freshman</MenuItem>
              <MenuItem value={'Sophomore'}>Sophomore</MenuItem>
              <MenuItem value={'Junior'}>Junior</MenuItem>
              <MenuItem value={'Senior'}>Senior</MenuItem>
            </Select>
        </FormControl>


        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Stack direction={"row"} spacing={3} alignItems="center">
            <Typography variant="body1" >
                Preferred days:
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
            <Typography variant="body1" >
                Preferred Times:
            </Typography>

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
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
