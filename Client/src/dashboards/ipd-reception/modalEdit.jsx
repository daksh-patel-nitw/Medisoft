import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material/';

const EditModal =({ open, column,handleClose, handleEdit, medicine }) => {
  const m=medicine;
  const [f, updateValue] = useState("");
    const title=medicine.name+"("+medicine.t+")";
  
   const handleInputChange = (event) =>
  {
    console.log("Medicinein modal",medicine,"Colname",column);
    updateValue(event.target.value);
  };

  const arr2 = {'ps':"Package Size",'ps_u':"Package Stock Quantity","price":"Price"};

  const handleSubmit = async() => {
    m[column]=f;
    let val;
    console.log("Medicinein modal",m,"Colname",column);
    await fetch(`http://localhost:5000/api/updatemedicine/${column}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(m)
        })
        .then(res => res.json())
        .then(data =>{console.log("Updated data",data);val=data[column]})
        .catch(err => console.error(err));
   
    handleEdit(m._id, val,column);
    handleClose();
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
                        />
    
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {(column==='ps_u')?"Add":"Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
