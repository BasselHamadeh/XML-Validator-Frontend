import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ViewCompactSharpIcon from '@mui/icons-material/ViewCompactSharp';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import SideBar from './SideBar';
import OverviewDialog from './Overview';

const themeDark = createTheme({
  palette: {
    mode: 'dark',
    text: {
      primary: '#fff',
    },
    primary: {
      main: '#04809c',
    },
  },
});

const themeLight = createTheme({
  palette: {
    mode: 'light',
    text: {
      primary: '#000000',
    },
    primary: {
      main: '#04809c',
    },
  },
});

const ButtonAppBar = () => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('selectedTheme') || 'light');
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [lastLoggedInUser, setLastLoggedInUser] = useState('');

  useEffect(() => {
    const fetchLoginDetails = async () => {
      try {
        const response = await fetch('http://localhost:8080/login');
        if (response.ok) {
          const details = await response.json();
          if (details.length > 0) {
            const lastLogin = details.reduce((prev, current) =>
              new Date(current.jahr, current.monat - 1, current.tag, ...current.uhrzeit.split(':')) >
              new Date(prev.jahr, prev.monat - 1, prev.tag, ...prev.uhrzeit.split(':'))
                ? current
                : prev
            );
            setLastLoggedInUser(lastLogin.username);
          }
        }
      } catch (error) {
        console.error('Error fetching login details:', error.message);
      }
    };

    fetchLoginDetails();
  }, []);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem('selectedTheme', selectedTheme);
    closeDialog();
  };

  const toggleSideBar = () => {
    setSideBarOpen(!sideBarOpen);
  };

  return (
    <ThemeProvider theme={theme === 'dark' ? themeDark : themeLight}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar style={{ minHeight: 50 }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleSideBar}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            {lastLoggedInUser && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountCircleIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  {lastLoggedInUser}
                </Typography>
              </Box>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              color="inherit"
              startIcon={<ViewCompactSharpIcon />}
              onClick={openDialog}
              style={{ color: theme === 'dark' ? '#fff' : 'inherit' }}
            >
              {t('xml_validator_overview')}
            </Button>
            <OverviewDialog open={dialogOpen} onClose={closeDialog} onThemeChange={handleThemeChange} />
          </Toolbar>
        </AppBar>
      </Box>
      <SideBar open={sideBarOpen} onClose={toggleSideBar} onThemeChange={handleThemeChange} />
    </ThemeProvider>
  );
};

export default ButtonAppBar