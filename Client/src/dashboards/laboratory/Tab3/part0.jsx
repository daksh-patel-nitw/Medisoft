import React, { useState, Component, useEffect } from "react";
import { PatientAutocomplete } from '../../../components/patientAutoComp';
import CardContent from '@mui/material//CardContent';
import Grid from '@mui/material//Grid2';
import Button from '@mui/material//Button';
import Part1_1 from './part1';
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setPatientOptions } from '../../../redux/slices/patientsAutoCompSlice';

const Part0 = ({ index, nextTab1,detail,setDetail, setNextTab1, patient,setPatient}) => {
    //Which tab are we.
   
    const dispatch = useDispatch();
    //Setting Patient in Undone
    

    useEffect(() => {
        if (nextTab1 === 0) {
            // setPatient(null)
            dispatch(setPatientOptions([]))

        }
    }, [nextTab1])

    //Going to next Part
    const handleNext = async () => {
        if (!patient) {
            toast.warn("Please select a patient");
            return
        }
        setNextTab1(1);
    }

    return (
        nextTab1 === 0 ?
            <>
                <CardContent>
                    <Grid container size={{ xs: 12 }} spacing={2}>


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

                    </Grid>
                </CardContent>
                <Grid size={{ xs: 12 }} sx={{ position: "absolute", bottom: "4px", p: 2 }}>
                    <Button variant="contained" fullWidth color="primary" onClick={handleNext}
                        sx={{ height: "8vh", fontWeight: "bold", fontSize: "1.2rem" }}
                    >
                        Next
                    </Button>
                </Grid>
            </> :
            <Part1_1
                index={index}
                patient={patient}
                setNextTab1={setNextTab1}
                detail={detail}
                setDetail={setDetail}
            />


    )

}

export default Part0;