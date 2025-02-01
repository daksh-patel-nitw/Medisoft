import React from 'react';
import TextField from '@mui/material/TextField';

const CTextField = ({ name, label, value, onChange }) => {
  return (
    <TextField
      fullWidth
      name={name}
      id={name}
      label={label}
      variant="outlined"
      value={value}
      onChange={onChange}
    />
  );
};

export default CTextField;