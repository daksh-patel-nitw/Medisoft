import { useState } from "react";
import apis from '../../../Services/commonServices.js';

const useMedicineForm = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    q: "",
    t: "",
    ps: "",
    ps_u: "",
    price: ""
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apis.noTokenPostRequest('/pharmacy', formValues);
      setFormValues({ name: "", q: "", t: "", ps: "", ps_u: "", price: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    formValues,
    handleInputChange,
    handleSubmit,
  };
};

export default useMedicineForm;
