
import NavBar from '../../components/Navbar';
import SideBar from '../../components/sidebar';
import Box from '@mui/material//Box';
import React,{useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const  arr=[
  {label:'All Bills',path:'/bill',icon:'AddBox'},
 
  
  ]

const PageLayout = ({children}) => {
  const navigate = useNavigate();
  const [checkLoad,setLoad]=useState(false);

  useEffect(() => {
    const handleLoad = async () => {
      const getType = await localStorage.getItem('type');
  
      if (getType !== 'bill') {
        navigate('/');
      } else {
        setLoad(true);
      }
    }

    handleLoad();
  }, [navigate]);

  return (
    checkLoad &&<>
      <NavBar name="Bill"/>
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
