import EditModal from './modalEdit.jsx';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, Grid2 } from '@mui/material';
import { apis } from "../../../Services/commonServices.js";
import { SideBar } from "../../../components/sidebar.jsx";
import MedicinesTable from './medicineTable.jsx';
import { side_bar_utils } from '../utils.js';
import Autocomp from './autocomp.jsx';
import { debounce } from '@mui/material/utils';

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState([]);  // Stores all medicines (pagination)
  const [filteredString, setFilteredString] = useState(''); // Stores the search string
  const [filteredMedicines, setFilteredMedicines] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Check if more pages exist
  const [isFiltered, setisFiltered] = useState(true); // Check if filter is applied
  const [loading, setLoading] = useState(false);

  const observer = useRef(); // Intersection Observer reference

  // Fetch paginated medicines
  const fetchData = debounce(async (pageNumber) => {
    if (loading || !hasMore) return; // Prevent duplicate calls

    setLoading(true);
    try {
      const response = await apis.noTokengetRequest(`/pharmacy?page=${pageNumber}&limit=15&query=${filteredString}`);
      console.log(response)
      if (response.medicines.length > 0) {
        setMedicines((prev) => [...prev, ...response.medicines]); // Append new data
      }
      setHasMore(pageNumber < response.totalPages);
      console.log(page);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
    setLoading(false);
  },500);

  useEffect(() => {
    fetchData(1); // Initial call when component mounts
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [page]);
  

  //------------------------------------Edit Modal------------------------------------
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [colname, setColname] = useState('');

  // Open the edit modal
  const handleOpenEditModal = useCallback((medicine, column) => {
    setSelectedMedicine(medicine);
    setColname(column);
    setOpenEditModal(true);
  }, []);

  // Close the edit modal
  const handleCloseEditModal = useCallback(() => {
    setOpenEditModal(false);
  }, []);

  // Handle Delete (Placeholder)
  const handleDelete = useCallback(async (id) => {
    console.log(id);
  }, []);

  // Search Filter for Table
  useEffect(() => {
    setFilteredMedicines(medicines);
  }, [medicines]);

  //------------------------------------------ Autocomplete -----------------------------------------

  // Lazy Loading: Observe the last element
  const lastElementRef = useCallback((node) => {
    if (loading || page === 1) return; // Prevent triggering on first render
    if (observer.current) observer.current.disconnect();
  
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
  
    if (node) observer.current.observe(node);
  }, [hasMore, loading, page]);
  

  return (
    <SideBar arr={side_bar_utils}>
      <Card className="partition" sx={{maxHeight: '83vh'}}>
        <CardContent>
          <Grid2 container spacing={2}>


            <Grid2 size={{ xs: 12 }}>

              {Autocomp(setHasMore,setFilteredString, setFilteredMedicines, medicines)}

            </Grid2>


            <Grid2 size={{ xs: 12 }} sx={{ maxHeight: '70vh', overflow: 'auto' }}>

              {/* Medicines Table */}
              <MedicinesTable  hasMore={hasMore} lastElementRef={lastElementRef} medicines={filteredMedicines} handleDelete={handleDelete} handleOpenEditModal={handleOpenEditModal} />

            </Grid2>


            {/* Edit Modal */}
            {selectedMedicine && (
              <EditModal open={openEditModal} column={colname} handleClose={handleCloseEditModal} medicine={selectedMedicine} />
            )}

          </Grid2>
        </CardContent>
      </Card>
    </SideBar>
  );
};

export default MedicinesPage;
