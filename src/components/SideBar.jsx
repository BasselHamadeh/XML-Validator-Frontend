import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import DesignMenu from './DesignMenu';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';

function SideBar({ open, onClose, onThemeChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const toggleDrawer = (event, closeMenu = true) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    if (closeMenu) {
      onClose();
    }
  };

  const handleHomeClick = () => {
    setIsMenuOpen(false);
    onClose();
  };

  const list = () => (
    <Box
      sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%' }}
      role="presentation"
      onClick={(event) => toggleDrawer(event, false)}
      onKeyDown={(event) => toggleDrawer(event, false)}
    >
      <IconButton onClick={() => toggleDrawer({}, true)} style={{ alignSelf: 'flex-start', margin: '5px' }}>
        <CloseIcon />
      </IconButton>
      <List sx={{ flexGrow: 1 }}>
        <ListItem key="Home" disablePadding>
          <ListItemButton component={Link} to="/" onClick={() => { handleHomeClick(); setIsMenuOpen(true); toggleDrawer({}, true); }}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={t('xml_validator_view_home')} />
          </ListItemButton>
        </ListItem>
        <ListItem key="User" disablePadding>
          <ListItemButton component={Link} to="/user" onClick={() => { setIsMenuOpen(true); toggleDrawer({}, true); }}>
            <ListItemIcon>
              <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText primary={t('xml_validator_view_user')} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <DesignMenu onThemeChange={onThemeChange} sx={{ alignSelf: 'center', marginY: 'auto' }} />
      <Divider />
      <Grid container direction="column" justifyContent="flex-end" alignItems="flex-start" sx={{ height: '100%' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { setIsMenuOpen(true); toggleDrawer({}, true); }}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary={t('xml_validator_view_logout')} />
            </ListItemButton>
          </ListItem>
        </List>
      </Grid>
    </Box>
  );

  return (
    <div>
      <Drawer
        anchor="left"
        open={open || (isMenuOpen)}
        onClose={() => {
          setIsMenuOpen(false);
          onClose();
        }}
        onOpen={() => setIsMenuOpen(true)}
      >
        {list()}
      </Drawer>
    </div>
  );
}

export default SideBar