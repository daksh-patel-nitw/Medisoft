import React from 'react';
import { useState} from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { SideBar } from '../../components/sidebar';
import { sidebar_utils } from './utils';
import { PatientAutocomplete } from '../../components/patientAutoComp';
import { toast } from 'react-toastify';
import OtherParts from '../../components/BookOPDAppointment';

export default function App() {

  //Track the patient
  const [patient, setPatient] = useState(null);

  //Will be used for the navigation from one part to another
  const [part, setPart] = useState(0);

  //----------------------------- Part-0  --------------------------------------

  //UI for part 0.
  const partO = () => {
    return (
      <Grid container size={{ xs: 12 }} spacing={2}>
        
        <Grid size={{ xs: 12 }}>
          <h2>Patient Details</h2>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <PatientAutocomplete
            index={1}
            setPatient={setPatient}
            patient={patient}
            opd="1"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <PatientAutocomplete
            index={2}
            setPatient={setPatient}
            patient={patient}
            opd="1"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <PatientAutocomplete
            index={3}
            setPatient={setPatient}
            patient={patient}
            opd="1"
          />
        </Grid>

      </Grid>
    );
  }

  const handleNext = () => {
    if (!patient) {
      toast.error("Select Patient")
      return;
    }
    if(patient.opd){
      toast.warn( <div>
        Already booked appointment with<br/>
        <strong>Dr. {patient.opd}</strong>
      </div>)
      return;
    }
    setPart((prev) => (prev + 1) % 3)
  }

  return (
    <SideBar arr={sidebar_utils}>
      {part === 0 ?
        <Grid justifyContent="center" container spacing={2} >
          <Card className="partition" sx={{ position: "relative", width: { md: "50%", xs: "100%" }, height: "82vh" }}>
            <CardContent>
              {partO()}
            </CardContent>
            <Grid size={{ xs: 12 }} spacing={2} sx={{ position: "absolute", bottom: "4px", p: 2 }}>

              <Button variant="contained" fullWidth color="primary" onClick={handleNext}
                sx={{ height: "8vh", fontWeight: "bold", fontSize: "1.2rem" }}
              >
                Next
              </Button>
            </Grid>
          </Card>
        </Grid>
        :
        <OtherParts
          part={part}
          setPart={setPart}
          patient={patient}
          setPatient={setPatient}
          index={1}
        />
      }
    </SideBar>
  );
}
