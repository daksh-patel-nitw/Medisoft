import React from 'react';
import { useState } from 'react';
import Grid from '@mui/material//Grid2;
import Card from '@mui/material//Card';
import CardContent from '@mui/material//CardContent';
import TextField from '@mui/material//TextField';
import Button from '@mui/material//Button';
import PageLayout from './pageLayout';

const arr1 = [ 'name',  'price',  'pat_details',  'normal',];
const arr2 = ["Test Name", "Test Price", "Required Details", "Normal Range"];
const initialized=arr1.reduce(
    (obj, key) => ({ ...obj, [key]: ''}),
    {}
  );

export default function App()
{
  const [formValues, setFormValues] = useState(initialized);
  

  const handleSubmit = (event) =>
  {
    event.preventDefault();
    // perform any necessary actions with formValues
    alert(JSON.stringify(formValues));
    fetch('http://localhost:5000/api/newtest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formValues)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setFormValues(initialized);
    })
    .catch(error => console.error(error));
  };

  const handleInputChange = (event) =>
  {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const makeUI=()=>{
      return(
        arr1.map((fieldName, index) => (
                      
            <Grid item key={fieldName}> 
                <TextField
                  fullWidth
                  name={fieldName}
                  id={fieldName}
                  label={arr2[index]}
                  variant="outlined"
                  value={formValues[fieldName]}
                  onChange={handleInputChange}
                  required
                />
    
             </Grid>          
          ))
      )
  }

  return (

      <SideBar>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Grid container spacing={2}>
            <Grid size={{xs:12} sm={6}>
              <Card className="partition" >
                <CardContent>
                  <h2>Add New Test</h2>
                  <Grid container direction="column" spacing={2}>
                    {makeUI()}
                    <Grid item>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"

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
