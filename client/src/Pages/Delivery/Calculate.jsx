import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import LoadingModal from "../../Components/LoadingModal";
import useData from "../../customHooks/useData";
import useEditModal from "../../customHooks/useEditModal";
import MeatSelect from "../../Components/MeatSelect";
import useTotal from "../../customHooks/useTotal";
import Table from "../../Components/Table";
import useConfirmModal from "../../customHooks/useConfirmModal";
import ConfirmModal from "../../Components/ConfirmModal";
import { url } from "../../js/url";
import axios from "axios";
import useFetchMeatPart from "../../customHooks/useFetchMeatParts";
const Calculate = () => {
  const {
    editItem,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    setEditItem,
  } = useEditModal();
  const { isConfirmModalOpen, openConfirmModal, closeConfirmModal } =
    useConfirmModal();
  const [isLoading, setIsLoading] = useState(false);
  const receivedTotalData = useData(`received-total`);
  const totalData = useData(`total-data`);
  const totalKGReceived = useTotal(receivedTotalData.dataList, "totalKg");
  const [totalProcessed, setTotalProcessed] = useState("");
  const [selectedMeatType, setSelectedMeatType] = useState("");
  const [meatTypeOptions, setMeatTypeOptions] = useState([]);
  const [totalKgProcessed, setTotalKgProcessed] = useState(0);
  const [totalScrap, setTotalScrap] = useState(0);
  const [partnerMeatOptions, setPartnerMeatOptions] = useState([]);
  const [partnerMeatType, setPartnerMeatType] = useState("");

  useEffect(() => {
    const loadMeatOptions = async () => {
      try {
        const res = await axios.get(`${url}/meatPart/fetch-combine`);
        setMeatTypeOptions(res.data);
        setSelectedMeatType(res.data[0] || "");
      } catch (error) {
        console.error("Error loading meat options: ", error);
      }
    };

    loadMeatOptions();
  }, []);
  useEffect(() => {
    const loadPartnerMeatType = async () => {
      if (selectedMeatType !== "") {
        const res = await axios.get(
          `${url}/meatPart/fetch-partner/${selectedMeatType}`
        );
        setPartnerMeatOptions(res.data);
        setPartnerMeatType(res.data[0] || "");
      }
    };
    loadPartnerMeatType();
  }, [selectedMeatType]);
  //Add the total processed in the table
  const handleAddTotal = async () => {
    const meatTypeExists = receivedTotalData.dataList.some(
      (value) => value.meatType === selectedMeatType.toUpperCase()
    );

    const selectedMeatTotalKg = receivedTotalData.dataList.find(
      (value) => value.meatType === selectedMeatType.toUpperCase()
    )?.totalKg;
    const meatTypeExistsInTotal = totalData.dataList.some(
      (value) => value.processedMeat === partnerMeatType.toUpperCase()
    );

    if (meatTypeExistsInTotal) {
      alert(
        `Meat type ${selectedMeatType.toUpperCase()} already exists in totalData.`
      );
      return;
    }
    if (totalProcessed < 0) {
      alert(`Invalid input`);
      return;
    }
    if (
      selectedMeatTotalKg &&
      parseFloat(totalProcessed) > selectedMeatTotalKg
    ) {
      alert("Total processed should not exceed the received totalKg.");
      return;
    }

    if (meatTypeExists) {
      try {
        const res = await axios.post(`${url}/calculate/add-processed-total`, {
          partnerMeatType,
          selectedMeatType,
          totalProcessed,
        });
        setTotalProcessed("");
        totalData.fetchData();
      } catch (error) {
        console.error("Error adding data: ", error);
      }
    } else {
      alert("There are no meatType in the received");
    }
  };
  //Delete a data
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${url}/calculate/delete-processed-total/${id}`
      );
      totalData.fetchData();
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };
  //Edit the kg
  const handleEditKG = async () => {
    const sameMeatType = receivedTotalData.dataList.find(
      (value) => value.meatType === editItem.meatType
    );

    if (sameMeatType) {
      if (parseFloat(editItem.totalKg) > sameMeatType.totalKg) {
        alert("Total processed should not exceed the received totalKg.");
        return;
      }
    }
    try {
      const res = await axios.put(
        `${url}/calculate/edit-processed-total/${editItem.id}`,
        {
          totalKg: editItem.totalKg,
        }
      );
      closeEditModal();
      totalData.fetchData();
    } catch (error) {
      console.error("Error updating KG: ", error);
    }
  };
  const handlevalidate = async () => {
    try {
      const res = await axios.post(`${url}/calculate/validate`, {
        receivedTotalData,
        totalData,
      });
      openConfirmModal();
    } catch (error) {
      console.error("Error", error);
      alert(error.response.data.message);
    }
  };

  //Calculate the percentages
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      closeConfirmModal();
      const res = await axios.post(`${url}/calculate/submit-processed`, {
        receivedTotalData,
        totalData,
        totalKGReceived,
        totalKgProcessed,
        totalScrap,
      });
      receivedTotalData.fetchData();
      totalData.fetchData();
      setIsLoading(false);
    } catch (error) {
      console.error("An error occurred:", error);
      setIsLoading(false);
    }
  };
  //Count the total scrap and non scrap in the table
  useEffect(() => {
    const meatData = totalData.dataList.filter(
      (value) => !value.processedMeat.includes("- (SCRAP)")
    );

    const totalProcessedKg = meatData.reduce(
      (total, value) => total + value.totalKg,
      0
    );
    const scrapData = totalData.dataList.filter((value) =>
      value.processedMeat.includes("- (SCRAP)")
    );

    const totalScrapKg = scrapData.reduce(
      (total, value) => total + value.totalKg,
      0
    );

    setTotalKgProcessed(totalProcessedKg);
    setTotalScrap(totalScrapKg);
  }, [totalData.dataList]);
  const receivedColumns = [
    {
      field: "meatType",
      headerName: "Meat Type",
      flex: 1,
    },
    {
      field: "totalKg",
      headerName: "Total Kg",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
  ];
  const totalDataColumns = [
    {
      field: "processedMeat",
      headerName: "Processed Meat",
      flex: 1,
    },
    {
      field: "meatType",
      headerName: "Meat Type",
      flex: 1,
    },
    {
      field: "totalKg",
      headerName: "Total Kg",
      flex: 1,
      headerAlign: "left",
      align: "left",
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
        {isLoading ? <LoadingModal /> : null}
        <h2>CALCULATE</h2>
        <h4>Total KG Received In Each MeatType </h4>
        <h5>Total Kilo Received: {totalKGReceived}</h5>
        <Table
          rows={receivedTotalData.dataList}
          columns={receivedColumns}
          height={"300px"}
        />
        <div className="emp-deli-faci mt-5">
          <MeatSelect
            label="Type"
            options={meatTypeOptions}
            value={selectedMeatType || ""}
            onChange={(e) => setSelectedMeatType(e.target.value)}
          />

          <MeatSelect
            label="Processed Meat Type"
            options={partnerMeatOptions}
            value={partnerMeatType || ""}
            onChange={(e) => setPartnerMeatType(e.target.value)}
          />

          <TextField
            sx={{ mx: 1 }}
            id="outlined-size-small"
            label="Total"
            type="number"
            variant="outlined"
            size="small"
            value={totalProcessed}
            onChange={(e) => setTotalProcessed(e.target.value)}
          />

          <button
            className="btn btn-primary"
            onClick={handleAddTotal}
            disabled={receivedTotalData.dataList.length === 0}
          >
            Add
          </button>
        </div>
        <div className="table-container mt-3">
          <Table
            rows={totalData.dataList}
            columns={totalDataColumns}
            height={"300px"}
          />

          <button
            className="btn btn-lg btn-primary mt-3"
            onClick={handlevalidate}
            disabled={totalData.dataList.length === 0}
          >
            Submit
          </button>
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
                value={editItem ? editItem.processedMeat : ""}
                disabled
              />
              <label htmlFor="edt-id">Name</label>
            </Form.Floating>

            <Form.Floating className="mb-3">
              <Form.Control
                type="number"
                value={editItem ? editItem.totalKg : ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, totalKg: e.target.value })
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

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleSubmit}
        text="Are you sure that all input data is correct?"
      />
    </>
  );
};

export default Calculate;
