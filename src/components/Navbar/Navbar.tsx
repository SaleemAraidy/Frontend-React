import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="static" sx={{backgroundColor: "#0A66C2",color:"white"}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Button component={NavLink} to="/" color="inherit">Home</Button>
          <Button component={NavLink} to="/login" color="inherit">Login</Button>
          <Button component={NavLink} to="/register" color="inherit">Register</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
