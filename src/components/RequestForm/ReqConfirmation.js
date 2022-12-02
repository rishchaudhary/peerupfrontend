import React from 'react'
import {Container, Grid, List, ListItem, ListItemText, Button, Typography} from '@mui/material'

const ReqConfirmation = ({ prevStep, nextStep, handleChange, values }) => {
    console.log(values);
    const {
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

    let priorities = ""
    let i;
    for (i = 0; i < matchPriority.length; i += 1) {
        if (i < matchPriority.length - 1) {
            priorities += `${matchPriority[i]}, `
        } else {
            priorities += `${matchPriority[i]}`
        }
    }
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    let prefDays = ""
    for (let i = 0; i < rDays.length; i += 1) {
        if (i < rDays.length - 1) {
            prefDays += `${days[rDays[i]]}, `
        } else {
            prefDays += `${days[rDays[i]]}`
        }
    }

    const Continue = e => {
        e.preventDefault();
        nextStep();
    }

    const Previous = e => {
        e.preventDefault();
        prevStep();
    }

    return (
        <Container  component="main" maxWidth="xs">
            <div>
                <Typography variant={"h4"}>
                    6. Request Summary
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="Course" secondary={course}/>
                    </ListItem>
                    {(recurring) ?
                        <ListItem>
                            <ListItemText primary="Start Date" secondary={date}/>
                        </ListItem>
                        :
                        <ListItem>
                            <ListItemText primary="Date" secondary={date}/>
                        </ListItem>
                    }

                    {(recurring) ?
                        <ListItem>
                            <ListItemText primary="Recurring Time" secondary={time}/>
                        </ListItem>
                        :
                        <ListItem>
                            <ListItemText primary="Time" secondary={time}/>
                        </ListItem>
                    }

                    <ListItem>
                        <ListItemText primary="Length" secondary={length}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Format" secondary={format}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Location" secondary={location}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Description" secondary={description}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Priorities (in order)" secondary={priorities}/>
                    </ListItem>
                    {(recurring) ?
                        <ListItem>
                            <ListItemText primary="Recurring Days" secondary={prefDays}/>
                        </ListItem>
                        : null
                    }
                    {(recurring) ?
                        <ListItem>
                            <ListItemText primary="Number of Weeks" secondary={rNumWeeks}/>
                        </ListItem>
                        :
                        null
                    }
                </List>

                <br />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Button
                            onClick={ Previous }
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Previous
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {(
                            (course !== '' && date !== '' && time !== ''
                                && length !== '' && format !== '' && location !== ''
                                && description !== '' && matchPriority.length !== 0)
                            || (recurring && (rDays.length !== 0 && rNumWeeks !== ''))
                        ) ?
                            <Button
                                onClick={Continue}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="success"
                            >
                                Confirm & Continue
                            </Button>
                            :
                            <div>
                                <Button variant="outlined" color="error">
                                    Error! Missing Items
                                </Button>
                            </div>
                        }
                    </Grid>
                </Grid>
            </div>
        </Container>
    )
}

export default ReqConfirmation