// import P1 from "../dashboards/1pharmacy/tabs/tab1/1newMedicine.jsx";
// import P2 from "../dashboards/1pharmacy/tabs/tab2/2medicines.jsx";
// import P3 from "../dashboards/1pharmacy/tabs/tab3/3patients";

import OP1 from "../dashboards/opd-1-reception/1newRegister";
import OP2 from "../dashboards/opd-1-reception/2bookAppointment";

// import D1 from "../dashboards/doctor/1dstats";
// import D2 from "../dashboards/doctor/2.patDoc";
import D3 from "../dashboards/doctor/3setup";

import OOp1 from "../dashboards/opd-2-reception/1confirmP";

import Queue from "../dashboards/queueScreen";

import A1 from "../dashboards/admin/1newAdmin";
import A2 from "../dashboards/admin/2showCategory";

import I1 from "../dashboards/ipd-reception/1newRoom";
import I2 from "../dashboards/ipd-reception/2RegisterPatients";
import I3 from "../dashboards/ipd-reception/3Patients";
/*
import I4 from "../dashboards/ipd-reception/4AddCharge";

import T1 from "../dashboards/lab/1newtest";
import T2 from "../dashboards/lab/2tests";
import T3 from "../dashboards/lab/3patients";


import B1 from "../dashboards/billDesk/1billshow";

import Pat1 from "../dashboards/patient/1view";
import Pat2 from "../dashboards/patient/patientBookApp";

import L from "../dashboards/login";

*/
const routes = [
  // OPD-1
  { path: "/registermember", element: <OP1 /> },
  { path: "/bookappointment", element: <OP2 /> },

  // OPD-2
  { path: "/confirmpatient", element: <OOp1 /> },

  // Queue
  { path: "/queue/:dep", element: <Queue /> },

  // Doctor Tab
  // { path: "/doctoropdpatient", element: <D2 /> },
  { path: "/doctorappointments", element: <D3 /> },


  // Admin
  { path: "/admin", element: <A1 /> },
  { path: "/viewemps", element: <A2 /> },


  // IPD
  { path: "/newroom", element: <I1 /> },
  { path: "/ipdnewpatient", element: <I2 /> },
  { path: "/testpatients", element: <I3 /> },

  // pharmacy
  // { path: "/newmedicine", element: <P1 /> },
  // { path: "/medicine", element: <P2 /> },
  // { path: "/medpatients", element: <P3 /> },

  /*// IPD
  { path: "/addipdcharge", element: <I4 /> },


  
  // Doctor
  { path: "/doctorstats", element: <D1 /> },
  

  // Lab
  { path: "/newtest", element: <T1 /> },
  { path: "/tests", element: <T2 /> },
  { path: "/labpatients", element: <T3 /> },

  // Login
  { path: "/", element: <L /> },

  
  // Bill
  { path: "/bill", element: <B1 /> },
  // Patients
  { path: "/patientView", element: <Pat1 /> },
  { path: "/patientBook", element: <Pat2 /> }, 
   */
];

export default routes;
