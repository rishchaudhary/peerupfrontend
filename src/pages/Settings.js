// React
import {useContext, useState} from "react";
// material
import {
  Stack,
  Container,
  Typography,
  Divider,
} from '@mui/material';

import { getAuth } from 'firebase/auth';
import * as React from 'react';
// components
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Page from '../components/Page';
import SettingsProfile from '../sections/Settings/SettingsProfile';
import SettingsAuth from "../sections/Settings/SettingsAuth";
import TutorApplication from '../sections/Settings/TutorApplication';
import {DBContext} from "../App";


// Controller
import {User as USER} from "../Controller/User";

const auth = getAuth();




export default function Settings() {

  const {hasTutorAcc, userMode, toggleUserMode} = useContext(DBContext);
  // const [deleted, setDeleted] = useState("deleted");
  const handleDeleteAccount = () => {
    console.log("Deleting user:", auth.currentUser.uid)
    USER.delete_account(auth.currentUser.uid)
  }

  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    console.log("switch:", event.target.checked);
  };

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

          {hasTutorAcc[0] ?
            <Stack alignItems={"center"} mb={5}>
              <Typography variant={"h3"} mb={5}>
                Current Mode:  
          {checked ?
             " Student"
              : " Tutor"
          }
              </Typography>
              <FormControlLabel control={<Switch
                checked={checked}
                onChange={setChecked}
                inputProps={{ 'aria-label': 'controlled' }}
              />} label="Student" />
            </Stack>
            : null
          }

          {!hasTutorAcc[0] ?
              <Stack alignItems={"center"} mb={5}>
                <Typography variant={"h3"} mb={5}>
                  Become a tutor!
                </Typography>
                <TutorApplication />
              </Stack>
              : null
          }

          <button variant={"outlined"} color={"error"} size={"large"} onClick={handleDeleteAccount}>
            DeleteAccount
          </button>

        </Stack>
      </Container>
    </Page>
  );
}
