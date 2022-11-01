import { filter } from 'lodash';
import { useState } from 'react';

// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination, ToggleButtonGroup, ToggleButton, TextField,
} from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserMoreMenu } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import USER from "../Controller/User";

async function getUserData() {
  const dbSnap = USER.get_information('test2');
  const user = await dbSnap.then(val => {return val;});
  return user;
}

export default function Settings() {

  const user = getUserData();
  const [days, setPref] = useState(false);

  const handlePrefDay = (event, newDays) => {
    setPref(newDays);
  }


  return (
    <Page title="Settings">
      <Container>
        <Stack alignItems={"leftAligment"} >
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h3" gutterBottom>
             Settings
            </Typography>
          </Stack>
            <Stack direction={"row"} spacing={3} alignItems="center">
              <Typography variant="body1" >
                Name:
              </Typography>
              <TextField variant={"outlined"} label={user.Name} id={"NameField"} />
            </Stack>
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
        </Stack>
      </Container>
    </Page>
  );
}
