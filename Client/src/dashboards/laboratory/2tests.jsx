import React, { useState, useEffect } from 'react';


import {
    Grid2 as Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TextField,
    TablePagination
} from '@mui/material/';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material//Card';
import CardContent from '@mui/material//CardContent';
import { Delete, Edit } from '@mui/icons-material';
import { SideBar } from '../../components/sidebar';
import { side_bar } from './utils';
import { apis } from '../../Services/commonServices';
import EditModal from './modalEdit';



export default function App() {
    const [tests, setTests] = useState([]);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [colname, setColname] = useState('');
    const fetchTests = async () => {
        const data = await apis.noTokengetRequest('/lab');
        setTests(data);
    };
    useEffect(() => {
        fetchTests();
    }, []);

    // console.log(tests)

    const handleDelete = async (id) => {
        console.log(id);
        const status = await apis.noTokenStatusDeleteRequest('/lab', id);
        if (status === 200) {
            setTests(tests.filter((m) => m._id !== id))
        }
    };

    const handleOpenEditModal = (medicine, column) => {
        setSelectedMedicine(medicine);
        // console.log("MName", medicine, "Column:", column);
        setColname(column);
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    };
    const arr = ["Test Name", "Price", "Required Details", "Normal Range", "Timings", "Delete"];
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (event, newValue) => {
        // console.log(tests);
        setSearchValue(newValue ? newValue : '');
    };

    const handleMe = () => {
        console.log(tests);
    }

    const rowsPerPageOptions = [7];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        //   console.log(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    return (

        <SideBar arr={side_bar}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Card className="partition">
                        <CardContent>
                            <Autocomplete
                                freeSolo
                                options={tests && tests.map((option) => option.name)}
                                onChange={handleSearch}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label='Search by Test'
                                        margin='normal'
                                        variant='outlined'
                                    />
                                )}
                            />
                            <TableContainer >
                                <Table size="small" sx={{ minWidth: 100 }}>
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
                                        {tests && tests.filter((m) => m.name.toLowerCase().includes(searchValue.toLowerCase())).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((m) => (
                                            <TableRow key={m._id}>
                                                <TableCell>{m.name}</TableCell>
                                                <TableCell>{m.price} <IconButton

                                                    onClick={() => handleOpenEditModal(m, 'price')}
                                                >
                                                    <Edit />
                                                </IconButton></TableCell>

                                                <TableCell>{m.pat_details}  <IconButton

                                                    onClick={() => handleOpenEditModal(m, 'pat_details')}
                                                >
                                                    <Edit />
                                                </IconButton></TableCell>
                                                <TableCell>{m.normal} <IconButton

                                                    onClick={() => handleOpenEditModal(m, 'normal')}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                </TableCell>

                                                <TableCell>
                                                    <Grid container spacing ={1}>
                                                        <Grid container direction='column' spacing={1}>
                                                            {m.timing.map((t,index) => (
                                                                <Grid>
                                                                    {index+1+'. '+t}
                                                                </Grid>
                                                            ))}
                                                        </Grid> 
                                                        <Grid>
                                                            <IconButton onClick={() => handleOpenEditModal(m, 'timing')}>
                                                                <Edit />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                </TableCell>

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
                                <TablePagination
                                    rowsPerPageOptions={rowsPerPageOptions}
                                    component="div"
                                    count={tests && tests.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                                {selectedMedicine && (
                                    <EditModal
                                        open={openEditModal}
                                        column={colname}
                                        handleClose={handleCloseEditModal}
                                        test={selectedMedicine}
                                    />
                                )}
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </SideBar >

    );
}
