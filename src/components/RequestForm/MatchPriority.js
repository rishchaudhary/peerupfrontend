import React from 'react';
import {
    Box,
    Chip,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select, Stack,
    Typography,
    useTheme
} from "@mui/material";
import Button from "@mui/material/Button";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const priorityList = ["course", "day", "time", "language"]


const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const MatchPriority = ({nextStep, prevStep, handlePriorities, values}) => {
    const theme = useTheme();
    const [priorities, setPriority] = React.useState([]);

    const handlePrioritySelect = (event) => {
        const {
            target: { value },
        } = event;
        setPriority(
            typeof value === 'string' ? value.split(',') : value,
        );
        handlePriorities(value)
    };


    const Continue = e => {
        e.preventDefault()
        nextStep()
    }

    const Previous = e => {
        e.preventDefault();
        prevStep();
    }

    return (
        <Container maxWidth={"sm"}>
            <div>
                <Typography variant={"body1"}>
                    6. Choose your priorities for matching with a tutor, from most to least important for you
                </Typography>
                <FormControl sx={{ m: 1, width: 500 }}>
                    <InputLabel id="priorityList">Priority</InputLabel>
                    <Select
                        labelId="multiChipSelect"
                        id="priority"
                        multiple
                        value={priorities}
                        onChange={handlePrioritySelect}
                        input={<OutlinedInput id="select-multiple-chip" label="Priority" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {priorityList.map((name) => (
                            <MenuItem
                                key={name}
                                value={name}
                                style={getStyles(name, priorities, theme)}
                            >
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Stack direction={"row"} spacing={2}>
                    <Button
                        onClick={ Previous }
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={ Continue }
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Next
                    </Button>
                </Stack>
            </div>
        </Container>
    )
}

export default MatchPriority