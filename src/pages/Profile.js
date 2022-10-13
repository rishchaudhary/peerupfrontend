import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
      <Container 
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
      <Avatar 
        alt="Remy Sharp"
        src={account.photoURL}
        sx={{ width: 200, height: 200}}
      />

        <Stack direction="row" alignItems="center" >
        <Typography variant="h2" gutterBottom>
          {account.displayName}
          </Typography>
      
        </Stack>
    
      </Container>
    </Page>
  );
}
