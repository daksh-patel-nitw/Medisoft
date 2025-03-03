
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

const MedicineForm = ({ typeValues }) => {
  return (
    <form  autoComplete="off">
      <Card className="component_img">
        <CardContent>
          <h2>Add New Medicine</h2>
          
        </CardContent>
      </Card>
    </form>
  );
};

export default MedicineForm;
