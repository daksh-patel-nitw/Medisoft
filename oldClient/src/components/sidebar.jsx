import React,{useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import * as Icons from '@material-ui/icons';
import {useNavigate, useLocation } from 'react-router-dom';
import {useAppstore} from './appstore';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(0) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7) + 1,
    },
  },
  toolbar: {
    height:'41px'
  },
  active: {
    backgroundColor: '#ebebeb',
    color:'black',
    '&:hover': {
      backgroundColor: '#d5d1d1',
    },
  },
  colorme:{
    backgroundColor:'#1F3F49',
    color:'white'
  },
  cin:{
    backgroundColor:'inherit',
    color:'inherit'
  }
}));

export default function MiniDrawer(props) {
  const classes = useStyles();
  const navigate=useNavigate();
  const [activeTab, setActiveTab] = useState('');
  const location = useLocation();
  const handleListItemClick = (event, path) => {
    navigate(path);
    setActiveTab(path);
  };

  const open=useAppstore((state)=>state.doopen);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
            [classes.colorme]: true,
          }),
        }}
      >
        <div className={classes.toolbar}/>
        <List >
          {props.arr.map((item)=>(
            <ListItem button key={item.label} className={clsx({
              [classes.active]: location.pathname === item.path,
            })}
            onClick={(event) => handleListItemClick(event, item.path)}>
              <ListItemIcon className={classes.cin}> {React.createElement(Icons[item.icon])} </ListItemIcon>
              <ListItemText primary={item.label} />
          </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
}
