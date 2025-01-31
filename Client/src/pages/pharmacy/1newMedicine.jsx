import React from 'react';
import { useState } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PageLayout from './pageLayout';

export default function App() {
  const [formValues, setFormValues] = useState({
    name: '',
    q: '',
    t: '',
    ps: '',
    ps_u: '',
    price: ''

  });
  const arr1 = ['name', 'q', 't', 'ps', 'ps_u', 'price'];
  const arr2 = ["Medicine Name", "Quantity/Unit", "Type", "Package Size", "Package Stock Quantity", "Price per 1 Unit"];

  const handleSubmit = (event) => {
    event.preventDefault();
    // perform any necessary actions with formValues
    alert(JSON.stringify(formValues));
    fetch('http://localhost:5000/api/newmedicine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formValues)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setFormValues({ name: '', q: '', t: '', ps: '', ps_u: '', price: '', });
      })
      .catch(error => console.error(error));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };


  return (

    <PageLayout>
      <form onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card className="partition">
              <CardContent>
                <h2>Add New Medicine</h2>
                <Grid container direction="column" spacing={2}>
                  {arr1.map((fieldName, index) => (
                    (index === 2 || index === 4) ? null :
                      <Grid item key={fieldName}>
                        {(index === 1 || index === 3) ? <Grid container spacing={2}>
                          <Grid size={{ xs: 6 }} key={fieldName}>
                            <TextField
                              fullWidth
                              name={fieldName}
                              id={fieldName}
                              label={arr2[index]}
                              variant="outlined"
                              value={formValues[fieldName]}
                              onChange={handleInputChange}
                            />
                          </Grid>
                          <Grid size={{ xs: 6 }} key={arr1[index + 1]}>
                            <TextField
                              fullWidth
                              name={arr1[index + 1]}
                              id={arr1[index + 1]}
                              label={arr2[index + 1]}
                              variant="outlined"
                              value={formValues[arr1[index + 1]]}
                              onChange={handleInputChange}
                            />
                          </Grid>
                        </Grid>
                          :
                          <TextField
                            fullWidth
                            name={fieldName}
                            id={fieldName}
                            label={arr2[index]}
                            variant="outlined"
                            value={formValues[fieldName]}
                            onChange={handleInputChange}
                          />
                        }
                      </Grid>
                  ))}
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </PageLayout>

  );
}
