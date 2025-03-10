import React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material//Card';
import CardContent from '@mui/material//CardContent';
import TextField from '@mui/material//TextField';
import Button from '@mui/material//Button';
import { Delete } from '@mui/icons-material';
import { apis } from '../../Services/commonServices';
import { SideBar } from '../../components/sidebar';
import { side_bar_utils } from './side_bar';

export default function App() {

  //Roles and Departments
  const [rolesDeps, setValues] = useState('');

  //handle the text field values
  const [data, setData] = useState({ dep: '', role: '' });

  const [isLoading, setIsLoading] = useState(true);

  //fetch all employees
  const fetchData = async () => {
    try {
      const data = await apis.noTokengetRequest('/member/rolesDeps/all');
      console.log(data)
      setValues(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  //Initialization
  useEffect(() => {
    fetchData();
  }, []);

  //Handle Category Form Submit
  const handleSubmit = async (event, index) => {
    event.preventDefault();

    await apis.noTokenPostRequest('/member/roleDeps', { name:index===0?'roles':'dep', data: rolesDeps[index] });

  };


  const handleChange = (event, index) => {
    if (index === 0) {
      setData({ ...data, role: event.target.value });
    }
    else {
      setData({ ...data, dep: event.target.value });
    }
  };

  const handleUpdate = (index, code, d) => {
    let newData = [...rolesDeps];

    if (code === 'D') {
      // Remove the value 'd' from the specified index
      newData[index] = newData[index].filter(e => e !== d);
    } else {
      // Add the value 'val' to the specified index if it's not already present
      const val = index === 0 ? data.role : data.dep;
      if (!newData[index].includes(val)) {
        newData[index] = [...newData[index], val];
      }
    }

    setValues(newData);
    setData({ dep: '', role: '' });
  };



  //Category Form UI
  function UI(index) {
    // console.log(' Role',role,'Dep',dep)
    return (
      <Grid size={{ xs: 6 }}>
        <Card className="partition">
          <CardContent >
            <form onSubmit={(event) => handleSubmit(event, index)} autoComplete="off">
              <Grid container spacing={2} >
                <Grid size={{ xs: 8 }}>
                  <TextField
                    label={"Enter " + (index === 0 ? 'Role' : 'Department')}
                    margin="normal"
                    variant="outlined"
                    onChange={(event) => handleChange(event, index)}
                    value={index === 0 ? data.role : data.dep}
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdate(index, 'U')}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
              <Grid size={{ xs: 12 }} style={{ height: '60vh', overflow: 'auto' }}>
                {rolesDeps[index].map(e =>
                (<Grid key={e} container spacing={2}>
                  <Grid size={{ xs: 9 }}><h3>{e}</h3></Grid>
                  <Grid size={{ xs: 3 }}>
                    <Delete onClick={() => handleUpdate(index, 'D', e)} />
                  </Grid>
                </Grid>
                ))}
              </Grid >

              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >Save</Button>
              </Grid>

            </form>
          </CardContent>
        </Card>
      </Grid >
    )
  }

  return (

    <SideBar arr={side_bar_utils} title="Admin">
      <Grid container spacing={2} >
        {isLoading ? (
          <p>Loading...</p>
        ) : (<>
          {UI(0)}
          {UI(1)}
        </>
        )}
      </Grid>
    </SideBar>

  );
}
