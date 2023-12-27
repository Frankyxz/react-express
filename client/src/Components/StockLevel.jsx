import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import useStockLevelStore from "../stores/useStockLevelStore";
const StockLevel = ({ rows, columns, type }) => {
  const { levels } = useStockLevelStore();
  const { raw, process } = levels;
  return (
    <>
      <div style={{ height: 400, width: "50%" }}>
        <Box
          sx={{
            height: 371,
            width: "98%",
            "& .crit": {
              backgroundColor: "#ff943975",
              color: "#1a3e72",
            },
            "& .re-order": {
              backgroundColor: "#ffce81",
              color: "#1a3e72",
            },
            "& .no-stock": {
              backgroundColor: "#ABB0B8",
              color: "#1a3e72",
            },
            "& .average": {
              backgroundColor: "#FFF9A6 ",
              color: "1a3e72",
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableRowSelectionOnClick
            getRowClassName={(params) => {
              const totalKg =
                type === "Raw" ? params.row.kg : params.row.quantity;

              const average =
                totalKg < (type === "Raw" ? raw[2]?.value : process[2]?.value);
              const reOrder =
                totalKg < (type === "Raw" ? raw[1]?.value : process[1]?.value);
              const critical =
                totalKg < (type === "Raw" ? raw[0]?.value : process[0]?.value);

              if (critical) {
                return "crit";
              } else if (reOrder) {
                return "re-order";
              } else if (average) {
                return "average";
              }

              return "";
            }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pagination
            pageSizeOptions={[5, 10]}
          />
        </Box>
      </div>
    </>
  );
};

export default StockLevel;
