
import React from "react";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CTextField from "../../../../components/CTextField";

const arr1 = ["name", "q", "t", "ps", "ps_u", "price"];
const arr2 = [
  "Medicine Name",
  "Quantity/Unit",
  "Type",
  "Package Size",
  "Package Stock Quantity",
  "Price per 1 Unit",
];

const MedicineForm = ({ formValues, handleInputChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Card className="component_img">
        <CardContent>
          <h2>Add New Medicine</h2>
          <Grid container spacing={2}>
            {arr1.map((fieldName, index) =>
              index === 2 || index === 4 ? null : (
                < Grid key={fieldName} size={{xs:12}}>
                  {index === 1 || index === 3 ? (
                    <Grid container  spacing={2}>
                      <Grid size={{xs:6}}>
                        <CTextField
                          name={fieldName}
                          label={arr2[index]}
                          value={formValues[fieldName]}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid size={{xs:6}}>
                        <CTextField
                          name={arr1[index + 1]}
                          label={arr2[index + 1]}
                          value={formValues[arr1[index + 1]]}
                          onChange={handleInputChange}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <CTextField
                      name={fieldName}
                      label={arr2[index]}
                      value={formValues[fieldName]}
                      onChange={handleInputChange}
                    />
                  )}
                </Grid>
              )
            )}
            <Grid size={{xs:6}}>
              <Button type="submit" variant="contained" color="primary">
                Add
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export default MedicineForm;
