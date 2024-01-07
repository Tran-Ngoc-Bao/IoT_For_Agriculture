import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, IconButton, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';
import { useState } from 'react';

export const DevicesSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        placeholder="Search device"
        startAdornment={(
          <InputAdornment position="start">
            <SvgIcon
              color="action"
              fontSize="small"
            >
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        )}
        sx={{ maxWidth: 500 }}
        endAdornment={(
          <InputAdornment position="end">
            <SvgIcon
              color="action"
              fontSize="small"
            >
              <IconButton onClick={handleSearch}>
                <MagnifyingGlassIcon />
              </IconButton>
            </SvgIcon>
          </InputAdornment>
        )}
      />
    </Card>
  )
};
