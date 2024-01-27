import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home'; // Placeholder for Home icon
import PersonIcon from '@mui/icons-material/Person'; // Placeholder for User icon
import { Link } from 'react-router-dom';
import Settings from './Settings';
import Dialog from '@mui/material/Dialog';

function SideBar({ open, onClose, onThemeChange }) {
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const handleHomeClick = () => {
    onClose();
  };

  const handleSettingsClick = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  const toggleDrawer = (event, closeMenu = true) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    if (closeMenu) {
      onClose();
    }
  };

  const list = () => (
    <Box
      sx={{
        width: 250,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        textAlign: 'center',
      }}
      role="presentation"
      onClick={(event) => toggleDrawer(event, false)}
      onKeyDown={(event) => toggleDrawer(event, false)}
    >
      <IconButton onClick={() => toggleDrawer({}, true)} style={{ alignSelf: 'flex-start', margin: '5px' }}>
        <CloseIcon />
      </IconButton>
      <List sx={{ flexGrow: 1 }}>
        <ListItem key="Home" disablePadding>
          <ListItemButton component={Link} to="/" onClick={handleHomeClick}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <hr style={{ width: '80%', margin: '10px auto' }} />
        <ListItem key="User" disablePadding>
          <ListItemButton component={Link} to="/user">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="User" />
          </ListItemButton>
        </ListItem>
        <hr style={{ width: '80%', margin: '10px auto' }} />
        <div style={{ marginTop: 'auto' }}>
          <ListItem key="Settings" disablePadding>
            <ListItemButton onClick={handleSettingsClick}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </div>
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => {
          setSettingsOpen(false);
          onClose();
        }}
      >
        {list()}
      </Drawer>
      <Dialog open={isSettingsOpen} onClose={handleSettingsClose} fullWidth maxWidth="sm">
        <Settings onThemeChange={onThemeChange} />
      </Dialog>
    </div>
  );
}

export default SideBar