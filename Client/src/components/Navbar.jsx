import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {useAppstore} from './appstore';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor:'#1F3F49',
    color:'white'
  }
}));

export default function DenseAppBar(props) {
  const classes = useStyles();
    const setOpen=useAppstore((state)=>state.updateOpen);
    const open=useAppstore((state)=>state.doopen);

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={()=>setOpen(!open)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            {props.name}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
