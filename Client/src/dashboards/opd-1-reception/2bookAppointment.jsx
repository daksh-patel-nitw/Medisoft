import './2.css';
import React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { SideBar } from '../../components/sidebar';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material/';
import Calendar from 'react-calendar';
import Autocomplete from '@mui/material/Autocomplete';
import { apis } from '../../Services/commonServices';
import { sidebar_utils } from './utils';

// Appointment Form Values
const arr1 = ['pid', 'pname', 'mobile', 'pph','did', 'dname', 'dep', 'schedule_date', 'time', 'qs', 'count', 'price'];
const arr2 = ['Patient ID', "Patient Name", "Mobile", 'DepartMent', "Doctor Name",];
const initialValues = arr1.reduce(
  (obj, key) => ({ ...obj, [key]: key !== 'schedule_date' ? '' : 'Select Date' }),
  {}
);

function showLabel(num) {
  if (Number(num) >= 12) {
    return (Number(num) !== 12 ? Number(num) % 12 : 12) + ' p.m.'
  } else {
    return num + 'a.m.'
  }
}

export default function App() {

  const [count, setC] = useState({});
  const [patients, setPat] = useState([]);
  const [doctors, setDoc] = useState([]);
  const [formV, setForm] = useState(initialValues);
  const [Timings, setT] = useState([]);

  // fetching data
  useEffect(() => {
    const fetchData = async () => {
      const d_data = await apis.noTokengetRequest('/member/doctors');
      // console.log(d_data);
      setDoc(d_data);
      const data = await apis.noTokengetRequest('/member/patient/reception');
      setPat(data);
      // console.log(data);
    };

    fetchData();
  }, []);

  //-----------------------------Part-1---------------------------------------------
  //Take patient details
  //Take doctor details

  //updates the values of the form with the patient values and doctor values as they get selected.
  const handleSearch = (newValue, index, i2) => {
    if (newValue) {
      if (index === 1) {
        const s = (i2 === 1) ? 'pid' : 'pname';
        const t = patients.find((e) => e[s] === newValue);
        setForm({ ...formV, pid: t.pid, mobile: t.mobile, pname: t.pname })
      } else {
        const s = (i2 === 1) ? 'dep' : 'dname';
        const t = doctors.find((e) => e[s] === newValue);
        setForm({ ...formV, did: t.eid, dname: t.dname, dep: t.dep, qs: t.qs, price: t.price,pph:t.pph });
        setT(t.timings);
      }
    }
  };

  //Autocomplete 
  const autoComp = (arrS, property, label, index, i2) => (
    <Grid size={{ md: 6 }} >
      <Autocomplete
        freeSolo
        options={arrS.map((option) => option[property])}
        onChange={(event, newValue) => handleSearch(newValue, index, i2)}
        value={formV[property]}
        required
        renderInput={(params) => (
          <TextField
            {...params}
            label={`Search ${label}`}
            margin='normal'
            variant='outlined'
          />
        )}
      />
    </Grid >
  );

  //UI for part 0.
  const partO = () => {
    return (
      <Grid container spacing={2} >
        <Grid size={{ md: 6 }}>
          <Grid container spacing={2}>
            {autoComp(patients, 'pid', "Patient ID", 1, 1)}
            {autoComp(patients, 'pname', "Patient Name", 1, 0)}
          </Grid>
        </Grid>
        <Grid size={{ md: 6 }}>
          <Grid container spacing={2}>
            {autoComp(doctors, 'dname', "Doctor Name", 0, 0)}
            {autoComp(doctors, 'dep', "Doctor Department", 0, 1)}
          </Grid>
        </Grid >
      </Grid >
    );
  }

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
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formV);
    if (formV['time']) {
      alert(JSON.stringify(formV));
      await apis.noTokenPostRequest('/appointment/opd', formV);
      clearValues();

    } else {
      alert("Select Date");
    }
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



  //=========================Calender===========

  const [selectedDate, setSelectedDate] = useState(null);

  const isBeforeToday = (date) => {
    const today = new Date(Date.now() - 86400000);;
    return date < today;
  };

  const handleDateClick = async (date) => {
    if (!isBeforeToday(date)) {
      setSelectedDate(date);
      const localDate = new Date(date);
      localDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
      const d = localDate.toISOString().split("T")[0];
      setForm({ ...formV, schedule_date: d });

      const link = `/member/doctorTiming/${d}/${formV.did}`;
      const res = await apis.noTokengetRequest(link);

      console.log("Result", res, "Link", link);

      if (res) {
        const resMap = res.reduce((acc, { timing, count }) => {
          acc[timing] = count;
          return acc;
        }, {});


        const updatedCount = Timings.reduce((acc, timing) => {
          if (resMap[timing] == null)
            acc[timing] = formV.pph;
          else
            acc[timing] = resMap[timing];
          return acc;
        }, {});

        console.log(updatedCount);
        setC(updatedCount);
      } else {
        const defaultCount = Object.fromEntries(Timings.map(t => [t, formV.pph]));
        setC(defaultCount);
      }

      console.log(count);
    }
  };



  //======================
  const cUI = () => {
    return (
      <Grid container spacing={2} >

        <Grid size={{ sm: 8 }}>
          <Calendar
            className="my-calendar"
            style={{ height: '500px', width: '800px', backgroundColor: 'blue' }}
            onClickDay={handleDateClick}
            value={selectedDate}
            tileDisabled={({ date }) => isBeforeToday(date)}
            tileClassName={({ date }) => (isBeforeToday(date) ? 'disabled-date' : '')}
          />
        </Grid>

        <Grid size={{ sm: 4 }}>
          <Grid> <h2>Date: {(new Date(formV.schedule_date)).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric' })} <br /><br /> Select Timings:</h2></Grid>
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

        <Grid>
          <Button variant="contained" color="primary" type='submit'>Book Appointment</Button>
        </Grid>
      </Grid>
    )
  }


  return (

    <SideBar arr={sidebar_utils}>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={2} >
          <Grid size={{ xs: 12 }}>
            <Card className="partition" >
              <CardContent>
                {partO()}
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12 }} >
            <Card className="partition" >
              <CardContent>
                {cUI()}
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </form>

    </SideBar>

  );
}
