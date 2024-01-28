import React, { useState, useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import WarningIcon from '@mui/icons-material/Warning';
import axios from 'axios';

function XSDDropdown({ onSelectXSD }) {
  const [xsdData, setXsdData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/xsd')
      .then(response => {
        setXsdData(response.data.data || []);
      })
      .catch(() => {
        console.error('Error fetching XSD data');
      });
  }, []);

  const handleChange = async (event) => {
    const selectedXSDFileName = event.target.value;
    setSelectedOption(selectedXSDFileName);

    try {
      if (!selectedXSDFileName || selectedXSDFileName.toLowerCase() === 'no file selected') {
        console.error('No XSD file selected');
        setServerError(true);
        return;
      }

      const response = await axios.get(`http://localhost:8080/xsd/${encodeURIComponent(selectedXSDFileName)}`, { responseType: 'blob' });
      console.log('Response Data:', response.data);
      console.log('Response Content-Type:', response.headers['content-type']);

      const xsdContent = await response.data.text();
      onSelectXSD(xsdContent);
    } catch (error) {
      console.error('Error fetching XSD content:', error);
    }
  };

  const handleDialogClose = () => {
    setServerError(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Select
          value={selectedOption}
          onClick={() => setServerError(!xsdData.length)}
          onChange={handleChange}
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
          {Array.isArray(xsdData) && xsdData.map((xsdFile, index) => (
            <MenuItem key={index} value={xsdFile.fileName}>
              {xsdFile.fileName}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Dialog open={serverError} onClose={handleDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle style={{ backgroundColor: '#f44336', color: 'white', textAlign: 'center' }}>
          <WarningIcon fontSize="large" style={{ marginRight: '8px' }} />
          <Typography variant="h6">Server Error</Typography>
        </DialogTitle>
        <DialogContent style={{ backgroundColor: '#f44336', color: 'white' }}>
          <DialogContentText style={{ textAlign: 'center', fontWeight: 'bold' }}>
            The server is not started! Please start the server at http://localhost:8080. Refresh once you're done.
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ backgroundColor: '#f44336', padding: '8px', justifyContent: 'center' }}>
          <Button onClick={handleDialogClose} variant='contained'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default XSDDropdown