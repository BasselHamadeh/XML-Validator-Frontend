import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DesignMenu from './DesignMenu';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useTranslation } from 'react-i18next';

const Settings = ({ onThemeChange, onClose }) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || i18n.language);
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('selectedTheme') || 'light');

  const handleSaveSettings = () => {
    localStorage.setItem('selectedLanguage', selectedLanguage);
    localStorage.setItem('selectedTheme', selectedTheme);

    i18n.changeLanguage(selectedLanguage);

    console.log('Einstellungen gespeichert:', { selectedLanguage, selectedTheme });

    setOpen(false); // Schließen Sie den Dialog nach dem Speichern der Einstellungen
    window.location.reload();
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    onThemeChange(theme);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Paper elevation={0} sx={{ padding: 3, maxWidth: 400, margin: 'auto', backgroundColor: 'transparent' }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={9}>
              <Typography variant="h4" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                {t('xml_validator_view_setting')}
              </Typography>
            </Grid>
            <Grid item xs={3} style={{ textAlign: 'right' }}>
              <IconButton onClick={() => setOpen(true)}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>

          <Divider sx={{ marginY: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            {t('xml_validator_view_language')}
          </Typography>
          <Select
            label={t('xml_validator_view_language_focus')}
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            fullWidth
            margin="none"
          >
            <MenuItem value="en">{t('xml_validator_view_englisch')}</MenuItem>
            <MenuItem value="de">{t('xml_validator_view_german')}</MenuItem>
          </Select>
          <Divider sx={{ marginY: 2 }} />

          <DesignMenu onThemeChange={handleThemeChange} />

          <Divider sx={{ marginY: 2 }} />

          <Grid container justifyContent="center">
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleSaveSettings}>
                {t('xml_validator_view_setting_save')}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle style={{ fontWeight: 'bold' }}>
          {t('xml_validator_view_settings')}
          <IconButton aria-label="close" onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box>
            <Typography variant="h4" style={{ textAlign: 'left', marginBottom: '1rem' }}>
              {t('xml_validator_view_setting')}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Settings;
