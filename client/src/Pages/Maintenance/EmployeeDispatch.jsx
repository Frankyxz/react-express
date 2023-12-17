import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import useData from "../../customHooks/useData";
import useEditModal from "../../customHooks/useEditModal";
import TextField from "@mui/material/TextField";
import Table from "../../Components/Table";
import { url } from "../../js/url";
import axios from "axios";
const EmployeeDispatch = () => {
  const [dispatchName, setDispatchName] = useState("");
  const dispatchList = useData("dispatchers");
  const {
    editItem,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    setEditItem,
  } = useEditModal();

  const handleAddDispatch = async () => {
    if (dispatchName.trim() === "") {
      alert("Input a value");
      return;
    }

    try {
      const res = await axios.post(`${url}/dispatcher/add`, {
        name: dispatchName,
      });
      dispatchList.fetchData();
      setDispatchName("");
    } catch (error) {
      console.error("Error adding data: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${url}/dispatcher/delete/${id}`);
      dispatchList.fetchData();
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };
  const handleEdit = async () => {
    closeEditModal();
    try {
      const res = await axios.put(`${url}/dispatcher/edit/${editItem.id}`, {
        updateName: editItem.empName.trim().toUpperCase(),
      });
      dispatchList.fetchData();
    } catch (error) {
      console.error("Error updating Meat: ", error);
    }
  };
  const columns = [
    { field: "empName", headerName: "Name", flex: 1 },
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
        <h2>Dispatcher</h2>
        <TextField
          id="outlined-size-small"
          label="Name"
          variant="outlined"
          size="small"
          value={dispatchName}
          onChange={(e) => setDispatchName(e.target.value)}
        />
        <button
          type="button"
          id="btn-meat"
          className="px-3 btn-primary btn ms-2"
          onClick={handleAddDispatch}
        >
          Add
        </button>
        <div className="table-container"></div>
        <Table
          rows={dispatchList.dataList}
          columns={columns}
          height={"400px"}
        />
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
                value={editItem ? editItem.empName : ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, empName: e.target.value })
                }
              />
              <label htmlFor="edt-id">Name</label>
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

export default EmployeeDispatch;
