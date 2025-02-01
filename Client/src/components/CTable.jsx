import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const CustomTable = ({ columns, generateRows }) => {
  return (
    <TableContainer>
      <Table size="small" className="table">
        <TableHead style={{ backgroundColor: '#1F3F49' }}>
          <TableRow>
            {columns.map((element, index) => (
              <TableCell key={index} style={{ color: 'white', fontWeight: 'bold' }}>
                {element}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {generateRows()}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;