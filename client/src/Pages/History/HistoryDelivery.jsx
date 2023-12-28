import React from "react";
import useData from "../../customHooks/useData";
import Table from "../../Components/Table";
import { Modal } from "react-bootstrap";
import useFilterDate from "../../customHooks/useFilterDate";
import useRecords from "../../customHooks/useRecords";
const HistoryDelivery = () => {
  const historyDelivery = useData("history-delivery");
  const { handleFromDate, handleToDate, filteredData, fromDate, toDate } = useFilterDate(historyDelivery, "dateConfirm");
  const { records, recordModal, handleRecords, handleCloseRecord } = useRecords("delivery");

  const columns = [
    { field: "totalKiloDelivered", headerName: "Total Kilo Delivered", flex: 1, headerAlign: "center", align: "center" },
    { field: "totalKiloReceived", headerName: "Total Kilo Received", flex: 1, headerAlign: "center", align: "center" },
    { field: "dateConfirm", headerName: "Date", flex: 1, headerAlign: "center", align: "center" },
    { field: "remarks", headerName: "Remarks", flex: 1, headerAlign: "center", align: "center" },
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
            className="btn btn-info d-flex align-items-center p-2"
            onClick={() => handleRecords(params.row.id)}
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
        <h2>Delivery History</h2>
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
          <Table rows={filteredData} columns={columns} height={"450px"} />
        </div>
      </div>

      <Modal
        show={recordModal}
        onHide={handleCloseRecord}
        dialogClassName="modal-85w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            {records?.dateConfirm}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table">
            <thead>
              <tr>
                <th>Meat Type</th>
                <th>Brand Name</th>
                <th>Expected KG</th>
                <th>Received KG</th>
              </tr>
            </thead>
            <tbody>
              {records?.expectedTotal.map((expectedItem, index) => {
                const matchingReceivedItem = records.receivedMeat.find(
                  (receivedItem) =>
                    receivedItem.meatType === expectedItem.meatType &&
                    receivedItem.brandName === expectedItem.brandName
                );

                return (
                  <tr key={index}>
                    <td>{expectedItem.meatType}</td>
                    <td>{expectedItem.brandName}</td>
                    <td>{expectedItem.totalKg}</td>
                    <td>
                      {matchingReceivedItem
                        ? matchingReceivedItem.totalKg
                        : "0"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default HistoryDelivery;
