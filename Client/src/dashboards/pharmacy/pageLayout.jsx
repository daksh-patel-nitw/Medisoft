import React, { memo } from 'react';
import SideBar from '../../components/sidebar';


const arr = [
  { label: 'New Medicine', path: '/', icon: 'AddBox' },
  { label: 'Medicine List', path: '/medicine', icon: 'TableChart' },
  { label: 'Patients', path: '/medpatients', icon: 'AccountBox' },
];


const PageLayout = ({ children }) => {

  return (
    (
      console.log('page layout'),
      <SideBar arr={arr} >

        {children}
      </SideBar>


    )
  );
};

export default PageLayout;