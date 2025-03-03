import React, { useCallback, useMemo } from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import CustomTable from '../../../components/CTable';

const MedicinesTable = ({ medicines, handleDelete, handleOpenEditModal }) => {
  const columns = useMemo(
    () => ["Medicine Name", "Type", "Package", "Package Available", "Free Available", "Price", "Action"], 
    []
  );

  const generateRows = useCallback(() => {
    return medicines.map(m => (
      <TableRow key={m._id}>
        <TableCell>{m.name}</TableCell>
        <TableCell>{m.t}</TableCell>
        <TableCell>
          {m.ps}
          <IconButton onClick={() => handleOpenEditModal(m, 'ps')}>
            <Edit />
          </IconButton>
        </TableCell>
        <TableCell>
          {m.ps_u}
          <IconButton onClick={() => handleOpenEditModal(m, 'ps_u')}>
            <Edit />
          </IconButton>
        </TableCell>
        <TableCell>{m.ps_c + m.ps_u * m.ps}</TableCell>
        <TableCell>
          {m.price}
          <IconButton onClick={() => handleOpenEditModal(m, 'price')}>
            <Edit />
          </IconButton>
        </TableCell>
        <TableCell>
          <IconButton onClick={() => handleDelete(m._id)}>
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  }, [medicines, handleOpenEditModal, handleDelete]);

  return <CustomTable columns={columns} generateRows={generateRows} />;
};

export default MedicinesTable;
