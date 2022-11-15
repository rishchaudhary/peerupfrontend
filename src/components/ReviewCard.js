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

async function disputeReview(reviewID, content){

    const userID = getAuth().currentUser.uid;
    const reviewUserID = `${userID}/${reviewID}`;
    console.log(reviewUserID.toString());
    console.log(content.toString());

    REVIEW.dispute_review(reviewUserID, content.toString());

}

function createData(Rating, CreatedBy, CreatedFor,Comment, ReviewID) {
    return {
      Rating,
      CreatedBy,
      CreatedFor,
      Comment,
      ReviewID
    };
  }

export default function ReviewCard() {


const database = getDatabase();
const userID = getAuth().currentUser.uid;


console.log(userID);

let userReviewIDs = [];
let reviewIDs = [];
const userReviewIdsRef = ref(database, `Reviews/${userID}`);
onValue(userReviewIdsRef, (snapshot) => {
  userReviewIDs = snapshot.val();
  if (userReviewIDs != null) {
    reviewIDs = Object.keys(userReviewIDs);
    console.log("keys:",Object.keys(userReviewIDs));
  } else {
    reviewIDs = null;
    console.log("no reviews for current user");
  }
  
});
if (reviewIDs != null) {
  console.log("User review ids:",reviewIDs.length);
}
const userReviewObject = [];
if(reviewIDs != null) {
  for(let i = 1; userReviewIDs.length; i+=1){
    const reviewID = userReviewIDs[i];
    const reviewRef = ref(database, `Reviews/${userID}/${reviewID}`);
    onValue(reviewRef, (snapshot) =>{
            userReviewObject.push(snapshot.val());
    });
  }
}




console.log("User review object:", userReviewObject);

/*
let userReviewObject = [];
const revRef = ref(database, `Reviews/${userID}`);
onValue(revRef, (snapshot) => {
    userReviewObject = snapshot.val();
});

console.log("User review ID length:", userReviewIDs.length);
console.log("User review object length:", userReviewObject.length);

const reqData = [];
for (let i = 1; i < userReviewIDs.length; i += 1) {
  const reqObj = userReviewObject[userReviewIDs[i]];
  console.log("reqobj:", reqObj);
  reqData.push(createData(
      reqObj.Rating,
      reqObj.CreatedBy,
      reqObj.CreatedFor,
      reqObj.Comment,
      userReviewIDs[i]
  ));
}

    console.log(reqData.length);

*/


let userSesIDs = [];
const sessionsIdsRef = ref(database, `Users/${userID}/Sessions`);
onValue(sessionsIdsRef, (snapshot) => {
  userSesIDs = snapshot.val();
});
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
const [value, setValue] = React.useState(2);
const [comment, setComment] = React.useState('');

// <li>{userSesObjs[i].Tutor}</li>

for (let i = 0; i < userSesObjs.length; i+= 1) {
    items.push( 
        <Paper elevation={24} padding={2}>
            <Stack direction="col" spacing={4} padding={4}>
                <div paddingleft={2}>
                {userSesObjs[i].Student}
                </div>
                <div>
                <Rating name="read-only" value={value} readOnly />
                </div>
                <div paddingleft={2}>
                    <TextField
                        id="outlined-read-only-input"
                        label="Comment"
                        defaultValue="An alright tutor"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </div>
                <div paddingleft={2}>
                <TextField id="outlined-basic" label="Enter Dispute Comment" variant="outlined" value={comment} onChange={(event) => {
                            setComment(event.target.value);
                        }} />
                </div>
                <div paddingleft={2}>
                <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={() => {
                console.log("Creating Dispute");
                disputeReview("CqsJ2lFXfcYqiMLcHz9",comment);
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