import { useState } from "react";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
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
  <Grid className="scrollable-element" size={{ xs: 12 }} sx={{
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
    <Grid size={{ xs: 12 }} className="scrollable-element" sx={{
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


/* Lab Tests UI*/
export const TestUI = ({ Ap, openEditModal, handleDelete,height1,height2 }) => {
  return (
      < Grid size={{ xs: 12 }}>
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
                          sx={{ height: '100%',fontWeight:"bold", borderRadius: 0 }}
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
      </Grid >
  )
}

// Medicine UI
export const MedicneUI = ({ Ap, openEditModal, handleDelete,height1,height2 }) => {

  return (<Grid size={{ xs: 12 }}>
      <Card className="partition" style={{ height: height1 }}>


          <Grid container size={{ xs: 12 }}>
              <Grid size={{ xs: 6 }} style={{ padding: 8, fontWeight: 'Bold', fontSize: '20px' }}>
                  Medicines:
              </Grid>
              <Grid size={{ xs: 6 }} container>
                  <Button
                      onClick={() => openEditModal(0)}
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ height: '100%',fontWeight:"bold", borderRadius: 0 }}
                  >
                      Add Medicine
                  </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                  <hr style={{ margin: 0 }} />
              </Grid>
          </Grid>

          <CardContent style={{ paddingTop: '9px' }}>
              <Grid container justify="center" xs={12}>
                  <MedicineTable
                      medicines={Ap.medicines}
                      handleDelete={(value) => handleDelete(value, 'medicines')}
                      height={height2}
                  />
              </Grid>
          </CardContent>

      </Card>
  </Grid>)
}