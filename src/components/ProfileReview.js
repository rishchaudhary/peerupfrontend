// tabs
import * as React from 'react';
import { useState } from 'react';

// ratings
import Rating from '@mui/material/Rating';
// button
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { filter } from 'lodash';
import { LoadingButton } from '@mui/lab';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

// User data 
import { getAuth } from 'firebase/auth';
import {getDatabase, ref, onValue} from "firebase/database";
import {Review as REVIEW} from '../Controller/Review';

// components
import Scrollbar from './Scrollbar';
import SearchNotFound from './SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';

// mock
import USERLIST from '../_mock/user';

const auth = getAuth();

async function createReview(rating, content,tutorID){

    const reviewID = "420-69";
    const userID = (auth.currentUser.uid).toString();

    console.log(rating.toString());
    console.log(content.toString());
    console.log("tutorid:",tutorID.toString());

    REVIEW.create_review(reviewID, rating, content.toString(), userID, tutorID.toString());

}


export default function ProfileReview() {


const database = getDatabase();
const userID = getAuth().currentUser.uid;


console.log(userID);

let reviewIDs = [];
const reviewIdsRef = ref(database, `Reviews/${userID}`);
onValue(reviewIdsRef, (snapshot) => {
    reviewIDs = snapshot.val();
});

console.log("Reviews IDs: ", reviewIDs);

const userReviewObjs = [];
for(let i = 1; )

const items  = [];
const [value, setValue] = React.useState(3);
const [comment, setComment] = React.useState('');

// <li>{userSesObjs[i].Tutor}</li>

for (let i = 0; i < userSesObjs.length; i+= 1) {
    items.push( 
        <Paper elevation={24} padding={2}>
            <Stack direction="row" spacing={4} padding={4}>
                <div paddingleft={2}>
                {reviews[i].Student}
                </div>
                <div>
                <Rating name="read-only" value={value} readOnly />
                </div>
                <div>
                    <TextField
                        id="outlined-read-only-input"
                        label=""
                        defaultValue="Not a great tutor"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </div>
                <div>
                <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={() => {
                console.log("Creating Review");
                createReview(value, comment,userSesObjs[i].TutorID)
            }} >
                Dispute Review
            </LoadingButton>
                </div>
            </Stack>
            <Divider />
        </Paper>
        
        

    );
  }

console.log("Completed User Session Objects", userSesObjs);

    return (
    
        <div>
            {items}
            
        </div>
      
    

    );



}