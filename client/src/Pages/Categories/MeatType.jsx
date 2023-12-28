import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import useData from "../../customHooks/useData";
import Table from "../../Components/Table";
import useEditModal from "../../customHooks/useEditModal";
import { url } from "../../js/url";
const MeatType = () => {
  const [meatName, setMeatName] = useState("");
  const meatType = useData(`meatType`);
  const { editItem, isEditModalOpen, openEditModal, closeEditModal, setEditItem } = useEditModal();
  const handleAddMeat = async () => {
    try {
      const res = await axios.post(`${url}/meatType/add-meat`, 
      { meatName: meatName.trim().toUpperCase() });
      meatType.fetchData();
      setMeatName("");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteMeat = async (value) => {
    try {
      const res = await axios.delete(
        `${url}/meatType/delete-meat/${value.id}`,
        { data: { Meat: value.Meat } });
      meatType.fetchData();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditMeat = async () => {
    try {
      await axios.put(`${url}/meatType/edit-meat/${editItem.id}`,
       { Meat: editItem.Meat, });
      closeEditModal();
      meatType.fetchData();
    } catch (error) {
      console.error(error.message);
    }
  };

  const validateEdit = async (value) => {
    try {
      const res = await axios.get(
        `${url}/meatType/validate-edit/${value.Meat}`
      );
      if (res.data.canEdit) {
        openEditModal(value);
      } else {
        alert("Cannot Edit.");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const columns = [
    { field: "Meat", headerName: "Meat Type", flex: 1 },
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
            onClick={() => validateEdit(params.row)}
          >
            <i className="bx bxs-edit"></i>
          </button>
          <button
            className="btn btn-danger ms-2 d-flex align-items-center p-2"
            onClick={() => handleDeleteMeat(params.row)}
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
        <h2>Meat type</h2>

        <TextField
          id="outlined-size-small"
          label="Meat Name"
          variant="outlined"
          size="small"
          value={meatName}
          onChange={(e) => setMeatName(e.target.value)}
        />
        <button
          type="button"
          id="btn-meat"
          className="px-3 btn-primary btn ms-2"
          onClick={handleAddMeat}
        >
          Add
        </button>

        <div className="table-container">
          <Table rows={meatType.dataList} columns={columns} height={"400px"} />
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
          <Modal.Title id="ModalLabel">Edit Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                value={editItem ? editItem.Meat : ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, Meat: e.target.value })
                }
              />
              <label htmlFor="edt-id">Meat Name</label>
            </Form.Floating>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
          <Button variant="primary" id="btn-edit-emp" onClick={handleEditMeat}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MeatType;
