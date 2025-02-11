import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment,Card,MenuItem } from '@mui/material';
import { useState } from 'react';
// component
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

const DropdownCard = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '100%', // Position below the toolbar
  left: '-100px', // Left align dropdown card
  zIndex: 10,
  padding: theme.spacing(2),
  minWidth: '150px',
}));

// ----------------------------------------------------------------------

TeacherListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  genderFilter: PropTypes.string, 
  onGenderFilterChange: PropTypes.func,
};

export default function TeacherListToolbar({ numSelected, filterName, onFilterName, genderFilter, onGenderFilterChange }) {
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);

  const handleToggleDropdown = () => {
    setFilterDropdownVisible((prev) => !prev);
  };
  return (
    <RootStyle
    sx={{
      ...(numSelected > 0 && {
        color: 'primary.main',
        bgcolor: 'primary.lighter',
      }),
    }}
  >
    {numSelected > 0 ? (
      <Typography component="div" variant="subtitle1">
        {numSelected} selected
      </Typography>
    ) : (
      <>
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Search user by email..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />

        <Tooltip title="Filter list">
          <IconButton onClick={handleToggleDropdown}>
            <Iconify icon="ic:round-filter-list" />
            {filterDropdownVisible && (
              <DropdownCard >
                <Typography variant="subtitle2">Filter by Gender</Typography>
                <MenuItem value="" onClick={() => { onGenderFilterChange({ target: { value: '' } }); setFilterDropdownVisible(false); }}>
                  All Gender
                </MenuItem>
                <MenuItem value="Male" onClick={() => { onGenderFilterChange({ target: { value: 'Male'} }); setFilterDropdownVisible(false); }}>Male</MenuItem>
                <MenuItem value="Female" onClick={() => { onGenderFilterChange({ target: { value: 'Female'} }); setFilterDropdownVisible(false); }}>Female</MenuItem>

                {/* Add more roles as needed */}
              </DropdownCard>
            )}
          </IconButton>

        </Tooltip>
      </>
    )}
  </RootStyle>
  );
}
