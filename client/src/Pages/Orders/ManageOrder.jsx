import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import LoadingModal from "../../Components/LoadingModal";
import useData from "../../customHooks/useData";
import OrderDetailsModal from "../../Components/OrderDetailsModal";
import useLogin from "../../stores/useLogin";
import useSeeDetails from "../../customHooks/useSeeDetails";
import axios from "axios";
import { url } from "../../js/url";
const ManageOrder = () => {
  const orders = useData("orders-list");
  const { user, isAdmin } = useLogin();
  const { orderDetails, showModal, handleSeeDetails, handleCloseModal } = useSeeDetails("order-list");
  const [isLoading, setIsLoading] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelOrder, setCancelOrder] = useState(null);
  const [cancelRemarks, setCancelRemarks] = useState("");

  const handleOpenCancelModal = async (order) => {
    setCancelModal(true);
    setCancelOrder(order);
  };

  const handleCloseCancelModal = async () => {
    setCancelModal(false);
    setCancelOrder(null);
    setCancelRemarks("");
  };
  const handleConfirm = async (id) => {
    setIsLoading(true);

    try {
      const res = await axios.post(`${url}/orders/confirm-order/${id}`);
      orders.fetchData();
      setIsLoading(false);
    } catch (error) {
      console.error(error.message);
      setIsLoading(false);
    }
  };
  const handleCancel = async () => {
    setIsLoading(true);
    setCancelModal(false);
    try {
      const res = await axios.post(`${url}/orders/cancel-order`, 
      { cancelOrder, cancelRemarks, user });
      orders.fetchData();
      setIsLoading(false);
      setCancelRemarks("");
    } catch (error) {
      console.error(error.message);
      setIsLoading(false);
    }
  };
  const rowOrder = orders.dataList.map((order) => ({
    id: order.id,
    customerName: order.customerName,
    modeOfPayment: order.modeOfPayment,
    type: order.type,
    totalPrice: order.totalPrice,
    date: order.date,
    processedBy: order.processedBy,
    dispatcher: order.dispatcher,
  }));

  const filteredRowOrder = isAdmin ? rowOrder : rowOrder.filter((order) => order.type !== "Raw");

  const columns = [
    {field: "id",headerName: "ID",headerAlign: "center",align: "center"},
    {field: "customerName",headerName: "Customer Name",flex: 1,headerAlign: "center",align: "center"},
    {field: "modeOfPayment",headerName: "MOP",flex: 1,headerAlign: "center",align: "center"},
    {field: "totalPrice",headerName: "Total Price",headerAlign: "center",flex: 1,align: "center"},
    {field: "date",headerName: "Date",headerAlign: "center",align: "center"},
    {field: "processedBy",headerName: "Process By",headerAlign: "center",flex: 1,align: "center"},
    { field: "dispatcher", headerName: "Dispatcher", headerAlign: "center", flex: 1, align: "center" },
    {
      field: "actions",
      headerName: "Action",
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
            onClick={() => handleSeeDetails(params.row.id)}
          >
            <i className="bx bx-notepad"></i>
          </button>
          <button
            className="btn btn-success ms-2 d-flex align-items-center p-2"
            onClick={() => handleConfirm(params.row.id)}
          >
            <i className="bx bxs-check-square"></i>
          </button>
          <button
            className="btn btn-danger ms-2 d-flex align-items-center p-2"
            onClick={() => handleOpenCancelModal(params.row)}
          >
            <i className="bx bxs-x-square"></i>
          </button>
        </>
      ),
    },
  ];
  return (
    <>
      <div className="content-container">
        {isLoading ? <LoadingModal /> : null}
        <h2>Manage Order</h2>
        <Box
          sx={{
            height: 500,
            width: "98%",
            "& .hot": {
              backgroundColor: "#ff943975",
              color: "#1a3e72",
            },
            "& .cold": {
              backgroundColor: "#b9d5ff91",
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
            getRowClassName={(params) => {
              if (params.row.type === "Raw") {
                return "cold";
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

      <OrderDetailsModal show={showModal} onHide={handleCloseModal} data={orderDetails} />

      <Modal show={cancelModal} onHide={handleCloseCancelModal}>
        <Modal.Header closeButton>
          <Modal.Title>Reason for Canceling Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                placeholder="ID"
                id="edt-name"
                disabled
                value={
                  cancelOrder
                    ? `${cancelOrder.id} - ${cancelOrder.customerName}`
                    : ""
                }
              />
              <label htmlFor="edt-brand">Name</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                style={{ height: "100px" }}
                value={cancelRemarks}
                onChange={(e) => setCancelRemarks(e.target.value)}
              />
              <label>Leave comment here</label>
            </Form.Floating>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCancelModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCancel}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageOrder;
