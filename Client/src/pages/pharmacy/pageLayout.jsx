import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import SideBar from '../../components/sidebar';


const arr = [
  { label: 'New Medicine', path: '/', icon: 'AddBox' },
  { label: 'Medicine List', path: '/medicine', icon: 'TableChart' },
  { label: 'Patients', path: '/medpatients', icon: 'AccountBox' },
];

const PageLayout = ({ children }) => {
  const [checkLoad, setLoad] = useState(true);

  return (
    checkLoad && (
    
    <SideBar arr={arr} >
          
            {children}
          </SideBar>
          
        
    )
  );
};

export default PageLayout;