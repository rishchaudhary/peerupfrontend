import { filter } from 'lodash';
import { useState } from 'react';

// material
import {
  Card,
  Table,
  Stack,
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
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserMoreMenu } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';


export default function Settings() {
  
 
  return (
    <Page title="Settings">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h3" gutterBottom>
           Settings
          </Typography>
        </Stack>

      </Container>
    </Page>
  );
}
