import React from 'react';
import NavBar from '../../components/Navbar';
import SideBar from '../../components/sidebar';
import Box from '@material-ui/core/Box';


const  arr=[
  {label:'My Stats',path:'/doctorstats'
  ,icon:'AddBox'},
  {label:'Get Patient',path:'/doctoropdpatient'
  ,icon: 'TableChart'},
  {label:'My Appointments',path:'/doctorappointments'
  ,icon:'AccountBox'},
  ]

const PageLayout = ({children}) => {
  
  return (
    <>
      <NavBar name="Doctor" />
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
