import React from 'react';
import { useState,useEffect,useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PageLayout from './pageLayout';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

export default function App()
{
  const doctorId =async()=> {return (await localStorage.getItem('id'))  }
  const [check,setC]=useState(0);
    const[Ap,setAp]=useState([]);
    const[p,setP]=useState({});
    const[A,setA]=useState({});
    const[M,setM]=useState([]);
    const[T,setT]=useState([]);
  //Categories data fetch
  const fetchData = async (did) => {
    try {
      const response = await fetch(`http://localhost:5000/api/getappointment/${did}`);
      const data = await response.json();
      console.log(data);
      setAp(data);
      fetchpData(data.pid);
      fetchAData(data.pid,did);
    } catch (error) {
      setErr(1);
      console.log(error);
    }
  };
  const fetchpData = async (pid) => {
    try {
      const response = await fetch(`http://localhost:5000/api/getpatientdoctor/${pid}`);
      const data = await response.json();
      console.log(data);
      setP(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAData = async (pid,eid) => {
    try {
      const response = await fetch(`http://localhost:5000/api/viewpatientapp/${pid}/${eid}`);
      const data = await response.json();
      console.log(data);
      setA(data);
    } catch (error) {
      console.log(error);
    }
  };

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

  //Initialization
  useEffect(() => {
    fetchMedicine();
    fetchTest();
    //doctorId
    fetchData('E000000C');
  }, []);

 
  //Medicines Submit
  const handleTSubmit = async (event) =>
  {
    event.preventDefault();
    // alert(JSON.stringify(m));
    console.log(Ap.tests);
   
    const updatedt = { ...t, pid: Ap.pid, did: Ap.did,aid:Ap._id,pname:Ap.pname,date:Ap.schedule_date };
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
  
    setAp(prevAp => ({ ...prevAp, tests: [...prevAp.tests, t] }));
    setAuto2('');
    };

  //Medicines Submit
  const handleMSubmit = async (event) =>
  {
    event.preventDefault();
    // alert(JSON.stringify(m));
    console.log(Ap.medicines);
   
    const updatedm = { ...m, pid: Ap.pid, did: Ap.did,aid:Ap._id,pname:Ap.pname,date:Ap.schedule_date };
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
  
    setAp(prevAp => ({ ...prevAp, medicines: [...prevAp.medicines, m] }));
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
      
      <Grid item xs alignItems="center" container spacing={1}>
        
          <Grid item xs={10}>
              {autoComp('name','Test',0)}
          </Grid>
          <Grid item xs={2}>
            <Button style={{margin:"auto"}}onClick={handleTSubmit} variant="contained" color="primary">
              Add
            </Button>
          </Grid>
          <Grid item xs={12}>
          {Ap.tests && Ap.tests.map(item=>(
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
              {Ap.medicines && Ap.medicines.map(item=>(
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
  const [checkErr,setErr]=useState(0);
  const handleSubmit=async()=>{
    const updated={...Ap,notes:notes}
    console.log(updated);
    try{
    await fetch('http://localhost:5000/api/diagnoseopd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updated)
    })
      .then(response => response.json())
      .then(data =>
      {
        console.log(data);
        // doctorId
        fetchData('E000000C');
      })
      .catch(error => console.error(error));}
      catch{
          setErr(1);
      }
      setNotes('');
  }

  const handleN=(event)=>{
    setNotes(event.target.value);
  };

  const[notes,setNotes]=useState('');

  return (

    <PageLayout>
      
     { checkErr?<h1>No More Patients</h1>:<Grid container spacing={2} >

      <Grid item xs={3}> 
          <Card className="partition" >
            <CardContent>
                
                  <div><h2>{Ap.pname }</h2></div>
                  <div style={{fontSize:'16px'}}><b>Height:</b>{Ap.height}cm</div>
                  <div style={{fontSize:'16px'}}><b>Weight:</b>{Ap.weight}Kg</div>
                  <div style={{fontSize:'16px'}}><b>Allergy:</b> {p.allergy}</div>
                  <div style={{fontSize:'16px'}}><b>Medical Conditions:</b> {p.conditions}</div>
                  <div style={{fontSize:'16px'}}><b>Others:</b> {p.others}</div>
                  <div style={{fontSize:'16px'}}><b>Doctor questions:</b>
                {Ap.doctor_qs&& Ap.doctor_qs[1].map((item,index) => (
                  item===1 && <><span style={{padding:4,borderRadius:2,backgroundColor:"rgb(255, 137, 192)",fontWeight:"bold"}}>{Ap.doctor_qs[0][index]}</span> </>
                ))}</div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item container xs={5}>
          <Card className="partition" style={{height:500}}>
          <Grid item xs={12}><div style={{padding:8,fontWeight:'Bold',fontSize:'16px'}}>Medicines:</div> <hr style={{ margin: 0 }} /></Grid>
            <CardContent style={{paddingTop:'9px'}}>
              <Grid  item container justify="center" xs={12}>{medicineC()}</Grid></CardContent>
            <Grid item xs={12}><div style={{padding:8,fontWeight:'Bold',fontSize:'16px'}}>Lab Tests:</div> <hr style={{ margin: 0 }} /></Grid>
            <CardContent style={{paddingTop:'9px'}}><Grid  container justify="center" xs={12}>{TestC()}</Grid>
              </CardContent>
          </Card>  
        </Grid>
        
        
        
        <Grid item xs={4}>
          <Card className="partition" >
            <CardContent>
              <TextareaAutosize
                  minRows={5}
                  maxRows={6}
                  placeholder="Enter Notes"
                  value={notes}
                  onChange={handleN}
                  
                />

                {
                  A.length&& A.map(e=>(
                    <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <p>{(new Date(e.admitted_date)).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric'  })} <br/>{e.notes}</p>
        </AccordionSummary>
        <AccordionDetails>
        <div>
        <p>Medicines:</p>
        { e.medicines.map(m=>(
                      <div style={{margin:4,padding:4,borderRadius:2,backgroundColor:"rgb(255, 137, 192)",fontWeight:"bold"}}>{m.name} {m.type} </div>
                    ))}<br/><p>Tests:</p>
                      {
                        e.tests.map(t=>(
                          <div style={{margin:4,padding:4,borderRadius:2,backgroundColor:"rgb(255, 137, 192)",fontWeight:"bold"}}>{t.name}</div>
                        ))
                      }</div>
        </AccordionDetails>
      </Accordion>
                    
                  ))
                }
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Button style={{width:'500px'}} variant="contained" size="medium" color="secondary" onClick={handleSubmit}> Next </Button>
        </Grid>
      </Grid>}
    </PageLayout>

  );
  }