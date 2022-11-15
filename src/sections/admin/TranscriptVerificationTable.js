import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
        field: 'Name',
        headerName: 'Name',
        width: 200,
        editable: false,
    },
    {
        field: 'UserID',
        headerName: 'User ID',
        width: 400,
        editable: false,
    },
    {
        field: 'NonVerifiedCourses',
        headerName: 'Non Verified Courses',
        width: 200,
        editable: false,
    },
];

const rows = [
    { id: 1, Name: 'Patricio Figueroa', UserID: 'g16fNFbndUgDMNMH24nfFfdf9RF3', NonVerifiedCourses:'CS 180, CS 182' },
    { id: 2, Name: 'Avi Katare', UserID: 'TyKtWwGM8lelAITLsGKcT5O3gX92', NonVerifiedCourses:'CS 180, CS 182' }, 
   
  ];

export default function TranscriptVerificationTable() {
  return (
    <Box sx={{ height: 500, width: '100%' }}>
    <DataGrid
        rows={rows}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
    />
</Box>
  );
}
