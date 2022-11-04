import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    {
        field: 'reviewID',
        headerName: 'Review ID',
        width: 200,
        editable: false,
    },
    {
        field: 'comment',
        headerName: 'Review Comment',
        width: 200,
        editable: false,
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 200,
      editable: false,
  },
    {
        field: 'disputeComment',
        headerName: 'Dispute Comment',
        width: 200,
        editable: false,
    },
];

const rows = [
    { id: 1, reviewID: 'CqsJ2lFXfcYqiMLcHz9', comment: 'An Alright tutor', rating:'2', disputeComment: 'Not true' },

  ];

export default function DisputedReviewTable() {
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
