import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const SearchBar = ({ handleSearchTermChange }) => {
  const [searchCategory, setSearchCategory] = useState('username');

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
    handleSearchTermChange({ target: { value: '' } });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginLeft: '8px' }}>
      <TextField
        variant="outlined"
        placeholder={`Search by ${searchCategory === 'username' ? 'Username' : 'Email'}...`}
        fullWidth
        margin="normal"
        onChange={(event) => {
          if (event.target.value === '' || searchCategory === 'username') {
            handleSearchTermChange(event);
          }
        }}
        style={{
          flex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          transition: 'background-color 0.3s',
        }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ color: '#04809c' }} />,
        }}
      />
      <FormControl sx={{ marginLeft: '10px' }}>
        <InputLabel id="search-category-label">Search By</InputLabel>
        <Select
          labelId="search-category-label"
          id="search-category"
          value={searchCategory}
          label="Search By"
          onChange={handleCategoryChange}
        >
          <MenuItem value="username">Username</MenuItem>
          <MenuItem value="email">Email</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default SearchBar