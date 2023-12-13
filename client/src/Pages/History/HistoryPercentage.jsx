import React from "react";
import useFilterDate from "../../customHooks/useFilterDate";
import Table from "../../Components/Table";
import { Modal } from "react-bootstrap";
import useData from "../../customHooks/useData";
import useRecords from "../../customHooks/useRecords";
const HistoryPercentage = () => {
  const historyPercent = useData("history-percentages");
  const { handleFromDate, handleToDate, filteredData, fromDate, toDate } =
    useFilterDate(historyPercent, "date");
  const { records, recordModal, handleCloseRecord, handleRecords } =
    useRecords("percentages");

  const columns = [
    {
      field: "totalKGReceived",
      headerName: "Total Kilo Received",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalKgProcessed",
      headerName: "Total Processed Meat",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalScrap",
      headerName: "Total Scrap Meat",
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
      field: "missing",
      headerName: "Waste",
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
        <h2>Percentage History</h2>
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
        <div className="facility-container">
          <div className="table-container">
            <Table rows={filteredData} columns={columns} height={"450px"} />
          </div>
        </div>
      </div>

      <Modal
        show={recordModal}
        onHide={handleCloseRecord}
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Date: {records?.date}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="record-container d-flex justify-content-around">
            <div className="received ">
              <h4 className="text-center">Meat Received and Waste</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Meat Type</th>
                    <th>Received Today</th>
                    <th>Waste</th>
                  </tr>
                </thead>
                <tbody>
                  {records?.receivedToday.map((received, index) => {
                    const matchingReceivedItem = records.percentages.find(
                      (receivedItem) =>
                        receivedItem.meatType === received.meatType
                    );

                    return (
                      <tr key={index}>
                        <td>{received.meatType}</td>
                        <td>{received.totalKg}</td>
                        <td>
                          {matchingReceivedItem
                            ? matchingReceivedItem.percentage
                            : "0"}
                          %
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="produced d-grid justify-content-center align-items-center">
              <h4 className="text-center"> Meat Produced</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Processed Meat</th>
                    <th>Made Today</th>
                  </tr>
                </thead>
                <tbody>
                  {records?.madeToday.map((made, index) => {
                    return (
                      <tr key={index}>
                        <td>{made.processedMeat}</td>
                        <td>{made.totalKg}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default HistoryPercentage;
