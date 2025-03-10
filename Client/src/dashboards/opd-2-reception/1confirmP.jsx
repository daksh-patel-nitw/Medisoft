import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Button,
} from '@mui/material/';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material//CardContent';
import { SideBar } from "../../components/sidebar.jsx";
import EditModal from './modalEdit';
import { arr } from './pageLayout';
import { Delete } from '@mui/icons-material';
import { apis } from '../../Services/commonServices.js';


const arr1 = ['pid', 'pname', 'mobile', 'dname', 'time', 'weight', "height", 'doctor_qs',];
const arr2 = ["Patient ID", "Patient Name", "Mobile", "Doctor Name", "Time", "Weight", "Height", "Doctor questions"];

const initialValues = arr1.reduce(
  (obj, key) => ({ ...obj, [key]: '' }),
  {}
);

export default function App() {

  // Patient Values
  const [patValues, setPat] = useState(initialValues);
  const [pData, setD] = useState([]);

  const fetchData = async (dep) => {
    const data = await apis.noTokengetRequest(`/appointment/getapp/${dep}`);
    setD(data);
  };

  useEffect(() => {
    fetchData('cardiology');
  }, []);


  //clear Values
  const clearValues = (valf) => {
    const newValues = {};
    Object.entries(patValues).forEach(([key, value]) => {
      newValues[key] = '';
    });
    setPat(newValues);
  };

  //Filters
  const [filter, setF] = useState([]);
  const handleSearch = (newValue, index) => {
    // console.log("In Handle Search",newValue,index);
    if (newValue) {

      const s = (index === 1) ? 'pid' : 'pname';
      const t = pData.find((e) => e[s] === newValue);
      setPat({ ...patValues, pid: t.pid, mobile: t.mobile, pname: t.pname })
      setF(pData.filter((m) => m[index === 1 ? 'pid' : 'pname'].toLowerCase().includes(newValue.toLowerCase())));
    } else {
      setPat({ ...patValues, pid: '', mobile: '', pname: '' });
      setF(pData);
    }
  };

  const autoComp = (arrS, property, label, index) => (

    <Autocomplete
      freeSolo
      options={arrS.map((option) => option[property])}
      onChange={(event, newValue) => handleSearch(newValue, index)}
      value={patValues[property]}
      required
      renderInput={(params) => (
        <TextField
          {...params}
          label={`Search ${label}`}
          margin='normal'
          variant='outlined'
        />
      )}
    />

  );

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);



  const handleDelete = async (id) => {
    console.log(id);
    await apis.noTokendeleteRequest('/appointment',id);
  };

  const handleEdit = async (updated) => {
    console.log("Updated in the 1", updated);
    setD(pData.filter(e => e.pid !== updated.pid));

    await apis.noTokenputRequest('/appointment', updated);
  };

  const handleOpenEditModal = (app) => {
    setSelectedApp(app);
    console.log("MName", app);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };


  const getTable = () => {
    return (
      <TableContainer>
        <Table size="small">
          <TableHead style={{ backgroundColor: "#1F3F49" }}>
            <TableRow>
              {arr2.map((element, index) => (
                index < 5 && <TableCell style={{ color: "white", fontWeight: "bold" }}>
                  {element}
                </TableCell>
              ))}
              <TableCell style={{ color: "white", fontWeight: "bold" }}>Confirm</TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(filter.length ? filter : pData)
              .map((m) => (
                <TableRow key={m._id}>
                  <TableCell>{m.pid}</TableCell>
                  <TableCell>{m.pname}</TableCell>
                  <TableCell>{m.mobile}</TableCell>
                  <TableCell>{m.dname}</TableCell>
                  <TableCell>{m.time}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleOpenEditModal(m)}>
                      Confirm
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(m._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {selectedApp && (
          <EditModal
            open={openEditModal}
            handleClose={handleCloseEditModal}
            handleEdit={handleEdit}
            appoint={selectedApp}
          />
        )}
      </TableContainer>
    )
  }

  return (
    <SideBar arr={arr}>
      <Grid container spacing={2} >
        <Grid size={{ xs: 12 }}>
          <Card className="partition" style={{ height: 500 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}> {autoComp(pData, 'pid', "Patient ID", 1)}</Grid>
                <Grid size={{ xs: 6 }}> {autoComp(pData, 'pname', "Patient Name", 0)}</Grid>

                <Grid size={{ xs: 12 }}>{getTable()}</Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SideBar>

  );
}
