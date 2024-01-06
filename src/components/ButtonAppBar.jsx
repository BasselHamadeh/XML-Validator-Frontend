import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ViewCompactSharpIcon from '@mui/icons-material/ViewCompactSharp';
import MenuIcon from '@mui/icons-material/Menu';
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
  const [theme, setTheme] = useState('light');
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
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

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
            <Button
              color="inherit"
              startIcon={<ViewCompactSharpIcon />}
              onClick={openDialog}
              style={{ color: theme === 'dark' ? '#fff' : 'inherit' }}
            >
              {t('xml_validator_view_settings')}
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