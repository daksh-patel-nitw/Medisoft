import React, { useEffect, useState, useCallback } from 'react';
import CustomTable from '../../components/CTable';
import { TableRow, TableCell, Button, Card, CardContent, Tab, Tabs } from '@mui/material';
import AutoComp from '../../components/CAutocomplete';
import Grid from '@mui/material/Grid2';
import PageLayout from './pageLayout';
import pharmacyServices from './services/pharmacyServices';

export default function App() {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [fval, setFval] = useState({ pid: '', pname: '' });
  const [value, setValue] = useState(0);
  const [clickedButtons, setClickedButtons] = useState([]);
  const [billed, setBill] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const response = await pharmacyServices.fetchAllMedicines();
        const data = response.data;
        console.log(data);
        setMedicines(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMedicine();
  }, []);

  useEffect(() => {
    setFilteredMedicines(
      medicines.filter((m) => m.name.toLowerCase().includes(fval.pid.toLowerCase()) || m.name.toLowerCase().includes(fval.pname.toLowerCase()))
    );
  }, [fval, medicines]);

  const handleSearch = (newValue, name) => {
    if (newValue) {
      const t = medicines[value].find((e) => e[name] === newValue);
      setFilteredMedicines(medicines[value].filter((m) => m[name].toLowerCase().includes(newValue.toLowerCase())));
      setFval({ ...fval, [name]: newValue });
    } else {
      setFilteredMedicines([]);
      setFval({ ...fval, [name]: '' });
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setFval({ pid: '', pname: '' });
    setFilteredMedicines([]);
  };

  const isButtonDisabled = (m) => {
    return clickedButtons.includes(m._id);
  };

  const handleClick = (m) => {
    console.log(m);
    setBill([...billed, m]);
    setClickedButtons((prevClickedButtons) => [...prevClickedButtons, m._id]);
  };

  const columns = ["Patient Id", "Appointment Date", "Medicine Name", "Units Required", "Unit", "Price", "Amount", "Action"];

  const generateRows = useCallback(() => {
    return filteredMedicines.map((m) => (
      <TableRow key={m.pid}>
        <TableCell>{m.pid}</TableCell>
        <TableCell>{new Date(m.createdAt).toLocaleDateString('en', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric' })}</TableCell>
        <TableCell>{m.mname}</TableCell>
        <TableCell>{m.quantity}</TableCell>
        <TableCell>{m.unit}</TableCell>
        <TableCell>{m.price}</TableCell>
        {value === 0 && (
          <>
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
          </>
        )}
      </TableRow>
    ));
  }, [filteredMedicines, value, clickedButtons]);

  const handleBill = () => {
    let table = "<table style='width: 100%; border-collapse: collapse;'>";
    table += "<tr><th style='border: 1px solid black; padding: 5px;'>Description</th><th style='border: 1px solid black; padding: 5px;'>Price</th><th style='border: 1px solid black; padding: 5px;'>Quantity</th></tr>";

    billed.forEach(item => {
      table += `<tr><td style='border: 1px solid black; padding: 5px;'>${item.mname}</td><td style='border: 1px solid black; padding: 5px;'>${(item.price * item.quantity).toFixed(2)}</td><td style='border: 1px solid black; padding: 5px;'>${item.quantity}</td></tr>`;
    });

    table += `</table><h2>Total:${total}</h2>`;

    const newWindow = window.open("", "", "height=500,width=700");
    newWindow.document.write(table);
    newWindow.document.close();
    newWindow.focus();
    newWindow.addEventListener("afterprint", () => {
      newWindow.close();
    });
    newWindow.print();

    const updated = [...billed, table, total];
    pharmacyServices.finishMedOpd(updated)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => console.error(error));

    setMedicines([medicines[0].filter((num) => !billed.includes(num)), [...medicines[1], ...billed]]);
    setFilteredMedicines([]);
    setTotal(0);
  };

  useEffect(() => {
    if (billed) {
      setTotal(billed.reduce((acc, m) => acc + (m.price * m.quantity), 0).toFixed(2));
    }
  }, [billed]);

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
            <Grid item xs={4}>
              <AutoComp name="pid" label="Patient ID" handleSearch={handleSearch} arr={medicines[value]} value={fval.pid} />
            </Grid>
            <Grid item xs={4}>
              <AutoComp name="pname" label="Patient Name" handleSearch={handleSearch} arr={medicines[value]} value={fval.pname} />
            </Grid>
            {value === 0 && (
              <>
                <Grid item xs={2}>
                  <div style={{ margin: 'auto' }}>
                    <h2>Total: {total}</h2>
                  </div>
                </Grid>
                <Grid item xs={2}>
                  {billed.length > 0 && (
                    <div style={{ margin: 'auto' }}>
                      <Button
                        style={{ margin: 'auto' }}
                        variant="contained"
                        color="primary"
                        onClick={handleBill}
                      >
                        Bill
                      </Button>
                      &emsp;
                      <Button
                        style={{ margin: 'auto' }}
                        variant="contained"
                        color="primary"
                        onClick={() => { setBill([]); setClickedButtons([]); }}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </Grid>
              </>
            )}
            <CustomTable columns={columns} rows={generateRows()} />
          </Grid>
        </CardContent>
      </Card>
    </PageLayout>
  );
}