import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import useData from "../../customHooks/useData";
import useEditModal from "../../customHooks/useEditModal";
import TextField from "@mui/material/TextField";
import Table from "../../Components/Table";
import axios from "axios";
import { url } from "../../js/url";
const Payments = () => {
  const [paymentName, setPaymentName] = useState("");
  const paymentList = useData("payment-list");
  const {
    editItem,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    setEditItem,
  } = useEditModal();
  const handleAddPayment = async () => {
    if (paymentName.trim() === "") {
      alert("Input a value");
      return;
    }

    try {
      const res = await axios.post(`${url}/payment/add`, {
        name: paymentName,
      });
      paymentList.fetchData();
      setPaymentName("");
    } catch (error) {
      console.error("Error adding data: ", error);
    }
  };

  const handleEdit = async () => {
    closeEditModal();
    try {
      const res = await axios.put(`${url}/payment/edit/${editItem.id}`, {
        updateName: editItem.paymentName.trim().toUpperCase(),
      });
      paymentList.fetchData();
    } catch (error) {
      console.error("Error updating Meat: ", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${url}/payment/delete/${id}`);
      paymentList.fetchData();
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };
  const columns = [
    { field: "paymentName", headerName: "Payment Name", flex: 1 },
    {
      field: "actions",
      headerName: "Action",
      headerClassName: "custom-cell",
      cellClassName: "cell",
      headerAlign: "center",
      align: "center",
      width: 160,
      renderCell: (params) => (
        <>
          <button
            className="btn btn-success ms-2 d-flex align-items-center p-2"
            onClick={() => openEditModal(params.row)}
          >
            <i className="bx bxs-edit"></i>
          </button>
          <button
            className="btn btn-danger ms-2 d-flex align-items-center p-2"
            onClick={() => handleDelete(params.row.id)}
          >
            <i className="bx bxs-trash"></i>
          </button>
        </>
      ),
    },
  ];
  return (
    <>
      <div className="content-container">
        <h2>Mode of Payments List </h2>
        <TextField
          id="outlined-size-small"
          label="Mode of Payment Name"
          variant="outlined"
          size="small"
          value={paymentName}
          onChange={(e) => setPaymentName(e.target.value)}
        />

        <button
          type="button"
          id="btn-meat"
          className="px-3 btn-primary btn ms-2"
          onClick={handleAddPayment}
        >
          Add
        </button>
        <div className="table-container"></div>
        <Table rows={paymentList.dataList} columns={columns} height={"400px"} />
      </div>

      <Modal
        show={isEditModalOpen}
        onHide={closeEditModal}
        id="eModal"
        tabIndex="-1"
        aria-labelledby="ModalLabel"
        aria-hidden="true"
      >
        <Modal.Header closeButton>
          <Modal.Title id="ModalLabel">Edit Payment Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                value={editItem ? editItem.paymentName : ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, paymentName: e.target.value })
                }
              />
              <label htmlFor="edt-id">Payment Name</label>
            </Form.Floating>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
          <Button variant="primary" id="btn-edit-emp" onClick={handleEdit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Payments;
