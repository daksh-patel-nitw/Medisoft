import React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material//Button';
import { SideBar } from '../../components/sidebar';
import Autocomplete from '@mui/material/Autocomplete';
import DeleteIcon from '@mui/icons-material/Delete';
import { sidebar_utils } from './utils';

export default function App() {

  const [e, setT] = useState({});
  const [ques, setQ] = useState('');
  //Medicines data fetch
  const fetchTimings = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/getempwithid/${id}`);
      const data = await response.json();
      console.log(data)
      setT(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTimings('E000000C');
  }, []);

  const arr1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];

  const updateTimings = async (updated) => {
    console.log(updated);
    await fetch('http://localhost:5000/api/addtimings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updated)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.timings);
      })
      .catch(error => console.error(error));
  }

  const handleClick = () => {
    if (autoComp2) {
      const updated = { ...e, timings: [...e.timings, `${autoComp2}-${Number(autoComp2) + 1}`] }
      setT(updated);
      updateTimings(updated);

    } else {
      alert("Select Date before adding.");
    }

  };

  const handleBClick = () => {
    const updated = { ...e, questions: [...e.questions, ques] }
    console.log(updated);
    setT(updated);
    updateTimings(updated);
  };

  const onQuesChange = (event) => {
    setQ(event.target.value);
  }

  const updatePatients = () => {
    console.log(e.pph);
    updateTimings(e);
  }

  const handledelete = (dl) => {
    const updated = { ...e, timings: e.timings.filter(t => t !== dl) }
    alert(JSON.stringify(updated));
    updateTimings(updated);
    setT(updated);
    console.log(e)
  }
  const handleSearch = (event, newValue) => {
    setAuto2(newValue);
    setl((Number(newValue) + 1) % 24);
  }

  const handleChng = (event) => {
    setT({ ...e, pph: event.target.value })
  }

  const [l, setl] = useState('');
  const [autoComp2, setAuto2] = useState('');
  const autoComp = () => (

    <Autocomplete
      options={arr1.map((option) => option)}
      required
      value={autoComp2}
      onChange={handleSearch}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Select'
          margin='normal'
          variant='outlined'
        />
      )}
    />
  );

  return (

    <SideBar arr={sidebar_utils}>
      <Grid container spacing={2}>

        <Grid size={{ xs: 6 }}>
          <Card className="partition" >
            <CardContent>
              <h2>Timings</h2>
              
                  <Grid container justifyContent="flex-start" alignItems="center" spacing={2}>
                    <Grid size={{ xs: 2 }}><h3>From</h3></Grid>
                    <Grid size={{ xs: 4 }}>{autoComp()}</Grid>
                    <Grid size={{ xs: 2 }}><h3>to {l}</h3></Grid>
                    <Grid size={{ xs: 2 }}>
                      <Button
                        onClick={handleClick}
                        variant="contained"
                        color="primary"
                      >
                        Add
                      </Button>
                    </Grid>
              </Grid>

              {e.timings && e.timings.map(t => (
                <React.Fragment key={t}>
                  <Grid size={{ xs: 4 }}>{t}</Grid>
                  <Grid size={{ xs: 8 }}>
                    <DeleteIcon onClick={() => handledelete(t)} />
                  </Grid>
                </React.Fragment>
              ))}


            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Card className="partition" >
            <CardContent>
              <h2>Yes/No Questions</h2>
              <Grid container size={{ xs: 12 }}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    label='Question'
                    value={ques}
                    onChange={onQuesChange}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Button
                    onClick={handleBClick}
                    variant="contained"
                    color="primary"
                  >
                    Add
                  </Button>
                </Grid>
                
                {e.questions && e.questions.map(t => (
                  <React.Fragment key={t}>
                    <Grid size={{ xs: 4 }}>{t}</Grid>
                    <Grid size={{ xs: 8 }}>
                      {/* <DeleteIcon onClick={() => handledelete(t)}/> */}
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 4 }} >
          <Card>
            <CardContent>
              <h3>Patients per Hour</h3>
              <TextField
                label='PPH'
                defaultValue={e.pph}
                value={e.pph}
                onChange={handleChng}
              /><br /><br />
              <Button
                onClick={updatePatients}
                variant="contained"
                color="primary"
              >
                Update
              </Button>
            </CardContent>
          </Card>

        </Grid>

      </Grid >

    </SideBar >

  );
}
