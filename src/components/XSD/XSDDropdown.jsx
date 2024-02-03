import React, { useState, useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import WarningIcon from '@mui/icons-material/Warning';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

function XSDDropdown({ onSelectXSD }) {
  const [xsdData, setXsdData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [serverError, setServerError] = useState(null);
  const [errorMessageShown, setErrorMessageShown] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [dropdownClicked, setDropdownClicked] = useState(false);
  const [errorDisplayed, setErrorDisplayed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/xsd');
        setXsdData(response.data.data || []);
        setShowLoading(false);
      } catch (error) {
        console.error('Error fetching XSD data:', error);
        setServerError(error.message || 'Error fetching XSD data');
        setErrorMessageShown(true);
        setErrorDisplayed(true);
      }
    };

    const timeout = setTimeout(() => {
      if (!dropdownClicked && !errorDisplayed) {
        setShowLoading(false);
        fetchData();
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [dropdownClicked, errorDisplayed]);

  const handleChange = async (event) => {
    const selectedXSDFileName = event.target.value;
    setSelectedOption(selectedXSDFileName);

    try {
      if (!selectedXSDFileName || selectedXSDFileName.toLowerCase() === 'no file selected') {
        throw new Error('No XSD file selected');
      }

      const response = await axios.get(`http://localhost:8080/xsd/${encodeURIComponent(selectedXSDFileName)}`, { responseType: 'json' });
      const xsdContent = response.data.data;

      onSelectXSD(xsdContent);
    } catch (error) {
      setServerError(error.message || 'Error fetching XSD content');
    }
  };

  const handleDropdownClick = () => {
    setDropdownClicked(true);
    setShowLoading(!selectedOption);
  };

  const handleDialogClose = () => {
    setServerError(null);
    setErrorMessageShown(false);
    setErrorDisplayed(false);
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Select
          value={selectedOption}
          onChange={handleChange}
          onClick={handleDropdownClick}
          style={{
            marginTop: '10px',
            marginBottom: '20px',
            height: '42px',
            width: '95%',
            backgroundColor: '#fff',
            color: 'black',
          }}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {showLoading && !selectedOption && <MenuItem disabled><CircularProgress size={20} /></MenuItem>}
          {xsdData.map((xsdFile, index) => (
            <MenuItem key={index} value={xsdFile.fileName}>
              {xsdFile.fileName}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Dialog
        open={!!serverError || (errorMessageShown && !xsdData.length)}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '10px',
            maxHeight: '200px',
            overflow: 'hidden',
          },
        }}
      >
        {(serverError || (errorMessageShown && !xsdData.length)) && (
          <React.Fragment>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleDialogClose}
              style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
              <CloseIcon />
            </IconButton>
            <WarningIcon fontSize="large" style={{ color: '#f44336', marginBottom: '10px' }} />
            <Typography variant="h5" style={{ color: '#f44336', textAlign: 'center', marginBottom: '10px' }}>
              Server Error
            </Typography>
            <Typography style={{ color: '#000', textAlign: 'center', marginBottom: '4px' }}>
              Keine XSD-Dateien vorhanden. Starte den Server, um XSD-Dateien zu erhalten.
            </Typography>
          </React.Fragment>
        )}
      </Dialog>
    </Grid>
  );
}

export default XSDDropdown