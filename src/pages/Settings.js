// React
import {useContext} from "react";
// material
import {
  Stack,
  Container,
  Typography,
  Divider,
} from '@mui/material';
// components

import Page from '../components/Page';

import SettingsProfile from '../sections/Settings/SettingsProfile';
import SettingsAuth from "../sections/Settings/SettingsAuth";
import {DBContext} from "../App";



export default function Settings() {

  const {hasTutorAcc} = useContext(DBContext);

  return (
    <Page title="Settings">
      <Container>
        <Stack alignItems={"leftAlignment"} divider={<Divider orientation={"horizontal"} flexItem /> }>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h2" gutterBottom>
             Settings
            </Typography>
          </Stack>

          <Stack alignItems={"center"} mb={5}>
            <Typography variant={"h3"} mb={5}>
              Update Profile
            </Typography>

            <SettingsProfile />
          </Stack>

          <Stack alignItems={"center"} mb={5}>
            <Typography variant={"h3"} mb={5}>
              Update Authentication
            </Typography>

            <SettingsAuth />
          </Stack>

          {!hasTutorAcc[0] ?
              <Stack alignItems={"center"} mb={5}>
                <Typography variant={"h3"} mb={5}>
                  Become a tutor!
                </Typography>
                <tutorApplication />
              </Stack>
              : null
          }

        </Stack>
      </Container>
    </Page>
  );
}
