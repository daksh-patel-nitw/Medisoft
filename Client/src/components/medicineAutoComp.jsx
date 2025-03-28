import React, { useState, useMemo, useEffect } from 'react';
import { Autocomplete, TextField, Box, Typography } from '@mui/material';
import { debounce } from '@mui/material/utils';
import MedicationIcon from "@mui/icons-material/Medication";
import { apis } from '../Services/commonServices';
import { useSelector,useDispatch } from 'react-redux';
import { getMedicine, setMedicineAutoComp } from '../redux/slices/medicineAutoCompleteSlice';

export const MedicineAutocomplete = ({ index, setHasMore, setFilteredString, setFilteredMedicines, setMedicine }) => {
  const [value, setValue] = useState(null);
  // const [inputValue, setInputValue] = useState('');
  
  const inputValue=useSelector(getMedicine);
  const dispatch=useDispatch();
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(false);
  // Debounce API Call
  const fetchMedicines = useMemo(
    () =>
      debounce(async (query, active) => {
        if (!query) return;
        try {
          const response = await apis.noTokengetRequest(`/pharmacy/search?query=${query}`);
          // console.log("This is response", response)
          if (active) {
            setOptions(response || []);

            //We don't need to update the filtered medicines for the doctor screen tab
            if (index === 1) return;

            response.length > 0 && setFilteredMedicines(response);
          }
        } catch (error) {
          console.error('Error fetching medicines:', error);
        }
      }, 500), // 500ms debounce time
    []
  );
 

  useEffect(() => {
    // We dont need the filtered string for the doctor screen tab


    let active = true;
    // console.log(inputValue);
    if (inputValue === '') {
      setValue(null);
      setOptions(value ? [value] : []);
      index !== 1 && setHasMore?.(true);
      return;
    }

    if (inputValue.length >= 3) {
      index !== 1 && setFilteredString(inputValue);
      fetchMedicines(inputValue, active);
    } else {
      index !== 1 && setFilteredString('');
    }
    // console.log(inputValue);
    return () => {
      active = false;
    };
  }, [inputValue]);

  return (
    <Autocomplete
      getOptionLabel={(option) => option.name} // Display medicine name
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No medicines found"
      onChange={(event, newValue) => {
        setValue(newValue);
        if (index === 1) {
          // console.log("Medicine--->", newValue);
          setMedicine(newValue);
          return;
        }
        setHasMore?.(false);
        setFilteredMedicines(newValue ? [newValue] : []);
      }}
      onInputChange={(event, newInputValue) => {

        const isValid = /^[a-zA-Z0-9 ]*$/.test(newInputValue);
        setError(!isValid);
        if (isValid) {
          dispatch(setMedicineAutoComp(newInputValue));
        }

      }}
      renderInput={(params) => (
        <TextField {...params} error={error} label={error?"Don't use special Characters":"Search Medicines"} fullWidth />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option._id}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <MedicationIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {option.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Per {option.t} - ₹{option.price.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </li>
      )}
    />
  );
};


