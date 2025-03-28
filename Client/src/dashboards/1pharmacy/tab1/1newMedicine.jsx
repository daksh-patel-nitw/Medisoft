import React, { useState, useEffect } from "react";
import { SideBar } from "../../../components/sidebar.jsx";
import { Grid2, Card, TextField, Autocomplete, CardContent, Button } from "@mui/material";
import TypeUI from "./showTypes.jsx";
import { side_bar_utils } from "../utils.js";
import { apis } from "../../../Services/commonServices.js";
import { initialMedicineState, checkNewMedicine, arr1, arr2 } from '../utils.js';

const MedicineForm = React.memo(({ formValues, handleInputChange, handleSubmit, allCategory, searchValue, searchVal }) => {
  console.log("rerendering. medicine form.");
  return (
    // <Grid2 container spacing={2}>
    <Card className="partition" >
      <CardContent >
        <form onSubmit={handleSubmit} autoComplete="off">
          <Grid2 container spacing={1}>
            <Grid2 size={{ xs: 12 }}>
              <h2>Add New Medicine</h2>
            </Grid2>
            {arr1.map((fieldName, index) => (
              index === 2 ? (
                <Grid2 size={{ xs: 12 }} key={fieldName}>
                  <Autocomplete
                    options={allCategory}
                    key={fieldName}
                    onChange={(event, newValue) => searchValue(newValue)}
                    value={searchVal}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} label="Search Category" />
                    )}
                  />
                </Grid2>
              ) : (
                <Grid2 size={{ xs: [5].includes(index) ? 12 : 6 }} key={fieldName}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    key={fieldName + '1'}
                    name={fieldName}
                    label={arr2[index]}
                    type={[3, 4, 5].includes(index) ? "number" : "text"}
                    value={formValues[fieldName]}
                    onChange={handleInputChange}
                  />
                </Grid2>
              )
            ))}
            <Grid2 size={{ xs: 6 }}>
              <Button type="submit" variant="contained" color="primary">
                Add
              </Button>
            </Grid2>
          </Grid2>
        </form>
      </CardContent>
    </Card>
    // </Grid2>
  );
});

export default function App() {
  const [formValues, setFormValues] = useState(initialMedicineState);
  const [allCategory, setCategory] = useState([]);
  const [searchVal, setSearchVal] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const searchValue = (newValue) => {
    setSearchVal(newValue);
    setFormValues({ ...formValues, t: newValue });
  };

  // Fetch medicine categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apis.noTokengetRequest('/pharmacy/types');
        console.log(data);
        setCategory(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (checkNewMedicine(formValues)) {
      try {
        await apis.noTokenPostRequest('/pharmacy', formValues);
        setFormValues(initialMedicineState);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <SideBar arr={side_bar_utils}>
      <Grid2 container spacing={2} style={{ height: '100vh' }} alignItems="stretch">
        <Grid2 size={{ md: 6 }}>

          <MedicineForm
            formValues={formValues}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            allCategory={allCategory}
            searchValue={searchValue}
            searchVal={searchVal}
          />

        </Grid2>
        <Grid2 size={{ md: 6 }}>

          <TypeUI typeValues={allCategory} updateValues={setCategory} />

        </Grid2>
      </Grid2>

    </SideBar>
  );
}
