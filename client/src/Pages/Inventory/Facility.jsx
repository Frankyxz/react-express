import React, { useEffect, useState, useRef } from "react";
import MeatSelect from "../../Components/MeatSelect";
import useMeat from "../../customHooks/useMeat";
import useEditModal from "../../customHooks/useEditModal";
import { Button, Modal, Form } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Table from "../../Components/Table";
import BrandSelect from "../../Components/BrandSelect";
import { url } from "../../js/url";
import axios from "axios";
import useTotal from "../../customHooks/useTotal";
import SearchBar from "../../Components/SearchBar";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";
const Facility = () => {
  const { selectedMeatType, setSelectedMeatType, partsOptions, selectedParts, setSelectedParts, meatBrandOptions, meatData, meatTypeOptions, brandSelect, setBrandSelect, loadData } = useMeat();
  const { editItem, isEditModalOpen, openEditModal, closeEditModal, setEditItem } = useEditModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [meatKg, setMeatKg] = useState("");
  const meatTotal = useTotal(meatData, "kg");
  const [brandTotalKgs, setBrandTotalKgs] = useState({});
  const [qrModal, setQrModal] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [qrDetails, setQrDetails] = useState(null);
  const qrRef = useRef();

  const handleOpenQrModal = (data) => {
    const num = data.id;
    const meatKg = data.kg;
    const brandName = data.brandName;
    const type = data.combine;
    setQrModal(true);
    setQrDetails(data);
    setQrData(JSON.stringify({ num, type, brandName, meatKg }));
  };
  const handleCloseQrModal = () => {
    setQrData(null);
    setQrModal(false);
  };
  const handleAddItem = async () => {
    if (meatKg <= 0 || meatKg === "") {
      alert("Input a value");
      return;
    }
    try {
      const res = await axios.post(`${url}/facility/add-box/`, 
      { brandSelect, meatKg, selectedMeatType, selectedParts });
      setMeatKg("");
      loadData();
    } catch (error) {
      console.error(error.message);
    }
  };
  //Delete a box in a specific meatType and meat Parts
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${url}/facility/delete-box/${id}`);
      loadData();
    } catch (error) {
      console.error(error.message);
    }
  };

  //Edit the kg of the specific box
  const handleEditKG = async () => {
    closeEditModal();
    try {
      await axios.put(`${url}/facility/edit-box/${editItem.id}`, 
      { kg: editItem.kg });
      loadData();
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const calculateBrandTotalKgs = () => {
      const brandKgs = {};

      for (const item of meatData) {
        if (!brandKgs[item.brandName]) {
          brandKgs[item.brandName] = item.kg;
        } else {
          brandKgs[item.brandName] += item.kg;
        }
      }
      setBrandTotalKgs(brandKgs);
    };

    calculateBrandTotalKgs();
  }, [meatData]);
  const columns = [
    {
      field: "brandId",
      headerName: "ID",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "brandName",
      headerName: "Brand Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "kg",
      headerName: "KG",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "dateAdded",
      headerName: "Date Added",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
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
            className="btn btn-warning ms-2 d-flex align-items-center p-2"
            onClick={() => handleOpenQrModal(params.row)}
          >
            <i className="bx bx-qr-scan"></i>
          </button>
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
  const handlePrint = useReactToPrint({
    content: () => qrRef.current,
  });
  return (
    <>
      <div className="content-container">
        <h2>Facility </h2>

        <MeatSelect
          label="Meat Type"
          options={meatTypeOptions}
          value={selectedMeatType}
          onChange={(e) => setSelectedMeatType(e.target.value)}
        />

        <MeatSelect
          label="Meat Part"
          options={partsOptions}
          value={selectedParts}
          onChange={(e) => setSelectedParts(e.target.value)}
        />
        <BrandSelect
          options={meatBrandOptions}
          value={brandSelect}
          onChange={(e) => setBrandSelect(e.target.value)}
        />

        <TextField
          sx={{ mr: 1, minWidth: 120 }}
          id="outlined-size-small"
          label="Kg"
          variant="outlined"
          type="number"
          size="small"
          value={meatKg}
          onChange={(e) => setMeatKg(e.target.value)}
        />
        <button
          type="button"
          id="btn-meat"
          className="px-3 btn-primary btn"
          onClick={handleAddItem}
          disabled={ selectedMeatType === "" || selectedParts == "" || meatKg == "" || brandSelect == ""}
        >
          Add
        </button>
        <h3>Total KG: {meatTotal} </h3>
        {Object.keys(brandTotalKgs).map((brandName) => (
          <div key={brandName}>
            {brandName}: {brandTotalKgs[brandName].toFixed(2)} kg
          </div>
        ))}

        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="table-container mt-3">
          <Table
            rows={meatData.filter(
              (value) =>
                value.brandName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                value.kg.toString().includes(searchQuery.toLowerCase()) ||
                value.dateAdded
                  .toString()
                  .includes(searchQuery.toLowerCase()) ||
                value.id.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Modal.Title id="ModalLabel">Edit Kg</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                placeholder="ID"
                id="edt-id"
                value={
                  editItem ? editItem.brandId + " - " + editItem.brandName : ""
                }
                disabled
              />
              <label htmlFor="edt-id">ID</label>
            </Form.Floating>

            <Form.Floating className="mb-3">
              <Form.Control
                type="number"
                value={editItem ? editItem.kg : ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, kg: e.target.value })
                }
              />
              <label htmlFor="edt-id">KG</label>
            </Form.Floating>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
          <Button variant="primary" id="btn-edit-emp" onClick={handleEditKG}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={qrModal}
        onHide={handleCloseQrModal}
        id="eModal"
        tabIndex="-1"
        aria-labelledby="ModalLabel"
        aria-hidden="true"
      >
        <Modal.Header closeButton>
          <Modal.Title id="ModalLabel">QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {qrData ? (
            <>
              <div ref={qrRef} className="d-flex justify-content-center">
                <QRCode value={qrData} size={120} />
              </div>

              <p className="text-center mt-3">
                {qrDetails.id} {qrDetails.combine} {qrDetails.brandName}{" "}
                {qrDetails.kg}
              </p>
            </>
          ) : (
            <p>Loading</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" id="btn-edit-emp" onClick={handlePrint}>
            Print
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Facility;
