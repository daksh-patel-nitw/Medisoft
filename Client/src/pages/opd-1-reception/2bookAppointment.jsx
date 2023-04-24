import './2.css';
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
import Calendar from 'react-calendar';

// Appointment Form Values
 const arr1=['pid','pname','mobile','did','dname','dep','schedule_date','time','qs','count'];
 const arr2=['Patient ID',"Patient Name","Mobile",'DepartMent',"Doctor Name",];
 const initialValues = arr1.reduce(
  (obj, key) => ({ ...obj, [key]: key!=='schedule_date'? '':'Select Date' }),
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
  const [patients,setPat]=useState([]);
  const [doctors,setDoc]=useState([]);
  const [formV, setForm] = useState(initialValues);
  const[T,setT]=useState([]);

  useEffect(()=>{
    const fetchData = async () => {
      const response1 = await fetch("http://localhost:5000/api/getemployee/doctor");
      const data1 = await response1.json();
      console.log(data1);
      setDoc(data1);
  
      const response2 = await fetch("http://localhost:5000/api/getpatient");
      const data2 = await response2.json();
      console.log(data2);
      setPat(data2);
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
     if(key==='schedule_date'){
        newValues[key] = 'Select Date';
      }else{
        newValues[key] = '';
      }
    });
    setT([]);
    setC({});
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

const isBeforeToday = (date) => {
  const today = new Date(Date.now() - 86400000);;
  return date < today;
};

const handleDateClick =async (date) => {
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
      console.log("Count:==",data["10-11"]);
      const result = {};

      for (const elem of T) {
        if (data.hasOwnProperty(elem)) {
          result[elem] = data[elem];
        } else {
          result[elem] = 6;
        }
      }
      console.log(result,count,);
      setC(result);
      // process data
    } else {
     
     const newCount = (T.length) ? Object.assign({}, ...T.map(e => ({[e]: 6}))):{};
      console.log("Count:-----",count,"NewCount ",newCount);
      
      setC(newCount);
    }
  }
};

const events = [
  // { title: 'Event 1', date: new Date(2023, 3, 22) },
  // { title: 'Event 2', date: new Date(2023, 3, 23) },
  // { title: 'Event 3', date: new Date(2023, 3, 24) },
];
//======================
  const cUI=()=>{
    return(
      <Grid container spacing={2} >
       
      <Grid item sm={8}>
          <Calendar
            className="my-calendar"
            style={{ height: '500px', width: '800px', backgroundColor: 'blue' }} 
            onClickDay={handleDateClick}
            value={selectedDate}
            tileDisabled={({ date }) => isBeforeToday(date)}
            tileClassName={({ date }) => (isBeforeToday(date) ? 'disabled-date' : '')}
            // tileContent={({ date }) => {
            //   const event = events.find((e) => e.date.getTime() === date.getTime());
            //   return event && <><br/><span className='kk'>{event.title}</span></>;
            // }}
          />
      </Grid>
      <Grid item sm={4}>
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
      <Button variant="outlined" color="primary" type='submit'>Book Appointment</Button>
  </Grid>
    )
  }
  
  const handleSearch = (newValue, index,i2) => {
    // console.log("In Handle Search",newValue,index);
    if(newValue){
      if(index===1){
        const s= (i2===1)?'pid':'pname';
        const t=patients.find((e)=>e[s]===newValue);
        setForm({...formV,pid:t.pid,mobile:t.mobile,pname:t.pname})
      }else{
        const s= (i2===1)?'dep':'dname';
        const t=doctors.find((e)=>e[s]===newValue);
        console.log(t.qs);
        setForm({...formV,did:t.did,dname:t.dname,dep:t.dep,qs:t.qs});
        // console.log(t.timings);
        setT(t.timings);
      }
    }    
  };

  const autoComp = (arrS,property, label,index,i2) => (
    <Grid item xs={6}>
      <Autocomplete
        freeSolo
        options={arrS.map((option) => option[property])}
        onChange={(event, newValue) => handleSearch(newValue, index,i2)}
        value={formV[property]}
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

  const partO=()=>{
    return(
      <Grid container spacing={2} > 
      <Grid item xs={6}>
        <Grid container spacing={2}>
          
          {autoComp(patients,'pid',"Patient ID",1,1)}
          {autoComp(patients,'pname',"Patient Name",1,0)}
          
          </Grid>
         </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2}>
          {autoComp(doctors,'dep',"Doctor Department",0,1)}
          {autoComp(doctors,'dname',"Doctor Name",0,0)}
      
          
          </Grid>
          </Grid>
      </Grid>
    );
  }
  

 return (

    <PageLayout>
     
      <form onSubmit={handleFormSubmit}>
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Card className="partition" >
            <CardContent>
                {cUI()}
                </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12}>
          <Card className="partition" >
          <CardContent>
          {partO()}
          </CardContent>
          </Card>
        </Grid>
        </Grid>
        </form>
     
    </PageLayout>

  );
}
