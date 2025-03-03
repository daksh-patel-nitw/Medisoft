import React from 'react';
import TextField from '@mui/material/TextField';

export const TextField = ({ name, label, value, onChange,key }) => {
  return (
    <TextField
      fullWidth
      name={name}
      id={name}
      key={key}
      label={label}
      variant="outlined"
      value={value}
      onChange={onChange}
    />
  );
};