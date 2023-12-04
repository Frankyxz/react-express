import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const MeatSelect = ({ label, options, value, onChange }) => {
  return (
    <>
      <FormControl sx={{ ml: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small-label">{label}</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          label={label}
          value={value}
          onChange={onChange}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default MeatSelect;
