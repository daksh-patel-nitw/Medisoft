import React, { useEffect } from 'react';
import { useState } from 'react';
import { SideBar } from '../../components/sidebar';
import { sidebar_utils } from './utils';
import OtherParts from '../../components/BookOPDAppointment';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import { Typography } from '@mui/material';
import { apis } from '../../Services/commonServices';
import { useSelector, useDispatch } from 'react-redux';
import { setPatient, getPatient } from '../../redux/slices/patientSlice';
import Skeleton from '@mui/material/Skeleton';

// const patient = { pname: "Sayan Kandoi", pid: "P000000B", mobile: "987654309" }
export default function App() {
  const pid = "P000000B";
  const dispatch = useDispatch();
  const patient = useSelector(getPatient);
  //Will be used for the navigation from one part to another
  const [part, setPart] = useState(1);
  const [patientToSend, setPat] = useState(null);
  const [opd, setOpd] = useState(null);

  //Will be used for the navigation from one part to another

  useEffect(() => {
    const fetchData = async () => {
      console.log(patient);
      if (patient) return;

      const data = await apis.noTokengetRequest("/member/getById/" + pid);
      console.log(data);
      const timer = setTimeout(() => {
        console.log("15s passed. Setting patientToSend...");
        dispatch(setPatient(data));
      }, 2000);

      return () => clearTimeout(timer);
    }

    //This is to set the title of the page
    fetchData();
  }, []);

  useEffect(() => {
    if (patient) {
      setPat({ pid, pname: patient.fname + patient.lname, mobile: patient.mobile });
      setOpd(patient.opd);
    }
  }, [patient]);
  //We always want to start from part 1, so if the part is less than 1, we set it to 1
  //This is to avoid any errors in the initial rendering of the component
  useEffect(() => {
    if (part < 1) {
      setPart(1);
    }
  }, [part]);

  useEffect(() => {
    if (patient && opd && opd !== patient.opd) {
      dispatch(setPatient({ ...patient, opd }));
    }
  }, [opd]);



  return (
    <SideBar arr={sidebar_utils}>
      {patient ? opd ?
        <Grid justifyContent="center" container spacing={2} >
          <Card className="partition" sx={{ position: "relative", width: { md: "50%", xs: "100%" }, height: "82vh" }}>

            <Grid container spacing={2} justifyContent="center" textAlign="center" sx={{ mt: 16, padding: "10%", height: "100%" }}>
              <Typography variant='h4'> You have already booked an appointment with<br /><strong>Dr. {opd}</strong>.</Typography>
            </Grid>

          </Card>
        </Grid>
        :
        <OtherParts
          part={part}
          setPart={setPart}
          patient={patientToSend}
          setOpd={setOpd}
          index={0}

        /> :
        <Grid justifyContent="center" container spacing={2} >
          <Card className="partition" sx={{ position: "relative", width: { md: "50%", xs: "100%" }, height: "82vh" }}>
            <Skeleton
              variant="rectangular"
              height="17%"
              animation="wave"
              sx={{ m: 2 }}
            />

            <Skeleton
              variant="rectangular"
              height="10%"
              animation="wave"
              sx={{ m: 2 }}
            />

            <Skeleton
              variant="rectangular"
              height="10%"
              animation="wave"
              sx={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                right: "16px", // matches `m: 2` on other skeletons
              }}
            />

          </Card>
        </Grid>
      }
    </SideBar >
  );
}
