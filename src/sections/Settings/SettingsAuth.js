import * as Yup from 'yup';
import {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
    Stack,
    IconButton,
    InputAdornment,
    ToggleButton,
    Typography,
    TextField
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { getAuth, updateEmail, updatePassword, sendEmailVerification } from 'firebase/auth';
import { ref, set, getDatabase } from 'firebase/database';
import { storage } from '../../firebaseConfig/storage';
// components
import Iconify from '../../components/Iconify';
import { FormProvider, RHFTextField } from '../../components/hook-form';

// import {User as USER, User as UserController} from '../../Controller/User';
// import {DBContext} from "../../App";
// import {database} from "../../firebaseConfig/database";

// ----------------------------------------------------------------------

export default function SettingsAuth() {
    const navigate = useNavigate();
    const auth = getAuth();
    const [showPassword, setShowPassword] = useState(false);

    const RegisterSchema = Yup.object().shape({
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const defaultValues = {
        email: auth.currentUser.email,
        password: '',
    };

    const methods = useForm({
        resolver: yupResolver(RegisterSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: {isSubmitting},
    } = methods;

    const onSubmit = async data => {
        const email = data.email;
        const password = data.password;
        if (email !== auth.currentUser.email) {
            await updateEmail(auth.currentUser, email).then(() => {
                const database = getDatabase();
                set(ref(database, `Users/${auth.currentUser.uid}/Email`), email);
                sendEmailVerification(auth.currentUser).then(() => {
                    console.log('Email verification sent');
                }).catch(() => {
                    console.log('Error sending verification email');
                });
                console.log(`User email updated to: ${email}`);
            }).catch(() => {
                console.log('Error updating email');
            })
        }
        if (password !== '') {
            await updatePassword(auth.currentUser, password).then(() => {
                console.log('Password Updated');
            }).catch(() => {
                console.log('Error updating password');
            })
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} sx={{pl: 5}} mb={5}>
                <Stack direction={"row"} spacing={2} alignItems="center">
                    <Typography variant={"h6"} fontWeight={"medium"}>
                        Edit Email:
                    </Typography>
                    <RHFTextField name="email" label={auth.currentUser.email} sx={{width: 300}} />
                </Stack>
                <Stack direction={"row"} spacing={2} alignItems="center">
                    <Typography variant={"h6"} fontWeight={"medium"}>
                        Edit Password:
                    </Typography>
                    <RHFTextField
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        sx={{width: 300}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
                <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    Save Changes
                </LoadingButton>
            </Stack>

        </FormProvider>
    );
}