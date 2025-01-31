
import NavBar from '../../components/Navbar';
import SideBar from '../../components/sidebar';
import Box from '@mui/material//Box';
import React,{useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const  arr=[
  {label:'Add New',path:'/admin',icon:'AddBox'},
  {label:'View All',path:'/viewemps',icon:'AddBox'},
  
  ]

const PageLayout = ({children}) => {
  const navigate = useNavigate();
  const [checkLoad,setLoad]=useState(false);

  useEffect(() => {
    const handleLoad = async () => {
      const getType = await localStorage.getItem('type');
  
      if (getType !== 'admin') {
        navigate('/');
      } else {
        setLoad(true);
      }
    }

    handleLoad();
  }, [navigate]);

  return (
    checkLoad &&<>
      <NavBar name="Admin"/>
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
