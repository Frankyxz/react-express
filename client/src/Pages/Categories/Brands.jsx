import React, { useState, useRef, useEffect } from "react";
import useData from "../../customHooks/useData";
import { url } from "../../js/url";
import axios from "axios";
import MeatSelect from "../../Components/MeatSelect";
import Table from "../../Components/Table";
import TextField from "@mui/material/TextField";
import useMeat from "../../customHooks/useMeat";
import useEditModal from "../../customHooks/useEditModal";
import { Button, Modal, Form } from "react-bootstrap";

const Brands = () => {
  const brandLists = useData(`brands`);
  const { selectedMeatType, setSelectedMeatType, partsOptions, selectedParts, setSelectedParts, meatTypeOptions } = useMeat();
  const { editItem, isEditModalOpen, openEditModal, closeEditModal, setEditItem } = useEditModal();
  const [brandName, setBrandName] = useState("");
  const [editMeatType, setEditMeatType] = useState("");
  const [editMeatPart, setEditMeatPart] = useState("");
  const [editMeatOptions, setEditMeatOptions] = useState([]);
  const [editPartOptions, setEditPartOptions] = useState([]);
  const editPartRef = useRef();

  useEffect(() => {
    const loadMeatOptions = () => {
      try {
        setEditMeatOptions(meatTypeOptions);
        setEditMeatType(editItem ? editItem.meatType : "");
      } catch (error) {
        console.error("Error loading meat options: ", error);
      }
    };

    loadMeatOptions();
  }, [isEditModalOpen]);

  useEffect(() => {
    const fetchMeatPart = async () => {
      if (editMeatType !== "") {
        const res = await axios.get(`${url}/useMeat/fetch-part/${editMeatType}`);
        setEditPartOptions(res.data);
        setEditMeatPart(editItem ? editItem.meatPart : "");
      }
    };
    fetchMeatPart();
  }, [editMeatType]);
  // Add
  const handleAddBrand = async () => {
    if ( brandName.trim() == "" || selectedMeatType.trim() == "" || selectedParts.trim() == "") {
      alert("Input a value");
      return;
    }

    // Find if there are the same brandName in the same meat type and meat part
    const brandExists = dataList.some((item) =>
        item.brandName === brandName &&
        item.meatType === selectedMeatType &&
        item.meatPart === selectedParts
    );

    if (brandExists) {
      alert("Brand with the same name and meat type already exists.");
      return;
    }

    try {
      const res = await axios.post(`${url}/brands/add-brand`, {
        brandName: brandName.trim().toUpperCase(),
        meatType: selectedMeatType,
        meatPart: selectedParts,
      });
      brandLists.fetchData();
      setBrandName("");
    } catch (error) {
      console.error(error.message);
    }
  };
  //Delete
  const handleDeleteBrand = async (id) => {
    try {
      const res = await axios.delete(`${url}/brands/delete-brand/${id}`);
      brandLists.fetchData();
    } catch (error) {
      console.error(error.message);
    }
  };
  //Edit
  const handleEditBrand = async () => {
    try {
      const brandExists = dataList.some((item) =>
          item.brandName.trim() === editItem.brandName.toUpperCase().trim() &&
          item.meatType === editMeatType &&
          item.meatPart === editPartRef.current.value
      );

      if (brandExists) {
        alert("Brand with the same name and meat type already exists.");
        return;
      }
      await axios.put(`${url}/brands/edit-brand/${editItem.id}`, {
        brandName: editItem.brandName.toUpperCase(),
        meatType: editMeatType.toUpperCase(),
        meatPart: editPartRef.current.value,
      });
      closeEditModal();
      brandLists.fetchData();
    } catch (error) {
      console.error(error.message);
    }
  };

  const columns = [
    { field: "brandName", headerName: "Brand Name", flex: 1 },
    { field: "meatType", headerName: "Meat Type", flex: 1 },
    { field: "meatPart", headerName: "Meat Part", flex: 1 },
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
            onClick={() => handleDeleteBrand(params.row.id)}
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
        <h2>Brands</h2>

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

        <TextField
          sx={{ ml: 1, minWidth: 120 }}
          id="outlined-size-small"
          label="Brand Name"
          variant="outlined"
          size="small"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
        <button
          type="button"
          id="btn-brand"
          className="px-3 btn-primary btn ms-2"
          onClick={handleAddBrand}
        >
          Add
        </button>
        <div className="table-container">
          <Table rows={brandLists.dataList} columns={columns} height={"400px"} />
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
          <Modal.Title id="ModalLabel">Edit Brand</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                value={editItem ? editItem.brandName : ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, brandName: e.target.value })
                }
              />
              <label htmlFor="edt-id">Meat Name</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Select
                id="meatType"
                name="meatType"
                aria-label="Floating label select example"
                value={editMeatType}
                onChange={(e) => setEditMeatType(e.target.value)}
              >
                {editMeatOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>

              <label htmlFor="meatType">Meat Type</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Select
                id="meatPart"
                name="meatPart"
                aria-label="Floating label select example"
                value={editMeatPart}
                onChange={(e) => setEditMeatPart(e.target.value)}
                ref={editPartRef}
              >
                {editPartOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>

              <label htmlFor="meatPart">Meat Part</label>
            </Form.Floating>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
          <Button variant="primary" id="btn-edit-emp" onClick={handleEditBrand}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Brands;
