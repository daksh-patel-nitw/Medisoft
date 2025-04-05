import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { SideBar } from '../../components/sidebar';
import Autocomplete from '@mui/material/Autocomplete';
import DeleteIcon from '@mui/icons-material/Delete';
import { sidebar_utils } from './utils';
import { apis } from '../../Services/commonServices';

export default function App() {
  const doctorId = "E0000002";

  const [values, setVal] = useState({ timings: '', questions: '', price: '', pph: '' });
  const [details, setDetails] = useState({});
  const [autoComp2, setAuto2] = useState('');

  // Fetch Doctor Details
  const fetchDoctorDetails = async (id) => {
    try {
      const data = await apis.noTokengetByIdRequest("member/getById", id);
      console.log(data);
      setDetails(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDoctorDetails(doctorId);
  }, []);

  const existingTimings = new Set(details.timings || []);

  const arr1 = Array.from({ length: 24 }, (_, i) => {
      const startHour = i % 12 || 12;
      const startPeriod = i < 12 ? ' a.m.' : ' p.m.';
      const endHour = (i + 1) % 12 || 12;
      const endPeriod = (i + 1) < 12 ? ' a.m.' : ' p.m.';
      
      const timeRange = `${startHour}${startPeriod} - ${endHour}${endPeriod}`;
      
      return existingTimings.has(timeRange) ? null : timeRange;
  }).filter(Boolean); // Remove null values
  


  const updateDetail = async (field) => {
    if (!values[field]) return alert('Please provide a value.');
    console.log(values[field]);
    let currentData = details[field] || [];

    if (['price', 'pph'].includes(field)) {
      currentData = values[field];
    } else {    
      currentData = [...currentData, values[field]]; 
    }

    const updated = { mid: details.mid, [field]: currentData };

    try {
      await apis.noTokenPostRequest("member/updateDetails", updated);
      fetchDoctorDetails(doctorId);
      setVal({...values,[field]:''});
      setAuto2('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange2 = (event) => {
    setVal({ ...values, [event.target.name]: event.target.value });
  };

  const handleDelete = async(item,field) => {
    const currentData=details[field].filter(m=>m!=item);
    // alert(currentData);
    const updated = { mid: details.mid, [field]: currentData };
    try {
      await apis.noTokenPostRequest("member/updateDetails", updated);
      fetchDoctorDetails(doctorId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (event, newValue) => {
    setAuto2(newValue);
    setVal({...values,timings:newValue})
  };

  return (
    <SideBar arr={sidebar_utils}>
      <Grid container spacing={2}>
        {/* Timings Section */}
        <Grid item size={{xs:6}}>
          <Card className="partition">
            <CardContent>
              <h2>Timings</h2>

              <Grid container spacing={2} alignItems="center">
                
                <Grid size={{xs:8}}>
                  <Autocomplete
                    options={arr1}
                    name='timings'
                    value={autoComp2}
                    onChange={handleSearch}
                    renderInput={(params) => (
                      <TextField {...params} label='Select' variant='outlined' />
                    )}
                  />
                </Grid>
                
                <Grid size={{xs:4}}>
                  <Button onClick={()=>updateDetail('timings')} variant="contained" color="primary">
                    Add
                  </Button>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                {details.timings && details.timings.map(t => (
                  <React.Fragment key={t}>
                    <Grid size={{xs:8}}>{t}</Grid>
                    <Grid size={{xs:4}}>
                      <DeleteIcon onClick={() => handleDelete(t,'timings')} />
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Questions Section */}
        <Grid size={{xs:6}}>
          <Card className="partition">
            <CardContent>
              <h2>Yes/No Questions</h2>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label='Question'
                    name='questions'
                    value={values.questions}
                    onChange={handleChange2}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={() => updateDetail('questions')} variant="contained" color="primary">
                    Add
                  </Button>
                </Grid>
              </Grid>

              {details.questions && details.questions.map(q => (
                <Grid container key={q} spacing={2}>
                  <Grid item xs={10}>{q}</Grid>
                  <Grid item xs={2}>
                    <DeleteIcon onClick={() => handleDelete(q,'questions')} />
                  </Grid>
                </Grid>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Patients Per Hour Section */}
        <Grid size={{xs:4}}>
          <Card>
            <CardContent>
              <h3>Patients per Hour: {details.pph}</h3>
              <TextField
                name='pph'
                value={values.pph}
                onChange={handleChange2}
                type="number"
              />
              <br /><br />
              <Button onClick={() => updateDetail('pph')} variant="contained" color="primary">
                Update
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Price Section */}
        <Grid size={{xs:4}}>
          <Card>
            <CardContent>
              <h3>Price: {details.price}</h3>
              <TextField
                name='price'
                value={values.price}
                onChange={handleChange2}
                type="number"
              />
              <br /><br />
              <Button onClick={() => updateDetail('price')} variant="contained" color="primary">
                Update
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SideBar>
  );
}
