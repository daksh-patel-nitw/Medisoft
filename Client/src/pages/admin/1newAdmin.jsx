import React from 'react';
import { useState,useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PageLayout from './pageLayout';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function App()
{
  const [emp,setEmp]=useState([]);
  const panel=['opd1','opd2','pharmacy','lab','doctor','ipd','bill','admin','']  

  //fetch all employees
  const fetchEmps = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admingetemp');
      const data = await response.json();
      console.log(data)
      setEmp(data);
    } catch (error) {
      console.log(error);
    }
  };

  //Initialization
  useEffect(() => {
    fetchEmps();
  }, []);

  // Category Form Values
  const [empValues, setEmpValues] = useState({eid:'',name:'',type:'',dep:''});
  
  //Handle Category Form Submit
  const handleEmpSubmit = async (event) =>
  {
    event.preventDefault();
    alert(JSON.stringify(empValues));
    await fetch('http://localhost:5000/api/addlogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(empValues)
    })
      .then(response => response.json())
      .then(data =>
      {
        console.log(data);
        setEmpValues({eid:'',name:'',type:'',dep:''});
      })
      .catch(error => console.error(error));
  };


  const handleSearch = (newValue,name) =>
    {
        if (newValue) {
          if(name){
            const t=emp.find((e)=>e[name]===newValue);
            setEmpValues({...empValues,eid:t.eid,name:t.name,dep:t.dep});
          }else{
            setEmpValues({...empValues,type:newValue})
          }           
        }
        else {
          setEmpValues({eid:'',name:'',type:'',dep:''});
        }
    };
    const autocomp = (name, label) => (
      <Autocomplete
        options={name ? emp && emp.map((option) => option[name]) : panel}
        onChange={(event, newValue) => handleSearch(newValue, name)}
        value={name ? empValues[name] : empValues["type"]}
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
    
  //Category Form UI
  function EmpCard(){
    return (
      <CardContent >
      <form onSubmit={handleEmpSubmit} autoComplete="off">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          {autocomp('eid','Search Employee Id')}
          </Grid>
        <Grid item xs={4}>
          {autocomp('name','Search Employee')}
          </Grid>
        <Grid item xs={4}>
          {autocomp(0,'Select Panel')}
          </Grid>
        <Grid item xs={4}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Give Access
          </Button>
        </Grid>
      </Grid>
      </form>
    </CardContent>
    )
  }

  return (

    <PageLayout>
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Card className="partition" style={{height:500}}>
            
            {EmpCard()}
          </Card>
        </Grid>
       
      </Grid>
    </PageLayout>

  );
}
