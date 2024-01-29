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
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(null);
  const [errorMessageShown, setErrorMessageShown] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [dropdownClicked, setDropdownClicked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/xsd');
        setXsdData(response.data.data || []);
      } catch (error) {
        console.error('Error fetching XSD data:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      setShowLoading(false);
      fetchData();
      if (dropdownClicked) {
        setErrorMessageShown(true); // Show the error message after loading only if dropdown was clicked
      }
    }, 4000);

    return () => clearTimeout(timeout);
  }, [dropdownClicked]);

  const handleChange = async (event) => {
    const selectedXSDFileName = event.target.value;
    setSelectedOption(selectedXSDFileName);

    try {
      if (!selectedXSDFileName || selectedXSDFileName.toLowerCase() === 'no file selected') {
        throw new Error('No XSD file selected');
      }

      setLoading(true);

      const response = await axios.get(`http://localhost:8080/xsd/${encodeURIComponent(selectedXSDFileName)}`, { responseType: 'blob' });
      const xsdContent = await response.data.text();
      onSelectXSD(xsdContent);
    } catch (error) {
      setServerError(error.message || 'Error fetching XSD content');
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownClick = () => {
    setDropdownClicked(true);
    setShowLoading(true); // Show loading animation on dropdown click
  };

  const handleDialogClose = () => {
    setServerError(null);
    setErrorMessageShown(false);
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Select
          value={selectedOption}
          onChange={handleChange}
          onClick={handleDropdownClick} // Track the dropdown click
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
          {showLoading && <MenuItem disabled><CircularProgress size={20} /></MenuItem>}
          {!showLoading && xsdData.map((xsdFile, index) => (
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
        maxWidth="sm" // Adjusted width
        PaperProps={{
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '10px', // Added border radius for a more rounded appearance
            maxHeight: '200px', // Set a fixed height to prevent scrollbar
            overflow: 'hidden', // Hide the scrollbar
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
            <Typography variant="h6" style={{ color: '#f44336', textAlign: 'center', marginBottom: '10px' }}>
              Server Error
            </Typography>
            <Typography variant="body1" style={{ textAlign: 'center', marginBottom: '20px' }}>
              {serverError || 'No XSD files available. Please try again later.'}
            </Typography>
          </React.Fragment>
        )}
      </Dialog>
    </Grid>
  );
}

export default XSDDropdown