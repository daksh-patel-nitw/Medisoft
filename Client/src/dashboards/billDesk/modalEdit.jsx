import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material/';
import Grid from '@mui/material/Grid2';
import './styles.css';
import { toast } from 'react-toastify';
import { Invoice } from './invoice';
import { apis } from '../../Services/commonServices'

const EditModal = ({ open, handleClose, patient, data, done }) => {
  const initialState = Object.keys(data.bills).reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

  const [selectedItems, setSelectedItems] = useState(initialState);
  const [total, setTotal] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setSelectedItems(initialState);
    setTotal(0);
    setConfirmed(false);
  }, [open, data]);

  const isCategorySelected = (category) => {
    return data.bills[category].length > 0 && selectedItems[category].length === data.bills[category].length;
  };

  const isAllSelected = () => {
    return Object.keys(data.bills).every(category => isCategorySelected(category));
  };

  const handleCheckboxChange = (category, item) => {
    setSelectedItems((prev) => {
      const isSelected = prev[category].some(selectedItem => selectedItem._id === item._id);
      const updatedCategory = isSelected
        ? prev[category].filter(selectedItem => selectedItem._id !== item._id)
        : [...prev[category], item];

      return { ...prev, [category]: updatedCategory };
    });

    setTotal((prevTotal) =>
      selectedItems[category].some(selectedItem => selectedItem._id === item._id)
        ? prevTotal - item.price
        : prevTotal + item.price
    );

    setConfirmed(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedItems((prev) => {
      const allSelected = isCategorySelected(category);
      const newSelection = allSelected ? [] : [...data.bills[category]];

      return { ...prev, [category]: newSelection };
    });

    const categoryTotal = data.bills[category].reduce((sum, item) => sum + item.price, 0);
    setTotal((prevTotal) => (isCategorySelected(category) ? prevTotal - categoryTotal : prevTotal + categoryTotal));
  };

  const handleSelectAll = () => {
    if (isAllSelected()) {
      setSelectedItems(initialState);
      setTotal(0);
    } else {
      const newSelectedItems = Object.keys(data.bills).reduce((acc, category) => {
        acc[category] = [...data.bills[category]];
        return acc;
      }, {});
      const totalAmount = Object.values(data.bills).flat().reduce((sum, item) => sum + item.price, 0);
      setSelectedItems(newSelectedItems);
      setTotal(totalAmount);
    }
    setConfirmed(false);
  };

  const handleSubmit = async () => {
    const result = {};

    Object.keys(selectedItems).forEach(category => {
      result[category] = selectedItems[category].map(({ _id, id }) => ({ _id, id }));
    });

    const status = await apis.noTokenStatusPutRequest('/appointment/confirmBill', { aid: data.aid, ...result })

    if (status === 200) {
      Object.keys(selectedItems).forEach(category => {
        data.bills[category] = data.bills[category].filter(
            item => !selectedItems[category].some(selectedItem => selectedItem._id === item._id)
        );

        // Remove category if it becomes empty
        if (data.bills[category].length === 0) {
            delete data.bills[category];
        }
    });

      
     

      setTotal(0);
      setConfirmed(false);
      handleClose();

    }

    // return result;
    console.log({ aid: data.aid, ...result });
  };

  const invoiceRef = useRef();

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = invoiceRef.current?.innerHTML;

    if (!printContent) {
      toast.error("Nothing to print!");
      return;
    }

    // Include styles
    const styles = [...document.styleSheets]
      .map((sheet) => {
        try {
          return [...sheet.cssRules].map(rule => rule.cssText).join("\n");
        } catch (error) {
          return "";
        }
      })
      .join("\n");

    printWindow.document.write(`
        <html>
            <head>
                <style>${styles}</style>
            </head>
            <body>
                <div class="print-container">${printContent}</div>
            </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };



  const handleNext = () => {
    const isEmpty = Object.values(selectedItems).every(arr => arr.length === 0);

    if (isEmpty) {
      toast.error("Please select at least one item");
    } else {
      setConfirmed(true);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Grid container spacing={1}>
          <Grid size={{ xs: 5 }} className="head1">{patient.pname}</Grid>
          <Grid size={{ xs: 2 }} className="head1">
            {`${Object.values(selectedItems).flat().length} / ${Object.values(data.bills).flat().length} Selected`}

          </Grid>
          <Grid size={{ xs: 5 }} className="head2">
            {confirmed ?

              <Button variant="contained" color="primary" onClick={handlePrint}>
                Print Bill
              </Button> :
              <>
                Total: <strong>{total}</strong>
              </>
            }
          </Grid>

        </Grid>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={1} className="bill-container">
          {confirmed ?
            <div ref={invoiceRef} className='print-container'>
              < Invoice
                dname={data.dname}
                patient={patient}
                aid={data.aid}
                selectedItems={selectedItems}
                total={total}
                mobile={9889} /></div>
            :
            <Grid size={{ xs: 12 }} key="bill-table">
              <table className="h-table">
                <thead>
                  <tr>
                    <th className='head1'>
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={isAllSelected()}
                      />

                    </th>
                    <th colSpan={2}>Doctor Name: {data.dname}</th>
                    <th>Schedule Date: {data.schedule_date}</th>
                  </tr>
                </thead>
              </table>
              <table className="bill-table">

                <tbody>
                  {Object.keys(data.bills).map((category) => (
                    <React.Fragment key={category}>
                      {/* Category Header with Checkbox */}
                      <tr>
                        <td className="subCategory" colSpan={4}>

                          {category.charAt(0).toUpperCase() + category.slice(1)}:
                        </td>
                      </tr>
                      <tr>
                        <th>

                          <input
                            type="checkbox"
                            onChange={() => handleCategorySelect(category)}
                            checked={isCategorySelected(category)}
                          />

                        </th>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Price</th>
                      </tr>

                      {/* Category Data */}
                      {data.bills[category].map((item) => (
                        <tr key={item._id}>
                          <td>
                            <input
                              type="checkbox"
                              onChange={() => handleCheckboxChange(category, item)}
                              checked={selectedItems[category].some(selectedItem => selectedItem._id === item._id)}
                            />
                          </td>
                          <td>{item.date}</td>
                          <td>{item.name}</td>
                          <td>{item.price}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </Grid>
          }

        </Grid>
      </DialogContent>
      <DialogActions>
        {confirmed ?
          <Button onClick={() => setConfirmed(false)} color="primary">Back</Button> :
          <Button onClick={handleClose} color="primary">Cancel</Button>}

        {confirmed ? <Button onClick={handleSubmit} color="primary">Confirm</Button> :
          <Button onClick={handleNext} color="primary">Next</Button>}
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
