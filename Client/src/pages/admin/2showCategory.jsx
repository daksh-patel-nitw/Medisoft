import React from 'react';
import { useState,useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PageLayout from './pageLayout';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
    TablePagination,
} from '@material-ui/core';

export default function App()
{
  const [emp,setEmp]=useState([]);
  const panel=['opd1','opd2','pharmacy','lab','doctor','ipd','bill','admin','']  

  //fetch all employees
  const fetchEmps = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getAllLogin');
      const data = await response.json();
      console.log(data)
      setEmp(data);
    } catch (error) {
      console.log(error);
    }
  };

  //Initialization
  useEffect(() => {
    fetchEmps();
  }, []);
  
  const handleSearch = (newValue) =>
    {
        if (newValue) {
            setFilter(
                emp.filter((m) =>
                  m['type'].toLowerCase().includes(newValue.toLowerCase())
                )   )    
        }
        else {
            setFilter([]);
        }
    };
    const autocomp = () => (
      <Autocomplete
        options={panel}
        onChange={(event, newValue) => handleSearch(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Filter with Type'
            margin="normal"
            variant="outlined"
          />
        )}
      />
    );
    const [filtered,setFilter]=useState([]);
    const rowsPerPageOptions = [5,7];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

    const deleteT=async(id)=>{
        
        await fetch(`http://localhost:5000/api/deleteLogin/${id}`)
              .then((res) => res.json())
              .then((data) => { console.log(data); 
                })
              .catch((err) => console.error(err));
                // console.log(emp.filter(e=>e._id!==id));
        setEmp(emp.filter(e=>e._id!==id));
              
      }
      return (
        <PageLayout>
          <Grid container spacing={2} style={{height:'500px'}}>
            <Grid item xs={12}>
              <Card className="partition" style={{width:'700px',margin:'auto'}}>
                <CardContent>
                  <Grid container spacing={2}>
                  <Grid item xs={4}>
                  {autocomp()}
                  </Grid>
                  <Grid item xs={12}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead style={{ backgroundColor: '#1F3F49' }}>
                        <TableRow>
                          <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Employee ID</TableCell>
                          <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Panel</TableCell>
                          <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                          <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {emp && (filtered.length ? filtered : emp)
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((e, index) => (
                          <TableRow key={index}>
                            <TableCell>{e.uname}</TableCell>
                            <TableCell>{e.type}</TableCell>
                            <TableCell>{e.dep}</TableCell>
                            <TableCell>
                              <Button onClick={() => deleteT(e._id)} variant="contained" color="primary">
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={rowsPerPageOptions}
                      component="div"
                      count={emp && emp.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                  </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </PageLayout>
      );
      
}
