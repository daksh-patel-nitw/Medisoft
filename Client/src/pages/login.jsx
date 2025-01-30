import React, { useState } from "react";
import Pharmacy from "./pharmacy/1newMedicine";

// import IPD from "./ipd-reception/1newRoom";
// import Lab from "./lab/1newtest";
// import OPD1 from "./opd-1-reception/1newRegister";
// import OPD2 from "./opd-2-reception/1confirmP";
// import Doc from "./doctor/2.patDoc";
// import Bill from "./billDesk/1billshow";
// import Admin from "./admin/1newAdmin";
// import Patient from "./patient/1view";
// import { useNavigate } from 'react-router-dom';


import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Card, CardContent } from '@material-ui/core';

function LoginWithLocalStorage(){
    const handleInputChange=(event)=>{
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    }
   
    const getId=localStorage.getItem("id")
    const getType=localStorage.getItem("type")
    const [formValues, setFormValues] = useState({ uname: '',  password: '',  });
    const navigate = useNavigate();

    const getTarget=()=>{
        switch (getType) {
            case 'pharmacy':
              // history.push('/pharmacy');
              return 1;
            case 'ipd':
              return <IPD/>;
            case "opd1":
              navigate('/newregister');
              // return <OPD1/>;
            case "opd2":
              return <OPD2/>;
            case "doctor":
              return <Doc/>;
            case "lab":
              return <Lab/>;
            case "admin":
              return <Admin/>;
            case "patient":
              return <Patient/>;
            case "bill":
              return <Bill/>;
            default:
              return alert('This is default');
          }
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log(e);
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
          });         
       
        if (response.status === 200) {
            const user = await response.json();
            localStorage.setItem("id",user.id);
            localStorage.setItem("type",user.type);
            if(user.dep){
              localStorage.setItem('dep',user.dep);
            }
            window.location.reload();
          } else if (response.status === 401) {
            console.error('Invalid username or password');
          } else {
            console.error('Something went wrong');
          }
    }
   
    return(
        
            
                getId&&getType?
                getTarget():
           
           
                
                <Grid container style={{width:'400px',margin:'auto',heigth:'400px'}} justifyContent="center" alignItems="center" spacing={2}> <form onSubmit={handleSubmit}>
                    <Card className="partition">
                        <CardContent>
                            <Grid container style={{marginTop:8}}   spacing={2}>
                            <Grid item ><h1 align="center">Login Here</h1></Grid>
                            <Grid item xs={12}>
                                    <TextField
                                    fullWidth
                                    name="uname"
                                    id="uname"
                                    label="Username"
                                    variant="outlined"
                                    value={formValues['uname']}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                    <TextField
                                    fullWidth
                                    name="password"
                                    id="password"
                                    label="Password"
                                    variant="outlined"
                                    value={formValues['password']}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                            <Button type="submit" color="primary" size="medium" variant="contained">
                                Login
                            </Button></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    </form>
                </Grid>
               
               
          
            
        
    )
}
export default LoginWithLocalStorage;

