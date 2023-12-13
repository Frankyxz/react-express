import React from "react";
import useLogin from "../../stores/useLogin";
import useData from "../../customHooks/useData";
import useFilterDate from "../../customHooks/useFilterDate";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import OrderDetailsModal from "../../Components/OrderDetailsModal";
import useSeeDetails from "../../customHooks/useSeeDetails";

const HistoryOrder = () => {
  const { isAdmin } = useLogin();
  const orderHistory = useData("history-order");
  const { handleFromDate, handleToDate, filteredData, fromDate, toDate } =
    useFilterDate(orderHistory, "date");
  const { orderDetails, showModal, handleSeeDetails, handleCloseModal } =
    useSeeDetails("orderHistory");

  const filteredRowOrder = isAdmin
    ? filteredData
    : filteredData.filter((order) => order.type !== "Raw");
  const columns = [
    {
      field: "id",
      headerName: "ID",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "modeOfPayment",
      headerName: "Mode of Payment",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalPrice",
      headerName: "Grand Total",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Details",
      headerClassName: "custom-cell",
      cellClassName: "cell",
      flex: 1,
      headerAlign: "center",
      align: "center",
      width: 160,
      renderCell: (params) => (
        <>
          <button
            className="btn btn-info  d-flex align-items-center p-2"
            onClick={() => handleSeeDetails(params.row.id)}
          >
            <i className="bx bx-notepad"></i>
          </button>
        </>
      ),
    },
  ];
  return (
    <>
      <div className="content-container">
        <h2>Order History</h2>
        <label htmlFor="date-from" className="me-2">
          From:
        </label>
        <input
          type="date"
          id="date-from"
          className="date"
          value={fromDate}
          onChange={handleFromDate}
        />
        <label htmlFor="date-from" className="mx-2">
          To:
        </label>
        <input
          type="date"
          id="date-to"
          className="date"
          value={toDate}
          onChange={handleToDate}
        />
        <div className="table-container">
          <Box
            sx={{
              height: 450,
              width: "98%",
              "& .hot": {
                backgroundColor: "#ff943975",
                color: "#1a3e72",
              },
            }}
          >
            <DataGrid
              rows={filteredRowOrder}
              columns={columns}
              disableRowSelectionOnClick
              getCellClassName={(params) => {
                if (
                  params.field === "modeOfPayment" &&
                  params.value === "PENDING"
                ) {
                  return "hot";
                }
                return "";
              }}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pagination
              pageSizeOptions={[5, 10]}
            />
          </Box>
        </div>
      </div>

      <OrderDetailsModal
        show={showModal}
        onHide={handleCloseModal}
        data={orderDetails}
      />
    </>
  );
};

export default HistoryOrder;
