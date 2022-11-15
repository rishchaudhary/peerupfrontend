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


const auth = getAuth();

async function createReview(rating, content,tutorID){

    const reviewID = "420-69";
    const userID = (auth.currentUser.uid).toString();

    console.log(rating.toString());
    console.log(content.toString());
    console.log("tutorid:",tutorID.toString());

    REVIEW.create_review(reviewID, rating, content.toString(), userID, tutorID.toString());

}


export default function UserList() {

    const auth = getAuth();
    const database = getDatabase();
    const userID = getAuth().currentUser.uid;
    
    console.log(userID);
    
    let userIDs = [];
    const userIdsRef = ref(database, `Users`);
    onValue(userIdsRef, (snapshot) => {
      userIDs = snapshot.val();
    });

    // console.log("Users:", userIDs);

   const userObjs = [];
   for(let i = 1; i < userIDs.length; i+= 1){
        const userID = userIDs[i];
        const userRef = ref(database, `Users/${userID}`);
        onValue(userRef, (snapshot) =>{
            userObjs.push(snapshot.val());
            // console.log("Nmae", snapshot.val().name);
        });
   }

 
   console.log(userObjs);

const items  = [];
const [value, setValue] = React.useState(0);
const [comment, setComment] = React.useState('');

// <li>{userSesObjs[i].Tutor}</li>

for (let i = 0; i < userIDs.length; i+= 1) {
    items.push( 
        <Paper elevation={24} padding={2}>
            <Stack direction="row" spacing={4} padding={4}>
                <div paddingleft={2}>
                {userIDs[i]}
                </div>
            </Stack>
            <Divider />
        </Paper>
        
        

    );
  }


    return (
    
        <div>
            {items}
            
        </div>
      
    

    );



}