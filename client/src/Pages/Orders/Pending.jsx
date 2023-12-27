import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import LoadingModal from "../../Components/LoadingModal";
import useData from "../../customHooks/useData";
import OrderDetailsModal from "../../Components/OrderDetailsModal";
import useSeeDetails from "../../customHooks/useSeeDetails";
import useEditModal from "../../customHooks/useEditModal";
import Table from "../../Components/Table";
import usePaymentLists from "../../customHooks/usePaymentList";
import axios from "axios";
import { url } from "../../js/url";
const Pending = () => {
  const pendingData = useData("pending-list");
  const { orderDetails, showModal, handleSeeDetails, handleCloseModal } =
    useSeeDetails("pending");
  const { editItem, isEditModalOpen, openEditModal, closeEditModal } =
    useEditModal();
  const [isLoading, setIsLoading] = useState(false);
  const { modeOfPayment, setModeOfPayment, paymentOptions } =
    usePaymentLists(isEditModalOpen);

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    closeEditModal();
    try {
      const res = await axios.put(
        `${url}/orders/confirm-pending/${editItem.id}`,
        { mop: modeOfPayment }
      );
      pendingData.fetchData();
      setIsLoading(false);
    } catch (error) {
      console.error("Error confirming payment: ", error);
      setIsLoading(false);
    }
  };
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
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
      field: "totalPrice",
      headerName: "Total Payment",
      headerAlign: "center",
      flex: 1,
      align: "center",
    },
    {
      field: "date",
      headerName: "Date Ordered",
      headerAlign: "center",
      flex: 1,
      align: "center",
    },
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
            <i class="bx bx-notepad"></i>
          </button>
          <button
            className="btn btn-success ms-2 d-flex align-items-center p-2"
            onClick={() => openEditModal(params.row)}
          >
            <i class="bx bx-credit-card-front"></i>
          </button>
        </>
      ),
    },
  ];
  return (
    <>
      <div className="content-container">
        {isLoading ? <LoadingModal /> : null}
        <h2>Account Receivable</h2>
        <div className="table-container">
          <Table
            rows={pendingData.dataList}
            columns={columns}
            height={"500px"}
          />
        </div>
      </div>
      <OrderDetailsModal
        show={showModal}
        onHide={handleCloseModal}
        data={orderDetails}
      />

      <Modal show={isEditModalOpen} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Mode of Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                placeholder="id"
                id="id"
                value={
                  editItem ? editItem.id + " - " + editItem.customerName : ""
                }
                disabled
              />
              <label htmlFor="edt-brand">Name</label>
            </Form.Floating>
            <Form.Floating>
              <Form.Select
                id="mop"
                aria-label="Floating label select example"
                value={modeOfPayment}
                onChange={(e) => setModeOfPayment(e.target.value)}
              >
                <option value={"CASH"}>CASH</option>
                {paymentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
              <label htmlFor="mop">Mode of Payment</label>
            </Form.Floating>
          </Form>
          <Modal.Footer>
            <Button
              variant="primary"
              id="btn-confirm-payment"
              onClick={handleConfirmPayment}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Pending;
