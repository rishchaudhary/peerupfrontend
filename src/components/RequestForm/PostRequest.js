import React from 'react'
import {Button} from "@mui/material";
// Controller
import {Requests as REQUESTS} from '../../Controller/Requests';

const PostRequest = ({jumpStep, values}) => {
    const {
        userID,
        course,
        date,
        time,
        length,
        location,
        format,
        description,
        files,
        matchPriority,
        recurring,
        rDays,
        rNumWeeks
    } = values

    console.log('PostRequest values: ', values)
    REQUESTS.create_request(
        time,
        length,
        date,
        description,
        userID,
        course,
        location,
        format,
        files,
        matchPriority,
        recurring,
        rDays,
        rNumWeeks
    ).then(r => console.log("REQUEST POSTED SUCCESSFULLY", r))


    const Jump = e => {
        e.preventDefault();
        jumpStep(1);
    }

    return (
        <div>
            <h1>Success! Your request has been posted</h1>
            <Button
                onClick={ Jump }
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
            >
                Create Another Request
            </Button>
        </div>
    )
}

export default PostRequest