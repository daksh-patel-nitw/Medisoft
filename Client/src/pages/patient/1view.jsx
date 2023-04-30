import React from 'react';
import { useState,useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PageLayout from './pageLayout';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
    TablePagination,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

function Order(des) {
    return <div dangerouslySetInnerHTML={{ __html: des }} />;
  }

export default function App()
{
    const[appointments,setA]=useState([]);
    const[bills,setB]=useState([])
    const fetchBill = async (pid) => {
    try {
      const response = await fetch(`http://localhost:5000/api/getBill/${pid}`);
      const data = await response.json();
      console.log(data);
      setB(data);
    } catch (error) {
      console.log(error);
    }
  };
    const fetchData = async (pid) => {
    try {
      const response = await fetch(`http://localhost:5000/api/onlypatientapp/${pid}`);
      const data = await response.json();
      console.log(data);
      setA(data);
    } catch (error) {
      console.log(error);
    }
  };
  

  //Initialization
  useEffect(() => {
    fetchData('P0000004');
    fetchBill('P0000004');
  }, []);
 
   
      return (
        <PageLayout>
          <Grid container spacing={2} style={{height:'500px'}}>
            <Grid item xs={12}>
            <Grid container spacing={2}>
              
                  
            {appointments.length && appointments.map((e) => (
  <Card className="partition" style={{ width: "700px", margin: "auto" }}>
    <CardContent>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <p>
            {new Date(e.admitted_date).toLocaleString("en-US", {
              timeZone: "Asia/Kolkata",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "} 
          </p>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <p>Doctor Notes:</p>
            <div>
            {e.notes}
            </div>
          </div>
          <div>
            <p>Medicines:</p>
            {e.medicines.map((m) => (
              <div
                style={{
                  margin: 4,
                  padding: 4,
                  borderRadius: 2,
                  backgroundColor: "rgb(255, 137, 192)",
                  fontWeight: "bold",
                }}
              >
                {m.name} {m.type}{" "}
              </div>
            ))}
            <br />
            <p>Tests:</p>
            {e.tests.map((t) => (
              <div
                style={{
                  margin: 4,
                  padding: 4,
                  borderRadius: 2,
                  backgroundColor: "rgb(255, 137, 192)",
                  fontWeight: "bold",
                }}
              >
                {t.name}
              </div>
            ))}
          </div>
          <div>
          {bills.filter(b => b.aid === e._id).map(bill => (
              <div>
                <p>{bill.type}</p>
                {Order(bill.description)}
              </div>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </CardContent>
  </Card>
))}

               
                </Grid>
              
            </Grid>
          </Grid>
        </PageLayout>
      );
      
}
