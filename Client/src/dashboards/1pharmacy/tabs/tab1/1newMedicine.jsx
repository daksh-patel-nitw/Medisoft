import React from "react";
import SideBar from "../../../../components/sidebar.jsx";
import MedicineForm from "./MedicineForm.jsx";
import useMedicineForm from "../../hooks/useMedicineForm.js";
import { Grid2 } from "@mui/material";
import TypeUI from "./showTypes.jsx";
import { ToastContainer } from "react-toastify";

const arr = [
  { label: "New Medicine", path: "/", icon: "AddBox" },
  { label: "Medicine List", path: "/medicine", icon: "TableChart" },
  { label: "Patients", path: "/medpatients", icon: "AccountBox" },
];

export default function App() {
  const { formValues, handleInputChange, handleSubmit } = useMedicineForm();

  return (
    <SideBar arr={arr}>
      <ToastContainer/>
      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 6 }}>

          <MedicineForm
            formValues={formValues}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </Grid2>
        <Grid2 size={{ md: 6 }}>
          <TypeUI typeValues={23}/>
        </Grid2>
      </Grid2>

    </SideBar>
  );
}
