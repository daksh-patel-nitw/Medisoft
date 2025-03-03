import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import SideBar from "../../../../components/sidebar.jsx";
import EditModal from './modalEdit';
import AutoComp from '../../../../components/CAutocomplete.jsx';
import MedicinesTable from './MedicinesTable';
import useMedicines from '../../hooks/useMedicines.js';

const arr = [
  { label: 'New Medicine', path: '/', icon: 'AddBox' },
  { label: 'Medicine List', path: '/medicine', icon: 'TableChart' },
  { label: 'Patients', path: '/medpatients', icon: 'AccountBox' },
];

const MedicinesPage = () => {
  const { medicines, filteredMedicines, searchValue, setSearchValue, handleDelete } = useMedicines();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [colname, setColname] = useState('');

  const handleOpenEditModal = useCallback((medicine, column) => {
    setSelectedMedicine(medicine);
    setColname(column);
    setOpenEditModal(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setOpenEditModal(false);
  }, []);

  const handleSearch = useCallback((_, newValue) => {
    setSearchValue(newValue || '');
  }, []);

  return (
    <SideBar arr={arr}>
      <ToastContainer />
      <Card className="partition">
        <CardContent>
          <AutoComp name="name" label="Search By Medicine" handleSearch={handleSearch} arr={medicines} />
          <MedicinesTable medicines={filteredMedicines} handleDelete={handleDelete} handleOpenEditModal={handleOpenEditModal} />
          {selectedMedicine && (
            <EditModal open={openEditModal} column={colname} handleClose={handleCloseEditModal} medicine={selectedMedicine} />
          )}
        </CardContent>
      </Card>
    </SideBar>
  );
};

export default MedicinesPage;
