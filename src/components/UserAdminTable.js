import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    {
        field: 'firstName',
        headerName: 'First name',
        width: 200,
        editable: false,
    },
    {
        field: 'lastName',
        headerName: 'Last name',
        width: 200,
        editable: false,
    },
    {
        field: 'emailAddress',
        headerName: 'Email Address',
        width: 200,
        editable: false,
    },
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', emailAddress:'Jon.Snow@purdue.edu' },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei',emailAddress:'Lannister.Cersei@purdue.edu' },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', emailAddress:'Lannister.Jaime@purdue.edu'  },
    { id: 4, lastName: 'Stark', firstName: 'Arya', emailAddress:'Arya.Stark@purdue.edu'  },
    {id: 5, lastName: 'Targaryen', firstName: 'Daenerys', emailAddress:'Daenerys.Targaryen@purdue.edu'  },
    { id: 6, lastName: 'Melisandre', firstName: null, emailAddress:'Melisandre@purdue.edu' },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', emailAddress:'Ferrara.Clifford@purdue.edu'  },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', emailAddress:'Rossini.Frances@purdue.edu' },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', emailAddress:'Harvey.Roxie@purdue.edu'  },
  ];

export default function UserAdminTable() {
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
