import React, { useState, useMemo,useEffect } from 'react';
import { Autocomplete, TextField, Box, Typography } from '@mui/material';
import { debounce } from '@mui/material/utils';
import MedicationIcon from "@mui/icons-material/Medication";
import {apis} from '../../../Services/commonServices'; // Import your API functions

const MedicineAutocomplete = (setHasMore,setFilteredString, setFilteredMedicines, medicines) => {
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState(null);
  const [options, setOptions] = useState([]);

  // Debounce API Call
  const fetchMedicines = useMemo(
    () =>
      debounce(async (query, active) => {
        if (!query) return;
        try {
          const response = await apis.noTokengetRequest(`/pharmacy/search?query=${query}`);
          console.log(response)
          if (active) {
            setOptions(response || []);
            response.length>0 && setFilteredMedicines(response);
          }
        } catch (error) {
          console.error('Error fetching medicines:', error);
        }
      }, 500), // 500ms debounce time
    []
  );

  useEffect(() => {
    let active = true;
    
    if (inputValue === '') {
      setOptions(value ? [value] : []);
      setHasMore(true);
      return;
    }

    if(inputValue.length >= 3){
        setFilteredString(inputValue);
        fetchMedicines(inputValue, active);
    }else{
      setFilteredString('');
    }
    console.log(inputValue);
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
        // setOptions(newValue ? [newValue, ...options] : options);
        setHasMore(false);
        setFilteredMedicines(newValue ? [newValue] : []);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Search Medicines Enter 3 words" fullWidth />
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

export default MedicineAutocomplete;
