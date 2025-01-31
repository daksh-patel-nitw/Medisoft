import React, { useState,useEffect } from 'react';
import TableSortLabel from '@mui/material//TableSortLabel';
import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
    FormControl,InputLabel,Select,
    TablePagination,
} from '@mui/material/';
import Card from '@mui/material//Card';
import CardContent from '@mui/material//CardContent';
import PageLayout from './pageLayout';

import Autocomplete from '@mui/material/lab/Autocomplete';
export default function App()
{

    const arr2 = ["Room No","Floor","Patient Id", "Patient Name","Admit Date","Mobile","Doctor ID", "Department",];
    const arr=['room_no','floor','pid','pname','date','mobile','did','dep']
    
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');

    const handleSortRequest = (property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
      setRoom((prev) => prev.sort((a, b) => {
        const a_ = parseInt(a[property],10);
        const b_ = parseInt(b[property],10);
        if (isAsc) {
          return a_ > b_ ? 1 : -1;
        } else {
          return b_ > a_ ? 1 : -1;
        }
      }));
    };

    const fetchdata=async()=>await fetch(`http://localhost:5000/api/occupiedroom`)
          .then((res) => res.json())
          .then((data) => { console.log(data); 
            setRoom(data)
            })
          .catch((err) => console.error(err));
    const[rooms,setRoom]=useState([]);
    const [dep,setDepart]=useState([]);
    useEffect(() => {
      

      setDepart( [ 'orthopedic',
      'neurologist',
      'cardiologist',
      'endocrinologist',
      'gynecologist' ]);
        fetchdata();
    },[]);
    console.log(dep);
    const[selectValue,setFValue]=useState('');
    const [filtered,setf]=useState('');
    const filterR=async (event)=>{
        const t=event.target.value;
        setFValue(t);
        setf(rooms.filter((m) => m.dep.toLowerCase().includes(t.toLowerCase())));
    }

    const [newRooms,setr]=useState([]);
   
      
    
    const rowsPerPageOptions = [5,10];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
    
    
    const handleClick = (value) => {
      const dischargedata = async () => {
        try {
            console.log(value,value.room);
          const response = await fetch(`http://localhost:5000/api/dischargeipd/${value.room_no}/${value.dep}`);
          const data = await response.json();
          console.log(data);
          fetchdata();
        } catch (err) {
          console.error(err);
        }
      };
    
      dischargedata();
     
    };

     const handleSearch = (newValue, property) => {
        if (newValue) {
          setr(
            rooms.filter((m) =>
              m[property].toLowerCase().includes(newValue.toLowerCase())
            )
          );
        } else {   
          setr([]);
        }
      };
    const autoComp = (property, label) => (
        <Grid size={{xs:4}>
          <Autocomplete
            freeSolo
            options={rooms.map((option) => option[property])}
            onChange={(event, newValue) => handleSearch(newValue, property)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={`Search by ${label}`}
                margin='normal'
                variant='outlined'
              />
            )}
          />
        </Grid>
      );
      
    
    

    const fil=()=>(
        <Grid item sm={4}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="filled-age-native-simple">
            Filter with Department
          </InputLabel>
          <Select
            native
            key="cat"
            name="cat"
            label="Filter with Room Type"
            id="cat"
            onChange={filterR}
            value={selectValue}
            inputProps={{
              name: "cat",
              id: "filled-age-native-simple",
            }}
          >
            <option value="" />
            {dep.length > 0 &&
              dep.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </Select>
        </FormControl>
      </Grid>
      
    )

    return (

        <PageLayout>
            <Card className="partition">
        <Grid container spacing={2}>
                <Grid size={{xs:12}>
                <CardContent>
                
                    <Grid container spacing={2}>
                        {autoComp('pname', 'Patient Name')}
                        {autoComp('pid', 'Patient ID')}
                        <Grid size={{xs:4}>
                        {fil()}
                        </Grid>
                    </Grid>
                    </CardContent>
                    <CardContent>
                    
                <Grid size={{xs:12}>
                    <TableContainer>
                    <Table size="small">
                        <TableHead style={{ backgroundColor: "#1F3F49" }}>
                        <TableRow style={{color:"white"}}>
                            {arr2.map((m, index) =>
                            index !== 4 ? (
                                <TableCell>{m}</TableCell>
                            ) : (
                                <TableCell>
                                <TableSortLabel
                                    active={orderBy === arr[index]}
                                    direction={orderBy === arr[index] ? order : "asc"}
                                    onClick={() => handleSortRequest(arr[index])}
                                >
                                   {m}
                                </TableSortLabel>
                                </TableCell>
                            )
                            )}<TableCell>Action</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {(newRooms.length? newRooms: filtered.length? filtered: rooms)
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((m) => (
                            <TableRow key={m.id}>
                                {arr.map((value,index) => (
                                <TableCell>{index!==4?m[value]:(new Date(parseInt(m[value]))).toLocaleDateString('in','dd/mm/yy')}</TableCell> 
                                ))}
                                <TableCell>
                                <Button
                                    onClick={() => handleClick(m)}
                                    variant="contained"
                                    color="primary"
                                >
                                    Discharge
                                </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={rowsPerPageOptions}
                        component="div"
                        count={newRooms.length? newRooms.length: filtered.length? filtered.length: rooms.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    </TableContainer>
                </Grid>
                </CardContent>
                </Grid>
        </Grid>
        </Card>
      </PageLayout>
    
    );
}
