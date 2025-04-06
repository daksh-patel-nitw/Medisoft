// TimePickerDropdown.js
import React from 'react';
import {
    Box,
    Typography,
    Stack,
    Button,
    Popover,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid2
} from '@mui/material';
import { toast } from 'react-toastify';

const ScrollList = ({ items, selected, onSelect }) => (
    <Box
        sx={{
            maxHeight: 100,
            overflowY: 'auto',
            border: '1px solid #ccc',
            borderRadius: 1,
            width: "50%",
        }}
    >
        {items.map((item) => (
            <Box
                key={item}
                onClick={() => onSelect(item)}
                sx={{
                    p: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: selected === item ? '#1976d2' : 'transparent',
                    color: selected === item ? 'white' : 'inherit',
                }}
            >
                <Typography>{item}</Typography>
            </Box>
        ))}
    </Box>
);

class TimePickerDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            hour: '01',
            minute: '00',
            period: 'p.m.',
        };
    }

    hours = [...Array(12)].map((_, i) => String(i + 1).padStart(2, '0'));
    minutes = [...Array(60)].map((_, i) => String(i).padStart(2, '0'));

    openPopover = (e) => this.setState({ anchorEl: e.currentTarget });
    closePopover = () => this.setState({ anchorEl: null });

    confirmTime = () => {
        const { hour, minute, period } = this.state;
        const finalTime = `${hour}:${minute} ${period}`;
        this.props.onChange(finalTime);
        this.closePopover();
    };

    render() {
        const { value } = this.props;
        const { anchorEl, hour, minute, period } = this.state;
        const open = Boolean(anchorEl);

        return (
            <Grid2 size={{ xs: 6 }}>
                <FormControl sx={{ width: "100%" }}>
                    <InputLabel>Select Time</InputLabel>
                    <Select
                        fullWidth
                        value={value}
                        label="Select Time"
                        onClick={this.openPopover}
                        readOnly
                    >
                        <MenuItem value={value}>{value || 'Select Time'}</MenuItem>
                    </Select>
                </FormControl>

                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={this.closePopover}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    slotProps={{
                        paper: {
                          sx: {
                            minWidth: anchorEl?.offsetWidth || 100,
                          },
                        },
                      }}

                >
                    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                       

                        <FormControl fullWidth size="small">
                            <InputLabel>AM/PM</InputLabel>
                            <Select
                                value={period}
                                variant='outlined'
                                size="small"
                                label="AM/PM"
                                onChange={(e) => this.setState({ period: e.target.value })}
                            >
                                <MenuItem value="p.m.">p.m.</MenuItem>
                                <MenuItem value="a.m.">a.m.</MenuItem>
                            </Select>
                        </FormControl>
                        <Stack direction="row" spacing={1}>
                            <ScrollList items={this.hours} selected={hour} onSelect={(val) => this.setState({ hour: val })} />
                            <ScrollList items={this.minutes} selected={minute} onSelect={(val) => this.setState({ minute: val })} />
                        </Stack>

                        <Button variant="contained" onClick={this.confirmTime}>
                            Confirm
                        </Button>
                    </Box>
                </Popover>
            </Grid2>
        );
    }
}

export default class TimePickerWrapper extends React.Component {
    state = {
        fromTime: '',
        toTime: '',
    };

    handleAdd = () => {
        const { fromTime, toTime } = this.state;
        if(!fromTime || !toTime) {
            toast.warn("Please select both times");
            return;
        }
        const result = `${fromTime} - ${toTime}`;
        console.log('Combined Time:', result);
        this.setState({ fromTime: '', toTime: '' }); // Resetting the state after adding
        // Setting the combined time to the parent component
        this.props.handleAdd(result);
    };

    render() {
        const { fromTime, toTime } = this.state;

        return (
            <Grid2 size={{ xs: 12 }} spacing={1} container mt={1}>

                <TimePickerDropdown
                    value={fromTime}
                    onChange={(val) => this.setState({ fromTime: val })}
                />


                <TimePickerDropdown
                    value={toTime}
                    onChange={(val) => this.setState({ toTime: val })}
                />

                <Grid2 size={{ xs: 12 }} >
                    <Button
                        variant="contained"
                        onClick={this.handleAdd}
                        sx={{ height: "6vh", width: "100%", fontWeight: "bold", fontSize: "1.2rem" }}
                    >
                        Add Timings
                    </Button>
                </Grid2>
            </Grid2>
        );
    }
}