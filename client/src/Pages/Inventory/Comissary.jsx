import React, { useState } from "react";
import SearchBar from "../../Components/SearchBar";
import { Button, Modal, Form } from "react-bootstrap";
import { url } from "../../js/url";
import axios from "axios";
import useData from "../../customHooks/useData";
import useEditModal from "../../customHooks/useEditModal";
import useLogIn from "../../stores/useLogin";
import Table from "../../Components/Table";

const Comissary = () => {
  const {
    editItem,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    setEditItem,
  } = useEditModal();
  const processedMeatList = useData(`${url}/fetchData/processed-meat`);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAdmin } = useLogIn();

  //Edit quantity of the processed meat
  const handleEditQuantity = async () => {
    try {
      if (editItem.quantity < 0) {
        alert("Invalid value");
        return;
      }
      closeEditModal();
      const response = await axios.put(
        `${url}/processed/edit-process-quantity/${editItem.id}`,
        { quantity: editItem.quantity }
      );
      processedMeatList.fetchData();
    } catch (error) {
      console.error("Error updating: ", error);
    }
  };

  const columns = [
    { field: "processedMeat", headerName: "Processed Meat Name", flex: 1 },
    {
      field: "quantity",
      headerName: "KG",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];
  if (isAdmin) {
    columns.push({
      field: "actions",
      headerName: "Action",
      headerClassName: "custom-cell",
      cellClassName: "cell",
      headerAlign: "center",
      align: "center",
      width: 160,
      renderCell: (params) => (
        <>
          <td>
            <button
              className="btn btn-success d-flex align-items-center p-2"
              onClick={() => openEditModal(params.row)}
            >
              <i className="bx bxs-edit"></i>
            </button>
          </td>
        </>
      ),
    });
  }
  return (
    <>
      <div className="content-container">
        <h2>Commisary</h2>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="table-container">
          <Table
            rows={processedMeatList.dataList.filter(
              (value) =>
                value.processedMeat
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                value.quantity.toString().includes(searchQuery.toLowerCase())
            )}
            columns={columns}
            height={"400px"}
          />
        </div>
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
          <Modal.Title id="ModalLabel">Edit Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                placeholder="ID"
                id="edt-brand"
                value={editItem ? editItem.processedMeat : ""}
                disabled
              />
              <label htmlFor="edt-brand">Processed Meat Type</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                type="number"
                value={editItem ? editItem.quantity : ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, quantity: e.target.value })
                }
              />
              <label htmlFor="edt-id">Quantity</label>
            </Form.Floating>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
          <Button
            variant="primary"
            id="btn-edit-emp"
            onClick={handleEditQuantity}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Comissary;
