
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {Stack, IconButton, InputAdornment, ToggleButton, ToggleButtonGroup, Box, Typography} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, getAuth } from 'firebase/auth';
import { ref, uploadString } from 'firebase/storage';
import { storage } from '../../../firebaseConfig/storage';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

import { User as UserController } from '../../../Controller/User';
// ----------------------------------------------------------------------

const auth = getAuth();

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [days, setPref] = useState(false);

  const handlePrefDay = (event, newDay) => {
      // console.log(days);
      setPref(newDay);
  }

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    major: '',
    standing: '',
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
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // Registration was successful
        const user = userCredential.user;
        updateProfile(user, {displayName: `${data.firstName} ${data.lastName}`});
        sendEmailVerification(user);
        const userPath = `User_data/${user.uid}/usrconfig.txt`;
        const userRef = ref(storage, userPath);
        const userInfo = `Email: ${user.email} First name: ${data.firstName} Last name: ${data.lastName}`;
        console.log(days);
        UserController.create_account(
            user.uid,
            data.email,
            `${data.firstName} ${data.lastName}`,
            `${data.Major}`,
            `${data.Class}`,
            days);

        uploadString(userRef, userInfo).then((snapshot) => {
          console.log('Uploaded user config data.');
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
            <ToggleButtonGroup value={days} onSubmit = {handlePrefDay} aria-label={'Preferred Days'}>
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

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
