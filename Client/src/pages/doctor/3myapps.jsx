import React from 'react';
import { useState,useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PageLayout from './pageLayout';
import { InputLabel,FormControl,FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Chip from '@material-ui/core/Chip';


export default function App()
{
  
  return (

    <PageLayout>
      <Grid container spacing={2} >
        <Grid item xs={6}>
          <Card className="partition" style={{height:500}}>
            My Apps {}
          </Card>
          {/* http://localhost:5000/api/seeappointment/E000000C */}
        
      </Grid>
      </Grid>
    </PageLayout>

  );
}
