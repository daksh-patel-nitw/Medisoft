import React from 'react';
import { useState } from 'react';
import Grid from '@mui/material//Grid2';
import Card from '@mui/material//Card';
import CardContent from '@mui/material//CardContent';
import TextField from '@mui/material//TextField';
import Button from '@mui/material//Button';
import { arr1, arr2, side_bar, initialTestState } from '../utils';
import { SideBar } from '../../../components/sidebar';
import { apis } from '../../../Services/commonServices';
import { Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import { toast } from 'react-toastify';
import TimingsPicker from '../../../components/TimingsAutoComp';
import '../style.css';
export default function App() {
  const [formValues, setFormValues] = useState(initialTestState);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formValues.timing.length) {
      toast.warn("Please add timings");
      return;
    }
    const status = await apis.noTokenStatusPostRequest('/lab', formValues);
    if (status === 200) {
      setFormValues(initialTestState);
    }

  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    setFormValues({ ...formValues, [name]: value });
  };

  const addTiming = (timings) => {
    setFormValues({ ...formValues, timing: [...formValues.timing, timings] });
  }
  const delteTiming = (value) => {
    setFormValues({ ...formValues, timing: formValues.timing.filter(e => e != value) });
  }

  const makeUI = () => {
    return (
      arr1.map((fieldName, index) => (
        <>
          <Grid size={{ xs: index === 4 ? 5 : 12 }} container spacing={index === 4 ? 0 : 2} key={fieldName}>
            {index === 4 ? <Grid size={{ xs: 12 }} key={fieldName}>
              <TimingsPicker handleAdd={addTiming} />
            </Grid>
              :
              <Grid size={{ xs: 12 }} key={fieldName}>
                <TextField
                  fullWidth
                  name={fieldName}
                  id={fieldName}
                  label={arr2[index]}
                  variant="outlined"
                  value={formValues[fieldName]}
                  type={index === 1 ? "number" : "text"}
                  onChange={handleInputChange}
                  required={index === 4 ? false : true}
                  sx={{ ...(index === 4 && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }) }}
                />
              </Grid>}

          </Grid>

          {
            index === 4 &&
            <Grid container justifyContent="center" alignItems="center" size={{ xs: 7 }} sx={{ border: '1px solid black', borderRadius: '5px', padding: '10px' }} spacing={2}>
              {formValues.timing.length ? formValues.timing.map((time, index) => (

                <Chip label={time} variant="outlined" onDelete={() => delteTiming(time)} />


              ))
                :
                <Typography variant="body2" color="text.secondary" style={{ marginLeft: "10px" }}>
                  No Timings Added
                </Typography>
              }
            </Grid>
          }


        </>
      ))
    )
  }

  return (

    <SideBar arr={side_bar}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={2}>
          <Grid size={{lg:3, md: 1, xs: 0 }} />
          <Grid size={{lg:6, md: 10, xs: 12 }}>
            <Card className="partition"  sx={{ position: "relative", height: "82vh" }}>
              <CardContent>
                <h2>Add New Test</h2>
                <Grid container spacing={2}>
                  {makeUI()}

                </Grid>
              </CardContent>
              <Grid size={{ xs: 12 }} sx={{ position: "absolute", bottom: "4px", p: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{ height: "8vh",width:"100%", fontWeight: "bold", fontSize: "1.2rem" }}
                >
                  Add Test
                </Button>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </form>
    </SideBar>

  );
}
