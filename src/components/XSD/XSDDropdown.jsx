import React, { useState, useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import axios from 'axios';

function XSDDropdown({ onSelectXSD }) {
  const [xsdData, setXsdData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/xsd')
      .then(response => setXsdData(response.data.data || []))
      .catch(error => console.error('Error fetching XSD data:', error));
  }, []);

  const handleChange = async (event) => {
    const selectedXSDFileName = event.target.value;
    setSelectedOption(selectedXSDFileName);

    try {
      if (!selectedXSDFileName || selectedXSDFileName.toLowerCase() === 'no file selected') {
        console.error('No XSD file selected');
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Select
          value={selectedOption}
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
    </Grid>
  );
}

export default XSDDropdown