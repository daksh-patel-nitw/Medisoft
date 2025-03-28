import React from 'react';
import { useState } from 'react';
import Grid from '@mui/material//Grid2';
import Card from '@mui/material//Card';
import CardContent from '@mui/material//CardContent';
import TextField from '@mui/material//TextField';
import IconButton from '@mui/material//IconButton';
import { Delete } from '@mui/icons-material';
import Button from '@mui/material//Button';
import { arr1, arr2, side_bar, initialTestState } from './utils';
import { SideBar } from '../../components/sidebar';
import { apis } from '../../Services/commonServices';

export default function App() {
  const [formValues, setFormValues] = useState(initialTestState);
  const [timings, setTiming] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const status = await apis.noTokenStatusPostRequest('/lab', formValues);
    if (status === 200) {
      setFormValues(initialTestState);
    }

  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    if (name !== 'timing')
      setFormValues({ ...formValues, [name]: value });
    else
      setTiming(value);
  };

  const addTiming = () => {
    console.log(timings);
    setFormValues({ ...formValues, timing: [...formValues.timing, timings] });
    setTiming('');
  }
  const delteTiming = (value) => {
    setFormValues({ ...formValues, timing: formValues.timing.filter(e => e != value) });
    setTiming('');
  }

  const makeUI = () => {
    return (
      arr1.map((fieldName, index) => (

        <>
          <Grid size={{ xs: index === 4 ? 8 : 12 }} key={fieldName}>
            <TextField
              fullWidth
              name={fieldName}
              id={fieldName}
              label={arr2[index]}
              variant="outlined"
              value={index === 4 ? timings : formValues[fieldName]}
              type={index === 1 ? "number" : "text"}
              onChange={handleInputChange}
              required={index === 4 ? false : true}
            />
          </Grid>
          {index == 4 && <>
            <Grid size={{ xs: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={addTiming}
              >
                Add
              </Button>
            </Grid >

            {formValues.timing.map((time, index) => (
              <>
                <Grid size={{ xs: 3 }} />
                <Grid container size={{ xs: 6 }}>
                  <Grid  style={{ display: "flex", alignItems: "center" }} size={{ xs: 9 }}>
                    {time}

                  </Grid>
                  <Grid size={{ xs: 3 }}>
                    <IconButton onClick={() => delteTiming(time)}>
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 3 }} />
              </>
            ))}

          </>}
        </>
      ))
    )
  }

  return (

    <SideBar arr={side_bar}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={2}>
          <Grid size={{ xs: 3 }} />
          <Grid size={{ xs: 6 }}>
            <Card className="partition" >
              <CardContent>
                <h2>Add New Test</h2>
                <Grid container spacing={2}>
                  {makeUI()}

                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                    >
                      Add Test
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </SideBar>

  );
}
