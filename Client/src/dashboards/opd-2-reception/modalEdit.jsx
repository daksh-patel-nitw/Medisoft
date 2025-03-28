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
import { toast } from 'react-toastify';

const EditModal = ({ open, handleClose, handleEdit, appoint }) => {

  const [checkedList, setCheckedList] = useState('');
  const [form, setForm] = useState([]);

  const handleCheckboxChange = (event, index) => {
    const newCheckedList =
      checkedList.substring(0, index) +
      (event.target.checked ? "1" : "0") +
      checkedList.substring(index + 1);

    setCheckedList(newCheckedList);
    // console.log(newCheckedList);

  };

  useEffect(() => {
    setForm(appoint);
    setCheckedList("0".repeat(appoint.doctor_qs.length));
  }, [open]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value })
    // console.log(form, name, value);
  };

  const handleSubmit = () => {
    if (!form.weight || !form.height) {
      toast.error("Please fill all the fields");
      return;
    }
    const updatedForm = {
      _id: form._id,
      weight: form.weight,
      height: form.height,
      selected_doctor_qs: checkedList,
    };
    alert(JSON.stringify(updatedForm));
    // return;
    handleEdit(updatedForm);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{form.pname} <b>({form.time})</b></DialogTitle>
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
        {appoint.doctor_qs.map((e, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={checkedList[index] === '1'}
                onChange={(event) => handleCheckboxChange(event, index)}
                name={e}
              />
            }
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
