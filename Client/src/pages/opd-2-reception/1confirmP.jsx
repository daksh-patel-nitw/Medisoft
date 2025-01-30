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
    TextField,Button,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Delete, Edit } from '@material-ui/icons';
import PageLayout from './pageLayout';
import EditModal from './modalEdit';

 
const arr1 = ['pid','pname','mobile','dname','time','weight',"height",'doctor_qs',];
const arr2 = ["Patient ID", "Patient Name","Mobile","Doctor Name", "Time","Weight", "Height","Doctor questions"];

const initialValues = arr1.reduce(
    (obj, key) => ({ ...obj, [key]: '' }),
    {}
  );

export default function App()
{
 
  // Patient Values
  const [patValues, setPat] = useState(initialValues);
  const[pData,setD]=useState([]);
  const fetchData = async (dep) => {
    const response1 = await fetch("http://localhost:5000/api/getapp/"+dep.toString());
    const data1 = await response1.json();
    setD(data1);
  };

  useEffect(()=>{
    fetchData('orthopedic');
  },[]);
  //clear Values
  const clearValues = (valf) => {
    const newValues = {};
    Object.entries(patValues).forEach(([key, value]) => {
        newValues[key] = '';
    });
    setPat(newValues);
  };

  const [filter,setF]=useState([]);
  const handleSearch = (newValue, index) => {
    // console.log("In Handle Search",newValue,index);
    if(newValue){
      
        const s= (index===1)?'pid':'pname';
        const t=pData.find((e)=>e[s]===newValue);
        setPat({...patValues,pid:t.pid,mobile:t.mobile,pname:t.pname})
        setF(pData.filter((m) => m[index===1?'pid':'pname'].toLowerCase().includes(newValue.toLowerCase())));
    }else{
        setPat({...patValues,pid:'',mobile:'',pname:''});
        setF(pData);
    }    
  };

  const autoComp = (arrS,property, label,index) => (

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
   
  

    const handleDelete = async (id) =>
    {
        console.log(id);
        
        await fetch(`http://localhost:5000/api/deleteappointment/${id}`, {
            method: 'DELETE'
        })
            .then((res) => res.json())
            .then((data) => { console.log(data) })
            .catch((err) => console.error(err));
          setD(pData.filter(e=>e._id!==id));

    };

    const handleEdit = async(updated) =>
    {
        console.log("Updated in the 1",updated);
        setD(pData.filter(e=>e.pid!==updated.pid));

        await fetch(`http://localhost:5000/api/updatecapp`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updated)
        })
        .then(res => res.json())
        .then(data =>{console.log("Updated data",data)})
        .catch(err => console.error(err));
    };

    const handleOpenEditModal = (app) =>
    {
        setSelectedApp(app);
        console.log("MName", app);
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () =>
    {
        setOpenEditModal(false);
    };
   

    const getTable=()=>{
        return(
        <TableContainer>
        <Table size="small">
          <TableHead style={{ backgroundColor: "#1F3F49" }}>
            <TableRow>
              {arr1.map((element,index) => (
                index<5 && <TableCell style={{ color: "white", fontWeight: "bold" }}>
                  {element}
                </TableCell>
              ))}
              <TableCell  style={{ color: "white", fontWeight: "bold" }}>Confirm</TableCell>
              <TableCell  style={{ color: "white", fontWeight: "bold" }}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(filter.length?filter:pData)
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
    <PageLayout>
      <Grid container spacing={2} >
        <Grid item  xs={12}>
          <Card className="partition" style={{height:500}}>
            <CardContent>
              <Grid container spacing={2}>
              <Grid item xs={6}> {autoComp(pData,'pid',"Patient ID",1)}</Grid>
              <Grid item xs={6}> {autoComp(pData,'pname',"Patient Name",0)}</Grid>
              
              <Grid item xs={12}>{getTable()}</Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageLayout>

  );
}
