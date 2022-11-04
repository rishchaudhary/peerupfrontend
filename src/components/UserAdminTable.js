import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

// firebase
import { getDatabase, ref, onValue } from 'firebase/database';
import {getAuth} from "firebase/auth";

const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    {
        field: 'Name',
        headerName: 'Name',
        width: 200,
        editable: false,
    },
    {
        field: 'Email',
        headerName: 'Email',
        width: 200,
        editable: false,
    },
    {
        field: 'UserID',
        headerName: 'UserID',
        width: 200,
        editable: false,
    },
];



export default function UserAdminTable() {

    const auth = getAuth();
    const database = getDatabase();
    const userID = getAuth().currentUser.uid;
    
    console.log(userID);
    
    let userIDs = [];
    const userIdsRef = ref(database, `Users`);
    onValue(userIdsRef, (snapshot) => {
      userIDs = snapshot.val();
    });

    console.log("Users:", userIDs);

   const userObjs = [];
   for(let i = 1; i < userIDs.length; i+= 1){
        const userID = userIDs[i];
        const userRef = ref(database, `Users/${userID}`);
        onValue(userRef, (snapshot) =>{
            userObjs.push(snapshot.val());
        });
   }

    console.log(userIDs);
   

  return (
    <Box sx={{ height: 500, width: '100%' }}>
    <DataGrid
        rows={userObjs}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
    />
</Box>
  );
}
