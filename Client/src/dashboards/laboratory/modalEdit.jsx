import React, { useState,useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid2 as Grid,
  IconButton,
} from '@mui/material/';
import { toast } from 'react-toastify';
import { Delete } from '@mui/icons-material';
import { apis } from '../../Services/commonServices';

const arr2 = { pat_details: "Patient Details", normal: "Normal", price: "Price", timing: "Timing" };

const EditModal = ({ open, column, handleClose, test }) => {
  const [f, updateValue] = useState("");
  const [timings, setTiming] = useState([]);
  
  const title = test.name;
  useEffect(() => {
    if (open) {
      updateValue("");
      setTiming(test.timing || []);
    }
  }, [open, test]);

  const handleInputChange = (event) => {
    // console.log("Medicinein modal",medicine,"Colname",column);
    updateValue(event.target.value);
  };

  const addTiming = () => {
    if(f === "") {
      toast.error("Please enter a valid timing");
      return;
    }
    
    setTiming([f,...timings]);
    updateValue("");
  }

  const deleteTiming = (value) => {
    setTiming(timings.filter(e => e !== value));
  }

  const handleSubmit = async () => {
    //Validation for empty fields
    if(column!=='timing' && f === "") {
      toast.error("Please enter a valid value");
      return;
    }

    const value = column === 'timing' ? timings : f;
    if(value===test[column]){
      toast.warn("Value is same as previous");
      return;
    }
    const status = await apis.noTokenStatusPutRequest('/lab', {column: column, value: value, id: test._id});
    if (status === 200) {
      test[column] = value;

      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} style={{ width: '400px' }}> 
          <Grid size={{ xs: column === 'timing' ? 8 : 12 }}>
            <TextField
              fullWidth
              margin="dense"
              label={arr2[column]}
              value={f}
              variant="outlined"
              onChange={handleInputChange}
            />
          </Grid>
          {column === 'timing' && <>
            <Grid size={{ xs: 4 }} style={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={addTiming}
                fullWidth
                
              >
                Add
              </Button>
            </Grid >

            {timings.map((time, index) => (
              < >
                <Grid size={{ xs: 3 }} />
                <Grid container size={{ xs: 6 }}>
                  <Grid style={{ display: "flex", alignItems: "center" }} size={{ xs: 9 }}>
                    {time}

                  </Grid>
                  <Grid size={{ xs: 3 }}>
                    <IconButton onClick={() => deleteTiming(time)}>
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 3 }} />
              </>
            ))}

          </>}

        </Grid>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
