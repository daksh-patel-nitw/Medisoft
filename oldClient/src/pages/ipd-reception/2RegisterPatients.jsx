import React, { useEffect } from 'react';
import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PageLayout from './pageLayout';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { FormControl,InputLabel,Select,TablePagination,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,IconButton,} from '@material-ui/core';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import './2.css';
export default function App()
{
  

  const [patients, setPatients] = useState([]);
const [doctors, setDoctor] = useState([]);
const [rooms, setRoom] = useState([]);

const fetchRooms=async()=>await fetch(`http://localhost:5000/api/rooms`)
.then((res) => res.json())
.then((data) => { console.log(data); 
  setRoom(data)
  })
.catch((err) => console.error(err));
const getData=async()=>{
  fetchRooms()
  await fetch(`http://localhost:5000/api/getpatient`)
          .then((res) => res.json())
          .then((data) => { console.log(data); 
            setPatients(data)
            })
          .catch((err) => console.error(err));

  await fetch(`http://localhost:5000/api/getemployee/doctor`)
          .then((res) => res.json())
          .then((data) => { console.log(data); 
            setDoctor(data)
            })

          .catch((err) => console.error(err));
 

  await fetch(`http://localhost:5000/api/roomcategory`)
          .then((res) => res.json())
          .then((data) => { console.log(data); 
            let tarr=[]
            data.map(e=>{
              tarr.push(e.type)
            });
            console.log(tarr);setCat(tarr);
            })
          .catch((err) => console.error(err));
}
 
useEffect(() => {
  getData();
}, []);

const [cat,setCat]=useState([]);


  const [formValues, setFormValues] = useState({
    pid:'',pname:'',mobile:'',dname:'',dep:'',did:'',room_no:'',type:'',floor:'',occupied:'' });
    
  const pArr=['pid','pname','mobile'];
  const pArr2 = ["Patient Id", "Patient Name", "Mobile"];

  const dArr=['dname','dep','did'];
  const dArr2 =["Doctor name", "Department", "Doctor Id"];

  const rArr=['room_no','type','floor','occupied'];
  const rArr2=["Room No","Room Type","Floor","Select"];

  const handleFormSubmit = async(event) =>
  {
    event.preventDefault();
    alert(JSON.stringify(formValues));
    let dat={};
    await fetch('http://localhost:5000/api/newipdappointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formValues)
    })
      .then(response => response.json())
      .then(async(data) =>
      {
        console.log(data);
        const updated={...data,aid:data._id,room:formValues.room_no}
               await  fetch('http://localhost:5000/api/admitroom', {
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
                      })
                      .catch(error => console.error(error));

        setFormValues({ pid:'',pname:'',mobile:'',dname:'',dep:'',did:'',room_no:'',type:'',floor:'',occupied:'' });
      })
      .catch(error => console.error(error));
      fetchRooms();
    setActiveStep(0);
  };

  const handleInputChange = (event) =>
  {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };
  
  const [patientValue, setPValue] = useState([]);
  const handlePSearch = async (event, newValue) =>
    {
      // console.log(newValue);
      if(newValue){
        const p=await patients.find((p) => p.pid.includes(newValue));
      // console.log(p);
      setFormValues({ ...formValues, pid:p.pid,pname:p.pname,mobile:p.mobile });
      console.log(formValues);
      }
      
    };

  const [newRooms, setR] = useState([]);
  const handleDSearch = async(event, newValue) =>
    {
      if(newValue){
        const d=await doctors.find((d) => d.dname.includes(newValue));
        setFormValues({ ...formValues, dname:d.dname,dep:d.dep,did:d.did });
        console.log(formValues); 
        setR(rooms.filter((m)=>
          m.dep.toLowerCase().includes(d.dep.toLowerCase()))
                 )     ;
      }
      
    };

  function makeUI(autoArr,search,farr,farr2,searchFunction,index,label,title){
    return(
      < >
        
        {(index===1) && <Grid item xs={6}>
         <Autocomplete
              freeSolo
              options={autoArr.map((option) => option[search])}
              onChange={searchFunction}
              renderInput={(params) => (
                  <TextField
                  className='CI'
                      {...params}
                      label={label}
                      margin='normal'
                      variant='outlined'
                  />
              )}
            /><h2>{title} Details</h2>
        </Grid>}
      <Grid container spacing={2}>
        { farr.map((fieldName, index) => (

           (index!==3) && <Grid item xs={(index!=2)?5:10} key={fieldName}>
              <TextField
              className='CI'
                fullWidth
                key={fieldName}
                name={fieldName}
                id={fieldName}
                label={farr2[index]}
                value={formValues[fieldName]}
                required
                disabled
                variant="outlined"
              />
            </Grid>
        ))}
      </Grid>
    </>
    );
  }

    const rowsPerPageOptions = [ 3,5];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

  const selectRoom = async (rVal) => {
    console.log("In select Room");
    console.log(rVal, rooms);
    const r = await rooms.find((p) => p._id === rVal);
    console.log(r);
    setFormValues({ ...formValues, room_no: r.room_no, type: r.type, floor: r.floor, occupied: 'yes' });
  }
  const [filtered,setFiltered]=useState([]);
  const[selectValue,setSel]=useState('');
  function filter(event){
    const t=event.target.value;
    setSel(t);
    setFiltered(newRooms.filter(
      (m) =>(m.type.toLowerCase().includes(t.toLowerCase())
      )));
  }
  // const cat=['de','ge','p'];

  function roomUI(){
    return (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl className='CI' variant="outlined" fullWidth>
            <InputLabel htmlFor="filled-age-native-simple">
              Filter with Room Type
            </InputLabel>
            <Select
              native
              key="cat"
              name="cat"
              label="Filter with Room Type"
              id="cat"
              onChange={filter}
              value={selectValue}
              inputProps={{
                name: "cat",
                id: "filled-age-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              {cat.length > 0 &&
                cat.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TableContainer>
            <Table size="small">
              <TableHead style={{ backgroundColor: "#1F3F49" }}>
                <TableRow>
                  {rArr2.map((x) => (
                    <TableCell>{x}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(filtered.length !== 0 ? filtered : newRooms)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((m) => (
                    <TableRow key={m._id}>
                      <TableCell>{m.room_no}</TableCell>
                      <TableCell>{m.type}</TableCell>
                      <TableCell>{m.floor}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => selectRoom(m._id)}>
                        <AddBoxIcon style={{ borderRadius: 4, padding: 2 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={
                (filtered.length !== 0) === [] ? filtered.length : newRooms.length
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Grid>
      </Grid>
    );
    
  }

  function getSteps() {
    return ['Select Patient & Doctor', 'Select Room'];
  }
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = (event) => {
    if (activeStep === 0) {
      event.preventDefault();
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (<Grid container spacing={2}>
          <Grid item xs={6}>
            {makeUI(patients,'pid',pArr,pArr2,handlePSearch,1,"Search Patient ID","Patient")}
          </Grid>
          <Grid item xs={6}>
            {makeUI(doctors,'dname',dArr,dArr2,handleDSearch,1,"Search Doctor ID","Doctor")}
          </Grid>
          </Grid>)
      case 1:
        return (<Grid container spacing={2}>
          <Grid item xs={6}>
            {roomUI()}
          </Grid>
          <Grid item xs={6}>
            <h2>Room Details</h2>
            {makeUI(rooms,'',rArr,rArr2,'',0)}
          </Grid>
          </Grid>)
      default:
        return 'Unknown stepIndex';
    }
  }

  return (

    <PageLayout>
        <Grid container spacing={2}>
        <form onSubmit={handleFormSubmit} autoComplete="off">
          
             <Card className="partition bg" style={{width:"80%",margin:'auto'}}>
         
             <Stepper className="partition bg" activeStep={activeStep} alternativeLabel>
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper><hr />
                    <CardContent style={{top:'0px'}}>
                          {getStepContent(activeStep)}
                          <Grid item xs={12}>
                            <Grid container spacing={2} direction="row">
                              <Grid item xs={6}>
                                <Button disabled={activeStep === 0} style={{ width: '100%' }}onClick={handleBack}>
                                    Back
                                </Button>
                              </Grid>
                              <Grid item xs={6}>
                                
                                  {activeStep !== 0  ?
                                  <Button variant="contained" type="Submit" color="primary" style={{ width: '100%' }}>Submit</Button> : <Button variant="contained"  color="primary" style={{ width: '100%' }} onClick={handleNext}>Next</Button>}
                                
                              </Grid>
                          </Grid>
                        </Grid>
                      
                  </CardContent>
                </Card>
        
          
          
        </form>
        </Grid>
    </PageLayout>

  );
}
