import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Avatar,
  Container,
  Grid,
  Rating,
  Typography,
  TableContainer,
  TablePagination,
  Stack,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// mock
import account from '../_mock/account';


// ----------------------------------------------------------------------



export default function User() {

  return (
    <Page title="User">
      <Container>
        <Grid container spacing={2} sx={{border: 1, borderColor: 'primary.main'}}>
          {/* Grid 1: Profile pic */ }
          <Grid item xs={2} sx={{ alignItems: 'center' }}>
            <Avatar 
            alt={account.displayName}
            src={account.photoURL}
            style= {{border: '1px solid lightgray'}}
            sx={{ width: 150, height: 150,}}
            />
          </Grid>
          {/* gird 2: Name & rating */}
          <Grid item xs={6}>
            <Stack sx={{border: 1}}>
              <Typography variant="h1" gutterBottom>
                {account.displayName}
              </Typography>
              <Rating 
                name="read-only" 
                value={account.ratingVal} 
                precision={0.5}
                size="large"
                readOnly 
              />
            </Stack>
          </Grid>
        </Grid> 
        <Stack spacing={0.5} mt={3}>
          <Stack spacing = {0.5} direction="row">
            <Typography variant="body" gutterBottom sx={{fontWeight: 'medium'}}>
              Major: 
            </Typography>
            <Typography variant="body" gutterBottom>
              {account.major}
            </Typography>
          </Stack>
          
          <Stack spacing = {0.5} direction="row">
            <Typography variant="body" gutterBottom sx={{fontWeight: 'medium'}}>
              Class: 
            </Typography>
            <Typography variant="body" gutterBottom>
              {account.year}
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Page>
  );
}
