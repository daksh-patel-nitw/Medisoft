import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import PageLayout from './pageLayout';
import SideBar from '../../components/sidebar';
import CTextField from '../../components/CTextField';
import pharmacyServices from './services/pharmacyServices';

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
    alert(JSON.stringify(formValues));
    pharmacyServices.addNewMedicine(formValues)
      .then(response => {
        console.log(response.data);
        setFormValues({ name: '', q: '', t: '', ps: '', ps_u: '', price: '' });
      })
      .catch(error => console.error(error));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const arr = [
    { label: 'New Medicine', path: '/', icon: 'AddBox' },
    { label: 'Medicine List', path: '/medicine', icon: 'TableChart' },
    { label: 'Patients', path: '/medpatients', icon: 'AccountBox' },
  ];
  return (
    <>
    <SideBar arr={arr} >
    

    
      <form onSubmit={handleSubmit} autoComplete="off">
        <Card className="component_img">
          <CardContent>
            <h2>Add New Medicine</h2>
            <Grid container direction="column" spacing={2}>
              {arr1.map((fieldName, index) => (
                (index === 2 || index === 4) ? null :
                  <Grid key={fieldName}>
                    {(index === 1 || index === 3) ? (
                      <Grid container spacing={2}>
                        <Grid xs={6} key={fieldName}>
                          <CTextField
                            name={fieldName}
                            label={arr2[index]}
                            value={formValues[fieldName]}
                            onChange={handleInputChange}
                          />
                        </Grid>
                        <Grid xs={6} key={arr1[index + 1]}>
                          <CTextField
                            name={arr1[index + 1]}
                            label={arr2[index + 1]}
                            value={formValues[arr1[index + 1]]}
                            onChange={handleInputChange}
                          />
                        </Grid>
                      </Grid>
                    ) : (
                      <CTextField
                        name={fieldName}
                        label={arr2[index]}
                        value={formValues[fieldName]}
                        onChange={handleInputChange}
                      />
                    )}
                  </Grid>
              ))}
              <Grid>
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
      </form>
      </SideBar>
    </>
  );
}