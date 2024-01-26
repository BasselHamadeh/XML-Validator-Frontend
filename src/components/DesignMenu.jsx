import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
      <Button
        variant="contained"
        id="design-button"
        aria-controls={open ? 'design-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{ textTransform: 'none', marginLeft: '65px', marginTop: '20px', marginBottom: '20px' }}
      >
        {t('xml_validator_view_design')}
      </Button>
      <Menu
        id="design-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'design-button',
        }}
        style={{ marginTop: '40px' }}
      >
        <MenuItem onClick={() => handleThemeChange('dark')}>
          <Brightness4Icon />
          {t('xml_validator_view_dark_theme')}
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('light')}>
          <Brightness7Icon />
          {t('xml_validator_view_light_theme')}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default DesignMenu