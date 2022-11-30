import * as React from 'react';
import Box from '@mui/material/Box';
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
import Page from '../components/Page';


export default function ContactPage() {
    const [userInput, updateUserInput] = React.useState();

    const mailToString = `mailto:peerupadmin@googlegroups.com?subject=User Contact Message&body=${userInput}`;

    return(
    <Page title="Contact Page">
        <Container sx={{mx: 'auto', width: 1000}}>
            <Stack alignItems="center" spacing={0.5} direction="row">
                <TextField
                    id="outlined-multiline-flexible"
                    label="Enter your comment or issue"
                    multiline
                    onChange={(e) => {
                        updateUserInput(e.target.value);
                    }}
                />
                <LoadingButton size="large" type="submit" variant="contained" onClick={(e) => {
                    // Send email
                    window.location.href = mailToString;
                    e.preventDefault();
                    }} >
                        Send email
                    </LoadingButton>
            </Stack>
        </Container>
    </Page>
    );
}