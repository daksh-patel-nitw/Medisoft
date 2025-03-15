import React, { useState, useEffect } from 'react';
import TableSortLabel from '@mui/material//TableSortLabel';
import Grid from '@mui/material//Grid2';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  FormControl, InputLabel, Select,
  TablePagination,
  MenuItem,
} from '@mui/material/';
import Card from '@mui/material//Card';
import CardContent from '@mui/material//CardContent';
import Autocomplete from '@mui/material/Autocomplete';

import { side_bar } from './utils.js';
import { SideBar } from '../../components/sidebar.jsx';
import { apis } from '../../Services/commonServices.js';
import { toast } from 'react-toastify';


export default function App() {

  const arr2 = ["Room No", "Floor", "Patient Id", "Patient Name", "Admit Date", "Mobile", "Doctor ID", "Department",];
  const arr = ['room_no', 'floor', 'pid', 'pname', 'createdAt', 'mobile', 'did', 'dep']

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [rooms, setRoom] = useState([]);
  const [dep, setDepart] = useState([]);
  const [autoCompData, setData] = useState({ pname: '', pid: '' });

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setRoom((prev) => prev.sort((a, b) => {
      const a_ = parseInt(a[property], 10);
      const b_ = parseInt(b[property], 10);
      if (isAsc) {
        return a_ > b_ ? 1 : -1;
      } else {
        return b_ > a_ ? 1 : -1;
      }
    }));
  };

  const fetchdata = async () => {

    const data2 = await apis.noTokengetRequest('/room');
    setRoom(data2);
    const data3 = await apis.noTokengetRequest('/member/rolesDeps/onlyDeps');
    setDepart(data3);

    console.log(data2);
    console.log(data3);
  }

  useEffect(() => {
    fetchdata();
  }, []);


  const [selectValue, setFValue] = useState('');
  const [filtered, setf] = useState('');

  const filterR = async (event) => {
    const t = event.target.value;
    console.log(t);
    setFValue(t);
    setf(rooms.filter((m) => m.dep.toLowerCase().includes(t.toLowerCase())));
  }

  const [newRooms, setr] = useState([]);



  const rowsPerPageOptions = [5, 10];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleClick = async (value) => {
    try {
      console.log(value);
      const status = await apis.noTokenStatusPostRequest('/room/discharge', { id: value });
      if (status === 200) {
        setRoom((prev) => prev.filter((m) => m._id !== value));
        setr([]);
        setf([]);
        setData({ pname: '', pid: '' });
      }
    } catch (err) {
      console.error(err);
    }

  };

  const handleSearch = (newValue, property) => {
    if (newValue) {
      const searchValue = (filtered.length || selectValue !== '' ? filtered : rooms).filter((m) =>
        m[property].toLowerCase().includes(newValue.toLowerCase())
      );

      setr(searchValue);

      if (property === 'pid' && searchValue.length > 0) {
        setData(prevData => ({
          ...prevData,
          pid: newValue,
          pname: searchValue[0]?.pname || ''
        }));
      } else {
        setData(prevData => ({
          ...prevData,
          [property]: newValue
        }));
      }
    } else {
      setData({ pid: '', pname: '' });
      setr([]);
    }
  };


  const autoComp = (property, label, index) => (
    <Grid size={{ md: 4 }} >
      <Autocomplete
        freeSolo
        options={(newRooms.length ? newRooms : filtered.length || selectValue !== '' ? filtered : rooms).map((option) => option[property])}
        onChange={(event, newValue) => handleSearch(newValue, property, index)}
        value={autoCompData[property]}
        renderInput={(params) => (
          <TextField
            {...params}
            label={`Search by ${label}`}
            margin='normal'
            variant='outlined'
          />
        )}
      />
    </Grid >
  );




  const fil = () => (
    <Grid size={{ md: 4 }}>
      <FormControl variant="outlined" sx={{ mt: 2 }} fullWidth>
        <InputLabel id="dep">
          Filter with Department
        </InputLabel>
        <Select
          label="Filter By Department"
          labelId="dep"
          key="dep"
          name="dep"
          onChange={filterR}
          value={selectValue}
        >
          <MenuItem key="select" value="">None</MenuItem>
          {dep.length > 0 &&
            dep.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Grid>
  )

  return (

    <SideBar arr={side_bar}>
      <Grid size={{ xs: 12 }} container spacing={2}>
        <Grid size={{ xs: 12 }} >
          <Card className="partition">

            <CardContent>

              <Grid container spacing={2}>
                {autoComp('pname', 'Patient Name')}

                {autoComp('pid', 'Patient ID')}

                {fil()}

              </Grid>

            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }} >
          <Card className="partition">
            <CardContent>

              <Grid size={{ xs: 12 }} >
                <TableContainer>
                  <Table size="small">
                    <TableHead style={{ backgroundColor: "#1F3F49" }}>
                      <TableRow style={{ color: "white" }}>
                        {arr2.map((m, index) =>
                          index !== 4 ? (
                            <TableCell style={{ color: "white" }}>{m}</TableCell>
                          ) : (
                            <TableCell>
                              <TableSortLabel
                                active={orderBy === arr[index]}
                                direction={orderBy === arr[index] ? order : "asc"}
                                onClick={() => handleSortRequest(arr[index])}
                                style={{ color: "white" }}
                              >
                                {m}
                              </TableSortLabel>
                            </TableCell>
                          )
                        )}<TableCell style={{ color: "white" }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(newRooms.length ? newRooms : filtered.length || selectValue !== '' ? filtered : rooms).length > 0 ? (newRooms.length ? newRooms : filtered.length || selectValue !== '' ? filtered : rooms)
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((m) => (
                          <TableRow key={m._id}>
                            {arr.map((value, index) => (
                              <TableCell>{index !== 4 ? m[value] : (new Date(m[value])).toLocaleDateString('in', 'dd/mm/yy')}</TableCell>
                            ))}
                            <TableCell>
                              <Button
                                onClick={() => handleClick(m._id)}
                                variant="contained"
                                color="primary"
                              >
                                Discharge
                              </Button>
                            </TableCell>
                          </TableRow>
                        )) :
                        <TableRow>
                          <TableCell colSpan={arr.length + 1} align="center">
                            <h2>{`No Data for ${selectValue} Department Found`}</h2>
                          </TableCell>
                        </TableRow>
                      }
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={rowsPerPageOptions}
                    component="div"
                    count={newRooms.length ? newRooms.length : filtered.length ? filtered.length : rooms.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableContainer>
              </Grid>

            </CardContent>

          </Card >
        </Grid>
      </Grid >
    </SideBar >

  );
}
