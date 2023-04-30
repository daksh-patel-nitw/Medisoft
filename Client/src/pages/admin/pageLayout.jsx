
import NavBar from '../../components/Navbar';
import SideBar from '../../components/sidebar';
import Box from '@material-ui/core/Box';
import React,{useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const  arr=[
  {label:'My Stats',path:'/admin',icon:'AddBox'},
  
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
      <NavBar name="Doctor"/>
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
