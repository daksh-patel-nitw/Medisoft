import Tabs from '@mui/material//Tabs';
import Tab from '@mui/material//Tab';
import React, { useState} from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material//Card';
import { side_bar } from '../utils';
import { SideBar } from '../../../components/sidebar';
import Part0 from './part0'

export default function App() {

  //For the first tab
  const [nextTab1, setNextTab1] = useState(0);
  //For the first tab patient
  const [patient1, setPatient1] = useState(null);
  //For the first tab details
  const [detail1, setDetail1] = useState({});

  //For the second tab
  const [nextTab2, setNextTab2] = useState(0);
  //For the second tab patient
  const [patient2, setPatient2] = useState(null);
  //For the second tab details
  const [detail2, setDetail2] = useState({});

  //Check Tabs
  const [value, setValue] = useState(0);

  //Track tabs value
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (

    <SideBar arr={side_bar} title="Laboratory">
      <Grid justifyContent="center" container spacing={2} >
        <Card className="partition" sx={{ position: "relative", width: { lg: "50%", md: "90%", xs: "100%" }, height: "82vh" }}>

          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="disabled tabs example"
          >
            <Tab label="Take Patient Details" />
            <Tab label="Add Test Results" />
            <Tab label="Done" />
          </Tabs>
          {value === 0 && <Part0 detail={detail1} setDetail={setDetail1} index={0} patient={patient1} setPatient={setPatient1} nextTab1={nextTab1} setNextTab1={setNextTab1} />}
          {value === 1 && <Part0 detail={detail2} setDetail={setDetail2} index={1} patient={patient2} setPatient={setPatient2} nextTab1={nextTab2} setNextTab1={setNextTab2} />}


        </Card>
      </Grid>
    </SideBar>

  );
}