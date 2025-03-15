import React, { useEffect } from 'react';
import { useState } from 'react';
import Grid from '@mui/material//Grid2';
import Card from '@mui/material//Card';
import CardContent from '@mui/material//CardContent';
import TextField from '@mui/material//TextField';
import Button from '@mui/material//Button';
import Autocomplete from '@mui/material/Autocomplete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Typography, MenuItem, FormControl, InputLabel, Select, TablePagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, } from '@mui/material/';
import Stepper from '@mui/material//Stepper';
import Step from '@mui/material//Step';
import StepLabel from '@mui/material//StepLabel';
import './2.css';
import { side_bar } from './utils.js';
import { SideBar } from '../../components/sidebar';
import { apis } from '../../Services/commonServices.js';
import { toast } from 'react-toastify';

const initialState = { pid: '', pname: '', mobile: '', dname: '', price: '', dep: '', did: '', room_no: '', type: '', floor: '' };

export default function App() {


  const [patients, setPat] = useState([]);
  const [doctors, setDoctor] = useState([]);

  //Rooms
  const [rooms, setRoom] = useState([]);
  //Categories
  const [cat, setCat] = useState([]);

  const getData = async () => {
    const d_data = await apis.noTokengetRequest('/member/doctors');
    setDoctor(d_data);
    const data = await apis.noTokengetRequest('/member/patient/reception');
    setPat(data);
  }

  useEffect(() => {
    getData();
  }, []);

  const [formValues, setFormValues] = useState(initialState);

  const pArr = ['pid', 'pname', 'mobile'];
  const pArr2 = ["Patient Id", "Patient Name", "Mobile"];

  const dArr = ['dname', 'dep', 'did'];
  const dArr2 = ["Doctor name", "Department", "Doctor Id"];

  const rArr = ['room_no', 'type', 'floor', 'price'];
  const rArr2 = ["Room No", "Room Type", "Floor", "Price", "Select"];

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    alert(JSON.stringify(formValues));

    if (formValues.room_no === '') {
      toast.error(`Please Select the Room`);
      return;
    }

    const status = await apis.noTokenStatusPostRequest('room/book', formValues);

    if (status === 200) {
      setFormValues(initialState);
      setRoom([]);
      setCat([]);
      setActiveStep(0);
    }
  };

  const handlePSearch = (event, newValue) => {
    if (newValue) {
      const p = patients.find((p) => p.pid.includes(newValue));
      setFormValues({ ...formValues, pid: p.pid, pname: p.pname, mobile: p.mobile });
      console.log(formValues);
    }
  };

  const handleDSearch = async (event, newValue) => {
    if (newValue) {
      const d = doctors.find((d) => d.dname.includes(newValue));
      setFormValues({ ...formValues, dname: d.dname, dep: d.dep, did: d.eid });
      console.log(formValues);
    }

  };

  function makeUI(autoArr, search, farr, farr2, searchFunction, index, label, title) {
    return (
      < >
        <h2>{title} Details</h2>
        <Card sx={{ maxWidth: 500, margin: "auto", padding: 2, boxShadow: 3 }}>
          <CardContent>
            {(index === 1) &&
              <Grid size={{ xs: 12 }}>

                <Autocomplete
                  freeSolo
                  options={autoArr.map((option) => option[search])}
                  onChange={searchFunction}
                  renderInput={(params) => (
                    <TextField
                      className='CI'
                      {...params}
                      label={label}
                      margin='normal'
                      variant='outlined'
                    />
                  )}
                />
              </Grid>
            }



            {/* <table>
          <tbody>
            {farr.map((fieldName, index) => (
              index !== 4 && (
                <tr key={fieldName}>
                  <td>{farr2[index]}</td>
                  <td> :  </td>
                  <td> {formValues[fieldName]}</td>
                </tr>
              )
            ))}
          </tbody>
        </table> */}

            <Grid container size={{ xs: 12 }} spacing={2}>
              {farr.map((fieldName, index) => (
                index !== 4 && (
                  <>
                    <Grid size={{ xs: 5 }} key={fieldName}>
                      <Typography variant="body2" color="text.secondary">
                        {farr2[index]}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 1 }}> : </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body1">{formValues[fieldName]}</Typography>
                    </Grid>
                  </>
                )
              ))}
            </Grid>

          </CardContent>
        </Card>
      </>
    );
  }

  const rowsPerPageOptions = [3, 5];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const selectRoom = (rVal) => {
    console.log("In select Room");
    console.log(rVal, rooms);

    const r = rooms.find((p) => p._id === rVal);

    if (!r) {
      console.error("Room not found!");
      return;
    }

    console.log(r);
    setFormValues({ ...formValues, room_no: r.room_no, type: r.type, floor: r.floor, price: r.price });
  };


  const [filtered, setFiltered] = useState([]);
  const [selectValue, setSel] = useState('None');
  function filter(event) {
    const t = event.target.value;
    setSel(t);
    setFiltered(rooms.filter(
      (m) => (m.type.toLowerCase().includes(t.toLowerCase())
      )));
  }

  function roomUI() {
    return (
      <Grid container spacing={2}>
        <Grid size={{ xs: 8 }}>
          <FormControl className='CI' variant="outlined" fullWidth>
            <InputLabel id="cat"> Filter with Room Type  </InputLabel>
            <Select
              labelId="cat"
              key="cat"
              name="cat"
              label="Filter with Room Type"
              onChange={filter}
              value={selectValue}
            >
              <MenuItem key="select" value="">None</MenuItem>
              {cat.length > 0 &&
                cat.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TableContainer>
            <Table size="small">
              <TableHead style={{ backgroundColor: "#1F3F49" }}>

                <TableRow>
                  {rArr2.map((x) => (
                    <TableCell style={{ color: "white" }}>{x}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(filtered.length !== 0 ? filtered : rooms)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((m) => (
                    <TableRow key={m._id}>
                      <TableCell>{m.room_no}</TableCell>
                      <TableCell>{m.type}</TableCell>
                      <TableCell>{m.floor}</TableCell>
                      <TableCell>{m.price}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => selectRoom(m._id)}>
                          <AddBoxIcon style={{ borderRadius: 4, padding: 2 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={
                (filtered.length !== 0) ? filtered.length : rooms.length
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Grid>
      </Grid>
    );

  }

  function getSteps() {
    return ['Select Patient & Doctor', 'Select Room'];
  }
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = async (event) => {
    if (activeStep === 0) {
      event.preventDefault();
    }

    if (formValues[pArr[0]] === '') {
      toast.error(`Please Select the patient`);
      return;
    }
    if (formValues[dArr[0]] === '') {
      toast.error(`Please Select the Doctor`);
      return;
    }

    const data = await apis.noTokengetRequest('room/dep/' + formValues.dep);
    setRoom(data[0]);
    setCat(data[1]);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };


  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <Grid size={{ xs: 12 }} container spacing={2}>
            <Grid size={{ xs: 6 }}>
              {makeUI(patients, 'pid', pArr, pArr2, handlePSearch, 1, "Search Patient ID", "Patient")}
            </Grid>
            <Grid size={{ xs: 6 }}>
              {makeUI(doctors, 'dname', dArr, dArr2, handleDSearch, 1, "Search Doctor ID", "Doctor")}
            </Grid>
          </Grid>
        )
      case 1:
        return (
          <Grid container size={{ xs: 12 }} spacing={2}>
            <Grid size={{ xs: 6 }}>
              {roomUI()}
            </Grid>
            <Grid size={{ xs: 6 }}>
              {makeUI(rooms, '', rArr, rArr2, '', 0, '', 'Room')}
            </Grid>
          </Grid>
        )
      default:
        return 'Unknown stepIndex';
    }
  }

  return (

    <SideBar arr={side_bar}>
      <Grid container spacing={2}>
        <form onSubmit={handleFormSubmit} style={{ width: "70%", margin: 'auto' }} autoComplete="off">

          <Card className="partition" >

            <Stepper className="partition" activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper><hr />

            <CardContent style={{ top: '0px' }}>
              <Grid container spacing={2}>

                {getStepContent(activeStep)}

                <Grid size={{ xs: 12 }}>
                  <Grid container spacing={2} direction="row">
                    <Grid size={{ xs: 6 }}>
                      <Button variant="contained" disabled={activeStep === 0} style={{ width: '100%' }} onClick={handleBack}>
                        Back
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 6 }}>

                      {activeStep !== 0 ?
                        <Button variant="contained" type="Submit" color="secondary" style={{ width: '100%' }}>Submit</Button> : <Button variant="contained" color="primary" style={{ width: '100%' }} onClick={handleNext}>Next</Button>}

                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Grid>
    </SideBar>


  );
}
