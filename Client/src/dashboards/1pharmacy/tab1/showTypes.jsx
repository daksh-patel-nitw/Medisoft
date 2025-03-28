
import React, { useState, memo  } from "react";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { apis } from "../../../Services/commonServices";
import { Autocomplete, TextField } from "@mui/material";

const MedicineForm = ({ typeValues, updateValues }) => {
  const [category, setType] = useState('');
  const [categoryDelete, setDeleteType] = useState('');

  const handleInputChange = (event, newValue) => {
    const { value, name } = event.target;
    name === 'category' ? setType(value) : setDeleteType(newValue);
  }

  const handleSubmit = async (flag) => {

    if (flag && !category) {
      toast.error("Please enter a category");
      return;
    }
    const updated = flag ? [category, ...typeValues] : typeValues.filter(type => type !== categoryDelete);
    const data = { value: flag ? category : categoryDelete, flag };
    console.log(data);
    const status = await apis.noTokenStatusPostRequest('/pharmacy/types', data);
    if (status == 200) {
      flag ? setType('') : setDeleteType('');
      updateValues(updated);
    }
  }


  console.log("rerendering. types form.");
  return (
    <Grid container spacing={2} size={{ xs: 12 }}>

      <Card className="partition">
        <CardContent>
          <Grid container spacing={2}>
            <h2>Add Medicine Category</h2>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="category"
                label="Add New Category"
                value={category}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid >
              <Button onClick={() => handleSubmit(1)} variant="contained" color="primary">
                Add
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>



      <Card className="partition">
        <CardContent>
          <Grid container spacing={2}>
            <h2>Delete Medicine Category</h2>
            <Grid size={{ xs: 12 }}>
              <Autocomplete
                options={Array.isArray(typeValues) ? typeValues : []}
                name="categoryDelete"
                onChange={(event, newValue) => handleInputChange(event, newValue)}
                value={categoryDelete}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    {...params}
                    label="Search Category"
                  />
                )}
              />
            </Grid>
            <Grid container size={{ xs: 12 }}>
              <Grid size={{ xs: 3 }} />
              {categoryDelete ?
                <>

                  <Grid size={{ xs: 3 }}>
                    <h4>{categoryDelete}</h4>
                  </Grid>

                  <Grid>
                    <Button sx={{ mt: 2 }} onClick={() => handleSubmit(0)} variant="contained" color="primary">
                      Delete
                    </Button>
                  </Grid>

                </> : <Grid>"No category selected for deletion"</Grid>
              }


            </Grid>
          </Grid>
        </CardContent>
      </Card>


    </Grid>
  );
};

export default memo(MedicineForm);
