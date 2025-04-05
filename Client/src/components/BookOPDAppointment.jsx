import React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material/';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import { apis } from '../Services/commonServices';
import PersonIcon from "@mui/icons-material/Person";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { clearPatient } from '../redux/slices/patientsAutoCompSlice'; 


// Appointment Form Values
const arr1 = ['pph', 'did', 'dname', 'dep', 'schedule_date', 'time', 'qs', 'count', 'price'];

const initialValues = arr1.reduce(
    (obj, key) => ({ ...obj, [key]: '' }),
    {}
);

export default function App({ index, patient, setPatient, part, setPart,setOpd }) {
    const dispatch = useDispatch();

    //Tracking the selected date
    const [count, setC] = useState({});

    //Set loading state
    const [loading, setLoading] = useState(false);

    //Get the list of the doctors
    const [doctors, setDoc] = useState([]);

    //Form Details
    const [formV, setForm] = useState(initialValues);

    //Timings
    const [Timings, setT] = useState([]);

    // fetching data
    useEffect(() => {
        const fetchData = async () => {
            const d_data = await apis.noTokengetRequest('/member/doctors');
            console.log(d_data);
            setDoc(d_data);
        };
        fetchData();
    }, []);

    //---------------------------- Part -1 ---------------------------------------

    //Handle form values
    const handleSearch = (newValue) => {
        if (newValue) {
            console.log("HandleSearch", newValue)
            const { _id, timings, ...rest } = newValue;
            console.log("rest", { ...formV, ...rest })
            setForm({ ...formV, ...rest });
            setT(timings);
        } else {
            setForm(initialValues);
        }
    };

    //Selct the timings
    const part1 = () => (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
                <h2>Doctor Details</h2>
            </Grid>
            <Grid size={{ xs: 12 }}>
                <Autocomplete
                    autoComplete
                    noOptionsText="No Doctors found"
                    options={doctors}
                    getOptionLabel={(option) => option.dname}
                    includeInputInList
                    filterSelectedOptions
                    onChange={(event, newValue) => handleSearch(newValue)}
                    value={formV}
                    required
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={`Search Doctor`}
                            margin='normal'
                            variant='outlined'
                        />
                    )}
                    renderOption={(props, option) => (
                        <li {...props} key={option._id}>
                            <Grid container sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <PersonIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                <Grid>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        {option.dname}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Department: {option.dep}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </li>
                    )}
                />
            </Grid>
        </Grid>
    )

    //------------------------------ Form Submission event ----------------------------------
    //clear Values
    const clearValues = () => {
        const newValues = {};
        Object.entries(formV).forEach(([key, value]) => {
            if (key === 'schedule_date') {
                newValues[key] = 'Select Date';
            } else {
                newValues[key] = '';
            }
        });
        setT([]);
        setC({});
        setForm(newValues);
        setSelectedDate(null);
        dispatch(clearPatient());
        index === 1 && setPatient(null);
    };

    //-----------------------------Part-2 Calander ---------------------------------------------

    //Handle form values
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value,
            count: name === "time" ? count[value] : prevForm.count
        }));
        console.log(formV)
    };

    const [selectedDate, setSelectedDate] = useState('');

    const isBeforeToday = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(date) < today;
    };

    const handleDateChange = async (event) => {
        const date = event.target.value;
        console.log(date);
        if (!isBeforeToday(date)) {
            setSelectedDate(date);
            setForm({ ...formV, schedule_date: date });
            const link = `/member/doctorTiming/${date}/${formV.did}`;
            const res = await apis.noTokengetRequest(link);

            if (res) {
                const resMap = res.reduce((acc, { timing, count }) => {
                    acc[timing] = count;
                    return acc;
                }, {});

                const updatedCount = Timings.reduce((acc, timing) => {
                    acc[timing] = resMap[timing] != null ? resMap[timing] : formV.pph;
                    return acc;
                }, {});

                setC(updatedCount);
            } else {
                const defaultCount = Object.fromEntries(Timings.map(t => [t, formV.pph]));
                setC(defaultCount);
            }
        }
    };



    //======================
    const part2 = () => {
        return (

            <Grid container size={{ xs: 12 }} spacing={2} >
                <Grid size={{ xs: 6 }}>
                    <h3>Doctor: {formV.dname}</h3>

                </Grid>
                <Grid size={{ xs: 6 }}>
                    <h3>Doctor Department: {formV.dep}</h3>

                </Grid>
                <Grid container size={{ xs: 6 }}>
                    <Grid size={{ xs: 12 }}>
                        {!selectedDate
                            ?
                            "Date not selected" :
                            <h2>
                                Date:  {new Date(formV.schedule_date).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric' })}
                            </h2>}
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Select Date"
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                            slotProps={{
                                inputLabel: { shrink: true },
                                inputProps: {
                                    min: new Date().toISOString().split("T")[0], // Restrict past dates
                                }
                            }}
                            sx={{
                                "& .MuiInputBase-root": {
                                    cursor: "pointer",
                                },
                                "& .MuiInputBase-input": {
                                    cursor: "pointer",
                                },
                            }}
                        />
                    </Grid>

                </Grid>

                <Grid container size={{ xs: 6 }}>
                    {selectedDate &&
                        <>
                            <Grid size={{ xs: 12 }}>
                                <h2> Select Timings:</h2>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <RadioGroup required name="time" value={formV.time} onChange={handleInputChange}>
                                    {Timings.length ? (
                                        Object.keys(count).length ? (
                                            Timings.map((timeSlot) => (
                                                <FormControlLabel
                                                    key={timeSlot}
                                                    value={timeSlot}
                                                    control={<Radio required />}
                                                    label={`${timeSlot} slots available: ${count[timeSlot]}`}
                                                    disabled={count[timeSlot] === 0}
                                                />
                                            ))
                                        ) : (
                                            'Please select Date'
                                        )
                                    ) : (
                                        'Select date to see timings'
                                    )}
                                </RadioGroup>
                            </Grid>
                        </>}
                </Grid>
            </Grid>

        )
    }

    const handleNext = async() => {
        if (part === 1 && !formV.did) {
            toast.error("Select Doctor")
            return;
        }

        if(part === 2 && formV.schedule_date) {
            // console.log(formV);
            console.log("Patient:",patient);
            alert(JSON.stringify(formV));
            await apis.noTokenPostRequest('/appointment', { ...formV, ...patient });
            index===0 && setOpd(formV.dname);
            clearValues();
        }
        setPart((prev) => (prev + 1) % 3)
    }

    return (

        <Grid justifyContent="center" container spacing={2} >
            <Card className="partition" sx={{ position: "relative", width: { md: "50%", xs: "100%" }, height: "82vh" }}>
                <CardContent>
                    {part === 1 ? part1() : part2()}
                </CardContent>

                <Grid container size={{ xs: 12 }} spacing={2} sx={{ position: "absolute", bottom: "4px", p: 2 }}>


                   {(index===2 || (part===2 && index===0) )&& <Grid size={{ xs: 6 }} >
                        <Button variant="contained" fullWidth color="primary"
                            onClick={() => {
                                setPart((prev) => (prev - 1) % 3)
                                if (part === 1) {
                                    setForm(initialValues);
                                    setT([]);
                                }
                                if (part === 2) {
                                    setSelectedDate(null);
                                    setForm({ ...formV, schedule_date: '' });
                                }
                            }}
                            sx={{ height: "8vh", fontWeight: "bold", fontSize: "1.2rem" }}>
                            Back
                        </Button>
                    </Grid>}


                    <Grid size={{ xs: index===2? [1, 2].includes(part) ? 6 : 12 : part===2?6:12 }} >
                        <Button variant="contained" fullWidth color="primary" type={part === 2 ? 'submit' : 'button'}
                            onClick={handleNext}
                            sx={{ height: "8vh", fontWeight: "bold", fontSize: "1.2rem" }}
                            disabled={part === 2 && !formV.time}
                        >
                            {part === 1 ? "Next" : "Book Appointment"}
                        </Button>
                    </Grid>

                </Grid>
            </Card>
        </Grid>

    );
}
