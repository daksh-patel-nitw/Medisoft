import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material//CardContent';
import TextField from '@mui/material//TextField';
import Button from '@mui/material//Button';
import { SideBar } from '../../components/sidebar';
import { apis } from '../../Services/commonServices';
import Autocomplete from '@mui/material/Autocomplete';
import { sidebar_utils } from './utils';
import { toast } from 'react-toastify';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { setTests, getTests } from '../../redux/slices/doctorPrescriptionSlice';
import { EditModal } from './modalEdit';
import { MedicneUI, TestUI } from './utils';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const initialState = { _id: '', medicines: [], tests: [] }

export default function App() {
  const doctorId = "E0000003";
  const [openModal, setOpenEditModal] = useState(false);
  const [Ap, setAp] = useState(initialState);
  const [column, setCol] = useState('');
  const dispatch = useDispatch();
  const tests = useSelector(getTests);

  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    fetchTest();
    fetchData();
  }, []);

  const closeEditModal = () => {
    setOpenEditModal(false);
  };

  const openEditModal = (index) => {
    setCol(index === 0 ? 'medicines' : 'tests');
    setOpenEditModal(true);
  };

  //Fetching all the lab tests as the records are at most 100
  const fetchTest = async () => {
    if (tests.length === 0) {
      const data3 = await apis.noTokengetRequest('/lab/dScreen');
      dispatch(setTests(data3));
    }
  }

  const handleDelete = (value, column) => {
    setAp((prevAp) => ({
      ...prevAp,
      [column]: prevAp[column].filter((item) => item._id !== value),
    }));
  };

  //Getting all Patients to set up the autocomplete.
  const [patients, setPatients] = useState([]);

  //Selected Patient
  const [activePat, setActive] = useState({ pid: '', mobile:'', pname: '' });

  //Getting the info of the selected patient
  const [appointment, setAppointment] = useState([]);

  //Showing the Patient panel
  const [showPatient, setShowPatient] = useState(false);

  const fetchData = async () => {
    const data = await apis.noTokengetRequest("appointment/ipd/" + doctorId);
    console.log(data);
    setPatients(data);
  }

  const handle2Search = (newValue) => {
    if (newValue) {
      setActive(newValue);
      setAp({ ...Ap, _id: newValue._id });
      console.log(newValue._id);
    } else {
      setActive({ pid: '',mobile:'', pname: '' });
    }
  };

  const autoCompHeader = (label, property) => (
    <Grid size={{ xs: 12 }}>
      <Autocomplete
        options={patients}
        getOptionLabel={(option) => option[property]}
        onChange={(event, newValue) => handle2Search(newValue)}
        value={activePat}
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
    </Grid>
  );

  const getAppointment = async () => {
    if (activePat.pid === '') {
      toast.error('Please select a patient');
      return;
    }
    const data = await apis.noTokengetRequest("appointment/ipd/" + doctorId + "/" + activePat.pid);
    console.log(data);
    if (data) {
      setAppointment(data);
      setShowPatient(true);
    }
  }

  const handleSubmit = async () => {
    console.log(Ap);
    if (Ap.medicines.length === 0 && Ap.tests.length === 0) {
      toast.error('Please select Medicine or tests');
      return;
    }
    const status = await apis.noTokenStatusPutRequest("appointment/diagnoseIPD", { ...Ap, pid: activePat.pid, doctorId });

    if (status) {
      // setActive({ pid: '', pname: '' });
      // setShowPatient(false);
      // setAppointment([]);
      await getAppointment();
      setAp({ _id: Ap._id, medicines: [], tests: [] });
    }
  }
  return (

    <SideBar arr={sidebar_utils}>
      <Grid container spacing={2}>

        {!showPatient ? <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Card className="partition" sx={{width:"60%"}}>
            <CardContent>
              <Grid container spacing={2}>
                {autoCompHeader("Patient Id", 'pid')}
                {autoCompHeader('Patient Name', 'pname')}
                {autoCompHeader('Patient Mobile', 'mobile')}
                <Grid size={{xs:12}} >
                  <Button fullWidth style={{ height:"7vh",fontSize:"1rem",fontWeight:"bold" }} onClick={getAppointment} variant="contained" color="primary">
                    Get Patient Details
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
          :
          <>
            <Grid container spacing={1} size={{ md: 5, xs: 12 }}>

              <Grid container size={{ xs: 12 }} sx={{ position: 'relative' }}>

                <Grid
                  container
                  sx={{
                    overflow: 'hidden',
                    // transition: `height ${collapsed?"1s":"0s"} ease`
                    transition: `all ${collapsed ? "0.2s" : "1s"} ease`,
                    maxHeight: collapsed ? 0 : '500px',
                    opacity: collapsed ? 0 : 1,
                    transform: collapsed ? 'scaleY(0.95)' : 'scaleY(1)',
                    transformOrigin: 'top',
                  }}
                >
                  {/* --- Your Content --- */}
                  <Grid size={{ md: 12, xs: 12 }} container spacing={1}>
                    <Grid className="ipd-name" size={{ md: 6, xs: 12 }}>
                      
                      {activePat.pname}
                      </Grid>
                    <Grid className="ipd-name" size={{ md: 6, xs: 12 }}>
                      ID: {activePat["pid"] ? activePat["pid"] : 'Not Available'}
                    </Grid>

                  </Grid>

                  <Grid size={{ md: 12, xs: 12 }} container spacing={1}>

                    <Grid className="ipd-details" size={{ md: 4, xs: 12 }}>
                      Admitted: <br />{new Date(activePat.createdAt).toLocaleDateString('en-IN', {
                        timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric'
                      })}
                    </Grid>

                    <Grid className="ipd-details" size={{ md: 4, xs: 12 }}>
                      Room no: {appointment && appointment["room"] ? appointment["room"] : 'Not Available'}
                      <br />
                      {appointment && appointment["dep"] ? appointment["dep"] : 'Not Available'}
                    </Grid>
                    <Grid className="ipd-details" size={{ md: 4, xs: 12 }}>
                      Mobile:<br/> {activePat["mobile"] ? activePat["mobile"] : 'Not Available'}
                    </Grid>

                  </Grid>
                </Grid>

                <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                  <Button
                    onClick={() => setCollapsed(!collapsed)}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      height: "24px",
                      minHeight: "24px",
                      borderRadius: 0,
                      transition: "background-color 0.3s ease, transform 0.2s",
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      }
                    }}
                  >
                    {collapsed ? <KeyboardArrowDown sx={{ fontSize: 20 }} /> : <KeyboardArrowUp sx={{ fontSize: 20 }} />}
                  </Button>
                </Grid>
              </Grid>




              <Grid size={{ xs: 12 }} >
                <Card className="partition" sx={{ height: collapsed ? "67vh" : "47vh", transition: `height ${collapsed ? "1.5s" : "0.1s"} ease` }}>
                  <Grid size={{ xs: 12 }} style={{ padding: 8, fontWeight: 'Bold', fontSize: '20px' }}>
                    Past Prescriptions
                  </Grid>
                  <hr style={{ margin: 0 }} />
                  <CardContent>
                    <Grid container spacing={1} className="scrollable-element" sx={{ height: collapsed ? "58vh" : "38vh", overflowY: "auto", transition: `height ${collapsed ? "1.5s" : "0.1s"} ease` }}>
                      {appointment && appointment.data.length ? appointment.data.map((item, i) => (

                        <Grid container size={{ xs: 12 }} key={item.date} >
                          <Grid className={i % 2 ? "ipd-date-odd" : "ipd-date-even"} size={{ xs: 3 }}>
                            {new Date(item.date.split('-').reverse().join('-')).toLocaleDateString('en-IN', {
                              timeZone: 'Asia/Kolkata',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </Grid>
                          <Grid container spacing={1} size={{ xs: 9 }}>

                            {item.medicines.length ? <Grid container spacing={1} size={{ xs: 12 }}>
                              <Grid size={{ xs: 12 }} className={i % 2 ? "ipd-detail-heading-odd" : "ipd-detail-heading-even"}>
                                Medicines:<br />
                              </Grid>
                              <Grid container spacing={1}>
                                {item.medicines.map((med) => (
                                  <>
                                    <Grid size={{ xs: 6 }} className={i % 2 ? "ipd-content-odd" : "ipd-content-even"}>
                                      {med.name}
                                    </Grid>
                                    <Grid size={{ xs: 6 }} className={i % 2 ? "ipd-content-odd" : "ipd-content-even" + " ipd-content-left"}>
                                      {med.time}
                                    </Grid>
                                  </>
                                ))}
                              </Grid>
                            </Grid> : ""}

                            {item.tests.length ? <Grid container size={{ xs: 12 }}>
                              <Grid size={{ xs: 12 }} className={i % 2 ? "ipd-detail-heading-odd" : "ipd-detail-heading-even"}>
                                Tests:
                              </Grid>
                              {item.tests.map((test) => (
                                <Grid size={{ xs: 6 }} className={i % 2 ? "ipd-content-odd" : "ipd-content-even"}>
                                  {test.name}
                                </Grid>
                              ))}
                            </Grid> : ""}

                          </Grid>

                        </Grid>

                      ))
                        : <Grid size={{ xs: 12 }} style={{ padding: 8, textAlign: "center", fontWeight: 'Bold', fontSize: '20px' }}>
                          No Prescription Available
                        </Grid>}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

            </Grid>

            <Grid container spacing={2} size={{ md: 7, xs: 12 }}>
              <MedicneUI
                Ap={Ap}
                openEditModal={openEditModal}
                handleDelete={(value) => handleDelete(value, 'medicines')}
                height1="49vh"
                height2="40vh"
              />


              <TestUI
                Ap={Ap}
                openEditModal={openEditModal}
                handleDelete={(value) => handleDelete(value, 'tests')}
                height1="23vh"
                height2="14vh"
              />
            </Grid>

            <Grid container spacing={2} size={{ xs: 12 }} sx={{ height: "8vh" }}>
              <Grid size={{ md: 5, xs: 6 }} >
                <Button
                  onClick={() => {
                    setShowPatient(false)
                    setActive({ pid: '',mobile:'', pname: '' });
                    setAppointment(null);
                    setAp(initialState);
                    setCollapsed(false);
                  }}
                  variant="contained"
                  color="primary"
                  sx={{ fontSize: "1.5rem", fontWeight: "bold", height: "100%", width: "100%" }}
                >
                  Back
                </Button>
              </Grid>
              <Grid size={{ md: 7, xs: 6 }} >
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="secondary"

                  sx={{ fontSize: "1.5rem", fontWeight: "bold", height: "100%", width: "100%" }}
                >
                  Save
                </Button>
              </Grid>

            </Grid>

          </>}
        <EditModal open={openModal} column={column} handleClose={closeEditModal} arr={column === "tests" ? Ap.tests : Ap.medicines} />
      </Grid>
    </SideBar>

  );
}
