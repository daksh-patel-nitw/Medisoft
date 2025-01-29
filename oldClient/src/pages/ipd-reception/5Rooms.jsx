import React from 'react';
import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PageLayout from './pageLayout';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';

export default function App()
{
  const [catValues, setCatValues] = useState({
    type:'',beds:'',price:'',sofa:'',tv:'',refrigator:'',bathroom:'',other:'' });
  
  const arr1=['pid','pname','mobile','dname','dep','did','room_no','type','floor','occupied'];
  const arr1 = ['type','beds','price','sofa','tv','refrigator','bathroom','other'];
  const arr2 = ["Room Type", "Room Price", "No. of Beds", "Telivision", "Sofa", "Refrigator","Bathroom","Other"];

  const handleCatSubmit = (event) =>
  {
    event.preventDefault();
    alert(JSON.stringify(catValues));
    fetch('http://localhost:5000/api/newroomcategory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(catValues)
    })
      .then(response => response.json())
      .then(data =>
      {
        console.log(data);
        setCatValues({ type:'',beds:'',price:'',sofa:'',tv:'',refrigator:'',bathroom:'',other:'' });
      })
      .catch(error => console.error(error));
  };

  const handleInputChange = (event) =>
  {
    const { name, value } = event.target;
    setCatValues({ ...catValues, [name]: value });
  };


  return (

    <PageLayout>
      
        <Grid container spacing={2}>
          <Grid item xs={12}>
          <form onSubmit={handleCatSubmit} autoComplete="off">
            <Card className="partition" >
              <CardContent>
                <h2>Add New Category</h2>
                <Grid container spacing={2}>
                  {arr1.map((fieldName, index) => (

                    (index < 3) ?
                      <Grid item sm={4} key={fieldName}>
                        <TextField
                          fullWidth
                          name={fieldName}
                          id={fieldName}
                          label={arr2[index]}
                          variant="outlined"
                          value={catValues[fieldName]}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      : (index < 7) ?
                        <RadioGroup name={fieldName} value={catValues[fieldName]} onChange={handleInputChange}>
                          <label>{arr2[index]} </label>
                          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                          <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                        :
                        <Grid item key={fieldName}>
                          <TextField
                            fullWidth
                            name={fieldName}
                            id={fieldName}
                            label={arr2[index]}
                            variant="outlined"
                            value={catValues[fieldName]}
                            onChange={handleInputChange}
                          />
                        </Grid>

                  ))
                  }
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"

                    >
                      Add Category
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            </form>
          </Grid>
        </Grid>
    </PageLayout>

  );
}
