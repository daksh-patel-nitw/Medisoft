import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material/';
import { apis } from "../../../Services/commonServices.js";

const EditModal = ({ open, column, handleClose, medicine }) => {
  const m = medicine;
  const [f, updateValue] = useState("");
  const title = medicine.name + "(" + medicine.t + ")";

  const handleInputChange = (event) => {
    updateValue(event.target.value);
  };

  const arr2 = { 'ps': "Package Size", 'ps_u': "Package Stock Quantity", "price": "Price" };

  const handleSubmit = async () => {

    console.log({ id: medicine._id, field: column, value: f });
    // const status=await apis.noTokenStatusPostRequest(`/api/updatemedicine`,{field:column,value:f});
    const status = 200;
    if (status === 200) {
      console.log("Success");
      m[column] = f;
      
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          name={column}
          id={column}
          label={arr2[column]}
          variant="outlined"
          onChange={handleInputChange}
          type="Number"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {(column === 'ps_u') ? "Add" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
