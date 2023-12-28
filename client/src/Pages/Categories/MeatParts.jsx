import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Table from "../../Components/Table";
import useData from "../../customHooks/useData";
import { url } from "../../js/url";
import useMeat from "../../customHooks/useMeat";
import MeatSelect from "../../Components/MeatSelect";
import useEditModal from "../../customHooks/useEditModal";
import axios from "axios";
const MeatParts = () => {
  const [meatPart, setMeatPart] = useState("");
  const { dataList, fetchData } = useData(`meatPart`);
  const { selectedMeatType, setSelectedMeatType, meatTypeOptions } = useMeat();
  const { editItem, isEditModalOpen, openEditModal, closeEditModal, setEditItem } = useEditModal();

  //Add
  const handleAddPart = async () => {
    if (meatPart.trim() == "" || selectedMeatType.trim() == "") {
      alert("Input a value");
      return;
    }

    //Find if there are the same meat part in the same meat type
    const partsExist = dataList.some((item) =>
        item.meatPart === meatPart.toUpperCase() &&
        item.meatType === selectedMeatType
    );

    if (partsExist) {
      alert("Part with the same name and meat type already exists.");
      return;
    }
    try {
      const res = await axios.post(`${url}/meatPart/add-part`, {
        meatPart: meatPart.trim().toUpperCase(),
        meatType: selectedMeatType,
        combined: `${selectedMeatType} ${meatPart.trim().toUpperCase()}`,
      });

      fetchData();
      setMeatPart("");
    } catch (error) {
      console.error(error.message);
    }
  };

  //Delete
  const handleDeletePart = async (value) => {
    try {
      const res = await axios.delete(
        `${url}/meatPart/delete-part/${value.id}`,
        { data: { meatType: value.meatType, meatPart: value.meatPart }}
      );
      fetchData();
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  //Validate Edit
  const validateEdit = async (value) => {
    try {
      const res = await axios.get(`${url}/meatPart/validate-edit/`, {
        params: { meatType: value.meatType, meatPart: value.meatPart },
      });
      if (res.data.canEdit) {
        openEditModal(value);
        return;
      }
      alert(res.data.message);
    } catch (error) {
      console.error(error.message);
    }
  };

  //Edit
  const handleEditPart = async () => {
    if (editItem.meatPart.trim() === "" || editItem.meatType.trim() === "") {
      alert("Input a valid value");
      return;
    }
    const partsExist = dataList.some((item) =>
        item.meatPart === editItem.meatPart.toUpperCase().trim() &&
        item.meatType === editItem.meatType
    );

    if (partsExist) {
      alert("Part with the same name and meat type already exists.");
      return;
    }

    try {
      await axios.put(`${url}/meatPart/edit-part/${editItem.id}`, {
        meatType: editItem.meatType, meatPart: editItem.meatPart });
      closeEditModal();
      fetchData();
    } catch (error) {
      console.error("Error updating data: ", error);
    }
  };
  const columns = [
    { field: "meatPart", headerName: "Meat Part", flex: 1 },
    { field: "meatType", headerName: "Meat Type", flex: 1 },
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
            className="btn btn-success ms-2  d-flex align-items-center p-2"
            onClick={() => validateEdit(params.row)}
          >
            <i className="bx bxs-edit"></i>
          </button>
          <button
            className="btn btn-danger ms-2  d-flex align-items-center p-2"
            onClick={() => handleDeletePart(params.row)}
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
        <h2>Meat Parts</h2>

        <TextField
          id="outlined-size-small"
          label="Part Name"
          variant="outlined"
          size="small"
          value={meatPart}
          onChange={(e) => setMeatPart(e.target.value)}
        />
        <MeatSelect
          label="Meat Type"
          options={meatTypeOptions}
          value={selectedMeatType}
          onChange={(e) => setSelectedMeatType(e.target.value)}
        />
        <button
          type="button"
          id="btn-meat"
          className="px-3 btn-primary btn ms-2"
          onClick={handleAddPart}
        >
          Add
        </button>

        <div className="table-container">
          <Table rows={dataList} columns={columns} height={"400px"} />
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
          <Modal.Title id="ModalLabel">Edit Meat Part</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                value={editItem ? editItem.meatPart : ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, meatPart: e.target.value })
                }
              />
              <label htmlFor="edt-id">Meat Name</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Select
                id="meatType"
                name="meatType"
                aria-label="Floating label select example"
                value={editItem ? editItem.meatType : ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, meatType: e.target.value })
                }
              >
                {meatTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>

              <label htmlFor="meatType">Meat Type</label>
            </Form.Floating>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
          <Button variant="primary" id="btn-edit-emp" onClick={handleEditPart}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MeatParts;
