import { useState } from "react";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import './styles.css';

export const sidebar_utils = [
  {
    label: 'OPD Patients', path: "/diagnoseOPD"
    , icon: 'AssistWalker'
  },
  {
    label: 'IPD Patients', path: "/diagnoseIPD"
    , icon: 'Hotel'
  },
  {
    label: 'My Appointments', path: "/doctorSettings"
    , icon: 'ManageAccounts'
  },
]

export const MedicineTable = ({ medicines, handleDelete, height }) => (
  <Grid className="scrollable-table" size={{ xs: 12 }} sx={{
    maxHeight: height,
    overflowY: 'auto'
  }}>
    <table class='table'>
      {medicines?.length > 0 ? (
        <>
          <thead>
            <tr>
              {['Name', 'Time', 'Package<br>Size', 'Package<br>Quantity', 'Free<br>Quantity', 'Delete'].map((a, index) => (
                <th key={index} dangerouslySetInnerHTML={{ __html: a }}></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {medicines.map(item => (
              <tr>
                <td>{item.name}</td>
                <td><ol>{item.time.map(x => (<li>{x}</li>))}</ol></td>
                <td>{item.ps}</td>
                <td>{item.ps_u}</td>
                <td>{item.ps_c}</td>
                <td>
                  <IconButton onClick={() => handleDelete(item._id)}>
                    <Delete />
                  </IconButton>
                </td>
              </tr>))}
          </tbody>
        </>
      ) :
        <tr>
          <td class="noBorder" colSpan={4}  >
            <h2>No Medicines</h2>
          </td>
        </tr>
      }

    </table>
  </Grid >
)

export const TestView = ({ tests, handleDelete, height }) => (
  <>
    <Grid size={{ xs: 3 }} />
    <Grid size={{ xs: 12 }} className="scrollable-table" sx={{
      maxHeight: height,
      overflowY: 'auto'
    }}>
      <table class='table'>
        {tests?.length > 0 ?
          <>
            <tr>
              {['Name', 'Delete'].map((a) => (
                <th>{a}</th>
              ))}
            </tr>
            <tbody>
              {tests.map(item => (
                <tr>
                  <td>{item.name}</td>
                  <td>
                    <IconButton onClick={() => handleDelete(item._id)}>
                      <Delete />
                    </IconButton>
                  </td>
                </tr>))}
            </tbody>
          </>
          :
          <tr >
            <td class="noBorder" colSpan={4}  >
              <h2>No Tests</h2>
            </td>
          </tr>
        }
      </table>
    </Grid>
  </>
)

export const TestUI = ({ height1,height2,openEditModal }) => {
  const handleDelete = (value, column) => {
    setAp((prevAp) => ({
      ...prevAp,
      [column]: prevAp[column].filter((item) => item._id !== value),
    }));
  };

  (

    <Card className="partition" style={{ height: height1 }}>
      <Grid container size={{ xs: 12 }}>
        <Grid size={{ xs: 6 }} style={{ padding: 8, fontWeight: 'Bold', fontSize: '20px' }}>
          Lab Tests:
        </Grid>
        <Grid size={{ xs: 6 }} container>
          <Button
            onClick={() => openEditModal(1)}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ height: '100%', borderRadius: 0 }}
          >
            Add Test
          </Button>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <hr style={{ margin: 0 }} />
        </Grid>
      </Grid>

      <CardContent style={{ paddingTop: '9px' }}>
        <Grid container justify="center" xs={12}>
          <TestView height={height2} tests={Ap.tests} handleDelete={(value) => handleDelete(value, 'tests')} />
        </Grid>
      </CardContent>
    </Card>
  )
}