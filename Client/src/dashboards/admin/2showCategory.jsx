import React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid2';
import {
  Card,
  CardContent,
  Tabs,
  Tab,
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
import { apis } from '../../Services/commonServices';
import { SideBar } from '../../components/sidebar';
import { side_bar_utils } from './side_bar';

export default function App() {
  const [loginEmp, setLoginEmp] = useState([]);
  const [emp, setEmp] = useState([]);
  const [panel, setPanel] = useState([]);
  // const panel = ['opd1', 'opd2', 'pharmacy', 'lab', 'doctor', 'ipd', 'bill', 'admin', '']
  const [isLoading, setIsLoading] = useState(true);

  //fetch all Login with role from database
  const fetchData = async () => {
    const data2 = await apis.noTokengetRequest('/member/admin')
    setEmp(data2[0]);
    setLoginEmp(data2[1]);
    setPanel(data2[2]);
    setIsLoading(false);
  };

  //Initialization
  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (newValue, name, index) => {
    if (index === 0) {
      if (newValue) {
        if (name) {
          const t = emp.find((e) => e[name] === newValue);
          setEmpValues({ ...empValues, mobile: t.mobile, eid: t.eid, name: t.name, dep: t.dep });
        } else {
          setEmpValues({ ...empValues, role: newValue })
        }
      }
      else {
        setEmpValues({ eid: '', name: '', role: '', dep: '', mobile: '' });
      }
    } else {
      if (newValue) {

        setFilter(
          loginEmp.filter((m) =>
            m['role'].toLowerCase().includes(newValue.toLowerCase())
          ))
      }
      else {
        setFilter([]);
      }
    }

  };

  const autocomp = (index, label, name) => (
    <Autocomplete
      options={name ? emp && emp.map((option) => option[name]) : panel}
      onChange={(event, newValue) => handleSearch(newValue, name, index)}
      value={name ? empValues[name] : empValues["role"]}
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

  const [filtered, setFilter] = useState([]);
  const rowsPerPageOptions = [5, 7];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //Delete Employee
  const deleteT = async (id) => {
    const result = await apis.noTokenStatusDeleteRequest("member/role", id);
  
    if (result === 200) {
      const employee = loginEmp.find(e => e.eid === id);
  
      if (employee) {
        setLoginEmp(loginEmp.filter(e => e.eid !== id));
        setEmp([...emp, employee]);
      }
    }
  };

  // Category Form Values
  const [empValues, setEmpValues] = useState({ eid: '', name: '', role: '', dep: '', mobile: '' });

  //Handle Category Form Submit
  const handleEmpSubmit = async (event) => {
    event.preventDefault();
    if(!empValues.eid || !empValues.name){
      toast.error("Please select the patient");
      return;
    }
    if(!empValues.role){
      toast.error('Please select the role');
      return;
    }

    alert(JSON.stringify(empValues));

    const result = await apis.noTokenStatusPostRequest('member/role', empValues);
    console.log(result);
    if (result === 200) {
      setLoginEmp([empValues, ...loginEmp]);
      setEmp(emp.filter((e) => e.eid != empValues['eid']));
      setEmpValues({ eid: '', name: '', role: '', dep: '', mobile: '' });
    }

  };

  //Category Form UI
  function EmpCard() {
    return (
      <CardContent >
        <form onSubmit={handleEmpSubmit} autoComplete="off">
          <Grid container spacing={2}>
            <Grid size={{ xs: 4 }}>
              {autocomp(0, 'Employee Id', 'eid')}
            </Grid>
            <Grid size={{ xs: 4 }}>
              {autocomp(0, 'Search Employee', 'name')}
            </Grid>
            <Grid size={{ xs: 4 }}>
              {autocomp(0, 'Select Panel')}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <h2>{empValues.eid}</h2>
              <h2>{empValues.name}</h2>
              <h2>{empValues.dep}</h2>
              <h2>{empValues.mobile}</h2>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Give Access
              </Button>
            </Grid>
          </Grid>
        </form >
      </CardContent >
    )
  }

  //Check Tabs 
  const [value, setValue] = useState(0);

  //Track tabs value
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const viewEmpUI = () => (
    <Grid container spacing={2}>
      <Grid size={{ xs: 4 }}>
        {autocomp(1, 'Filter By Panel')}
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TableContainer>
          <Table size="small">
            <TableHead style={{ backgroundColor: '#1F3F49' }}>
              <TableRow>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Employee ID</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Panel</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Mobile</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loginEmp && (filtered.length ? filtered : loginEmp)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((e, index) => (
                  <TableRow key={index}>
                    <TableCell>{e.name}</TableCell>
                    <TableCell>{e.role}</TableCell>
                    <TableCell>{e.mobile}</TableCell>
                    <TableCell>{e.dep}</TableCell>
                    <TableCell>
                      <Button onClick={() => deleteT(e.eid)} variant="contained" color="primary">
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
    <SideBar arr={side_bar_utils} >
      <Grid container spacing={2}>

        {isLoading ? 'Loading...' :
          <Grid size={{ xs: 12 }}>
            <Card className="partition" style={{ height: '530px', width: '700px', margin: 'auto' }}>
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
                {(value !== 1) ? EmpCard() : viewEmpUI()}
              </CardContent>
            </Card>
          </Grid>
        }
      </Grid >

    </SideBar>
  );

}
