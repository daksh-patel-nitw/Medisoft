import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material/';

const EditModal =({ open, id,handleClose, handleEdit }) => {
  
  const [f, updateValue] = useState("");
    const title="Add Test";
  
   const handleInputChange = (event) =>
  {
    updateValue(event.target.value);
  };

  const handleSubmit = async() => {
  
    handleEdit(id, f);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
          

             <TextField
                    fullWidth
                    margin="dense"
                    name='{column}'
                    id='column'
                    label='Add Test Result'
                    variant="outlined"
                    onChange={handleInputChange}
                        />
    
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
