import React, { useCallback, useMemo } from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import { TableContainer, Table, TableHead, TableBody, CircularProgress } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';


const MedicinesTable = ({ hasMore, lastElementRef, medicines, handleDelete, handleOpenEditModal }) => {
  const columns = useMemo(
    () => ["Medicine Name", "Type", "Package", "Package Available", "Free Pieces", "Price", "Action"],
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

  return (
    <TableContainer>
      <Table size="small" className="table">
        <TableHead style={{ backgroundColor: '#1F3F49' }}>
          <TableRow>
            {columns.map((element, index) => (
              <TableCell key={index + "heading"} style={{ color: 'white', fontWeight: 'bold' }}>
                {element}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {generateRows()}

          {hasMore && <TableRow ref={lastElementRef}>
            <TableCell colSpan={7} align="center">
              <CircularProgress size={24} />
            </TableCell>
          </TableRow>}

        </TableBody>
      </Table>
    </TableContainer>
  )
  // <CustomTable columns={columns} generateRows={generateRows} />;
};

export default MedicinesTable;
