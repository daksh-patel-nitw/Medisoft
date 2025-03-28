import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import Autocomplete from '@mui/material/Autocomplete';
import { toast } from 'react-toastify';
import { MedicineAutocomplete } from '../../components/medicineAutoComp';
import { MedicineTable, TestView } from './utils';
import { getTests } from '../../redux/slices/doctorPrescriptionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { clearMedicine } from '../../redux/slices/medicineAutoCompleteSlice';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const medArr = { ps_c: 0, ps_u: 0, name: '', time: [], _id: '', ps: 0 }
const times = [
  'Before Breakfast', 'After Breakfast', 'Before Lunch', 'After Lunch', 'Before Snacks', 'After Snacks', 'Before Dinner', 'After Dinner', 'Once in Day'
];

const autoComp = (autoComp1, setAuto, label, arr) => (
  <Autocomplete
    options={arr}
    getOptionLabel={(option) => option.name}
    required
    value={autoComp1}
    onChange={(event, newValue) => {
      // console.log(newValue);
      setAuto(newValue);
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label={`Search ${label}`}
        margin='normal'
        variant='outlined'
      />
    )}
  />
);

export const EditModal = ({ open, column, handleClose, arr }) => {
  const [testVal, updateTestValue] = useState(null);
  const [medVal, updateMedValue] = useState(medArr);
  const [inputArr, setInputArr] = useState([]);
  const tests = useSelector(getTests);
  //For test autocomplete

  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      updateMedValue(medArr);
      updateTestValue(null);
      console.log(arr);
      setInputArr(arr || []);
    }
  }, [open, arr])

  //For medicine autocomplete
  const updateMedicines = (value) => {
    updateMedValue({ ...medVal, _id: value._id, name: value.name, ps: value.ps });
  }

  //Handle Timings change for medicine.
  const handleTimingChange = (event) => {
    const { value } = event.target;
    // console.log(value)
    updateMedValue({
      ...medVal,
      time: value
    });
  };

  //For handling the focus and blur of the textfield
  const handleFocus = (event) => {
    if (event.target.value == 0)
      updateMedValue({ ...medVal, [event.target.name]: '' });
  };
  const handleBlur = (event) => {
    if (event.target.value == '')
      updateMedValue({ ...medVal, [event.target.name]: 0 });
  };

  //For handling the input change
  const handleInputChange = (event) => {
    // console.log(column, " ", event.target.name, " ", event.target.value);
    const { name, value } = event.target;

    updateMedValue({ ...medVal, [name]: value });

  };

  //For adding the values to the array
  const addValues = () => {
    if (column == "tests") {
      // console.log(testVal);
      if (testVal === "") {
        toast.error("Please Select a Test.");
        return;
      }
      setInputArr([testVal, ...inputArr]);
      updateTestValue(null);
    } else {
      if (medVal.name === "") {
        toast.error("Please Select the Medicine");
        return;
      }

      if (medVal.time.length === 0) {
        toast.error("Please Select at least one time.")
        return;
      }
      setInputArr([medVal, ...inputArr]);
      updateMedValue(medArr);
      dispatch(clearMedicine());
    }
  }

  //For deleting the values from the array
  const deleteValues = (value) => {
    // console.log(value);
    setInputArr(inputArr.filter(e => e._id !== value));
  }

  const handleDeleteTime = (deletedValue) => {
    updateMedValue((prev) => ({
      ...prev,
      time: prev.time.filter((value) => value !== deletedValue)
    }));
  };

  const handleSubmit = async () => {
    if (inputArr === arr) {
      toast.warn("Value is same as previous");
      return;
    }

    // console.log(inputArr);
    arr.splice(0, arr.length, ...inputArr);

    console.log("Clicked save", arr)
    updateTestValue(null);
    updateMedValue(medArr);

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ fontWeight: 700 }}>{column === "tests" ? "Add Test" : "Add Medicine"}</DialogTitle>
      <DialogContent sx={{ width: '80vh', height: '55vh' }} >
        <Grid container spacing={2} pt={1} >

          {
            column === 'tests' ?
              <>
                <Grid size={{ xs: 8 }} >
                  {autoComp(testVal, updateTestValue, 'Search Tests', tests)}
                </Grid>
                <Grid size={{ xs: 4 }} style={{ display: "flex", alignItems: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={addValues}
                    fullWidth
                  >
                    Add
                  </Button>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TestView height="38vh" tests={inputArr} handleDelete={(value) => deleteValues(value)} />
                </Grid>
              </>
              : <>
                <Grid size={{ xs: 12 }}>
                  <MedicineAutocomplete index={1} setMedicine={updateMedicines} />
                </Grid>
                {
                  ["ps_c", "ps_u"].map((col) =>
                    <Grid key={col} size={{ xs: col === "ps_c" ? 3 : 4 }}>
                      <TextField
                        fullWidth
                        key={col}
                        name={col}
                        label={col === "ps_u" ? "Package units " + (medVal.ps && medVal.ps) : "Enter Units"}
                        value={medVal[col]}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleInputChange}
                        variant="outlined"
                        type="number"
                      />
                    </Grid>)
                }
                <Grid size={{ xs: 5 }}>
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="demo-multiple-chip-label">Time</InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      multiple
                      value={medVal.time}
                      onChange={handleTimingChange}
                      input={<OutlinedInput label="Chip" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                          {selected.map((value, index) => (
                            <Chip
                              key={value}
                              size="small"
                              label={value}
                              onMouseDown={(event) => event.stopPropagation()} // Prevents dropdown from opening
                              onDelete={() => handleDeleteTime(value)}
                              sx={{ mt: index === 0 ? 0 : 1 }}
                            />
                          ))}
                        </Box>
                      )}

                    >
                      {times.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}

                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }} style={{ display: "flex", alignItems: "center" }}>
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={addValues}

                  >
                    Add
                  </Button>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <MedicineTable height="24vh" medicines={inputArr} handleDelete={(value) => deleteValues(value)} />
                </Grid>
              </>
          }

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


