import React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material//Grid2';
import Card from '@mui/material//Card';
import CardContent from '@mui/material//CardContent';
import Button from '@mui/material//Button';
import TextField from '@mui/material//TextField';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material//Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { sidebar_utils, MedicineTable, TestView } from './utils.jsx';
import { SideBar } from '../../components/sidebar.jsx';
import { apis } from '../../Services/commonServices.js';
import { EditModal } from './modalEdit.jsx';
import { setTests } from '../../redux/slices/doctorPrescriptionSlice.js';
import { useDispatch } from 'react-redux';


export default function App() {
  const doctorId = "E0000003"
  const [checkErr, setErr] = useState(1);
  const [openModal, setOpenEditModal] = useState(false);
  const dispatch = useDispatch();

  const [Ap, setAp] = useState([]);
  const [p, setP] = useState({});
  const [A, setA] = useState({});

  const [column, setCol] = useState('');
  //Categories data fetch
  const fetchData = async (did) => {
    try {

      //fetching the current appointment
      // appointment/dscreen/E0000003
      const data = await apis.noTokengetRequest((`appointment/dscreen/${did}`));
      console.log(data);
      setAp({ ...data, tests: [], medicines: [], notes: '' });

      //fetching the patient details
      const data2 = await apis.noTokengetByIdRequest('member/getById', data.pid);
      setP(data2);


      //fetching the Appointment data
      const data4 = await apis.noTokengetRequest(`appointment/doctor/${data.pid}/${did}`);
      console.log(data4);
      setA(data4);
      setErr(0);
    } catch (error) {
      setErr(1);
      console.log(error);
    }
  };

  //Fetching all the lab tests as the records are at most 100
  const fetchTest = async () => {
    const data3 = await apis.noTokengetRequest('/lab/dScreen');
    dispatch(setTests(data3));
  }

  const closeEditModal = () => {
    setOpenEditModal(false);
  };

  const openEditModal = (index) => {
    setCol(index === 0 ? 'medicines' : 'tests');
    setOpenEditModal(true);
  };

  //Initialization
  useEffect(() => {
    //doctorId
    fetchData(doctorId);

    fetchTest();
  }, []);



  const handleSubmit = async () => {
    const updated = {
      _id: Ap._id,
      // Removing 'name' & 'ps' to save api load money
      medicines: Ap.medicines.map(({ name, ps, ...rest }) => rest),
      tests: Ap.tests,
      notes: Ap.notes
    };

    console.log(updated);
    const status = await apis.noTokenStatusPutRequest("appointment/diagnose", updated);
    if (status === 200) {
      fetchData(doctorId);
    }
  };


  const handleN = (event) => {
    setAp({ ...Ap, notes: event.target.value });
  };

  const handleDelete = (value, column) => {
    setAp((prevAp) => ({
      ...prevAp,
      [column]: prevAp[column].filter((item) => item._id !== value),
    }));
  };

  return (

    <SideBar arr={sidebar_utils}>
      <Grid container spacing={2}>
        {checkErr ?
          <Grid size={{ xs: 12 }} style={{ textAlign: 'center' }}>
            <h1>No More Patients</h1>
          </Grid> :
          <>

            <Grid container direction="column" spacing={2} size={{ md: 4, xs: 12 }}>

              {/* Previous Appointments UI */}
              <Grid size={{ xs: 12 }}>
                <Card className="partition" >
                  <CardContent sx={{ height: "48vh", overflowY: "scroll" }}>
                    {
                      A.length ? A.map(e => (
                        <Accordion spacing={1} style={{ marginBottom: 10 }}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <h2>{(new Date(e.discharge_date)).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric' })}</h2>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid container spacing={1}>

                              <Grid style={{ fontSize:20 }} size={{ xs: 12 }}>
                                Medicines:
                              </Grid>

                              {e.medicines.map((m, i) => (<Grid

                                container spacing={1} size={{ xs: 12 }}>
                                <Grid
                                  style={{ padding: 4, borderRadius: 2, backgroundColor: i % 2 ? "rgb(255, 211, 123)" : "rgb(88, 250, 174)", fontWeight: "bold" }}
                                  size={{ xs: 6 }} >
                                  {m.mname}
                                </Grid>
                                <Grid container spacing={1} size={{ xs: 6 }} >
                                  {m.time.split(',').map((t) => (

                                    <Grid size={{ xs: 12 }} style={{ padding: 4, borderRadius: 2, backgroundColor: i % 2 ? "rgb(255, 211, 123)" : "rgb(88, 250, 174)", fontWeight: "bold" }}>{t}</Grid>
                                  ))}
                                </Grid>
                              </Grid>
                              ))}



                              <Grid size={{ xs: 12 }}>Tests:</Grid>
                              {
                                e.tests.map(t => (
                                  <Grid size={{ xs: 6 }} style={{ padding: 4, borderRadius: 2, backgroundColor: "rgb(255, 137, 192)", fontWeight: "bold" }}>{t.tname}</Grid>
                                ))
                              }
                            </Grid>
                          </AccordionDetails>
                        </Accordion>

                      )) : <Grid container justifyContent="center" >
                        <h2>No Previous Appointments</h2>
                      </Grid>

                    }
                  </CardContent>
                </Card>
              </Grid>

              {/* Lab Tests UI*/}
              <Grid size={{ xs: 12 }}>
                <Card className="partition" style={{ height: "34vh" }}>
                  <Grid container size={{ xs: 12 }}>
                    <Grid size={{ xs: 6 }} style={{ padding: 8, fontWeight: 'Bold', fontSize: '20px' }}>
                      Lab Tests:
                    </Grid>
                    <Grid size={{ xs: 6 }} container>
                      <Button
                        onClick={() => openEditModal(1)}
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ height: '100%', borderRadius: 0 }}
                      >
                        Add Test
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <hr style={{ margin: 0 }} />
                    </Grid>
                  </Grid>

                  <CardContent style={{ paddingTop: '9px' }}>
                    <Grid container justify="center" xs={12}>
                      <TestView height="24vh" tests={Ap.tests} handleDelete={(value) => handleDelete(value, 'tests')} />
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>



            </Grid>


            <Grid container spacing={2} size={{ md: 5, xs: 12 }}>

              {/* Medicine Tests UI*/}
              <Grid size={{ xs: 12 }}>
                <Card className="partition" style={{ height: "84vh" }}>


                  <Grid container size={{ xs: 12 }}>
                    <Grid size={{ xs: 6 }} style={{ padding: 8, fontWeight: 'Bold', fontSize: '20px' }}>
                      Medicines:
                    </Grid>
                    <Grid size={{ xs: 6 }} container>
                      <Button
                        onClick={() => openEditModal(0)}
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ height: '100%', borderRadius: 0 }}
                      >
                        Add Medicine
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <hr style={{ margin: 0 }} />
                    </Grid>
                  </Grid>

                  <CardContent style={{ paddingTop: '9px' }}>
                    <Grid container justify="center" xs={12}>
                      <MedicineTable
                        medicines={Ap.medicines}
                        handleDelete={(value) => handleDelete(value, 'medicines')}
                        height="72vh"
                      />
                    </Grid>
                  </CardContent>

                </Card>
              </Grid>



            </Grid>

            <Grid container spacing={2} size={{ md: 3, xs: 12 }}>

              <Grid size={{ xs: 12 }}>
                <Card className="partition" style={{ height: "47vh" }} >

                  <CardContent>

                    <div><h2>{Ap.pname}</h2></div>
                    <div style={{ fontSize: '16px' }}><b>Height:</b> {Ap.height}cm</div>
                    <div style={{ fontSize: '16px' }}><b>Weight:</b> {Ap.weight}Kg</div>
                    <div style={{ fontSize: '16px' }}><b>Allergy:</b> {p.allergy}</div>
                    <div style={{ fontSize: '16px' }}><b>Medical Conditions:</b> {p.conditions}</div>
                    <div style={{ fontSize: '16px' }}><b>Others:</b> {p.others}</div>
                    <div style={{ fontSize: '16px' }}><b>Doctor questions:</b>
                      {Ap.selected_doctor_qs && Ap.selected_doctor_qs.split("").map((item, index) => (
                        item === '1' &&

                        <span key={index} style={{ padding: 4, borderRadius: 2, backgroundColor: "rgb(255, 137, 192)", fontWeight: "bold" }}>
                          {Ap.doctor_qs[index]}
                        </span>

                      ))}</div>
                  </CardContent>

                </Card>
              </Grid>

              {/* Notes UI */}
              <Grid size={{ xs: 12 }}>
                <Card className="partition">
                  <CardContent>

                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Enter Notes"
                      value={Ap.notes}
                      onChange={handleN}

                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  sx={{ height: "10vh" }}
                  fullWidth
                  variant="contained"
                  size="Large"
                  color="secondary"
                  onClick={handleSubmit}>
                  <h1>Next</h1>
                </Button>
              </Grid>

            </Grid>




          </>
        }

        <EditModal open={openModal} column={column} handleClose={closeEditModal} arr={column==="tests"?Ap.tests:Ap.medicines} />
      </Grid >
    </SideBar >

  );
}