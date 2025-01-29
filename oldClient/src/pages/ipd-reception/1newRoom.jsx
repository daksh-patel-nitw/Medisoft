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


export default function App()
{
  const [roomCount,setRCount]=useState(0);

  //Categories data fetch
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/roomcategory');
      const data = await response.json();
      console.log(data);
      setCat(data);
    } catch (error) {
      console.log(error);
    }
  };

  //Room Count data fetch
  const fetchRoomCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/roomcount');
      const data = await response.json();
      console.log(data)
      setRCount(data);
    } catch (error) {
      console.log(error);
    }
  };

  //Initialization
  useEffect(() => {
    fetchRoomCount();
    fetchData();
  }, []);

  // Category Form Values
  const [catValues, setCatValues] = useState({
    type:'',beds:'',price:'',sofa:'',tv:'',refrigator:'',bathroom:'',other:'none' });
  
  const arr1 = ['type','price','beds','sofa','tv','refrigator','bathroom','other'];
  const arr2 = ["Room Type", "Room Price", "No. of Beds", "Sofa", "Television", "Refrigator","Bathroom","Other"];
  
  //Handle Category Form Submit
  const handleCatSubmit = async (event) =>
  {
    event.preventDefault();
    alert(JSON.stringify(catValues));
    await fetch('http://localhost:5000/api/newroomcategory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(catValues)
    })
      .then(response => response.json())
      .then(data =>
      {
        console.log(data);
        setCatValues({ type:'',beds:'',price:'',sofa:'',tv:'',refrigator:'',bathroom:'',other:'none' });
      })
      .catch(error => console.error(error));
    await fetchData();
  };

  //Handle Category Form Values
  const handleInputChange = (event) =>
  {
    const { name, value } = event.target;
    setCatValues({ ...catValues, [name]: value });
  };

  //Category Form UI
  function CatCard(){
    return (
      <CardContent >
      <form onSubmit={handleCatSubmit} autoComplete="off">
      <Grid container spacing={2}>
        {arr1.map((fieldName, index) => (

          (index < 3 || index===7) ?
            <Grid item sm={index===7?12:4} key={fieldName}>
              <TextField
                fullWidth
                key={fieldName}
                name={fieldName}
                id={fieldName}
                label={arr2[index]}
                variant="outlined"
                value={catValues[fieldName]}
                onChange={handleInputChange}
                type={(index===1||index===2)?"number":"text"}
                required
              />
            </Grid>
            : 
            <Grid item sm={3} key={fieldName}>
              <label>{arr2[index]} </label>
              <RadioGroup  name={fieldName} value={catValues[fieldName]} onChange={handleInputChange}>
                
                <FormControlLabel value="yes" control={<Radio required />} label="Yes" />
                <FormControlLabel value="no" control={<Radio required />} label="No" />
              </RadioGroup>
              </Grid>
        ))
        }
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            color="primary"

          >
            Add Category
          </Button>
        </Grid>
      </Grid>
      </form>
    </CardContent>
    )
  }

  //Check Tabs 
  const [value, setValue] = useState(0);

  //Fetch Departments  
  useEffect(() => { 
    if (value === 0) {
      const dep = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/deps');
          const data = await response.json();
          // [ { content } ] = data;
          // console.log(content);
          setDep(data);
        } catch (error) {
          console.log(error);
        }
      };
      dep();
    }
  }, [value]);

  //Track tabs value
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //Room Form values
  const [roomValues, setRoom] = useState({type:'',dep:'',floor:'',room_no:'',price:'' });

  //Department Values for selection
  const [depS, setDep] =useState([]);

  //Categories Values 
  const [categories, setCat] =useState([]);
 
  const Rar=['room_no','type','price','dep','floor',]
  const Rar2=["Room No.","Type","Price","Department","Floor"]

  //Room Form Submit
  const handleRoomSubmit = async (event) =>
  {
    event.preventDefault();
    alert(JSON.stringify(roomValues));
    await fetch('http://localhost:5000/api/newroom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(roomValues)
    })
      .then(response => response.json())
      .then(data =>
      {
        console.log(data);
        setRoom({ type:'',dep:'',floor:'',room_no:'',price:'' });
      })
      .catch(error => console.error(error));
      await fetchRoomCount();
  };

  //Room form Track Values
  const handleRChange = (event) =>
  {
    const { name, value } = event.target;
    // console.log(name,value);
    if(name==='type'){
      const testRoom = categories.find(category => category.type === value);
      // console.log(testRoom.price);
      const d=testRoom.price;
      setRoom({ ...roomValues,[name]: value, 'price': d });
    }else{
      setRoom({ ...roomValues, [name]: value });
    }
    
  };

  //Room Form UI
  function RoomCard(){
    return (
      <CardContent >
      <form onSubmit={handleRoomSubmit} autoComplete="off">
      <Grid container spacing={2}>
        {Rar.map((fieldName, index) => (

          (index%2===0) ?
            <Grid item sm={index===0?12:6} key={fieldName}>
              <TextField
                fullWidth
                key={fieldName}
                name={fieldName}
                id={fieldName}
                label={Rar2[index]}
                value={roomValues[fieldName]}
                onChange={handleRChange}
                variant="outlined"
                type="number"
                disabled={(index === 2)?true:false}
                required
              />
            </Grid>
            : 
            <Grid item sm={6} key={fieldName}>
              <FormControl required variant="outlined" fullWidth>
              <InputLabel htmlFor="filled-age-native-simple">{Rar2[index]}</InputLabel>
                <Select
                  native
                  key={fieldName}
                  name={fieldName}
                  label={Rar2[index]}
                  id={fieldName}
                  onChange={handleRChange}
                  value={roomValues[fieldName]}
                  inputProps={{
                    name: fieldName,
                    id: 'filled-age-native-simple',
                  }}
                >
                  <option aria-label="None" value="" />
                  {(index===1)?categories.map((option) => (
                    <option  value={option.type}>{option.type}</option>
                  )):depS.length > 0&&depS[0].content.map((option) => (
                    <option  value={option}>{option}</option>
                  ))}
                    
                  
                </Select>
                </FormControl>
                
              </Grid>
        ))
        }
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            color="primary"

          >
            Add Room
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
        <Grid item xs={6}>
          <Card className="partition" style={{height:500}}>
            <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange}
              aria-label="disabled tabs example"
            >
              <Tab label="Room" />
              <Tab label="Room Category" />
            </Tabs>
            {(value===1)?CatCard():RoomCard()}
          </Card>
        </Grid>
        <Grid item xs={6}>
        <Grid container direction='column' spacing={2}>
          <Grid item ><Card className="partition" style={{height:240}}>
            <CardContent>
              <h1>Categories:</h1>
              <Grid container spacing={2}>
                  {categories.map((option) => (
                        <Grid style={{padding:2}} item sm={3}>
                          <Chip label={option.type} color="secondary"
        /></Grid>
                      ))}
              </Grid>
            </CardContent>
            </Card></Grid>
          <Grid item > <Card className="partition" style={{height:241}}>
          <CardContent><h1>Total Rooms: <hr/>{roomCount.count}</h1> </CardContent>
            </Card></Grid>
        </Grid>
      </Grid>
      </Grid>
    </PageLayout>

  );
}
