import React from 'react';
import NavBar from '../../components/Navbar';
import SideBar from '../../components/sidebar';
import Box from '@material-ui/core/Box';


const  arr=[
  {label:'Registration',path:'/newregister',icon:'AddBox'},
  {label:'Appointments',path:'/bookappointment',icon: 'TableChart'},
  // {label:'Patients',path:'/testpatients',icon:'AccountBox'},
  ]
const PageLayout = ({children}) => {
  
  return (
    <>
      <NavBar name="Main Reception" />
      <Box height="45px" />
      <Box sx={{ display: 'flex' }}>
        <SideBar arr={arr} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </>
  );
};

export default PageLayout;
