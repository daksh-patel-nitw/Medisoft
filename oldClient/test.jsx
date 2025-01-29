import React, { useState } from 'react';

function AppointmentForm() {
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      patientName,
      doctorName,
      date
    };
    fetch('/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Patient Name:
        <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} />
      </label>
      <label>
        Doctor Name:
        <input type="text" value={doctorName} onChange={e => setDoctorName(e.target.value)} />
      </label>
      <label>
        Date:
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default AppointmentForm;
