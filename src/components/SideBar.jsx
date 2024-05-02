import React, { useState, useEffect } from 'react';
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
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useTranslation } from 'react-i18next';
import Settings from './Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

function SideBar({ open, onClose, onThemeChange }) {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Fetch user data from localhost:8080/login
    fetch('http://localhost:8080/login')
      .then(response => response.json())
      .then(data => {
        // Check if the last entry has the security group 'Administrators'
        const lastEntry = data[data.length - 1];
        if (lastEntry && lastEntry.gruppe === 'Administratoren') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

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

  const handleLogoutClick = () => {
    window.close();
    window.location.href = 'about:blank';
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
        {isAdmin ? (
          <>
            <ListItem key="User" disablePadding>
              <ListItemButton component={Link} to="/user">
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="User" />
              </ListItemButton>
            </ListItem>
            <hr style={{ width: '80%', margin: '10px auto' }} />
          </>
        ) : (
          <>
            <ListItem key="AccountManagement" disablePadding>
              <ListItemButton component={Link} to="/useradministrate">
                <ListItemIcon>
                  <AdminPanelSettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Account verwalten" />
              </ListItemButton>
            </ListItem>
            <hr style={{ width: '80%', margin: '10px auto' }} />
          </>
        )}
        <ListItem key="Settings" disablePadding>
          <ListItemButton onClick={handleSettingsClick}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
      <ListItem key="Logout" disablePadding>
        <ListItemButton onClick={handleLogoutClick}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary={t('xml_validator_sidebar_exit')} />
        </ListItemButton>
      </ListItem>
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

      {isSettingsOpen && (
        <Settings
          open={isSettingsOpen}
          onClose={handleSettingsClose}
          onThemeChange={onThemeChange}
        />
      )}
    </div>
  );
}

export default SideBar