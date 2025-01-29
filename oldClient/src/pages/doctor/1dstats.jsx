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
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function App()
{
  const [activePat,setActive]=useState({pid:'',pname:''});
  const [patientData,setPat]=useState([]);
  const fetchData = async (pid) => {
    const response1 = await fetch(`http://localhost:5000/api/getIpdappointment/${pid}`);
    const data1 = await response1.json();
    console.log(data1);
    setPat(data1);
  };

  

  const handle2Search = (newValue,i2) => {
    // console.log("In Handle Search",newValue,index);
    if(newValue){
        const s= (i2===0)?'pid':'pname';
        const t=patientData.find((e)=>e[s]===newValue);
        setActive(t);
    }else{
      setActive({});
    } 
  };

  const autoCompHeader = (label,property,i2) => (
    <Grid item xs={6}>
      <Autocomplete
        freeSolo
        options={patientData && patientData.map((option) => option[property])}
        onChange={(event, newValue) => handle2Search(newValue, i2)}
        value={activePat[property]}
        required
        renderInput={(params) => (
          <TextField
            {...params}
            label={`Search ${label}`}
            margin='normal'
            variant='outlined'
          />
        )}
      />
    </Grid>
  );

  //==========================RCODE=================


  const[M,setM]=useState([]);
  const[T,setT]=useState([]);
      //Medicines data fetch
  const fetchMedicine = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getmedicinedoctor');
      const data = await response.json();
      console.log(data)
      setM(data);
    } catch (error) {
      console.log(error);
    }
  };
  
  //Get Tests
  const fetchTest = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/alltest');
      const data = await response.json();
      console.log(data)
      setT(data);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(()=>{
    
    fetchData('E000000G');
    fetchMedicine();
    fetchTest();

  },[]);
    //Update IPD PAtient
    const updatePatient=async (updatedPatient)=>{
      console.log('Tests',updatedPatient);
      await fetch('http://localhost:5000/api/updateIPDpat', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPatient)
      })
        .then(response => response.json())
        .then(data =>
        {
          console.log(data);
        })
        .catch(error => console.error(error));
    }

    //Medicines Submit
    const handleTSubmit = async (event) =>
    {
      event.preventDefault();
      // alert(JSON.stringify(m));
      console.log(activePat.tests);
     
      const updatedt = { ...t, pid: activePat.pid, did: activePat.did,aid:activePat._id,pname:activePat.pname,date:activePat.schedule_date };
      // alert(JSON.stringify(updatedt))
     
      await fetch('http://localhost:5000/api/newpatienttest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedt)
      })
        .then(response => response.json())
        .then(data =>
        {
          console.log(data);
        })
        .catch(error => console.error(error));
        sett({});
      
        const updatedPat={...activePat,tests:[...activePat.tests,{...t,date:Date.now}]}
        updatePatient(updatedPat);
        setActive(updatedPat);
      setAuto2('');
    
      };
  
    //Medicines Submit
    const handleMSubmit = async (event) =>
    {
      event.preventDefault();
      // alert(JSON.stringify(m));
      console.log(activePat.medicines);
     
      const updatedm = { ...m, pid: activePat.pid, did: activePat.did,aid:activePat._id,pname:activePat.pname,date:activePat.schedule_date };
      // alert(JSON.stringify(updatedm))
      await fetch('http://localhost:5000/api/addnewm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedm)
      })
        .then(response => response.json())
        .then(data =>
        {
          console.log(data);
        })
        .catch(error => console.error(error));
        setm({ps_c:'',ps_u:''});
        const updatedPat={...activePat,medicines:[...activePat.medicines,{...m,date:Date.now}]}
        updatePatient(updatedPat);
      setActive(updatedPat);
      setAuto('');
      };
  
    //medicine form Track Values
    const handleRChange = (event) =>
    {
      const { name, value } = event.target;
      console.log(name,value);
      setm({ ...m,[name]: value});
    };
  
    const [m,setm]=useState({ps_c:'',ps_u:''});
    const [t,sett]=useState({});
    const handleSearch = (newValue,  property,index) => {
      if (newValue) {
        if(index===1){
          const up= M.find((m) =>m[property].toLowerCase().includes(newValue.toLowerCase()));
          setm( { ...m,...up});
          setAuto(newValue);
        }else{
          sett( T.find((m) =>m[property].toLowerCase().includes(newValue.toLowerCase())));
          setAuto2(newValue);
        }
      }
    } ;
  
    const [autoComp1,setAuto] = useState('');
    const [autoComp2,setAuto2] = useState('');
    const autoComp = (property, label,index) => (
      
          <Autocomplete
            freeSolo
            options={(index===1?M:T).map((option) => option[property])}
            required
            value={(index===1)?autoComp1:autoComp2}
            onChange={(event, newValue) => handleSearch(newValue, property,index)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={`Search ${label}`}
                margin='normal'
                variant='outlined'
              />
            )}
          />
      );
  
    //Test Form UI
    function TestC(){
      return (
        
        <Grid container alignItems="center" spacing={1}>
          
            <Grid item xs={10}>
                {autoComp('name','Test',0)}
            </Grid>
            <Grid item xs={2}>
              <Button style={{margin:"auto"}}onClick={handleTSubmit} variant="contained" color="primary">
                Add
              </Button>
            </Grid>
            <Grid item xs={12}>
            {activePat.tests && activePat.tests.map(item=>(
            <><span style={{padding:4,borderRadius:2,backgroundColor:"rgb(255, 137, 192)",fontWeight:"bold"}}>{item.name}</span> </>))}
            </Grid>
      
        </Grid>
     
      )
    }
  
    //Medicine Form UI
    function medicineC(){
      return (
    
        <form onSubmit={handleMSubmit} autoComplete="off">
          <Grid container alignItems="center" spacing={1}>
              <Grid item sm={4}>
                {autoComp('name','Medicine',1)}
              </Grid>
          
              <Grid item xs={4} >
                <TextField
                  fullWidth
                  key='ps_c'
                  name='ps_c'
                  id='ps_c'
                  label="Enter Units"
                  value={m.ps_c}
                  onChange={handleRChange}
                  variant="outlined"
                  type="number"
                  required
                />
              </Grid>
              <Grid item xs={4} >
                <TextField
                  fullWidth
                  key='ps_u'
                  name='ps_u'
                  id='ps_u'
                  label={"Package units "+ (m.ps && m.ps)}
                  value={m.ps_u}
                  onChange={handleRChange}
                  variant="outlined"
                  type="number"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <h3>{m.t}</h3>
              </Grid>
  
            <Grid item xs={6}>
              <Button type="submit" variant="contained" color="primary">
                Add
              </Button>
            </Grid>
  
            <Grid item xs={12}>
              <table style={{borderCollapse: 'collapse',border:'1px solid black'}}>
                <tr>
                { ['Name','Unit','Package Quantity','Free Quantity'].map((a)=>(
                    <th style={{borderCollapse: 'collapse',border:'1px solid black'}}>{a}</th>
                  ))}
                </tr>
                <tbody>
                {activePat.medicines && activePat.medicines.map(item=>(
                <tr>
                  <td style={{borderCollapse: 'collapse',padding:1,border:'1px solid black'}} >{item.name}</td>
                  <td style={{borderCollapse: 'collapse',padding:1,border:'1px solid black',padding:2}} >{item.t}</td>
                  <td style={{borderCollapse: 'collapse',padding:1,border:'1px solid black'}} >{item.ps_u}</td>
                  <td style={{borderCollapse: 'collapse',padding:1,border:'1px solid black'}} >{item.ps_c}</td>
                </tr>
                ))}</tbody>
              </table>
            </Grid>
          </Grid>
        </form>
  )
    }
  
  return (

    <PageLayout>
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Card className="partition">
            <CardContent>
            <Grid container spacing={2}>
            {autoCompHeader("Patient Id",'pid',0)} 
            {autoCompHeader('Patient Name','pname',1)}
            </Grid>
            </CardContent>
          </Card>
       </Grid>
       
       <Grid item container xs={6}>
          <Card className="partition">
          <Grid item xs={12}><div style={{padding:8,fontWeight:'Bold',fontSize:'16px'}}>Medicines:</div> <hr style={{ margin: 0 }} /></Grid>
            <CardContent style={{paddingTop:'9px'}}>
              <Grid  item container justify="center" xs={12}>{medicineC()}</Grid></CardContent>
              </Card></Grid>
        
        <Grid item container xs={6}>
          <Card className="partition" style={{width:'100%'}}>
            <Grid item xs={12}><div style={{padding:8,fontWeight:'Bold',fontSize:'16px'}}>Lab Tests:</div> <hr style={{ margin: 0 }} /></Grid>
            <CardContent style={{paddingTop:'9px'}}>
              <Grid  container justify="center" xs={12}>{TestC()}</Grid>
            </CardContent>
          </Card>  
        </Grid>
        
      </Grid>
    </PageLayout>

  );
}
