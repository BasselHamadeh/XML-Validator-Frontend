import React from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ handleSearchTermChange }) => {
  return (
    <TextField
      variant="outlined"
      placeholder='Search User . . .'
      fullWidth
      margin="normal"
      onChange={handleSearchTermChange}
      style={{
        maxWidth: '400px',
        marginLeft: '8px',
        marginBottom: '60px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}
      InputProps={{
        startAdornment: <SearchIcon sx={{ color: '#04809c' }} />
      }}
    />
  );
};

export default SearchBar;