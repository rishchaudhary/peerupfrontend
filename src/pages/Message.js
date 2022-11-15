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



export default function Message() {
  
 
  return (
    <Page title="Messages">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h3" gutterBottom>
            Messages
          </Typography>
        </Stack>

      </Container>
    </Page>
  );
}
