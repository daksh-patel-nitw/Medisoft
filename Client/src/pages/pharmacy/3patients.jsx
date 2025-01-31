import React, { useEffect, useState } from 'react';
import {

Table,
TableBody,
TableCell,
TableContainer,
TableHead,
TableRow,
Button,
TextField,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import CardContent from '@mui/material/CardContent';
import PageLayout from './pageLayout';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function App() {
    const fetchMedicine = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/getmedicines');
            const data = await response.json();
            console.log(data)
            setMedicines(data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchMedicine();


    }, []);
    const [medicines, setMedicines] = useState([]);
    const [fval, setFval] = useState({ pid: '', pname: '' })

    const handleSearch = (newValue, name) => {
        if (newValue) {
            const t = medicines[value].find((e) => e[name] === newValue);
            setFilter(medicines[value].filter((m) => m[name].toLowerCase().includes(newValue.toLowerCase())));
            setFval({ pid: t.pid, pname: t.pname });
        }
        else {
            setFilter([]);
            setFval({ pid: '', pname: '' });
        }
    };

    //Track tabs value
    const handleChange = (event, newValue) => {
        setValue(newValue);
        setFval({ pid: '', pname: '' });
        setFilter([]);

    };
    //Check Tabs 
    const [value, setValue] = useState(0);
    const isButtonDisabled = (m) => {
        return clickedButtons.includes(m._id);
    };

    const [clickedButtons, setClickedButtons] = useState([]);
    const handleClick = (m) => {
        console.log(m);
        setBill([...billed, m]);
        setClickedButtons((prevClickedButtons) => [...prevClickedButtons, m._id]);
    }
    const tableUI = () => (
        <TableContainer >
            <Table >
                <TableHead style={{ backgroundColor: '#1F3F49' }}>
                    <TableRow>

                        <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Patient Id</TableCell>
                        <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Appointment Date</TableCell>
                        <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Medicine Name</TableCell>
                        <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Units Required</TableCell>
                        <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Unit</TableCell>
                        <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                        {value === 0 && <>
                            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                        </>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {medicines[value] && (filtered.length ? filtered : medicines[value]).map((m) => (
                        <TableRow>

                            <TableCell>{m.pid}</TableCell>
                            <TableCell>{(new Date(m.createdAt).toLocaleDateString('en', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric' }))}</TableCell>
                            <TableCell>{m.mname}</TableCell>
                            <TableCell>{m.quantity}</TableCell>
                            <TableCell>{m.unit}</TableCell>
                            <TableCell>{m.price}</TableCell>
                            {value === 0 && <>
                                <TableCell>{(m.price * m.quantity).toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button
                                        disabled={isButtonDisabled(m)}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleClick(m)}
                                    >
                                        {isButtonDisabled(m) ? "Checked" : "Check"}
                                    </Button>
                                </TableCell>
                            </>}

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    )

    const [filtered, setFilter] = useState([]);
    const [billed, setBill] = useState([]);
    console.log(filtered);
    const autocomp = (name, label) => (
        <Autocomplete
            freeSolo
            options={medicines[value] && medicines[value].map((option) => option[name])}
            onChange={(event, newValue) => handleSearch(newValue, name)}
            value={fval[name]}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={`Search by ${label}`}
                    margin='normal'
                    variant='outlined'

                />
            )}
        />
    )
    const [total, setTotal] = useState(0)
    const handleBill = () => {
        // Create table header
        let table = "<table style='width: 100%; border-collapse: collapse;'>";
        table += "<tr><th style='border: 1px solid black; padding: 5px;'>Description</th><th style='border: 1px solid black; padding: 5px;'>Price</th><th style='border: 1px solid black; padding: 5px;'>Quantity</th></tr>";

        // Loop through the billed items and add them to the table
        billed.forEach(item => {
            table += `<tr><td style='border: 1px solid black; padding: 5px;'>${item.mname}</td><td style='border: 1px solid black; padding: 5px;'>${(item.price * item.quantity).toFixed(2)}</td><td style='border: 1px solid black; padding: 5px;'>${item.quantity}</td></tr>`;
        });

        // Close the table
        table += `</table><h2>Total:${total}</h2>`;

        // Open new window and write table into it
        const newWindow = window.open("", "", "height=500,width=700");
        newWindow.document.write(table);

        newWindow.document.close();
        newWindow.focus();
        newWindow.addEventListener("afterprint", () => {
            // Close the window when the user finishes printing or cancels the print dialog
            newWindow.close();
        });
        // Print the window
        newWindow.print();
        // pid,price,aid,des,type,status,date

        const updated = [...billed, table, total];
        fetch('http://localhost:5000/api/finishmedopd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updated)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);

            })
            .catch(error => console.error(error));
        setMedicines([medicines[0].filter((num) => !billed.includes(num)), [...medicines[1], ...billed]])
        setFilter([]);
        setTotal(0);
    }

    useEffect(() => {
        if (billed) {
            setTotal(billed.reduce((acc, m) => acc + (m.price * m.quantity), 0).toFixed(2))
        }
    }, [billed])


    return (

        <PageLayout>
            <Card className="partition">
                    <CardContent>
                        <Tabs
                            value={value}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={handleChange}
                            aria-label="disabled tabs example"
                        >
                            <Tab label="Remaining" />
                            <Tab label="Done" />
                        </Tabs>

            
                            <Grid container spacing={2}>
                                <Grid size={{xs:4}}>
                                    {autocomp('pid', 'Patient ID')}
                                </Grid>
                                <Grid size={{xs:4}}>
                                    {autocomp('pname', 'Patient Name')}
                                </Grid>
                                {value === 0 && <><Grid size={{xs:2}}>
                                    <div style={{ margin: 'auto' }}>
                                        <h2>Total:{total}</h2>
                                    </div>
                                </Grid>
                                    <Grid size={{xs:2}}>
                                        {billed.length && <div style={{ margin: 'auto' }}><Button
                                            style={{ margin: 'auto' }}
                                            variant="contained"
                                            color="primary"
                                            onClick={handleBill}>
                                            Bill
                                        </Button> &emsp;
                                            <Button
                                                style={{ margin: 'auto' }}
                                                variant="contained"
                                                color="primary"
                                                onClick={() => { setBill([]); setClickedButtons([]) }}>
                                                Clear
                                            </Button>
                                        </div>}
                                    </Grid></>}
                                {tableUI()}
                            </Grid>
                        </CardContent>
               
                    </Card>
        </PageLayout>

    );
}

