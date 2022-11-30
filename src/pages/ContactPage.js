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
import { ref, getDatabase, set, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import Page from '../components/Page';

const auth = getAuth();


export default function ContactPage() {
    const [userInput, updateUserInput] = React.useState();
    const [ticketNumber, setTicketNumber] = React.useState();

    const mailToString = `mailto:peerupadmin@googlegroups.com?subject=Ticket ${ticketNumber}&body=${userInput}`;

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
                    // Create ticket
                    const dbref = push(ref(getDatabase(), `HelpForms`));
                    setTicketNumber(dbref.key);
                    const helpFormData = {
                        CreatedBy: auth.currentUser.displayName,
                        Description: userInput,
                        Email: auth.currentUser.email,
                        UserID: auth.currentUser.uid
                    };
                    set(dbref, helpFormData);
                    }} >
                        Send email
                    </LoadingButton>
            </Stack>
        </Container>
    </Page>
    );
}