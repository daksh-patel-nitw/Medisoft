import Tabs from '@mui/material//Tabs';
import Tab from '@mui/material//Tab';
import React, { useState } from 'react';
import Grid from '@mui/material//Grid2';
import Card from '@mui/material//Card';
import { SideBar } from '../../components/sidebar';
import { side_bar } from './utils';
import Part1 from './part1';

export default function App() {

  //Check Tabs 
  const [value, setValue] = useState(0);

  //Setting Bill
  const [bill1, setBill1] = useState(null);
  //Which tab are we.
  const [nextTab1, setNextTab1] = useState(0);
  //Setting Patient in Undone
  const [patient1, setPatient1] = useState(null);

  //Setting Bill
  const [bill2, setBill2] = useState(null);
  //Which tab are we.
  const [nextTab2, setNextTab2] = useState(0);
  //Setting Patient in Undone
  const [patient2, setPatient2] = useState(null);

  return (

    <SideBar arr={side_bar} title="Bill Desk">

      <Grid justifyContent="center" container spacing={2} >
        <Card className="partition" sx={{ position: "relative", width: { md: "50%", xs: "100%" }, height: "82vh" }}>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, n) => setValue(n)}
            aria-label="disabled tabs example"
          >
            <Tab label="Pending Bills" />
            <Tab label="Done" />

          </Tabs>

          {value ?
            <Part1
              setBill={setBill1}
              setNextTab={setNextTab1}
              patient={patient1}
              setPatient={setPatient1}
              nextTab={nextTab1}
              bill={bill1}
              value={true}
            /> :
            <Part1
              setBill={setBill2}
              setNextTab={setNextTab2}
              patient={patient2}
              setPatient={setPatient2}
              nextTab={nextTab2}
              bill={bill2}
              value={false}
            /> 
          }

        </Card>
      </Grid>
    </SideBar>

  );
}
