import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { sendAdminTicketEmail } from '../Controller/SendEmail';
import Page from '../components/Page';

const auth = getAuth();




export default function ContactPage() {
    const [userInput, updateUserInput] = React.useState();
    const [ticketNumber, setTicketNumber] = React.useState();
    const navigate = useNavigate();

    const mailToString = `mailto:peerupadmin@googlegroups.com?subject=Ticket ${ticketNumber}&body=${userInput}`;

    return(
    <Page title="Contact Page">
        <Container sx={{mx: 'auto'}} maxWidth='sm'>
            <Stack alignItems="center" spacing={0.5} direction="row">
                <Typography variant='h4' gutterBottom>
                    Contact PeerUp Support
                </Typography>
            </Stack>
            <Stack alignItems="center" spacing={0.5} direction="row">
                <Typography variant='body1' gutterBottom>
                    Use this page to send a message to the PeerUp support team.
                </Typography>
            </Stack>
            <Stack alignItems="center" spacing={0.5} direction="column">
                <TextField
                    id="outlined-multiline-flexible"
                    label="Enter your comment or issue"
                    fullWidth
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
                    sendAdminTicketEmail(userInput, dbref.key, auth.currentUser.email);
                    set(dbref, helpFormData).then(() => {
                        navigate('/dashboard/app', { replace: true});
                    });
                    }} >
                        Send email
                    </LoadingButton>
            </Stack>
        </Container>
    </Page>
    );
}