import React, { useState, useMemo, useEffect } from 'react';
import { Autocomplete, TextField, Box, Typography } from '@mui/material';
import { debounce } from '@mui/material/utils';
import PersonIcon from "@mui/icons-material/Person";
import { apis } from '../Services/commonServices';
import { useSelector, useDispatch } from 'react-redux';
import {
  clearPatient, getPatient, setPatientAutoComp, getPatientOptions, setPatientOptions, getActiveAutoComplete,
  setActiveAutoComplete
} from '../redux/slices/patientsAutoCompSlice';

const arr = ["pname", "pid", "mobile"];
const arr2 = ["Name", "ID", "Mobile"];

export const PatientAutocomplete = ({ index, setPatient, patient,opd }) => {
  const [value, setValue] = useState(null);
  const [isManualInput, setIsManualInput] = useState(false);

  const inputValue = useSelector(getPatient);
  const options = useSelector(getPatientOptions);
  const activeAutoComplete = useSelector(getActiveAutoComplete);

  const dispatch = useDispatch();
  const [Error, setError] = useState(false);

  useEffect(() => {
    setValue(patient);
  }, [patient]);

  // Debounce API Call
  const fetchPatients = useMemo(
    () =>
      debounce(async (query, active) => {
        if (!query) return;
        try {
          console.log("Fetching patients for query:", query, index);
          
          const response = await apis.noTokengetRequest(`/member/patient?search=${query.toString()}&flag=${index}&opd=${opd?1:0}`);
          console.log("Fetched response:", response);
          if (active) {
            dispatch(setPatientOptions(response || [])); // Store in Redux
          }
        } catch (error) {
          console.error('Error fetching patients:', error);
        }
      }, 500),
    []
  );

  useEffect(() => {
    let active = true;
    if (inputValue === '') {
      setValue(null);
      console.log("Clearing patient options ", index);
      dispatch(clearPatient());
      
      return;
    }

    if (isManualInput && activeAutoComplete === index) {
      if (index === 3) {
        if (inputValue[arr[index - 1]].length >= 5) {
          fetchPatients(inputValue[arr[index - 1]], active);
        }
      } else if (inputValue[arr[index - 1]].length >= 3) {
        fetchPatients(inputValue[arr[index - 1]], active);
      }
    }

    return () => {
      active = false;
    };
  }, [inputValue, isManualInput,patient]);

  const others = [1, 2, 3].filter(i => i !== index);

  const getErrMsg = (index) => {
    switch (index) {
      case 1:
        return "Characters allowed are A-Z,a-z and spaces";
      case 2:
        return "Characters allowed are A-Z, 0-9";
      case 3:
        return "Only numbers are allowed";
      default:
        return "";
    }
  }
  return (
    <Autocomplete
      getOptionLabel={(option) => option[arr[index - 1]].toString()}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No patients found"
      onChange={(event, newValue) => {
        setValue(newValue);
        setPatient(newValue);
        setIsManualInput(false);
        if(!newValue)dispatch(clearPatient());
        dispatch(setActiveAutoComplete(null)); // Reset active field after selection
      }}
      onInputChange={(event, newInputValue) => {
        const isValid = (() => {
          switch (index) {
            case 1:
              return /^[a-zA-Z ]*$/.test(newInputValue); // Name
            case 2:
              return /^[A-Z0-9]*$/.test(newInputValue); // ID
            case 3:
              return /^[0-9]*$/.test(newInputValue); // Mobile
            default:
              return false; // Default case (optional)
          }
        })();
        
        setError(!isValid);
        if (isValid) {
          dispatch(setPatientAutoComp({ i: arr[index - 1], val: newInputValue }));
          setIsManualInput(true);
        }
      }}
      onFocus={() => dispatch(setActiveAutoComplete(index))} // Set active on focus
      renderInput={(params) => (
        <TextField
          {...params}
          error={Error}
          label={Error ? getErrMsg(index) : `Search Patient ${arr2[index - 1]}`}
          fullWidth
          helperText={Error ? "Don't use special Characters" : index === 3 ? "Enter at least 5 characters" : "Enter at least 3 characters"}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option._id}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <PersonIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {option[arr[index - 1]]}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {arr2[others[0]-1]}: {option[arr[others[0] - 1]]} <br /> 
                {arr2[others[1]-1]}: {option[arr[others[1] - 1]]} 
              </Typography>
            </Box>
          </Box>
        </li>
      )}
    />

  );
};
