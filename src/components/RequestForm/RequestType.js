import React from 'react';
import {Button, Container, Stack, Typography} from "@mui/material";

const RequestType = ({nextStep, jumpStep, handleChange}) => {
    const Continue = e => {
        e.preventDefault()
        nextStep()
    }

    const Jump = e => {
        e.preventDefault()
        jumpStep(2)
    }
    return (
        <Container maxWidth={"xs"}>
            <div>
                <Stack spacing = {2}>
                    <Typography variant={"body1"}>
                        1. What type of session would you like to create?
                    </Typography>

                    <Button variant={"contained"} onClick={Jump}>
                        Recurring
                    </Button>

                    <Button variant={"contained"} onClick={Continue} >
                        Single
                    </Button>
                </Stack>
            </div>
        </Container>
    )
}

export default RequestType