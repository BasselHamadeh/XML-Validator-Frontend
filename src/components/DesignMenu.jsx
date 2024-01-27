import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTranslation } from 'react-i18next';

const DesignMenu = ({ onThemeChange }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('selectedTheme') || 'light');
  const open = Boolean(anchorEl);

  useEffect(() => {
    console.log('Current Theme in DesignMenu:', selectedTheme);
    onThemeChange(selectedTheme);
  }, [selectedTheme, onThemeChange]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    localStorage.setItem('selectedTheme', theme);
    handleClose();
  };

  return (
    <div>
      <Typography variant="body1" style={{ marginLeft: '10px', marginTop: '10px', marginBottom: '10px' }}>
        {t('xml_validator_view_design')}
      </Typography>
      <div
        aria-controls={open ? 'design-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{ marginLeft: '10px', marginTop: '10px', marginBottom: '10px' }}
      >
        <Brightness4Icon />
        {t('xml_validator_view_dark_theme')}
        <Switch
          color="primary"
          checked={selectedTheme === 'dark'}
          onChange={() => handleThemeChange(selectedTheme === 'dark' ? 'light' : 'dark')}
        />
      </div>
      <div
        aria-controls={open ? 'design-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{ marginLeft: '10px', marginTop: '10px', marginBottom: '10px' }}
      >
        <Brightness7Icon />
        {t('xml_validator_view_light_theme')}
        <Switch
          color="primary"
          checked={selectedTheme === 'light'}
          onChange={() => handleThemeChange(selectedTheme === 'dark' ? 'light' : 'dark')}
        />
      </div>
    </div>
  );
};

export default DesignMenu