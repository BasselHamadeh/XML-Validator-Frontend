import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/system';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import DesignMenu from './DesignMenu';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';

const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    width: '80vw',
    maxWidth: '700px',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiGrid-container': {
    alignItems: 'center',
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  justifyContent: 'flex-start',
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const Settings = ({ onThemeChange, onClose = () => {} }) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || i18n.language);
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('selectedTheme') || 'light');

  useEffect(() => {
    setOpen(true);
    document.title = 'XML Validator | Settings';
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('selectedLanguage', selectedLanguage);
    localStorage.setItem('selectedTheme', selectedTheme);

    i18n.changeLanguage(selectedLanguage);

    console.log('Einstellungen gespeichert:', { selectedLanguage, selectedTheme });

    window.location.reload();

    setOpen(false);
    onClose();
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    onThemeChange(theme);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    onClose();
    document.title = 'XML Validator';
  };  

  return (
    <StyledDialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleCloseDialog}
      aria-labelledby="responsive-dialog-title"
    >
      <StyledDialogTitle>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={9}>
            <Typography variant="h4" style={{ textAlign: 'left', marginBottom: '1rem' }}>
              {t('xml_validator_view_setting')}
            </Typography>
          </Grid>
          <Grid item xs={3} style={{ textAlign: 'right' }}>
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </StyledDialogTitle>
      <StyledDialogContent>
        <Typography variant="subtitle1" gutterBottom style={{ marginTop: '20px', fontWeight: 'bold' }}>
          {t('xml_validator_view_language')}
        </Typography>
        <StyledSelect
          label={t('xml_validator_view_language_focus')}
          value={selectedLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          fullWidth
          margin="none"
        >
          <MenuItem value="en">{t('xml_validator_view_englisch')}</MenuItem>
          <MenuItem value="de">{t('xml_validator_view_german')}</MenuItem>
        </StyledSelect>
        <StyledDivider />
        <DesignMenu onThemeChange={handleThemeChange} />
        <StyledDivider />
      </StyledDialogContent>
      <StyledDialogActions>
        <Button autoFocus onClick={handleSaveSettings} variant="contained" color="primary">
          {t('xml_validator_view_setting_save')}
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default Settings