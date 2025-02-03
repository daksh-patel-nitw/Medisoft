import apis from '../../../Services/commonServices';

const fetchAllMedicines = () => {
  return apis.noTokengetRequest('/api/allmedicines');
};

const deleteMedicine = (id) => {
  return apis.noTokendeleteRequest('/api/deletemedicine', id);
};

const addNewMedicine = (data) => {
    return apis.noTokenPostRequest('/api/newmedicine', data);
  };

const pharmacyServices = {
  fetchAllMedicines,
  deleteMedicine,
};

export default pharmacyServices;