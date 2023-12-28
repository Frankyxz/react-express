import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Table from "../Components/Table";
import { Card, CardContent } from "@mui/material";
import useStockLevelStore from "../stores/useStockLevelStore";
import { url } from "../js/url";
import axios from "axios";
const Settings = () => {
  const { levels } = useStockLevelStore();
  const [editModal, setEditModal] = useState(false);
  const [editedValues, setEditedValues] = useState({ critical: 0, reorder: 0, average: 0});
  const handleEditProcess = async (process) => {
    setEditedValues({
      name: "process",
      critical: process[0].value,
      reorder: process[1].value,
      average: process[2].value,
    });
    setEditModal(true);
  };

  const handleEditRaw = async (raw) => {
    setEditedValues({
      name: "raw",
      critical: raw[0].value,
      reorder: raw[1].value,
      average: raw[2].value,
    });
    setEditModal(true);
  };

  const handleCloseModal = () => {
    setEditModal(false);
    setEditedValues({
      name: "",
      critical: 0,
      reorder: 0,
      average: 0,
    });
  };
  const handleSave = async () => {
    if (editedValues.critical >= editedValues.reorder) {
      alert("Critical should not exceed Re-order");
      return;
    }
    if (editedValues.reorder >= editedValues.average) {
      alert("Reorder should not exceed average");
      return;
    }
    try {
      const res = await axios.put(`${url}/settings/set-level`, 
      { data: editedValues });
    } catch (error) {
      console.error(error.message);
    }
  };
  const rows = levels.raw.map((raw, index) => {
    const matchingRawItem = levels.process.find(
      (rawItem) => rawItem.status === raw.status
    );

    return {
      id: index,
      status: raw.status,
      rawValue: raw.value,
      processValue: matchingRawItem ? matchingRawItem.value : "0",
    };
  });
  const columns = [
    { field: "status", headerName: "Status", flex: 1 },
    { field: "rawValue", headerName: "Raw Value", flex: 1 },
    { field: "processValue", headerName: "Process Value", flex: 1 },
  ];
  return (
    <>
      <div className="content-container">
        <h2>Setting</h2>

        <Card sx={{ width: "99.5%" }}>
          <CardContent>
            <button
              className="btn btn-success me-3"
              onClick={() => {
                handleEditRaw(levels.raw);
              }}
            >
              Edit Raw Value
            </button>
            <button
              className="btn btn-warning"
              onClick={() => {
                handleEditProcess(levels.process);
              }}
            >
              Edit Process Value
            </button>

            <div className="table-container">
              <Table rows={rows} columns={columns} height={"400px"} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        show={editModal}
        onHide={handleCloseModal}
        id="eModal"
        tabIndex="-1"
        aria-labelledby="ModalLabel"
        aria-hidden="true"
      >
        <Modal.Header closeButton>
          <Modal.Title id="ModalLabel">
            EDIT {editedValues.name ? editedValues.name.toUpperCase() : ""} {""}
            VALUE
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Floating className="mb-3">
              <Form.Control
                type="number"
                value={editedValues.critical}
                onChange={(e) =>
                  setEditedValues({
                    ...editedValues,
                    critical: parseFloat(e.target.value),
                  })
                }
              />
              <label htmlFor="edt-id">Critical</label>
            </Form.Floating>

            <Form.Floating className="mb-3">
              <Form.Control
                type="number"
                value={editedValues.reorder}
                onChange={(e) =>
                  setEditedValues({
                    ...editedValues,
                    reorder: parseFloat(e.target.value),
                  })
                }
              />
              <label htmlFor="edt-id">Re-Order</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                type="number"
                value={editedValues.average}
                onChange={(e) =>
                  setEditedValues({
                    ...editedValues,
                    average: parseFloat(e.target.value),
                  })
                }
              />
              <label htmlFor="edt-id">Average</label>
            </Form.Floating>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" id="btn-edit-emp" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Settings;
