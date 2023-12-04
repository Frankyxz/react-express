import React from "react";
import { DataGrid } from "@mui/x-data-grid";
const Table = ({ rows, columns, height }) => {
  return (
    <div style={{ width: "98%" }}>
      <DataGrid
        rows={rows}
        sx={{ height }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        columns={columns}
        disableRowSelectionOnClick
        pagination
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
};

export default Table;
