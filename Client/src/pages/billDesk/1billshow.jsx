import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import React, { useState,useEffect } from 'react';
import TableSortLabel from '@material-ui/core/TableSortLabel';
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
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PageLayout from './pageLayout';


import Autocomplete from '@material-ui/lab/Autocomplete';
export default function App()
{

    const arr2 = ["Patient ID","Date","Type", "Price","Action"];

   

    const fetchdata=async()=>await fetch(`http://localhost:5000/api/getallBills`)
          .then((res) => res.json())
          .then((data) => { console.log(data); 
            setBill(data)
            })
          .catch((err) => console.error(err));

    const[bill,setBill]=useState([]);
  
    useEffect(() => {
        fetchdata();
    },[]);

    const [filtered,setFilter]=useState([]);
   
     const handleSearch = (newValue, property) => {
        if (newValue) {
          setFilter(
             bill[value].filter((m) =>
              m[property].toLowerCase().includes(newValue.toLowerCase())
            )
          );
        } else {   
          setFilter([]);
          
        }
      };
    
    const autoComp = (property, label) => (
        <Grid item xs={4}>
          <Autocomplete
            freeSolo
            options={bill[value]&&bill[value].map((option) => option[property])}
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
    
     
    //Check Tabs 
  const [value, setValue] = useState(0);
    
  //Track tabs value
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    console.log("value",value);
    
    setFilter([]);
  }, [value]);

  const confirmT=async(description)=>{
    var newWindow = window.open("", "Description", "width=500,height=500");
    newWindow.document.body.innerHTML = description;
  }
  

  
  const rowsPerPageOptions = [5,7];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const[id_,getId]=useState();
;


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
    return (

        <PageLayout>
            <Card className="partition">
        <Grid container spacing={2}>
                <Grid item xs={12}>
                <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange}
              aria-label="disabled tabs example"
            >
              <Tab label="Pending Bills" />
              <Tab label="Done" />
           
            </Tabs>
                <CardContent>
                
                    <Grid container spacing={2}>
                        {autoComp('type', 'Bill Type')}
                        {autoComp('pid', 'Patient ID')}
                        <Grid item xs={12}>
                     

                            <TableContainer >
                            <Table size="small">
                                <TableHead  style={{ backgroundColor: '#1F3F49' }}>
                                    <TableRow>
                                      {arr2.map(e=>(
                                        <TableCell>
                                          {e}
                                        </TableCell>
                                      ))
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {bill[value] &&(filtered.length?filtered:bill[value]).map((e,index)=> (
                                      <TableRow>
                                        <TableCell>{e.pid}</TableCell>
                                          <TableCell>{(new Date(e.date)).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric' })} </TableCell>
                                          <TableCell>{e.type} </TableCell>
                                          <TableCell>{e.price}</TableCell>
                                          
                                        <TableCell>
                                          <Button onClick={()=>confirmT(e.description)} variant="contained" color="primary">
                                            View Details
                                          </Button>
                                         
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                           
                            <TablePagination
                            rowsPerPageOptions={rowsPerPageOptions}
                            component="div"
                            count={bill[value]&& bill[value].length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                            </TableContainer>

                        </Grid>
                    </Grid>
                    </CardContent>
                    <CardContent>
                    
                
                </CardContent>
                </Grid>
        </Grid>
        </Card>
      </PageLayout>
    
    );
}
