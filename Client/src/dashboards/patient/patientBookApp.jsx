
import React from 'react';
import { useState,useEffect } from 'react';
import Grid from '@mui/material//Grid2;
import Card from '@mui/material//Card';
import CardContent from '@mui/material//CardContent';
import TextField from '@mui/material//TextField';
import Button from '@mui/material//Button';
import PageLayout from './pageLayout';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material/';
import Autocomplete from '@mui/material/lab/Autocomplete';
import Calendar from 'react-calendar';

// Appointment Form Values
 const arr1=['pid','pname','mobile','did','dname','dep','schedule_date','time','qs','count','pph'];
 const arr2=['Patient ID',"Patient Name","Mobile",'DepartMent',"Doctor Name",];
 const initialValues = arr1.reduce(
  (obj, key) => ({ ...obj, [key]: ''}),
  {}
);

function showLabel(num){
  if(Number(num)>=12){
    return (Number(num)!==12?Number(num)%12:12)+' p.m.'
}else{
  return num+'a.m.'
}
}

export default function App()
{
 
  const[count,setC]=useState({});
  const [doctors,setDoc]=useState([]);
  const [formV, setForm] = useState(initialValues);
  const[T,setT]=useState([]);

  useEffect(()=>{
    const fetchData = async () => {
      const response1 = await fetch("http://localhost:5000/api/getemployee/doctor");
      const data1 = await response1.json();
      console.log(data1);
      setDoc(data1);
  
      const response2 = await fetch("http://localhost:5000/api/patient/P0000004");
      const data2 = await response2.json();
      console.log(data2);
      setForm({...formV,pid:data2.pid,pname:data2.fname+" "+data2.lname,mobile:data2.mobile});
    };
  
    fetchData();
  },[]);
  //Handle form values
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
      count: name === "time" ? count[value] : prevForm.count
    }));    
    console.log( formV)
  };
  

  //clear Values
  const clearValues = () => {
    const newValues = {};
    Object.entries(formV).forEach(([key, value]) => {
     if(['pid','pname','mobile'].includes(key)){
        newValues[key] = value;
      }else{
        newValues[key] = '';
      }
    });
    setT([]);
    setC({});
    setSelectedDate(null);
    setForm(newValues);
  };

  //Handle Form Submit
  const handleFormSubmit = async (event,tracker) =>
  {
    event.preventDefault();
    if(formV['time']){
      alert(JSON.stringify(formV));
    const link='http://localhost:5000/api/newappointment';
    
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
       clearValues();
      })
      .catch(error => console.error(error));
    }else{
      alert("Select Date");
    }
    
    
  };

  //=========================Calender===========

const [selectedDate, setSelectedDate] = useState(null);
const currentDate = new Date().toISOString().split('T')[0];
const isBeforeToday = (date) => {
  const today = new Date(Date.now() - 86400000);
  return date < today;
};

const handleDateClick =async (event) => {
  const date=event.target.value;
  console.log("Date",date);
  if (!isBeforeToday(date)) {
    setSelectedDate(date);
    const d=(new Date(date));
    setForm({...formV,schedule_date:d.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric'  })})
    // alert(d.getMonth()+" "+d.getFullYear()+d.getDate());
    console.log(formV);
    console.log(`http://localhost:5000/api/getdtimings/${d.getTime()}/${formV.did}`);
    const res= await fetch(`http://localhost:5000/api/getdtimings/${d.getTime()}/${formV.did}`);
    if (res.ok) {
      const data = await res.json();
      
      const result = {};

      for (const elem of T) {
        if (data.hasOwnProperty(elem)) {
          result[elem] = data[elem];
        } else {
          result[elem] = formV.pph;
        }
      }
      console.log(result,count,);
      setC(result);
      // process data
    } else {
     
     const newCount = (T.length) ? Object.assign({}, ...T.map(e => ({[e]: formV.pph}))):{};
      console.log("Count:-----",count,"NewCount ",newCount);
      
      setC(newCount);
    }
  }
};


//======================
const dateUI=()=>(
  <Grid item>
    <TextField
      fullWidth
      onChange={handleDateClick}
      label={'Select Date'}
      variant='outlined'
      type='date'
      inputProps={{ min: currentDate }}
      InputLabelProps={{
        shrink: true,
      }}
    />
  </Grid>
)
  const timeUI=()=>{
    return(
        <>
        <Grid item >
            <Grid> <h2>Date: {(new Date(formV.schedule_date)).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric'  })} <br/><br/> Select Timings:</h2></Grid>
            <RadioGroup required name='time' value={formV.time} onChange={handleInputChange}>
                {  T.length ? Object.keys(count).length ? T.map(str => {
                  // console.log("rdio",str,count[str]);
                          const [start, end] = str.split('-');
                          const labelText = `${showLabel(start)} - ${showLabel(end)} Available Slots: ${count[str]}`;
                          return (
                            <FormControlLabel
                              key={str}
                              value={str}
                              control={<Radio required />}
                              label={labelText}
                              disabled={count[str]?false:true}
                            />
                          );
                        }):'Please select Date':'Select date to see timings'}
            </RadioGroup>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" type='submit'>Book Appointment</Button>
          </Grid>
          </>
    
    )
  }
  
  const handleSearch = (newValue,i2) => {
    // console.log("In Handle Search",newValue,index);
    if(newValue){
     
        const s= (i2===1)?'dep':'dname';
        const t=doctors.find((e)=>e[s]===newValue);
        console.log("Doctor",t.dname,t.dep);
        setForm({...formV,did:t.did,dname:t.dname,dep:t.dep,qs:t.qs,pph:t.pph});
        // console.log(t.timings);
        setT(t.timings);
  
    }    
  };

  const autoComp = (arrS,property, label,i2) => (
      <Autocomplete
        freeSolo
        options={arrS.map((option) => option[property])}
        onChange={(event, newValue) => handleSearch(newValue,i2)}
        value={formV[property]}
        required
        renderInput={(params) => (
          <TextField
            {...params}
            label={`Search ${label}`}
            margin='normal'
            variant='outlined'
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}
        
      />
  );

  const partO=()=>{
    return(
      <Grid container spacing={2} > 
        <Grid size={{xs:6}>
            {autoComp(doctors,'dname',"Doctor",0)}
          </Grid>
        <Grid size={{xs:6}>
            {autoComp(doctors,'dep',"Type",1)}
        </Grid>
      </Grid>
    );
  }
  

 return (

    <SideBar>
     
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={2} >
        
          <Grid item  xs={12}>
            <Card className="partition" >
              <CardContent>
                {partO()}
              </CardContent>
            </Card>
          </Grid>
      
        {formV.did && 
          <Grid size={{xs:12}>
            <Card className="partition" >
              <CardContent>
                  {dateUI()}
              </CardContent>
            </Card>
          </Grid>
          } 

        { selectedDate &&  
          <Grid size={{xs:12}>
            <Card className="partition" >
              <CardContent>
                  {timeUI()}
              </CardContent>
            </Card>
          </Grid>
          } 
        </Grid>
      </form>
     
    </SideBar>

  );
}
