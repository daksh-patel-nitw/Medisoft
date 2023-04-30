import React,{useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/Navbar';
import SideBar from '../../components/sidebar';
import Box from '@material-ui/core/Box';

const arr=[
  {label:'New Test',path:'/newtest',icon:'AddBox'},
  {label:'Test List',path:'/tests',icon: 'TableChart'},
  {label:'Patients',path:'/labpatients',icon:'AccountBox'},
];

const PageLayout = ({children}) => {
  const navigate = useNavigate();
  const [checkLoad,setLoad]=useState(false);

  useEffect(() => {
    const handleLoad = async () => {
      const getType = await localStorage.getItem('type');
  
      if (getType !== 'lab') {
        navigate('/');
      } else {
        setLoad(true);
      }
    }

    handleLoad();
  }, [navigate]);

  return (
    checkLoad && <>
      <NavBar name="Laboratory" />
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
