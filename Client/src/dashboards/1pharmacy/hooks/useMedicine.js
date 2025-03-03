import { useState, useEffect, useCallback } from 'react';
import apis from '../../../Services/commonServices.js';
import { toast } from 'react-toastify';

const useMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState([]);

  useEffect(() => {
    apis.noTokengetRequest('/pharmacy')
      .then(response => {
        setMedicines(response.data);
        toast.success("Medicines fetched successfully!");
      })
      .catch(err => {
        console.error(err);
        toast.error("Unable to fetch Data");
      });
  }, []);

  const handleDelete = useCallback(async (id) => {
    pharmacyServices.deleteMedicine(id)
      .then(() => {
        setMedicines(prev => prev.filter(m => m._id !== id));
        toast.success("Medicine deleted successfully!");
      })
      .catch(() => {
        toast.error("Unable to delete medicine.");
      });
  }, []);

  useEffect(() => {
    setFilteredMedicines(
      medicines.filter(m => m.name.toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [searchValue, medicines]);

  return { medicines, filteredMedicines, searchValue, setSearchValue, handleDelete };
};

export default useMedicines;
