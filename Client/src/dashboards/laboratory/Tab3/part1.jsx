import React, { useState, useEffect } from "react";
import { PatientAutocomplete } from '../../../components/patientAutoComp';
import CardContent from '@mui/material//CardContent';
import Grid from '@mui/material//Grid2';
import {
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
} from '@mui/material';

import { apis } from '../../../Services/commonServices'
import { toast } from "react-toastify";

const Part0 = ({ index, patient, setNextTab1, detail, setDetail }) => {

    const [tests, setTests] = useState([]);

    const fetchdata = async () => {
        const body = { pid: patient.pid }
        if (index === 0) {
            body.status = "B"
        } else {
            body.status = "T"
        }
        const data = await apis.noTokenPostRequest('/lab/prescription', body)
        console.log("Data in Part0", data)
        setTests(data);
    }

    useEffect(() => {
        fetchdata();
    }, [])

    const handleNext = async () => {
        setNextTab1(0)
    }

    //--------------------------------- UI - 1 Functions ----------------------------------

    //This function is for UI_0 to handle Change in the text field.
    const handleChange = (value, id) => {
        setDetail({ ...detail, [id]: value });
    };

    //This function is for UI_0 to handle Submit.
    const handleTaken = async (id) => {
        const body = { id: id }
        body.status = "T";
        if (!detail[id]) {
            toast.warn("Please enter the Details to proceed")
            return
        }
        body.details = detail[id];
        console.log("Body in Part", body)
        const Status = await apis.noTokenStatusPutRequest('/lab/details', body)
        if (Status === 200) {
            setDetail({ ...detail, [id]: "" })
            setTests(tests.filter((t) => t._id !== id))
        }
    }

    //This is UI for the first part of the Tab.
    const UI_1 = () => (
        tests.length === 0 ?
            <Grid container size={{ xs: 12 }} justifyContent="center" textAlign="center" sx={{ p: 2 }}>
                <Typography variant="h5"> No tests available for {patient?.pname}</Typography>
            </Grid>
            :
            <Grid container spacing={2}>
                <Grid container size={{ xs: 12 }}>
                    <Grid size={{ xs: 6 }}>
                        <Typography variant="h6" gutterBottom>
                            <strong>Patient Name:</strong> {patient?.pname}
                        </Typography>
                    </Grid>

                </Grid>

                <Grid container size={{ xs: 12 }}>
                    <Grid size={{ xs: 12 }}>
                        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Test Name</strong></TableCell>

                                        <TableCell><strong>Date</strong></TableCell>
                                        <TableCell><strong>Normal Range</strong></TableCell>
                                        <TableCell><strong>Action</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tests.length && tests.map((t) => (
                                        <TableRow key={t._id}>
                                            <TableCell>{t.tname}</TableCell>
                                            <TableCell>
                                                {new Date(t.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell>{t.n_range}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    label={`Patient ${t.pat_details} Details`}
                                                    value={detail[t._id] || ""}
                                                    onChange={(event) => handleChange(event.target.value, t._id)}
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    variant="outlined"
                                                    sx={{ mb: 2 }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleTaken(t._id)}
                                                    sx={{ width: "100%" }}
                                                >
                                                    Take
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Grid>
    )

    //---------------------------------- UI - 2 Functions ----------------------------------

    const [files, setFiles] = useState({});

    const handleFileChange = (event, id) => {
        setFiles((prev) => ({
            ...prev,
            [id]: event.target.files[0], // store the file by test ID
        }));
    };

    const handleUpload = (id) => {
        const file = files[id];
        if (!file){
            toast.warn("Please select a file to upload")
            return
        }
        if (!detail[id]) {
            toast.warn("Please enter the Patient Range to proceed")
            return
        }
        const formData = new FormData();
        formData.append("id", id);
        formData.append("status", "D");
        formData.append("report", file);
        formData.append("p_range", detail[id]);
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        
        apis.uploadFileRequest("/lab/details", formData)
            .then((res) => {
                if(res===200){
                    setTests(tests.filter((t) => t._id !== id)) 
                    setFiles((prev) => ({ ...prev, [id]: null }));
                    setDetail({ ...detail, [id]: "" })
                } 
            })
            .catch((err) => console.error("Upload error", err));
    };

    //This function helps to display the UI_2 and to send pdf.
    const UI_2 = () => (
        tests.length === 0 ? (
            <Grid container size={{ xs: 12 }} justifyContent="center" textAlign="center" sx={{ p: 2 }}>
                <Typography variant="h5"> No tests available for {patient?.pname}</Typography>
            </Grid>
        ) : (
            <Grid container spacing={2}>
                <Grid container size={{ xs: 12 }}>
                    <Grid size={{ xs: 6 }}>
                        <Typography variant="h6" gutterBottom>
                            <strong>Patient Name:</strong> {patient?.pname}
                        </Typography>
                    </Grid>
                </Grid>
    
                <Grid container size={{ xs: 12 }}>
                    <Grid size={{ xs: 12 }}>
                        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Test Name</strong></TableCell>
                                        <TableCell><strong>Date</strong></TableCell>
                                        <TableCell><strong>Normal Range</strong></TableCell>
                                        <TableCell><strong>Upload Report</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tests.map((t) => (
                                        <TableRow key={t._id}>
                                            <TableCell>{t.tname}</TableCell>
                                            <TableCell>
                                                {new Date(t.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell>{t.n_range}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    label={`Upload ${t.tname} Report`}
                                                    variant="outlined"
                                                    fullWidth
                                                    slotProps={{ htmlInput: { accept: ".pdf" },inputLabel: { shrink: true } }}
                                                    type="file"
                                                    
                                                    onChange={(e) => handleFileChange(e, t._id)}
                                                    style={{ marginBottom: 10 }}
                                                />
                                                <TextField
                                                    label={`Patient Range`}
                                                    value={detail[t._id] || ""}
                                                    onChange={(event) => handleChange(event.target.value, t._id)}
                                                    fullWidth
                                                    variant="outlined"
                                                    sx={{ mb: 1 }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleUpload(t._id)}
                                                    sx={{ width: "100%" }}
                                                >
                                                    Upload
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Grid>
        )
    );
    


    return (
        <>
            <CardContent>
                {index === 0 ? UI_1()
                    :

                    UI_2()
                }

            </CardContent >

            <Grid size={{ xs: 12 }} sx={{ position: "absolute", bottom: "4px", p: 2 }}>
                <Button variant="contained" fullWidth color="primary" onClick={handleNext}
                    sx={{ height: "8vh", fontWeight: "bold", fontSize: "1.2rem" }}
                >
                    Go Back
                </Button>
            </Grid>
        </>)

}

export default Part0;