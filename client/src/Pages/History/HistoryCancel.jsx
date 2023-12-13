import React from "react";
import useData from "../../customHooks/useData";
import Table from "../../Components/Table";
import useFilterDate from "../../customHooks/useFilterDate";
import useSeeDetails from "../../customHooks/useSeeDetails";
import OrderDetailsModal from "../../Components/OrderDetailsModal";
const HistoryCancel = () => {
  const cancelHistoryData = useData("history-cancel");
  const { handleFromDate, handleToDate, filteredData, fromDate, toDate } =
    useFilterDate(cancelHistoryData, "date");
  const { orderDetails, showModal, handleSeeDetails, handleCloseModal } =
    useSeeDetails("cancel");
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
      field: "remarks",
      headerName: "Remarks",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Canceled Order",
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
            <i class="bx bx-notepad"></i>
          </button>
        </>
      ),
    },
  ];
  return (
    <>
      <div className="content-container">
        <h2>Cancel History</h2>
        <label for="date-from" className="me-2">
          From:
        </label>
        <input
          type="date"
          id="date-from"
          className="date"
          value={fromDate}
          onChange={handleFromDate}
        />
        <label for="date-from" className="mx-2">
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
          <Table rows={filteredData} columns={columns} height={"450px"} />
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

export default HistoryCancel;
