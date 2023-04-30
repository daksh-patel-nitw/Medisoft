import React from "react";
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import P1 from "./pages/pharmacy/1newMedicine"
import P2 from "./pages/pharmacy/2medicines"
import P3 from "./pages/pharmacy/3patients"
import I1 from "./pages/ipd-reception/1newRoom"
import I2 from "./pages/ipd-reception/2RegisterPatients"
import I3 from "./pages/ipd-reception/3.1Patients"
import I4 from "./pages/ipd-reception/4AddCharge"
import OP1 from "./pages/opd-1-reception/1newRegister"
import OP2 from "./pages/opd-1-reception/2bookAppointment"
import OOp1 from "./pages/opd-2-reception/1confirmP"
import Queue from "./pages/queueScreen"
import D1 from "./pages/doctor/1dstats"
import D2 from "./pages/doctor/2.patDoc"
import D3 from "./pages/doctor/3myapps"
import T1 from './pages/lab/1newtest'
import T2 from './pages/lab/2tests'
import T3 from './pages/lab/3patients'
import L from './pages/login'
import A1 from './pages/admin/1newAdmin'
import A2 from './pages/admin/2showCategory'
import B1 from './pages/billDesk/1billshow'
import Pat1 from './pages/patient/1view'


function App() {
  const arr2=[<P1/>,
  <P2/>,
  <P3/>,
  //IPD
  <I1 />,
  <I2 />,
  <I3 />,
  <I4 />,
  //OPD-1
  <OP1/>,
  <OP2/>,
  //OPD-2
  <OOp1/>,
  //Queue
  <Queue/>,
  //doctor
  <D3/>,
  <D1/>,
  <D2/>,
  //lab
  <T1/>,
  <T2/>,
  <T3/>,
  //login,
  <L/>,
  //Admin,
  <A1/>,
  <A2/>,
  //bill
  <B1/>,
  //patient,
  <Pat1/>,
  ]
  const arr1=['/newmedicine',
  "/medicine",
  "/medpatients",
  //IPD
  '/newroom',
  '/ipdnewpatient',
  '/testpatients',
  '/addipdcharge',
  //OPD-1
  '/newregister',
  '/bookappointment',
  //OPD-2
  '/confirmpatient',
  //Queue
  '/queue/:dep',
  //doctor
  '/doctorappointments',
  '/doctorstats',
  '/doctoropdpatient',
  //tests
  '/newtest',
  '/tests',
  '/labpatients',
  //login,
  '/',
  //admin,
  '/admin',
  '/viewemps',
  //bill,
  '/bill',
  //patients,
  '/patientView',

]
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
            {arr1.map((element,index)=>(
              <Route key={element} path={element} exact element={arr2[index]} />
              
            ))}
        </Routes>
      </BrowserRouter>
      

    </div>
  );
}

export default App;
