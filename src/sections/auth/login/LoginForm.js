import { signInWithEmailAndPassword } from 'firebase/auth';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {Tutor} from "../../../Controller/Tutor";
import {Review} from "../../../Controller/Review";
import {Requests} from "../../../Controller/Requests";
import {User} from "../../../Controller/User";
import { auth } from '../../../firebaseConfig/auth';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';




// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async() => {
    // signInWithEmailAndPassword(auth, data.email, data.password)
    //  .then((userCredential) => {
      // Signed in 
    //  const user = userCredential.user;
   //   console.log('user logged in:', user.email);
    //  navigate('/dashboard/app', { replace: true });
      // console.log('current user email: ', auth.currentUser.email);
   //   })
    //  .catch((error) => {
    //  const errorCode = error.code;
    //  const errorMessage = error.message;
     // console.log(errorMessage);
     // console.log('Error code: ', errorCode);
      // If user is not found errorCode will be auth/user-not-found
      // If user exists but password is wrong errorCode will be auth/wrong-password
     // });
    // navigate('/dashboard/app', { replace: true });

   // Requests.create_request("742", "1pm", "2pm", "12th Jan", "Math help", "test3", "MA354");
  //  Requests.add_offer_to_request('743', 'offer2', '1pm', '1:30pm', 'Online', 'test')

      // const userData = Requests.get_information('743');
      // const data = await Requests.data(userData);
      // console.log(data.Date);

      // Requests.cancel_offer_for_request('743', 'offer2');
      // Review.create_review('testReview12', 1.9, 'I enjoyed the class', 'test2', 'test')
     // Review.delete_review('testReview4');

    User.create_account('test2', 'test@g', 'XYZ', 'CS', 'Junior', [0,2,4], [1]);
    await Requests.create_request("742", "1pm", "2pm", "12th Jan", "Math help", "test2", "MA354");
   await Requests.create_request("743", "1pm", "2pm", "12th Jan", "Math help", "test2", "MA354");
  await Requests.add_offer_to_request('743', 'offer1', '1pm', '1:30pm', 'Online', 'test')
   await Requests.add_offer_to_request('743', 'offer2', '1pm', '1:30pm', 'Online', 'test')
   await Requests.add_offer_to_request('742', 'offer3', '1pm', '1:30pm', 'Online', 'test')
   await Requests.add_offer_to_request('742', 'offer4', '1pm', '1:30pm', 'Online', 'test')
  await Review.create_review('testReview12', 1.9, 'I enjoyed the class', 'test2', 'test')
    await Review.create_review('testReview13', 1.9, 'I enjoyed the class', 'test2', 'test')
   await Tutor.create_profile('test2', 3.2, ['CS180', 'CS240'], [0,2,4], [2])
      // User.delete_account('test2');



  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email address" />
        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Login
      </LoadingButton>
    </FormProvider>
  );
}
