import React from 'react';
import { useState,useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material//Card';
import CardContent from '@mui/material//CardContent';
import TextField from '@mui/material//TextField';
import Button from '@mui/material//Button';

export default function App()
{
  const [rolesDeps,setData]=useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //fetch all employees
  const fetchData = async () => {
    try {
      const response = await fetch('http:///getRolesDeps');
      const data = await response.json();
      console.log(data)
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  //Initialization
  useEffect(() => {
    fetchData();
  }, []);

  // Role value textfield
  const [role, setRole] = useState('');
  
  //Department value textfield
  const [dep, setDep] = useState('');
  
  //Handle Category Form Submit
  const handleSubmit = async (event,index) =>
  {
    event.preventDefault();
    
    await fetch('http://localhost:5000/api/updateHelper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rolesDeps[index])
    })
      .then(response => response.json())
      .then(data =>
      {
        console.log(data);
        
      })
      .catch(error => console.error(error));
  
  };


  const handleChange = (event,index) =>
    {
        if (index===0) {
          setRole(event.target.value);
          // console.log(event.target.value);
        }
        else {
          setDep(event.target.value);
          // console.log(event.target.value);
        }
    };
    
  const handleUpdate=(index,code,d)=>{
    let newData;
    console.log(index,code)
    if(code==='D'){
      newData = { ...rolesDeps[index], content: rolesDeps[index].content.filter(e => e !== d) };
    } else{
      const val=(index===0?role:dep);
      newData = { ...rolesDeps[index], content: [...rolesDeps[index].content, val] };
    }
    
    setData(index === 0 ? [newData, rolesDeps[1]] : [rolesDeps[0], newData]);
    index===0?setRole(''):setDep('')
  }        
       
  
  //Category Form UI
  function UI(index){
    // console.log(' Role',role,'Dep',dep)
    return (
      <Grid size={{xs:6}}>
          <Card className="partition" style={{height:'85vh',overflow: 'auto'}}>
      <CardContent >
      <form onSubmit={(event)=>handleSubmit(event,index)} autoComplete="off">
      <Grid container spacing={2}>
        <Grid size={{xs:8}}>
          <TextField
            label={"Enter "+(index === 0 ? 'Role' : 'Department')}
            margin="normal"
            variant="outlined"
            onChange={(event) => handleChange(event, index)}
            value={index===0?role:dep}
          />
        </Grid>
        <Grid size={{xs:4}}>
          <Button
            variant="contained"
            color="primary"
            onClick={()=>handleUpdate(index,'U')}
          >
            Add
          </Button>
        </Grid>
        <Grid size={{xs:12}}>
          {rolesDeps[index].content.map(e=>
            (<Grid key={e} container spacing={2}>
              <Grid size={{xs:9}}><h3>{e}</h3></Grid>
              <Grid size={{xs:3}}>
              <button  onClick={()=>handleUpdate(index,'D',e)}>
                del
              </button>
              </Grid>
              </Grid>
              ))}
        </Grid >
        <Grid size={{xs:12}}> 
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >Save</Button>
        </Grid>
      </Grid>
      </form>
    </CardContent>
    </Card>
    </Grid>
    )
  }

  return (

    <PageLayout>
      <Grid container spacing={2} >
      {isLoading ? (
        <p>Loading...</p>
      ) : (<>
            {UI(0)}
            {UI(1)}
       </>
       )}
      </Grid>
    </PageLayout>

  );
}
