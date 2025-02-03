import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TableRow, TableCell, IconButton, Card, CardContent } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import PageLayout from './pageLayout';
import EditModal from './modalEdit';
import AutoComp from '../../components/CAutocomplete';
import CustomTable from '../../components/CTable';
import pharmacyServices from './services/pharmacyServices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from '../../components/sidebar';

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [colname, setColname] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState([]);

  useEffect(() => {
    pharmacyServices.fetchAllMedicines()
      .then((response) => {
        setMedicines(response.data);
        toast.success("Medicines fetched successfully!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Unable to fetch Data");
      });
  }, []);

  const handleDelete = useCallback(async (id) => {
    console.log(id);
    pharmacyServices.deleteMedicine(id)
      .then((response) => {
        console.log(response.data);
        setMedicines((prev) => prev.filter((m) => m._id !== id));
        toast.success("Medicine deleted successfully!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Unable to delete medicine.");
      });
  }, []);

  useEffect(() => {
    setFilteredMedicines(
      medicines.filter((m) => m.name.toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [searchValue, medicines]);

  const handleEdit = useCallback((id, updatedMedicine, column) => {
    setMedicines((prevMedicines) =>
      prevMedicines.map((m) => (m._id === id ? { ...m, [column]: updatedMedicine } : m))
    );
  }, []);

  const handleOpenEditModal = useCallback((medicine, column) => {
    setSelectedMedicine(medicine);
    console.log("MName", medicine, "Column:", column);
    setColname(column);
    setOpenEditModal(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setOpenEditModal(false);
  }, []);

  const handleSearch = useCallback((event, newValue) => {
    setSearchValue(newValue ? newValue : '');
  }, []);

  const columns = useMemo(() => ["Medicine Name", "Type", "Package", "Package Available", "Free Available", "Price", "Action"], []);

  const generateRows = useCallback(() => {
    return filteredMedicines.map((m) => (
      <TableRow key={m._id}>
        <TableCell>{m.name}</TableCell>
        <TableCell>{m.t}</TableCell>
        <TableCell>
          {m.ps}
          <IconButton onClick={() => handleOpenEditModal(m, 'ps')}>
            <Edit />
          </IconButton>
        </TableCell>
        <TableCell>
          {m.ps_u}
          <IconButton onClick={() => handleOpenEditModal(m, 'ps_u')}>
            <Edit />
          </IconButton>
        </TableCell>
        <TableCell>{m.ps_c + m.ps_u * m.ps}</TableCell>
        <TableCell>
          {m.price}
          <IconButton onClick={() => handleOpenEditModal(m, 'price')}>
            <Edit />
          </IconButton>
        </TableCell>
        <TableCell>
          <IconButton onClick={() => handleDelete(m._id)}>
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  }, [filteredMedicines, handleOpenEditModal, handleDelete]);

  const arr = [
    { label: 'New Medicine', path: '/', icon: 'AddBox' },
    { label: 'Medicine List', path: '/medicine', icon: 'TableChart' },
    { label: 'Patients', path: '/medpatients', icon: 'AccountBox' },
  ];
  return (
    <SideBar arr={arr}>
      <ToastContainer />
      <Card className="partition">
        <CardContent>
          <AutoComp
            name="name"
            label="Search By Medicine"
            handleSearch={handleSearch}
            arr={medicines}
          />
          <CustomTable columns={columns} generateRows={generateRows} />
          {selectedMedicine && (
            <EditModal
              open={openEditModal}
              column={colname}
              handleClose={handleCloseEditModal}
              handleEdit={handleEdit}
              medicine={selectedMedicine}
            />
          )}
        </CardContent>
      </Card>
    </SideBar>
  );
};

export default MedicinesPage;