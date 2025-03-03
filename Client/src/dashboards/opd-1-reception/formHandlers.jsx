import { useState } from "react";
import {apis} from '../../Services/commonServices.js';

export const usePatientForm = () => {
  const [patValues, setPatValues] = useState({
    fname: '', middlename: '', lname: '', mobile: '', email: '', dob: '2001-05-24',
    address: '', city: '', pincode: '', gender: '', allergy: 'none',
    conditions: 'none', others: 'none',type:'patient'
  });

  const handlePatChange = (event) => {
    const { name, value } = event.target;
    setPatValues({ ...patValues, [name]: value });
  };

  return { patValues, setPatValues, handlePatChange };
};

export const useEmployeeForm = () => {
  const [empValues, setEmp] = useState({
    fname: '', middlename: '', lname: '', mobile: '', email: '', dob: '2001-01-01',
    address: '', city: '', pincode: '', gender: '', degree: '',
    college: '', certificate: '', role: '', dep: '',type:'employee'
  });

  const handleEmpChange = (event) => {
    const { name, value } = event.target;
    setEmp({ ...empValues, [name]: value });
  };

  return { empValues, setEmp, handleEmpChange };
};

export const clearValues = (valf, setPatValues, setEmp,fval) => {
  const newValues = {};
  
  Object.entries(fval).forEach(([key, value]) => {
    if (key === 'dob') {
      newValues[key] = '2001-01-01';
    } else if (['allergy', 'conditions', 'others'].includes(key)) {
      newValues[key] = 'none';
    } else {
      newValues[key] = '';
    }
  });

  valf === 1 ? setPatValues(newValues) : setEmp(newValues);
};

export const handleFormSubmit = async (event, tracker, formV, setPatValues, setEmp) => {
  event.preventDefault();
  
  alert(JSON.stringify(formV));

  const link ='/member';

  //sending data
  const id=await apis.noTokenPostRequest(link, formV).id;
  alert(`Please note the id:\n ${formV.fname}:${id}`);
  clearValues(tracker,setPatValues, setEmp,formV)
};
