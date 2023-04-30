import React, { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';



export default function QueueScreen() {
  const { dep } = useParams();
  const [dataStore,setData]=useState([]);
  const [doc,setD]=useState([]);
  const [part,setPart]=useState(12);
  useEffect(() =>
  {
      getDoc(dep,setD);
  }, []);

  const getDoc=async(dep,setD)=>{
 
    await fetch(`http://localhost:5000/api/allDoctors/${dep}`)
            .then((res) => res.json())
            .then((data) => { console.log(data); 
              
              data.map((e)=>{
                getAppointments(e.eid);
              });
              setPart(12/data.length);
              setD(data);
              })
            .catch((err) => console.error(err));
  }

  function getAppointments(id) {
    // Make a GET request to the server to fetch appointments
    fetch(`http://localhost:5000/api/queuescreen/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log(id,data)
        setData(prevState => ({
          ...prevState,
          [id]: data
        }));
        setTimeout(()=>getAppointments(id), 10000);
      })
      .catch(error => {
        // Handle error
        console.error(error);
  
        // Call the function again after 10 seconds in case of error
        setTimeout(()=>getAppointments(id), 5000);
      });
  }

  return (
    
      <Box style={{ backgroundImage:'url("https://www.transparenttextures.com/patterns/mirrored-squares.png")',
      backgroundColor:'rgb(247, 245, 181)',flexGrow: 1,fontSize:'24px',backgroundColor:'',height: '100vh'}}>
      <marquee style={{backgroundColor:'#673AB7',color:'white'}}><h2>Department: {dep} &emsp; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Medisoft HMS System </h2></marquee>
      <Grid container spacing={2} style={{ height: '100%' }}>
    {doc.map((e,index)=>
  {
    return (
      <Grid item xs={part} key={e.eid}>
        <div><h2>Dr. {e.name}</h2></div>
        {dataStore[e.eid] && dataStore[e.eid].map((val)=>(
          <div style={{margin:2,padding:8,borderRadius:5,backgroundColor: val.status==='progress' ? '#00FFCA' : '#393646',color:'white' }}>{val.pname} ({val.pid})</div>
        ))}
      </Grid>
    )
  })
}

      </Grid>
    </Box>
  );
}

 