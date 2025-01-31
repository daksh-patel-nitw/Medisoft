import React from 'react';
import { useState,useEffect } from 'react';
import Card from '@mui/material//Card';
import CardContent from '@mui/material//CardContent';
import PageLayout from './pageLayout';
import Autocomplete from '@mui/material/lab/Autocomplete';
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
} from '@mui/material/';

import ExpandMoreIcon from '@mui/material/icons/ExpandMore';
import Accordion from '@mui/material//Accordion';
import AccordionSummary from '@mui/material//AccordionSummary';
import AccordionDetails from '@mui/material//AccordionDetails';

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
      // console.log(data);
      setB(data);
    } catch (error) {
      console.log(error);
    }
  };
    const fetchData = async (pid) => {
    try {
      const response = await fetch(`http://localhost:5000/api/onlypatientapp/${pid}`);
      const data = await response.json();
      // console.log(data);
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
 
   const writeStatus=(s)=>{
     return s==='D'?'Completed':'Pending'
   }
   
   const generatePDF = async(id) => {
    let table_=`<html><body style='margin:5px'><h2>Medisoft-HMS Invoice</h2><h3>Date:${new Date().toLocaleDateString()}</h3>`;
    let total=0;
    await bills.filter(b => b.aid === id).forEach(bill => {
      table_ += `<div>
        <p style='font-weight:bold'>${bill.type.charAt(0).toUpperCase() + bill.type.slice(1)}</p>
        ${bill.description}
        <h4>SubTotal:${bill.price}</h4>
      </div>`;
      total += bill.price;
    });
    table_+=`<h3>Total:${total}</h3></body></html>`
    console.log(table_)
    try {
      const response = await fetch('http://localhost:5000/api/generatepdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ table:table_ }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
  
      // Assuming the response contains the PDF file
      const pdfBlob = await response.blob();
  
      // Use the PDF blob as needed (e.g., initiate file download)
      // For example, to initiate a file download:
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'file.pdf';
      link.click();
  
      console.log('PDF generated and downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }  
  };

  const checkBill=(id)=>{
    return Boolean(bills.find(b=>b.aid===id));
  }
  
  const [rating, setRating] = useState(0);
  const [isInteractive, setIsInteractive] = useState(false);
  const handleRatingChange = (value) => {
    setRating(value);
    setIsInteractive(false);
  };
  const handleRateClick = () => {
    setIsInteractive(true);
  };


      return (
        <PageLayout>
          <Grid container direction="column" spacing={2}>

            {appointments.length && appointments.map((e,index) => (
               <Grid key={e._id} size={{xs:12}>
                      <Card className="partition" style={{ maxWidth: "700px", margin: "auto" }}>
                        <CardContent>
                          <Accordion 
                          disabled={e.status!=='D'?true:false}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              <span style={{flexGrow: 1,fontWeight: "bold",padding: 4,}}>
                                {new Date(e.admitted_date).toLocaleString("en-US", {
                                  timeZone: "Asia/Kolkata",
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                             
                              <span 
                              style={{ 
                                maxWidth:85,
                                textAlign:'center',
                                        padding: 4,
                                        borderRadius: 5,
                                        backgroundColor: e.status==='D'?"rgb(166, 255, 137)":"rgb(255, 137, 192)",
                                        fontWeight: "bold",}}>
                                          {writeStatus(e.status)} 
                              </span>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container direction="column" spacing={2}>
                                <Grid container item>
                                  <Grid size={{xs:6}>
                                    <h4>Doctor Notes:</h4>
                                    <div>
                                      {e.notes}
                                    </div>
                                  </Grid>
                                  <Grid size={{xs:6}>
                                    <div>
                                      {[...Array(5)].map((_, index) => (
                                          <span
                                            
                                            style={{
                                              color: index + 1 <= rating ? 'yellow' : 'gray', fontSize:'2rem',
                                              cursor: isInteractive ? 'pointer' : 'default', }}
                                            onClick={isInteractive?() => handleRatingChange(index + 1):null}
                                          >
                                            {index + 1 <= rating ? '★' : '☆'}
                                          </span>
                                        ))}
                                    </div>
                                    <div>
                                        <button disabled={isInteractive} onClick={handleRateClick}>
                                          Rate
                                        </button>
                                    </div>
                                  </Grid>

                                </Grid>
                                <Grid item>
                                  <p>Medicines:</p>
                                  {e.medicines.map((m) => (
                                    <div key={m._id}
                                      style={{
                                        margin: 4,
                                        padding: 4,
                                        borderRadius: 2,
                                        backgroundColor: "rgb(255, 137, 192)",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {m.name} {m.t}{" "}
                                    </div>
                                  ))}
                                </Grid>

                                <Grid item>
                                  <p>Tests:</p>
                                  {e.tests.map((t) => (
                                    <div key={t._id}
                                      style={{
                                        margin: 4,
                                        padding: 4,
                                        borderRadius: 2,
                                        backgroundColor: "rgb(255, 137, 192)",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {t.name}-------- "{t.p_range}"
                                    </div>
                                  ))}
                                </Grid>
                                <Grid item>
                                  <button disabled={!checkBill(e._id)}
                                  onClick={()=>generatePDF(e._id)}>Download Bill</button>
                                </Grid>
                              </Grid>
                              
                            
                            </AccordionDetails>
                          </Accordion>
                        </CardContent>
                      </Card>
                      </Grid>
                    ))}

               
                
          </Grid>
        </PageLayout>
      );
      
}
