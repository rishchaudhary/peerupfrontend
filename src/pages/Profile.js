import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Avatar,
  Container,
  Grid,
  Typography,
  TableContainer,
  TablePagination,
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
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Avatar 
            alt= {account.displayName}
            src={account.photoURL}
            style= {{border: '1px solid lightgray'}}
            sx={{ width: 150, height: 150}}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h2" gutterBottom>
              {account.displayName}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h2" gutterBottom>
              {account.displayName}
            </Typography>
          </Grid>
        </Grid> 
      </Container>
    </Page>
  );
}
