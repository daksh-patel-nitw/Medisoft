import React, { useState } from 'react';
import Grid from '@mui/material//Grid2';
import Button from '@mui/material/Button';
import CardContent from '@mui/material//CardContent';
import ConfirmBill from './confirmBill';
import { PatientAutocomplete } from '../../components/patientAutoComp';
import { toast } from 'react-toastify';
import { apis } from '../../Services/commonServices';

export default function App({ value, patient, setPatient, nextTab, setNextTab, bill, setBill }) {


    //Fetch bill
    const handleNext = async () => {
        if (!nextTab) {
            const pid = patient.pid;
            if (!pid) {
                toast.error("Please select a patient to fetch the bill.");
                return
            }
            try {
                const response = await apis.noTokenPostRequest(`/appointment/bill`, { pid,status:value });
                console.log("Response", response);
                setBill(response.data);
                setNextTab(1);
            } catch (error) {
                console.error('Error fetching bill:', error);
            }
        } else {
            setNextTab(0);
        }
    };

    return (
        nextTab ?
            <ConfirmBill
                bill={bill}
                patient={patient}
                index={value}
                setPatient={setPatient}
                setBill={setBill}
                setNextTab={setNextTab}
                value={value}
            />
            :

            <>
                <CardContent>

                    <Grid container size={{ xs: 12 }} spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <PatientAutocomplete
                                index={1}
                                setPatient={setPatient}
                                patient={patient}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <PatientAutocomplete
                                index={2}
                                setPatient={setPatient}
                                patient={patient}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <PatientAutocomplete
                                index={3}
                                setPatient={setPatient}
                                patient={patient}
                            />
                        </Grid>
                    </Grid>

                </CardContent>
                <Grid size={{ xs: 12 }} sx={{ position: "absolute", bottom: "4px", p: 2 }}>
                    <Button variant="contained" fullWidth color="primary" onClick={handleNext}
                        sx={{ height: "8vh", fontWeight: "bold", fontSize: "1.2rem" }}
                    >
                        Fetch Bill
                    </Button>
                </Grid>
            </>

    );
}
