import React, { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';

function getAppointments(id,setI) {
  // Make a GET request to the server to fetch appointments
  fetch(`http://localhost:5000/api/newmedicine/queuescreen/${id}`)
    .then(response => response.json())
    .then(data => {
      console.log()
      setI(data);

      setTimeout(getAppointments, 10000);
    })
    .catch(error => {
      // Handle error
      console.error(error);

      // Call the function again after 10 seconds in case of error
      setTimeout(getAppointments, 10000);
    });
}

const getDoc=async(dep,setD)=>{
 
  await fetch('http://localhost:5000/api/allDoctors/dep')
          .then((res) => res.json())
          .then((data) => { console.log(data); setD(data)})
          .catch((err) => console.error(err));
}
export default function QueueScreen() {
  const { dep } = useParams();
  const [doc,setD]=useState([]);
  const [id,setI]=useState([]);
  useEffect(() =>
  {
      getDoc(dep,setD);
      getAppointments(id,setI)
  }, []);
  
  console.log("DiD",dep);

  return (
    <div>
      <h1>Queue Screen for Doctor ID {dep}</h1>
    </div>
  );
}

 