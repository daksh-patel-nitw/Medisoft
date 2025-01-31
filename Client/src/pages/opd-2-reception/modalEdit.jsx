import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material/';
import Checkbox from '@mui/material//Checkbox';
import FormControlLabel from '@mui/material//FormControlLabel';

const EditModal =({ open, handleClose, handleEdit, appoint }) => {

  const [checkedList, setCheckedList] = useState([]);

const handleCheckboxChange = (event, index) => {
  const newCheckedList = [...checkedList];
  newCheckedList[index] = event.target.checked ? 1 : 0;
  setCheckedList(newCheckedList);
  console.log(newCheckedList);
};
useEffect(() =>
    {
       setForm(appoint);
       setCheckedList(Array(appoint.doctor_qs[0].length).fill(0))
    }, [open]);
  const title=appoint.pname;
  const [form,setForm]=useState([]);
   const handleInputChange = (event) =>
  {
    const {name,value}=event.target;
    setForm({...form,[name]:value})
    console.log(form,name,value);
  };

  const handleSubmit = () => {
    const updatedForm = {
      ...form,
      doctor_qs: [...form.doctor_qs, checkedList],
    };
    console.log("Updated Form",updatedForm);
    setCheckedList([])
    handleEdit(updatedForm);
    handleClose();
  };
  

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
          

             <TextField
                    fullWidth
                    margin="dense"
                    name='weight'
                    id='weight'
                    label="Weight"
                    type='number'
                    variant="outlined"
                    onChange={handleInputChange}
                        />
             <TextField
                    fullWidth
                    margin="dense"
                    name='height'
                    id='height'
                    label="Height"
                    type='number'
                    variant="outlined"
                    onChange={handleInputChange}
                        />
           {appoint.doctor_qs[0].map((e, index) => (
  <FormControlLabel
    key={index}
    control={<Checkbox checked={checkedList[index] === 1} onChange={(event) => handleCheckboxChange(event, index)} name={e} />}
    label={e}
  />
))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
