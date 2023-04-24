import React from 'react';
import NavBar from '../../components/Navbar';
import SideBar from '../../components/sidebar';
import Box from '@material-ui/core/Box';


const  arr=[
  {label:'New Medicine',path:'/newmedicine',icon:'AddBox'},
  {label:'Medicine List',path:'/medicine',icon: 'TableChart'},
  {label:'Patients',path:'/medpatients',icon:'AccountBox'},
  ]
const PageLayout = ({children}) => {
  
  return (
    <>
      <NavBar name="Pharmacy" />
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
