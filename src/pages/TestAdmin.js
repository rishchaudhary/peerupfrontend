import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
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



function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
  
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

export default function AdminPanel() {
    const [inputUid, setInputUid ] = useState();

    // Tabs
    const [value, setValue] = React.useState(1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
    <Page title="Admin">

      {/* main container holding everything */}
      <Container sx={{mx: 'auto', width: 1000}}>  
        {/* Stack for bottom section of profile page */}

        <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
            <Tab label="Users" {...a11yProps(0)} />
            <Tab label="Transcripts" {...a11yProps(1)} />
            <Tab label="Reviews" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h3" gutterBottom>
                Users
              </Typography>
            </Stack>
           
            <Stack spacing={0.5} mt={3} mx={3}>

                                {/* User ID */}
                                <Stack spacing={0.5} direction="row">
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
                            <Box sx={{ height: 500, width: '100%' }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    pageSize={20}
                                    rowsPerPageOptions={[5]}
                                    checkboxSelection
                                    disableSelectionOnClick
                                    experimentalFeatures={{ newEditingApi: true }}
                                />
                            </Box>
          </Container>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h3" gutterBottom>
               Transcripts
              </Typography>

            </Stack>

          </Container>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h3" gutterBottom>
                Reviews
              </Typography>

            </Stack>

          </Container>
        </TabPanel>
      
      </Box>




       
      </Container>
    </Page>
    )
}