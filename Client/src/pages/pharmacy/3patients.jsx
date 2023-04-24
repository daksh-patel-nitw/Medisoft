import React, { useState } from 'react';
import
{
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PageLayout from './pageLayout';

export default function App()
{
    const [medicines, setMedicines] = useState([
        {
            id: 1,
            name: 'Medicine 1',
            pid: 'P00001',
            did: "D00010",
            aid: "eshdkikwiokqmj",
            quantity: 10,
            unit: 'mg',
            price: 20.0,
        },
        {
            id: 2,
            name: 'Medicine 2',
            pid: 'P00301',
            did: "D00010",
            aid: "thurkedxwiokqm",
            quantity: 1,
            unit: 'tablet',
            price: 70.0,
        },
        {
            id: 3,
            name: 'Medicine 3',
            pid: 'P00401',
            did: "D00010",
            aid: "uidnehktbvhska",
            quantity: 1,
            unit: 'unit',
            price: 100.0,
        },
    ]);

    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (event, newValue) =>
    {
        if (newValue) {
            setSearchValue(newValue);
        }
        else {
            setSearchValue('');
        }
    };

    return (

        <PageLayout>
            <Grid container spacing={2}>
                <Grid item spacing={2} xs={12}>
                    <Card className="partition">
                        <CardContent>
                            <Grid spacing={2} xs={8}>
                                <Autocomplete
                                    freeSolo
                                    options={medicines.map((option) => option.pid)}
                                    onChange={handleSearch}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label='Search by Patient id'
                                            margin='normal'
                                            variant='outlined'

                                        />
                                    )}
                                />
                            </Grid>
                            <TableContainer >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Medicine Name</TableCell>
                                            <TableCell>PatientId</TableCell>
                                            <TableCell>AppointmentId</TableCell>
                                            <TableCell>DoctorId</TableCell>
                                            <TableCell>Units Required</TableCell>
                                            <TableCell>Unit</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {medicines.filter((m) => m.pid.toLowerCase().includes(searchValue.toLowerCase())).map((m) => (
                                            <TableRow key={m.id}>
                                                <TableCell>{m.name}</TableCell>
                                                <TableCell>{m.pid}</TableCell>
                                                <TableCell>{m.aid}</TableCell>
                                                <TableCell>{m.did}</TableCell>
                                                <TableCell>{m.quantity}</TableCell>
                                                <TableCell>{m.unit}</TableCell>
                                                <TableCell>{m.price}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                    >
                                                        Bill
                                                    </Button>
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </PageLayout>

    );
}
