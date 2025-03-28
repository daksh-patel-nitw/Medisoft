import React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material//CardContent';
import TextField from '@mui/material//TextField';
import Button from '@mui/material//Button';
import { SideBar } from '../../components/sidebar';
import { apis } from '../../Services/commonServices';
import { InputLabel, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material/';
import Select from '@mui/material//Select';
import Tabs from '@mui/material//Tabs';
import Tab from '@mui/material//Tab';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import { sidebar_utils } from './utils';
import { toast } from 'react-toastify';

export default function App() {
  const doctorId = "E0000003";
  //Getting all Patients to set up the autocomplete.
  const [patients, setPatients] = useState([]);

  //Selected Patient
  const [activePat, setActive] = useState({ pid: '', pname: '' });

  //Getting the info of the selected patient
  const [appointment, setAppointment] = useState(null);

  //Showing the Patient panel
  const [showPatient, setShowPatient] = useState(false);

  const fetchData = async () => {
    const data = await apis.noTokengetRequest("appointment/ipd/" + doctorId);
    console.log(data);
    setPatients(data);
  }

  const handle2Search = (newValue) => {
    if (newValue) {
      setActive(newValue);
    } else {
      setActive({ pid: '', pname: '' });
    }
  };

  const autoCompHeader = (label, property) => (
    <Grid size={{ xs: 6 }}>
      <Autocomplete
        options={patients}
        getOptionLabel={(option) => option[property]}
        onChange={(event, newValue) => handle2Search(newValue)}
        value={activePat}
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
    </Grid>
  );

  const getAppointment = async () => {
    if (activePat.pid === '') {
      toast.error('Please select a patient');
      return;
    }
    const data = await apis.noTokengetRequest("appointment/ipd/" + doctorId + "/" + activePat.pid);
    if (data) {
      setAppointment(data);
      setShowPatient(true);
    }
  }

  useEffect(() => {
    fetchData();

  }, []);

  return (

    <SideBar arr={sidebar_utils}>
      <Grid container spacing={2} >

        {!showPatient ? <Grid size={{ xs: 12 }}>
          <Card className="partition">
            <CardContent>
              <Grid container spacing={2}>
                {autoCompHeader("Patient Id", 'pid', 0)}
                {autoCompHeader('Patient Name', 'pname', 1)}
                <Grid>
                  <Button onClick={getAppointment} variant="contained" color="primary">
                    Get Patient Details
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
          :
          <>
            <Grid size={{ xs: 12 }} >
              <Card className="partition" sx={{ m: 0, p: 0 }}>

                <Grid container justifyContent="center"  spacing={0}>
                  <Grid size={{ xs: 4 }}>
                    <h2 style={{ margin: 1,alignItems:"center" }}>{activePat.pname}</h2>
                  </Grid>

                  <Grid size={{ xs: 3 }}>
                    <h2 style={{ margin: 1,alignItems:"center" }}>{activePat.pid}</h2>
                  </Grid>

                  <Grid size={{ xs: 3 }} >
                    <h2 style={{ margin: 1,alignItems:"center" }}>{activePat.mobile}</h2>
                  </Grid>

                  <Grid size={{ xs: 2 }} >
                    <Button
                      onClick={() =>{
                        setShowPatient(false)
                        setActive({ pid: '', pname: '' });
                        setAppointment(null);
                      }}
                      variant="contained"
                      color="primary"
                      sx={{ height: "100%", borderRadius: 0, width: "100%" }}
                    >
                      Back
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Grid container spacing={2} size={{ md: 7, xs: 12 }}>
              <Grid size={{ xs: 12 }}>
                <Card className="partition">
                  <Grid size={{ xs: 12 }}><div style={{ padding: 8, fontWeight: 'Bold', fontSize: '16px' }}>Medicines:</div> <hr style={{ margin: 0 }} /></Grid>
                  <CardContent style={{ paddingTop: '9px' }}>
                    Medicines
                    </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Card className="partition" style={{ width: '100%' }}>
                  <Grid size={{ xs: 12 }}><div style={{ padding: 8, fontWeight: 'Bold', fontSize: '16px' }}>Lab Tests:</div> <hr style={{ margin: 0 }} /></Grid>
                  <CardContent style={{ paddingTop: '9px' }}>
                    Tests
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid size={{ md: 5, xs: 12 }}>
              <Card className="partition">
                <Grid size={{ xs: 12 }}><div style={{ padding: 8, fontWeight: 'Bold', fontSize: '16px' }}>Past Appointments</div> <hr style={{ margin: 0 }} /></Grid>
                <CardContent style={{ paddingTop: '9px' }}>
                  <Grid container spacing={2}>
                    
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
          </>}
      </Grid>
    </SideBar>

  );
}
