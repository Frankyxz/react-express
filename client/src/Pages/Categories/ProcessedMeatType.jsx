import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import Table from "../../Components/Table";
import useData from "../../customHooks/useData";
import { url } from "../../js/url";
import axios from "axios";
import useFetchMeatPart from "../../customHooks/useFetchMeatParts";
import useStockLevelStore from "../../stores/useStockLevelStore";
import LoadingModal from "../../Components/LoadingModal";

const ProcessedMeatType = () => {
  const processedMeatList = useData(`processed-meat`);
  const [modalAddPmeat, setModalAddPmeat] = useState(false);
  const [selectedParts, setSelectedParts] = useState("");
  const [meatProcessedName, setMeatProcessedName] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [wholeSalePrice, setWholeSalePrice] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [retailScrap, setRetailScrap] = useState("");
  const [wholeSaleScrap, setWholeSaleScrap] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { meatCollection } = useStockLevelStore();

  const handleCloseModalAdd = () => {
    setModalAddPmeat(false);
    setMeatProcessedName("");
    setWholeSalePrice("");
    setRetailPrice("");
    setRetailScrap("");
    setWholeSaleScrap("");
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openEditModal = async (value) => {
    setIsEditModalOpen(true);
    setEditItem(value);
  };
  useEffect(() => {
    setSelectedParts(meatCollection[0] || "");
  }, []);

  // Add
  const handleAddProcessedMeat = async () => {
    if ( meatProcessedName === "" || retailScrap <= 0 || retailPrice <= 0 || wholeSalePrice <= 0 || wholeSaleScrap <= 0) {
      alert("Empty");
      return;
    }

    const existingProcessedMeat = processedMeatList.dataList.find(
      (item) => item.processedMeat === meatProcessedName.toUpperCase().trim()
    );
    const existingMeatType = processedMeatList.dataList.find(
      (item) => item.meatType === selectedParts.toUpperCase()
    );
    if (existingProcessedMeat) {
      alert("Processed meat already exists");
      return;
    }
    if (existingMeatType) {
      alert("Meat type already exists");
      return;
    }
    setIsLoading(true);
    setModalAddPmeat(false);
    try {
      const res = await axios.post(`${url}/processed/add-process`, 
      { meatProcessedName, retailPrice, wholeSalePrice, selectedParts, retailScrap, wholeSaleScrap });
      setIsLoading(false);
      processedMeatList.fetchData();
      setMeatProcessedName("");
    } catch (error) {
      console.error(error.message);
      setIsLoading(false);
    }
  };
  //Delete
  const handleDeleteProcessed = async (id) => {
    const itemToDelete = processedMeatList.dataList.find((item) => item.id === id);

    const scrapItem = processedMeatList.dataList.find(
      (item) => item.processedMeat === itemToDelete.processedMeat + "- (SCRAP)"
    );
    const nonScrapItem = processedMeatList.dataList.find(
      (item) => item.processedMeat === itemToDelete.processedMeat
    );

    if (nonScrapItem.quantity > 0) {
      alert("Can't Delete. May laman.");
      setIsLoading(false);
      return;
    }
    if (scrapItem.quantity > 0) {
      alert("Can't Delete. May scrap pa.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `${url}/processed/delete-process/${id}&${scrapItem.id}`
      );
      setIsLoading(false);
      processedMeatList.fetchData();
    } catch (error) {
      console.error(error.message);
      setIsLoading(false);
    }
  };

  const handleEditItem = async () => {
    const updatedProcessedMeatName = editItem.processedMeat.toUpperCase();

    const duplicateProcessedMeat = processedMeatList.dataList.find(
      (item) =>
        item.id !== editItem.id &&
        item.processedMeat.toUpperCase() === updatedProcessedMeatName);

    if (duplicateProcessedMeat) {
      alert("Name already exists");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    closeEditModal();
    try {
      const response = await axios.put( `${url}/processed/edit-process/${editItem.id}`, editItem );
      processedMeatList.fetchData();
      setIsLoading(false);
    } catch (error) {
      console.error(error.message);
      setIsLoading(false);
    }
  };
  const columns = [
    { field: "processedMeat", headerName: "Processed Meat Type", flex: 1 },
    { field: "retail", headerName: "Retail", flex: 1, headerAlign: "center", align: "center" },
    { field: "wholeSale", headerName: "Whole Sale", flex: 1, headerAlign: "center", align: "center" },
    { field: "meatType", headerName: "Meat Type", flex: 1, headerAlign: "center", align: "center" },
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
            onClick={() => openEditModal(params.row)}
          >
            <i className="bx bxs-edit"></i>
          </button>
          {params.row.processedMeat.includes("(SCRAP)") ? null : (
            <button
              className="btn btn-danger ms-2  d-flex align-items-center p-2"
              onClick={() => handleDeleteProcessed(params.row.id)}
            >
              <i className="bx bxs-trash"></i>
            </button>
          )}
        </>
      ),
    },
  ];
  return (
    <>
      <div className="content-container">
        <h2>PROCESSED MEAT TYPE</h2>
        {isLoading ? <LoadingModal /> : null}
        <button
          className="btn btn btn-primary mb-2"
          onClick={() => setModalAddPmeat(true)}
        >
          Add Processed Meat Type
        </button>

        <div className="table-container">
          <Table
            rows={processedMeatList.dataList}
            columns={columns}
            height={"420px"}
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
          <Modal.Title id="ModalLabel">Edit Kg</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                placeholder="ID"
                id="edt-brand"
                value={editItem ? editItem.processedMeat : ""}
                readOnly
              />

              <label htmlFor="edt-brand">Processed Meat</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                type="number"
                value={editItem ? editItem.retail : ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, retail: e.target.value })
                }
              />
              <label htmlFor="edt-id">Retail Price</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                type="number"
                value={editItem ? editItem.wholeSale : ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, wholeSale: e.target.value })
                }
              />
              <label htmlFor="edt-id">WholeSale Price</label>
            </Form.Floating>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
          <Button variant="primary" id="btn-edit-emp" onClick={handleEditItem}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={modalAddPmeat}
        onHide={handleCloseModalAdd}
        dialogClassName="modal-80w"
        id="eModal"
        tabIndex="-1"
        aria-labelledby="ModalLabel"
        aria-hidden="true"
      >
        <Modal.Header closeButton>
          <Modal.Title id="ModalLabel">Processed Meat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Floating>
              <Form.Select
                id="process"
                value={selectedParts}
                className="mb-3"
                onChange={(e) => setSelectedParts(e.target.value)}
              >
                {meatCollection.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
              <label htmlFor="process"> Meat Type</label>
            </Form.Floating>
            <Form.Group as={Row} className="mb-3">
              <Col sm="6">
                <Form.Floating>
                  <Form.Control
                    id="name"
                    type="text"
                    value={meatProcessedName}
                    onChange={(e) => setMeatProcessedName(e.target.value)}
                  />
                  <label htmlFor="name">Processed Name</label>
                </Form.Floating>
              </Col>
              <Col sm="6">
                <Form.Floating>
                  <Form.Control
                    type="text"
                    value={`${meatProcessedName} - (SCRAP)`}
                    readOnly
                  />
                  <label htmlFor="name">Scrap Meat Name</label>
                </Form.Floating>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm="6">
                <Form.Floating>
                  <Form.Control
                    id="name"
                    type="number"
                    value={retailPrice}
                    onChange={(e) => setRetailPrice(e.target.value)}
                  />
                  <label htmlFor="name">Retail Price</label>
                </Form.Floating>
              </Col>
              <Col sm="6">
                <Form.Floating>
                  <Form.Control
                    type="number"
                    value={retailScrap}
                    onChange={(e) => setRetailScrap(e.target.value)}
                  />
                  <label htmlFor="name">Scrap Retail Price</label>
                </Form.Floating>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm="6">
                <Form.Floating>
                  <Form.Control
                    id="name"
                    type="number"
                    value={wholeSalePrice}
                    onChange={(e) => setWholeSalePrice(e.target.value)}
                  />
                  <label htmlFor="name">Whole Sale Price</label>
                </Form.Floating>
              </Col>
              <Col sm="6">
                <Form.Floating>
                  <Form.Control
                    type="number"
                    value={wholeSaleScrap}
                    onChange={(e) => setWholeSaleScrap(e.target.value)}
                  />
                  <label htmlFor="name">Scrap Whole Sale Price</label>
                </Form.Floating>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            id="btn-edit-emp"
            onClick={handleAddProcessedMeat}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProcessedMeatType;
