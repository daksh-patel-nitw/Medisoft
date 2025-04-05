import React, { useState } from 'react';
import { Grid2, Button, Card, CardContent, Typography, Divider, Paper } from '@mui/material';
import EditModal from './modalEdit';

export default function App({ value, patient, nextTab, setNextTab, bill, setBill }) {
    // Control Open/Close of Modal
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);

    // Handle Closing of Edit Modal
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    };

    const confirmBill = (value) => {
        setOpenEditModal(true);
        setSelectedApp(value);
    };

    const done = () => {
        handleCloseEditModal();
        setBill(bill.filter((item) => item._id !== selectedApp._id));
    }

    return (
        <>

            <CardContent className="partition" sx={{ padding: 3, height: "82vh", backgroundColor: "#f9f9f9" }}>
                <Grid2 container size={{ xs: 12 }} spacing={2}>

                    {/* Patient Details */}
                    <Grid2 container size={{ xs: 12 }} justifyContent="space-between">
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Patient Details</Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 4 }}>
                        <Typography variant="body1"><strong>Patient:</strong> {patient.pname}</Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 4 }}>
                        <Typography variant="body1"><strong>Patient ID:</strong> {patient.pid}</Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 4 }}>
                        <Typography variant="body1"><strong>Mobile:</strong> {patient.mobile}</Typography>
                    </Grid2>

                    {/* Divider */}
                    <Grid2 size={{ xs: 12 }}>
                        <Divider sx={{ marginY: 2 }} />
                    </Grid2>

                    {/* Pending Bills Section */}
                    <Grid2 size={{ xs: 12 }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Pending Bills</Typography>
                    </Grid2>

                    {bill && bill.length > 0 ? (
                        bill.map((item, index) => (
                            Object.keys(item.bills).length > 0 ? <Paper key={index} elevation={3} sx={{ padding: 2, marginY: 1, borderRadius: 2, width: '100%' }}>
                                <Grid2 container size={{ xs: 12 }} alignItems="center">
                                    <Grid2 size={{ xs: 4 }} textAlign="center">
                                        <Typography variant="body1"><strong>Date:</strong> {item.schedule_date}</Typography>
                                    </Grid2>
                                    <Grid2 size={{ xs: 4 }} textAlign="center">
                                        <Typography variant="body1"><strong>Doctor:</strong> {item.dname}</Typography>
                                    </Grid2>
                                    <Grid2 size={{ xs: 4 }} textAlign="center">
                                        <Button variant="contained" color="primary" onClick={() => { console.log(item); confirmBill(item) }}>
                                            Confirm Bill
                                        </Button>
                                    </Grid2>
                                </Grid2>
                            </Paper>
                                : <Grid2 size={{ xs: 12 }}>
                                    <Typography variant="body1" color="textSecondary">No Bills Pending</Typography>
                                </Grid2>
                        ))
                    ) : (
                        <Grid2 size={{ xs: 12 }}>
                            <Typography variant="body1" color="textSecondary">No Bills Pending</Typography>
                        </Grid2>
                    )}

                    {/* Edit Modal */}
                    {selectedApp && (
                        <EditModal
                            open={openEditModal}
                            handleClose={handleCloseEditModal}
                            data={selectedApp}
                            patient={patient}
                            done={done}
                        />
                    )}
                </Grid2>
            </CardContent>



            <Grid2 size={{ xs: 12 }} sx={{ position: "absolute", bottom: "4px", p: 2 }}>
                <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={() => setNextTab(0)}
                    sx={{ height: "8vh", fontWeight: "bold", fontSize: "1.2rem" }}
                >
                    Back
                </Button>
            </Grid2>
        </>
    );
}
