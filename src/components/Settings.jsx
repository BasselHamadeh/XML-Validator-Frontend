import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DesignMenu from './DesignMenu';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

const Settings = ({ onThemeChange }) => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('selectedTheme') || 'light');

  const handleSaveSettings = () => {
    console.log('Einstellungen gespeichert:', { selectedLanguage, selectedTheme });
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    onThemeChange(theme);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language).then(() => {
      window.location.reload();
    });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Paper elevation={0} sx={{ padding: 3, maxWidth: 400, margin: 'auto', backgroundColor: 'transparent' }}>
        <Typography variant="h5" gutterBottom>
          {t('xml_validator_view_setting')}
        </Typography>
        <Divider sx={{ marginY: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          {t('xml_validator_view_language')}
        </Typography>
        <Select
          label={t('xml_validator_view_language_focus')}
          value={selectedLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="de">Deutsch</MenuItem>
        </Select>
        <Divider sx={{ marginY: 2 }} />
        <DesignMenu onThemeChange={handleThemeChange} />
        <Divider sx={{ marginY: 2 }} />
        <Button variant="contained" color="primary" onClick={handleSaveSettings}>
          {t('settings_save')}
        </Button>
      </Paper>
    </Box>
  );
};

export default Settings