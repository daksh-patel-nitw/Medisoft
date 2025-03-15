import React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material//Card';
import CardContent from '@mui/material//CardContent';
import TextField from '@mui/material//TextField';
import Button from '@mui/material//Button';
import { InputLabel, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material/';
import Select from '@mui/material//Select';
import Tabs from '@mui/material//Tabs';
import Tab from '@mui/material//Tab';
import Chip from '@mui/material//Chip';
import { side_bar } from './utils.js';
import { SideBar } from '../../components/sidebar';
import { apis } from '../../Services/commonServices.js';
import { toast } from 'react-toastify';


export default function App() {
  //Room Count
  const [roomCount, setRCount] = useState(0);

  const Rar = ['room_no', 'type', 'price', 'dep', 'floor', 'maxPatients'];
  const Rar2 = ["Room No.", "Type", "Price", "Department", "Floor"];
  const InitialRoomState = Rar.reduce((acc, key) => {
    acc[key] = '';
    return acc;
  }, {})
  //Room Form values
  const [roomValues, setRoom] = useState(InitialRoomState);

  //Department Values for selection
  const [depS, setDep] = useState([]);

  //Categories Values 
  const [categories, setCat] = useState([]);

  //Categories data fetch
  const fetchData = async () => {
    try {
      const data = await apis.noTokengetRequest('/room/category');
      console.log(data);
      setCat(data[0]);
      setDep(data[1]);
      setRCount(data[2]);
    } catch (error) {
      console.log(error);
    }
  };

  //Initialization
  useEffect(() => {
    fetchData();
  }, []);

  // Category Form Values
  const arr1 = ['type', 'price', 'beds', 'sofa', 'tv', 'refrigator', 'bathroom', 'number_of_patients', 'other'];
  const arr2 = ["Room Type", "Room Price", "No. of Beds", "Sofa", "Television", "Refrigator", "Bathroom", "Number of Patients", "Other"];

  const initialCategoryState = arr1.reduce((acc, key) => {
    acc[key] = key === "other" ? "none" : "";
    return acc;
  }, {});

  const [catValues, setCatValues] = useState(initialCategoryState);



  //Handle Category Form Submit
  const handleCatSubmit = async (event) => {
    event.preventDefault();
    for (let i = 0; i < arr1.length; i++) {
      if (catValues[arr1[i]] === '') {
        toast.error(`Please fill the ${arr2[i]}`);
        return;
      }
    }
    alert(JSON.stringify(catValues));
    const status = await apis.noTokenStatusPostRequest('/room/category', catValues)
    if (status === 200) {
      setCat([...categories, catValues]);
      setCatValues(initialCategoryState);
    }
  };

  //Handle Category Form Values
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCatValues({ ...catValues, [name]: value });
  };

  //Category Form UI
  function CatCard() {
    return (
      <CardContent >
        <form onSubmit={handleCatSubmit} autoComplete="off">
          <Grid container spacing={2}>
            {arr1.map((fieldName, index) => (

              (index < 3 || index >= 7) ?
                <Grid size={{ sm: [7, 8].includes(index) ? 6 : 4 }} key={fieldName}>
                  <TextField
                    fullWidth
                    key={fieldName}
                    name={fieldName}
                    id={fieldName}
                    label={arr2[index]}
                    variant="outlined"
                    value={catValues[fieldName]}
                    onChange={handleInputChange}
                    type={[1, 2, 7].includes(index) ? "number" : "text"}
                    required
                  />
                </Grid>
                :
                <Grid size={{ sm: 3 }} key={fieldName}>
                  <label>{arr2[index]} </label>
                  <RadioGroup name={fieldName} value={catValues[fieldName]} onChange={handleInputChange}>

                    <FormControlLabel value="yes" control={<Radio required />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio required />} label="No" />
                  </RadioGroup>
                </Grid>
            ))
            }
            <Grid>
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

  //Track tabs value
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //Room Form Submit
  const handleRoomSubmit = async (event) => {
    event.preventDefault();
    alert(JSON.stringify(roomValues));
    const status = await apis.noTokenStatusPostRequest('/room', roomValues);
    if (status === 200) {
      setRoom(InitialRoomState);
      setRCount(roomCount + 1);
    }

  };

  //Room form Track Values
  const handleRChange = (event) => {
    const { name, value } = event.target;

    setRoom((prevState) => {
      if (name === 'type') {
        const category = categories.find(category => category.type === value);

        if (category) {
          return {
            ...prevState,
            type: value,
            price: category.price || "",
            maxPatients: category.number_of_patients || ""
          };
        }
      }

      return { ...prevState, [name]: value };
    });
  };


  //Room Form UI
  function RoomCard() {
    return (
      <CardContent >
        <form onSubmit={handleRoomSubmit} autoComplete="off">
          <Grid container spacing={2}>
            {Rar.slice(0, 5).map((fieldName, index) => (

              (index % 2 === 0) ?
                <Grid size={{ sm: index === 0 ? 12 : 6 }} key={fieldName}>
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
                    disabled={(index === 2) ? true : false}
                    required
                  />
                </Grid>
                :
                <Grid size={{ sm: 6 }} key={fieldName}>
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
                      {(index === 1 && categories.length !== 0)
                        ? categories.map((option, idx) => (
                          <option key={idx} value={option.type}>{option.type}</option>
                        ))
                        : (depS.length > 0 && depS?.map((option, idx) => (
                          <option key={idx} value={option}>{option}</option>
                        )))}
                    </Select>
                  </FormControl>

                </Grid>
            ))
            }
            <Grid>
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

    <SideBar arr={side_bar}>
      <Grid container spacing={2} >
        <Grid size={{ md: 6 }}>
          <Card className="partition" style={{ height: 500 }}>
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
            {(value === 1) ? CatCard() : RoomCard()}
          </Card>
        </Grid>
        <Grid size={{ md: 6, sm: 12 }}>
          <Grid container direction='column' spacing={2}>
            <Grid>
              <Card className="partition" style={{ height: 240 }}>
                <CardContent>
                  <h1>Categories:</h1>
                  <Grid container spacing={2}>
                    {categories.map((option) => (
                      <Grid style={{ padding: 2 }} size={{ sm: 3 }}>
                        <Chip label={option.type} color="secondary" />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card></Grid>
            <Grid>
              <Card className="partition" style={{ height: 241 }}>
                <CardContent>
                  <h1>Total Rooms: <hr />{roomCount}</h1>
                </CardContent>
              </Card></Grid>
          </Grid>
        </Grid>
      </Grid>
    </SideBar>

  );
}
