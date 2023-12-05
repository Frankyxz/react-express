import React from "react";

const SearchBar = ({ value, onChange }) => {
  return (
    <>
      <div className="input-group rounded px-0 pt-3 _search">
        <input
          type="search"
          className="form-control rounded"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="search-addon"
          id="itm-search"
          value={value}
          onChange={onChange}
        />
        <span className="input-group-text border-0 me-4" id="search-addon">
          <i className="bx bx-search-alt"></i>
        </span>
      </div>
    </>
  );
};

export default SearchBar;
