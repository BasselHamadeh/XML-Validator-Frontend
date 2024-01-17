import React, { useState, useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import axios from 'axios';

function Dropdown({ onSelectXSD }) {
  const [xsdData, setXsdData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/xsd')
      .then(response => setXsdData(response.data.data || []))
      .catch(error => console.error('Error fetching XSD data:', error));
  }, []);

  const handleChange = async (event) => {
    const selectedXSDFileName = event.target.value;
    setSelectedOption(selectedXSDFileName);
  
    try {
      const response = await axios.get(`http://localhost:8080/xsd/${encodeURIComponent(selectedXSDFileName)}`);
      const xsdContent = response.data.data;
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
    <MenuItem key={index} value={xsdFile}>
      {xsdFile}
    </MenuItem>
  ))}
</Select>
      </Grid>
    </Grid>
  );
}

export default Dropdown