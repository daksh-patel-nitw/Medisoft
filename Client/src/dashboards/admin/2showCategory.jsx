import React from 'react';
import { useState,useEffect } from 'react';
import PageLayout from './pageLayout';
import Autocomplete from '@mui/material/lab/Autocomplete';
import {
    Card,
    CardContent,  
    Tabs,
    Tab,
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
} from '@mui/material/';

export default function App()
{
  const [loginEmp,setLoginEmp]=useState([]);
  const [emp,setEmp]=useState([]);
  const panel=['opd1','opd2','pharmacy','lab','doctor','ipd','bill','admin','']  
  const [isLoading, setIsLoading] = useState(true);

  //fetch all Login with role from database
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getAllLogin');
      const data = await response.json();
      console.log(data)
      setLoginEmp(data);
    } catch (error) {
      console.log(error);
    }
  
    //fetch all employees
    try {
      const response = await fetch('http://localhost:5000/api/admingetemp');
      const data = await response.json();
      console.log(data)
      setEmp(data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  //Initialization
  useEffect(() => {
    fetchData();
  }, []);

    const handleSearch = (newValue,name,index) =>{
      if(index===0){
        if (newValue) {
          if(name){
            const t=emp.find((e)=>e[name]===newValue);
            setEmpValues({...empValues,eid:t.eid,name:t.name,dep:t.dep});
          }else{
            setEmpValues({...empValues,type:newValue})
          }           
        }
        else {
          setEmpValues({eid:'',name:'',type:'',dep:''});
        }
      }else{
        if (newValue) {

          setFilter(
              loginEmp.filter((m) =>
                m['type'].toLowerCase().includes(newValue.toLowerCase())
              )   )    
        }
        else {
            setFilter([]);
        }
      }
        
    };

    const autocomp = (index,label,name) => (
      <Autocomplete
        options={name ? emp && emp.map((option) => option[name]) : panel}
        onChange={(event, newValue) => handleSearch(newValue, name,index)}
        value={name ? empValues[name] : empValues["type"]}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
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
                // console.log(loginEmp.filter(e=>e._id!==id));
        setLoginEmp(loginEmp.filter(e=>e._id!==id));
              
      }

  // Category Form Values
  const [empValues, setEmpValues] = useState({eid:'',name:'',type:'',dep:''});
  
  //Handle Category Form Submit
  const handleEmpSubmit = async (event) =>
  {
    event.preventDefault();
    alert(JSON.stringify(empValues));
    await fetch('http://localhost:5000/api/addlogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(empValues)
    })
      .then(response => response.json())
      .then(data =>
      {
        console.log(data);
        setEmpValues({eid:'',name:'',type:'',dep:''});
      })
      .catch(error => console.error(error));
  };

   //Category Form UI
  function EmpCard(){
    return (
      <CardContent >
      <form onSubmit={handleEmpSubmit} autoComplete="off">
      <Grid container spacing={2}>
        <Grid size={{xs:4}>
          {autocomp(0,'Search Employee Id','eid')}
          </Grid>
        <Grid size={{xs:4}>
          {autocomp(0,'Search Employee','name')}
          </Grid>
        <Grid size={{xs:4}>
          {autocomp(0,'Select Panel')}
          </Grid>
        <Grid size={{xs:4}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Give Access
          </Button>
        </Grid>
      </Grid>
      </form>
    </CardContent>
    )
  }

  //Check Tabs 
  const [value, setValue] = useState(0);

  //Track tabs value
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const viewEmpUI=()=>(
    <Grid container spacing={2}>
    <Grid size={{xs:4}>
    {autocomp(1,'Filter Type')}
    </Grid>
    <Grid size={{xs:12}>
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
          {loginEmp && (filtered.length ? filtered : loginEmp)
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
        count={loginEmp && loginEmp.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
    </Grid>
    </Grid>
  )
      
  return (
        <PageLayout>
          <Grid container spacing={2}>
           
          { isLoading ? 'Loading...': 
            <Grid size={{xs:12}>
              <Card className="partition" style={{height:'530px',width:'700px',margin:'auto'}}>
              <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                aria-label="disabled tabs example"
              >
                <Tab label="Add New Role" />
                <Tab label="View Roles" />
              </Tabs>
                <CardContent>
                  {(value!==1)?EmpCard():viewEmpUI()}
                </CardContent>
              </Card>
            </Grid>
          }
          </Grid>

        </PageLayout>
      );
      
}
