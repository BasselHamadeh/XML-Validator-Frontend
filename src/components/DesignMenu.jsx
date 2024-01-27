import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTranslation } from 'react-i18next';

const DesignMenu = ({ onThemeChange }) => {
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('selectedTheme') || 'light');

  useEffect(() => {
    onThemeChange(selectedTheme);
  }, [selectedTheme, onThemeChange]);

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    localStorage.setItem('selectedTheme', theme);
  };

  return (
    <div style={{ marginLeft: '10px', marginTop: '10px', marginBottom: '10px' }}>
      <Typography variant="body1">{t('xml_validator_view_design')}</Typography>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Brightness4Icon style={{ marginRight: '5px' }} />
        <Typography variant="body1" style={{ marginRight: '10px' }}>
          {t('xml_validator_view_dark_theme')}
        </Typography>
        <Switch
          color="primary"
          checked={selectedTheme === 'dark'}
          onChange={() => handleThemeChange(selectedTheme === 'dark' ? 'light' : 'dark')}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <Brightness7Icon style={{ marginRight: '5px' }} />
        <Typography variant="body1" style={{ marginRight: '10px' }}>
          {t('xml_validator_view_light_theme')}
        </Typography>
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