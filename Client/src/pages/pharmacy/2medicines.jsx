import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import
{
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TextField
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Delete, Edit } from '@material-ui/icons';
import PageLayout from './pageLayout';
import EditModal from './modalEdit';

const useStyles = makeStyles({
    table: {
        minWidth: 100,
    },
});


export default function App()
{
    const [medicines, setMedicines] = useState([]);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [colname, setColname] = useState('');
    useEffect(() =>
    {
        fetch('http://localhost:5000/api/allmedicines')
            .then((res) => res.json())
            .then((data) => { console.log(data); setMedicines(data) })
            .catch((err) => console.error(err));
    }, []);


    const classes = useStyles();
    const handleDelete = async (id) =>
    {
        console.log(id);
        await fetch(`http://localhost:5000/api/deletemedicine/${id}`, {
            method: 'DELETE'
        })
            .then((res) => res.json())
            .then((data) => { console.log(data); setMedicines(medicines.filter((m) => m._id !== id)) })
            .catch((err) => console.error(err));

    };

    const handleEdit = (id, updatedMedicine, column) =>
    {
        console.log(id);
        setMedicines((prevMedicines) => prevMedicines.map((m) =>
        {
            if (m._id === id) {
                return { ...m, [column]: updatedMedicine };
            }
            return m;
        }));
    };

    const handleOpenEditModal = (medicine, column) =>
    {
        setSelectedMedicine(medicine);
        console.log("MName", medicine, "Column:", column);
        setColname(column);
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () =>
    {
        setOpenEditModal(false);
    };
    const arr = ["Medicine Name", "Type", "Package", "Package Available", "Free Available", "Price", "Action"];
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (event, newValue) =>
    {
        setSearchValue(newValue ? newValue : '');
    };
    return (

        <PageLayout>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card className="partition">
                        <CardContent>
                            <Autocomplete
                                freeSolo
                                options={medicines.map((option) => option.name)}
                                onChange={handleSearch}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label='Search by Medicine'
                                        margin='normal'
                                        variant='outlined'
                                    />
                                )}
                            />
                            <TableContainer >
                                <Table size="small" className={classes.table}>
                                    <TableHead style={{ backgroundColor: '#1F3F49' }}>
                                        <TableRow>
                                            {arr.map((element) => (
                                                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
                                                    {element}
                                                </TableCell>)
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {medicines.filter((m) => m.name.toLowerCase().includes(searchValue.toLowerCase())).map((m) => (
                                            <TableRow key={m._id}>
                                                <TableCell>{m.name}</TableCell>
                                                <TableCell>{m.t}</TableCell>
                                                <TableCell>{m.ps}  <IconButton

                                                    onClick={() => handleOpenEditModal(m, 'ps')}
                                                >
                                                    <Edit />
                                                </IconButton></TableCell>
                                                <TableCell>{m.ps_u} <IconButton

                                                    onClick={() => handleOpenEditModal(m, 'ps_u')}
                                                >
                                                    <Edit />
                                                </IconButton></TableCell>
                                                <TableCell>{m.ps_c + (m.ps_u * m.ps)}</TableCell>
                                                <TableCell>{m.price} <IconButton

                                                    onClick={() => handleOpenEditModal(m, 'price')}
                                                >
                                                    <Edit />
                                                </IconButton></TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() =>
                                                            handleDelete(m._id)
                                                        }
                                                    >
                                                        <Delete />
                                                    </IconButton>

                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {selectedMedicine && (
                                    <EditModal
                                        open={openEditModal}
                                        column={colname}
                                        handleClose={handleCloseEditModal}
                                        handleEdit={handleEdit}
                                        medicine={selectedMedicine}
                                    />
                                )}
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </PageLayout>

    );
}
