import React from 'react';
import { useState,useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PageLayout from './pageLayout';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteIcon from '@material-ui/icons/Delete';

export default function App()
{

    const[e,setT]=useState({});

  //Medicines data fetch
  const fetchTimings = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/getempwithid/${id}`);
      const data = await response.json();
      console.log(data)
      setT(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTimings('E000000C');
  }, []);

  const arr1=["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];

  const updateTimings=async(updated)=>{
    console.log(updated);
    await fetch('http://localhost:5000/api/addtimings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updated)
      })
      .then(response => response.json())
      .then(data =>
      {
        console.log(data.timings);
      })
      .catch(error => console.error(error));
}

  const handleClick = () =>
  {
      if(autoComp2){
        const updated={...e,timings:[...e.timings,`${autoComp2}-${Number(autoComp2)+1}`]}
    setT(updated);
    // const send={...e,timings:`${autoComp2}-${Number(autoComp2)+1}`};
      
      updateTimings(updated);
    //   
      }else{
          alert("Select Date before adding.");
      }
      
  };

  const updatePatients=()=>{
    console.log(e.pph);
    updateTimings(e);
  }

  const handledelete=(dl)=>{
      const updated={...e,timings:e.timings.filter(t=>t!==dl)}
      alert(JSON.stringify(updated));
      updateTimings(updated);
      setT(updated);
      console.log(e)     
  }
  const handleSearch=(event,newValue)=>{
      setAuto2(newValue);
      setl((Number(newValue)+1)%24);
  }

  const handleChng=(event)=>{
    setT({...e,pph:event.target.value})
  }

  const[l,setl]=useState('');
  const [autoComp2,setAuto2] = useState('');
  const autoComp = () => (
    
    <Autocomplete
      options={arr1.map((option) => option)}
      required
      value={autoComp2}
      onChange={handleSearch}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Select'
          margin='normal'
          variant='outlined'
        />
      )}
    />
);

  return (

      <PageLayout>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Card className="partition" >
                <CardContent>
                  <h2>Timings</h2>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Grid container   justifyContent="flex-start"
  alignItems="center" spacing={2}>
                        <Grid item xs={2}><h3>From</h3></Grid>
                        <Grid item xs={4}>{autoComp()}</Grid>
                        <Grid item xs={2}><h3>to {l}</h3></Grid>
                        <Grid item xs={2}>
                            <Button
                            onClick={handleClick}
                              variant="contained"
                              color="primary"
                            >
                              Add
                           </Button>
                        </Grid>
                      </Grid>
                    </Grid>

                    {e.timings && e.timings.map(t => (
                        <React.Fragment key={t}>
                          <Grid item xs={4}>{t}</Grid>
                          <Grid item xs={8}>
                            <DeleteIcon onClick={() => handledelete(t)}/>
                          </Grid>
                        </React.Fragment>
                      ))}


                    
                  </Grid>
                    
                  
                </CardContent>
              </Card>
            </Grid>
          
            <Grid item xs={6}>

            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                    <h3>Patients per Hour</h3>
                    <TextField
                    label='PPH'
                    defaultValue={e.pph}
                    value={e.pph}
                    onChange={handleChng}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  /><br/><br/>
                  <Button
                    onClick={updatePatients}
                      variant="contained"
                      color="primary"
                    >
                        Update
                    </Button>
                </CardContent>
              </Card>
              
            </Grid>
          </Grid>
      </PageLayout>
 
  );
}
