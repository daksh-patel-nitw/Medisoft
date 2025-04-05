import React from 'react';
import {SideBar} from "../../components/sidebar.jsx";
import { useEffect, useState} from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material/';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { sidebar_utils, patientForm, patLabels, empForm, empLabels } from './utils.js';

import { usePatientForm, useEmployeeForm, handleFormSubmit } from "./formHandlers";
import Autocomplete from '@mui/material/Autocomplete';
export default function App() {

  const { patValues, setPatValues, handlePatChange } = usePatientForm();
  const { empValues, setEmp, handleEmpChange } = useEmployeeForm();
  const [rolesDeps, setRolesDeps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [patError, setPatError] = useState(false);

  // Patient and Employee Form UI
  function formCard(components, labels, handleInputChange, formValues, handleSubmit, tracker) {
    return (
      <CardContent >
        <form onSubmit={(event) => handleSubmit(event, tracker, formValues, setPatValues, setEmp)} autoComplete="off">
          <Grid container spacing={2}>
            {components.map((fieldName, index) => (
              index !== 4 ? <Grid size={{sm:4}} key={fieldName}>
                <TextField
                  fullWidth
                  key={fieldName}
                  name={fieldName}
                  id={fieldName}
                  label={labels[index]}
                  variant="outlined"
                  type={index === 3 ? 'date' : [5, 9].includes(index) ? 'number' : 'text'}
                  value={formValues[fieldName]}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
                :
                <Grid size={{sm:4}} key={fieldName}>
                  <label>{labels[index]} </label>
                  <RadioGroup name={fieldName} value={formValues[fieldName]} onChange={handleInputChange}>
                    <Grid container>
                      <Grid><FormControlLabel value="M" control={<Radio required />} label="Male" /></Grid>
                      <Grid><FormControlLabel value="F" control={<Radio required />} label="Female" /></Grid>
                    </Grid>

                  </RadioGroup>
                </Grid>
            ))
            }
            <Grid size={{sm:12}}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Register {tracker === 1 ? "Patient" : "Employee"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    )
  }

  //Check Tabs 
  const [value, setValue] = useState(0);

  //Track tabs value
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

   const autocomp = (index, label, name,value) => (
      <Autocomplete
        options={rolesDeps[index]}
        onChange={(event, newValue) => handleSearch(newValue, name, index)}
        value={value}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            margin="normal"
            variant="outlined"
          />
        )}
      />
    );

  return (

    <SideBar arr={sidebar_utils}>
      <Grid container justifyContent="center" spacing={2} >
        

          <Card className="partition" style={{ width:'85%', height: 600 }}>
            <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange}
              aria-label="disabled tabs example"
            >
              <Tab label="Register Patient" />
              <Tab label="Register Employee" />
            </Tabs>
            {value !== 1
              ? formCard(patientForm, patLabels, handlePatChange, patValues, handleFormSubmit, 1)
              : formCard(empForm, empLabels, handleEmpChange, empValues, handleFormSubmit, 2)}

          </Card>
        

      </Grid>
    </SideBar>

  );
}
