import { useNavigate } from 'react-router-dom';
// material
import {
  Avatar,
  Container,
  Chip,
  Divider,
  Grid,
  Rating,
  Paper,
  Typography,
  Stack,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// Firebase

import { ref, onValue, set, getDatabase } from "firebase/database";
import { getAuth, updateProfile, deleteUser } from 'firebase/auth';

import { ref as refStorage, getDownloadURL, uploadBytes } from 'firebase/storage';

import {useContext, useState} from 'react';
import { DBContext } from '../App';
// components
import Page from '../components/Page';
// mock
import account from '../_mock/account';
// data 


import { storage } from '../firebaseConfig/storage';
import { User as USER } from '../Controller/User';


const auth = getAuth();
const database = getDatabase();

export default function AdminPanel() {
    const [inputUid, setInputUid ] = useState();

    return(
    <Page title="Admin">

      {/* main container holding everything */}
      <Container sx={{mx: 'auto', width: 1000}}>  
        {/* Stack for bottom section of profile page */}
        <Stack spacing={0.5} mt={3} mx={3}>

          {/* User ID */}
          <Stack spacing = {0.5} direction="row">
                <TextField
                    id="outlined-multiline-flexible"
                    label="Enter User ID"
                    multiline
                    maxRows={4}
                    onChange={(event) => {
                        setInputUid(event.target.value);
                    }}
                />
            <LoadingButton size="large" type="submit" variant="contained" onClick={() => {
                console.log("Deleting user...");
                deleteUser(inputUid).then(() => {
                    console.log('User deleted from auth successfully');
                }).catch((error) => {
                    console.log(error.message);
                });
                USER.delete_account(inputUid).then(() => {
                    console.log('User deleted from database successfully');
                }).catch(() => {
                    console.log('Error deleting user from database');
                });

            }} >
                Delete User
            </LoadingButton>
          </Stack>
        </Stack>
      </Container>
    </Page>
    )
}