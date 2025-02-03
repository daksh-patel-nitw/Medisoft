import App from "../dashboards/pharmacy/1newMedicine";
import P2 from "../dashboards/pharmacy/2medicines";
import P3 from "../dashboards/pharmacy/3patients";
/*
import I1 from "./pages/ipd-reception/1newRoom";
import I2 from "./pages/ipd-reception/2RegisterPatients";
import I3 from "./pages/ipd-reception/3.1Patients";
import I4 from "./pages/ipd-reception/4AddCharge";

import OP1 from "./pages/opd-1-reception/1newRegister";
import OP2 from "./pages/opd-1-reception/2bookAppointment";

import OOp1 from "./pages/opd-2-reception/1confirmP";

import D1 from "./pages/doctor/1dstats";
import D2 from "./pages/doctor/2.patDoc";
import D3 from "./pages/doctor/3myapps";

import T1 from "./pages/lab/1newtest";
import T2 from "./pages/lab/2tests";
import T3 from "./pages/lab/3patients";

import A1 from "./pages/admin/1newAdmin";
import A2 from "./pages/admin/2showCategory";

import B1 from "./pages/billDesk/1billshow";

import Pat1 from "./pages/patient/1view";
import Pat2 from "./pages/patient/patientBookApp";

import L from "./pages/login";

import Queue from "./pages/queueScreen";
*/
const routes = [
  // { path: "/newmedicine", element: <P1 /> },
  { path: "/", element: <App /> },
  { path: "/medicine", element: <P2 /> },
  { path: "/medpatients", element: <P3 /> },
  /*// IPD
  { path: "/newroom", element: <I1 /> },
  { path: "/ipdnewpatient", element: <I2 /> },
  { path: "/testpatients", element: <I3 /> },
  { path: "/addipdcharge", element: <I4 /> },
  // OPD-1
  { path: "/newregister", element: <OP1 /> },
  { path: "/bookappointment", element: <OP2 /> },
  // OPD-2
  { path: "/confirmpatient", element: <OOp1 /> },
  // Queue
  { path: "/queue/:dep", element: <Queue /> },
  // Doctor
  { path: "/doctorappointments", element: <D3 /> },
  { path: "/doctorstats", element: <D1 /> },
  { path: "/doctoropdpatient", element: <D2 /> },
  // Lab
  { path: "/newtest", element: <T1 /> },
  { path: "/tests", element: <T2 /> },
  { path: "/labpatients", element: <T3 /> },
  // Login
  { path: "/", element: <L /> },
  // Admin
  { path: "/admin", element: <A1 /> },
  { path: "/viewemps", element: <A2 /> },
  // Bill
  { path: "/bill", element: <B1 /> },
  // Patients
  { path: "/patientView", element: <Pat1 /> },
  { path: "/patientBook", element: <Pat2 /> }, */
];

export default routes;
