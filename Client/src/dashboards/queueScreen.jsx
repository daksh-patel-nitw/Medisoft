import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';

import { apis } from '../Services/commonServices';
import { useParams } from 'react-router-dom';

export default function QueueScreen() {
  const { dep } = useParams();
  const [doc, setDoc] = useState([]);

  const fetchData = async () => {
    try {
      const res = await apis.noTokengetRequest(`/appointment/queuescreen/${dep}`);
      console.log(res);
      if (!res) throw new Error("Failed to fetch doctors");
      setDoc(res);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [dep]);


  const UI = () => {
    return (
      doc.length === 0 ? <h1>No Patients there</h1>
        :

        doc.map((doctor, index) => {

          return (
            <Grid size={{ xs: 12 / doc.length }} key={doctor.eid}>
              <div>
                <h2>Dr. {doctor.doctorName}</h2>
              </div>
              {doctor.appointments.map((val) => (
                <div
                  key={val.pid}
                  style={{
                    margin: 2,
                    padding: 8,
                    borderRadius: 5,
                    backgroundColor: val.status === 'progress' ? '#00FFCA' : '#393646',
                    color: 'white',
                  }}
                >
                  {val.pname} {val.pid}
                </div>
              ))}
            </Grid>
          );
        })
    )
  }

  return (
    <Box
      style={{
        backgroundImage: 'mirrored-squares.png',
        backgroundColor: 'rgb(247, 245, 181)',
        flexGrow: 1,
        fontSize: '24px',
        height: '100vh',
      }}
    >
      <marquee style={{ backgroundColor: '#673AB7', color: 'white' }}>
        <h2>
          Department: {dep} &emsp; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
          Medisoft HMS System
        </h2>
      </marquee>

      <Grid container spacing={2} style={{ height: '100%' }}>
        {UI()}
      </Grid>
    </Box>
  );
}
