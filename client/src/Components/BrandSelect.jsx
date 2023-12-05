import React, { forwardRef } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const BrandSelect = (props) => {
  return (
    <>
      <FormControl sx={{ mx: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small-label">Brand: </InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          label="Brand"
          value={props.value || ""}
          onChange={props.onChange}
        >
          {props.options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default BrandSelect;
