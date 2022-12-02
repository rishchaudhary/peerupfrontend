import React from 'react'
import {Button} from "@mui/material";
// Controller
import {Requests as REQUESTS} from '../../Controller/Requests';
import {DBContext} from "../../App";

const PostRequest = (jumpStep, values) => {
    const {displayName} = React.useContext(DBContext)

    REQUESTS.create_request(
        values.time,
        values.length,
        values.date,
        values.description,
        values.userID,
        values.course,
        values.location,
        values.format,
        displayName,
        values.files,
        values.matchPriority,
        values.recurring,
        values.rDays,
        values.rNumWeeks
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