import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ handleSearchChange }) => {
  const [searchCategory, setSearchCategory] = useState('username');
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
    handleSearchChange(searchTerm, event.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px', marginLeft: '8px' }}>
      <TextField
        variant="outlined"
        placeholder={t('xml_validator_user_search_placeholder', { searchCategory: searchCategory === 'username' ? 'Benutzernamen' : 'E-Mail' })}
        fullWidth
        margin="normal"
        onChange={(event) => {
          setSearchTerm(event.target.value);
          handleSearchChange(event.target.value, searchCategory);
        }}
        style={{
          width: '40%',
          backgroundColor: 'white',
          transition: 'background-color 0.3s',
        }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ color: '#04809c' }} />,
        }}
        autoComplete="off"
      />
      <FormControl sx={{ width: '17%', marginTop: '10px', borderRadius: '4px', backgroundColor: 'white' }}>
        <Select
          labelId="search-category-label"
          id="search-category"
          value={searchCategory}
          onChange={handleCategoryChange}
          sx={{ '&:before': { borderBottomColor: '#04809c' } }}
        >
          <InputLabel id="search-category-label" sx={{ color: '#04809c', position: 'absolute', top: -8, left: 8, pointerEvents: 'none' }}></InputLabel>
            <MenuItem value="username">{t('xml_validator_user_username')}</MenuItem>
            <MenuItem value="email">{t('xml_validator_user_email')}</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default SearchBar