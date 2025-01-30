import React from 'react';
import { useState,useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PageLayout from './pageLayout';
import { InputLabel,FormControl,FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Chip from '@material-ui/core/Chip';

  //Fetch Departments  
//   useEffect(() => { 
//     if (value === 0) {
//       const dep = async () => {
//         try {
//           const response = await fetch('http://localhost:5000/api/deps');
//           const data = await response.json();
//           // [ { content } ] = data;
//           // console.log(content);
//           setDep(data);
//         } catch (error) {
//           console.log(error);
//         }
//       };
//       dep();
//     }
//   }, [value]);
export default function App()
{
 
  // Category Form Values
  const [patValues, setPatValues] = useState({
    fname:'',middlename:'',lname:'',mobile:'',email:'',dob:'2001-05-24',address:'',city:'',pincode:'',gender:'',allergy:'none',conditions:'none',others:'none', });
  
  const arr1 = ['fname','middlename','lname','dob','gender','mobile','email','address','city','pincode','allergy','conditions','others'];
  const arr2 = ["First Name", "Middle name", "Last Name", "Birth date","Gender", "Mobile","Email", "Address","City ", "Pincode","allergy","conditions","Others"];

  //clear Values
  const clearValues = (valf) => {
    const newValues = {};
    const fval=(valf===1?patValues:empValues);
    Object.entries(fval).forEach(([key, value]) => {
      if (key=='dob') {
        newValues[key] = '2001-01-01';
      } else if(['allergy','conditions','others'].includes(key)){
        newValues[key] = 'none';
      } else{
        newValues[key] = '';
      }
    });
  
    (valf===1)?setPatValues(newValues):setEmp(newValues);
  };

  //Handle Category Form Submit
  const handlePatSubmit = async (event,tracker) =>
  {
    event.preventDefault();
    const formV=(tracker===1?patValues:empValues);
    alert(JSON.stringify(formV));
    const link='http://localhost:5000/api/'+(tracker===1?'newpatient':'newemployee');
    console.log('Link:',link)
    // alert(link);
    await fetch(link, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formV)
    })
      .then(response => response.json())
      .then(data =>
      {
        console.log(data);
       clearValues(tracker);
      })
      .catch(error => console.error(error));
    // await fetchData();
  };

  //Handle Category Form Values
  const handleInputChange = (event) =>
  {
    const { name, value } = event.target;
    setPatValues({ ...patValues, [name]: value });
  };

  //Patient Form UI
  function patCard(){
    return (
      <CardContent >
      <form onSubmit={(event)=>handlePatSubmit(event,1)} autoComplete="off">
      <Grid container spacing={2}>
        {arr1.map((fieldName, index) => (
            index!==4?<Grid item sm={3} key={fieldName}>
              <TextField
                fullWidth
                key={fieldName}
                name={fieldName}
                id={fieldName}
                label={arr2[index]}
                variant="outlined"
                type={index===3? 'date':[5, 9].includes(index) ? 'number':'text'}
                value={patValues[fieldName]}
                onChange={handleInputChange}
                required
                InputLabelProps={index===3&&{
                  shrink: true,
                }}
              />
            </Grid>
            : 
            <Grid item sm={3} key={fieldName}>
              <label>{arr2[index]} </label>
              <RadioGroup  name={fieldName} value={patValues[fieldName]} onChange={handleInputChange}>
                <Grid container>
                  <Grid item><FormControlLabel value="M" control={<Radio required />} label="Male" /></Grid>
                  <Grid item><FormControlLabel value="F" control={<Radio required />} label="Female" /></Grid>
                </Grid>
   
              </RadioGroup>
              </Grid>
        ))
        }
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            color="primary"

          >
            Register Patient
          </Button>
        </Grid>
      </Grid>
      </form>
    </CardContent>
    )
  }


  //Employee Form values
  const [empValues, setEmp] = useState({fname:'',middlename:'',lname:'',mobile:'',email:'',dob:'2001-01-01',address:'',city:'',pincode:'', gender:'',degree:'',college:'',certificate:'',role:'',dep:'', });
  const emp2=["First Name", "Middle name", "Last Name", "Birth date","Gender", "Mobile","Email", "Address","City ", "Pincode","Degree Name","College Name","Certificate","Role","Department"];    
  const emp =['fname','middlename','lname','dob','gender','mobile','email','address','city','pincode','degree','college','certificate','role','dep', ];

  const handleEmpChange = (event) =>
  {
    const { name, value } = event.target;
    setEmp({ ...empValues, [name]: value });
  };
  
  function empCard(){
    return (
      <CardContent >
      <form onSubmit={(event)=>handlePatSubmit(event,0)} autoComplete="off">
      <Grid container spacing={2}>
        {emp.map((fieldName, index) => (
            index!==4?<Grid item sm={3} key={fieldName}>
              <TextField
                fullWidth
                key={fieldName}
                name={fieldName}
                id={fieldName}
                label={emp2[index]}
                variant="outlined"
                type={index===3? 'date':[5, 9].includes(index) ? 'number':'text'}
                value={empValues[fieldName]}
                onChange={handleEmpChange}
                required
                InputLabelProps={index===3&&{
                  shrink: true,
                }}
              />
            </Grid>
            : 
            <Grid item sm={3} key={fieldName}>
              <label>{emp2[index]} </label>
              <RadioGroup  name={fieldName} value={empValues[fieldName]} onChange={handleEmpChange}>
                <Grid container>
                  <Grid item><FormControlLabel value="M" control={<Radio required />} label="Male" /></Grid>
                  <Grid item><FormControlLabel value="F" control={<Radio required />} label="Female" /></Grid>
                </Grid>
   
              </RadioGroup>
              </Grid>
        ))
        }
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            color="primary"

          >
            Register Employee
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

 return (

    <PageLayout>
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Card className="partition" style={{height:500}}>
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
            {(value!==1)?patCard():empCard()}
          </Card>
        </Grid>
        
      </Grid>
    </PageLayout>

  );
}
