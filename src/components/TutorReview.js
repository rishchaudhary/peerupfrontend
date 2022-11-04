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


export default function TutorReview() {


const database = getDatabase();
const userID = getAuth().currentUser.uid;


console.log(userID);

let userSesIDs = [];
const sessionsIdsRef = ref(database, `Users/${userID}/Sessions`);
onValue(sessionsIdsRef, (snapshot) => {
  userSesIDs = snapshot.val();
});

console.log("Completed Sessions IDS: ", userSesIDs);

const userSesObjs = [];
for(let i = 1; i < userSesIDs.length; i+= 1){
  const sessionID = userSesIDs[i];
  const sesRef = ref(database, `Sessions/${sessionID}`);
  onValue(sesRef, (snapshot) => {
    if(snapshot.toJSON().Completed){
      userSesObjs.push(snapshot.toJSON());
    }
 
  });
}

const items  = [];
const [value, setValue] = React.useState(0);
const [comment, setComment] = React.useState('');

// <li>{userSesObjs[i].Tutor}</li>

for (let i = 0; i < userSesObjs.length; i+= 1) {
    items.push( 
        <Paper elevation={24} padding={2}>
            <Stack direction="row" spacing={4} padding={4}>
                <div paddingleft={2}>
                {userSesObjs[i].Tutor}
                </div>
                <div>
                <Rating
                    name="simple-controlled"
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                />
                </div>
                <div>
                <TextField id="outlined-basic" label="Enter Comment" variant="outlined" value={comment} onChange={(event) => {
                            setComment(event.target.value);
                        }} />
                </div>
                <div>
                <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={() => {
                console.log("Creating Review");
                createReview(value, comment,userSesObjs[i].TutorID)
            }} >
                Submit Review
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