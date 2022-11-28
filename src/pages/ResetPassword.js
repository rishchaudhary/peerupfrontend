import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Stack, Container, Typography, Link } from '@mui/material';

import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { LoadingButton } from '@mui/lab';
import { FormProvider, RHFTextField } from '../components/hook-form';
// hooks
import useResponsive from '../hooks/useResponsive';


// components
import Page from '../components/Page';
import Logo from '../components/Logo';



// sections

const auth = getAuth();
// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ResetPassword() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const methods = useForm();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async data => {
    sendPasswordResetEmail(auth, data.email).then(() => {
        console.log("password reset email sent");
    }).catch((error) => {
        console.log(error);
    })
  }

  return (
    <Page title="Reset password">
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hey, welcome back to PeerUp
            </Typography>
            <img src="/static/illustrations/8401.jpg" alt="login" />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Reset password
            </Typography>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    <RHFTextField name="password" label="Password" />
                </Stack>
                <Stack spacing={3}>
                    <RHFTextField name="confirmpassword" label="Confirm Password" />
                </Stack>
                <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    Submit
                </LoadingButton>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                    <Link variant="subtitle2" underline="hover" component={RouterLink} to="/login">
                        Return to login page
                    </Link>
                </Stack>
            </FormProvider>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
