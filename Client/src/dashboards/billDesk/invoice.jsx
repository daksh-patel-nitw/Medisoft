import React from 'react';
import { Grid2, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { generateNumberFromId } from './utils';
import { Box } from "@mui/material";



export const Invoice = ({ selectedItems, aid, patient, total }) => {
    const formattedDate = new Date().toISOString().split('T')[0].split('-').reverse().join('-');

    const categories = Object.keys(selectedItems).filter(key => key !== '_id');



    return (
        <Grid2 container spacing={2} sx={{ padding: 2, border: "1px solid black" }}>
            <Grid2 size={{ xs: 12 }} container justifyContent="space-between">
                <Typography variant="h4"><strong>Medisoft HMS</strong></Typography>
                <Typography variant="h5">Invoice</Typography>
                <Box sx={{ width: "100%", height: 2, bgcolor: "black", printColorAdjust: "exact" }} />
            </Grid2>



            <Grid2 size={{ xs: 12 }} container justifyContent="space-between">
                <Typography variant="body1"><strong>Date:</strong> {formattedDate}</Typography>
                <Typography variant="body1"><strong>Patient Name: </strong>{patient.pname}</Typography>
                <Typography variant="body1"><strong>Invoice No:</strong> {generateNumberFromId(aid)}</Typography>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
            <TableContainer >
    <Table sx={{ borderCollapse: "collapse" }}>
        <TableHead>
            <TableRow>
                <TableCell sx={{ borderBottom: "1px solid black", padding: "4px" }}><strong>Description</strong></TableCell>
                <TableCell sx={{ borderBottom: "1px solid black", padding: "4px" }}><strong>Date</strong></TableCell>
                <TableCell sx={{ borderBottom: "1px solid black", padding: "4px" }}><strong>Price</strong></TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {categories.map(category => (
                selectedItems[category].map(item => (
                    <TableRow key={item._id}>
                        <TableCell sx={{  padding: "4px" }}>{item.name}</TableCell>
                        <TableCell sx={{  padding: "4px" }}>{item.date}</TableCell>
                        <TableCell sx={{  padding: "4px" }}>₹{item.price.toFixed(2)}</TableCell>
                    </TableRow>
                ))
            ))}
        </TableBody>
    </Table>
</TableContainer>

            </Grid2>

            <Grid2 size={{ xs: 12 }} textAlign="right">
                <Typography variant="h6"><strong>Total:</strong> ₹{total.toFixed(2)}</Typography>
            </Grid2>
        </Grid2>
    );
};

export default Invoice;
