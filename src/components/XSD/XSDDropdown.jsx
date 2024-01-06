import React, { useState, useEffect } from 'react';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import axios from 'axios';

function Dropdown() {
  const [xsdData, setXsdData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/xsd')
      .then(response => setXsdData(response.data.data || []))
      .catch(error => console.error('Error fetching XSD data:', error));
  }, []);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
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
            width: '100%',
            backgroundColor: '#fff',
            color: 'black',
          }}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {Array.isArray(xsdData) && xsdData.map((xsdFile, index) => (
            <option key={index} value={xsdFile}>
              {xsdFile}
            </option>
          ))}
        </Select>
      </Grid>
    </Grid>
  );
}

export default Dropdown