
import NavBar from '../../components/Navbar';
import SideBar from '../../components/sidebar';
import Box from '@material-ui/core/Box';
import React,{useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const  arr=[
  {label:'New Room',path:'/newroom'
  ,icon:'AddBox'},
  {label:'Register Patient',path:'/ipdnewpatient'
  ,icon: 'TableChart'},
  {label:'Patients',path:'/testpatients'
  ,icon:'AccountBox'},
  {label:'Add Charges',path:'/addipdcharge'
  ,icon:'AccountBalanceWallet'},
  ]
const PageLayout = ({children}) => {
  const navigate = useNavigate();
  const [checkLoad,setLoad]=useState(false);

  useEffect(() => {
    const handleLoad = async () => {
      const getType = await localStorage.getItem('type');
  
      if (getType !== 'ipd') {
        navigate('/');
      } else {
        setLoad(true);
      }
    }

    handleLoad();
  }, [navigate]);


  return (
    checkLoad &&<>
       <NavBar name="IPD"  />
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
