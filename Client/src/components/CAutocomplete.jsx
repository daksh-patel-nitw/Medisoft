import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export const AutoComp = ({ name, label, handleSearch, arr, value='' }) => {
  return (
    <Autocomplete
      freeSolo
      options={arr?.map((option) => option[name]) || []}
      onChange={(event, newValue) => handleSearch(newValue, name)}
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          label={`Search by ${label}`}
          margin="normal"
          variant="outlined"
        />
      )}
    />
  );
};

