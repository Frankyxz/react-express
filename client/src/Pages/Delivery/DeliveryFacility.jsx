import React, { useEffect, useState, useRef } from "react";
import SearchBar from "../../Components/SearchBar";
import MeatSelect from "../../Components/MeatSelect";
import LoadingModal from "../../Components/LoadingModal";
import useMeat from "../../customHooks/useMeat";
import useData from "../../customHooks/useData";
import useTotal from "../../customHooks/useTotal";
import { Button, Modal, Form } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import QrScanner from "qr-scanner";
import axios from "axios";
import { url } from "../../js/url";
import ConfirmModal from "../../Components/ConfirmModal";
import useConfirmModal from "../../customHooks/useConfirmModal";
const DeliveryFacility = () => {
  const {
    selectedMeatType,
    setSelectedMeatType,
    partsOptions,
    selectedParts,
    setSelectedParts,
    meatData,
    meatTypeOptions,
  } = useMeat();
  const { isConfirmModalOpen, openConfirmModal, closeConfirmModal } =
    useConfirmModal();
  const deliveryQueueData = useData(`${url}/fetchData/deliveryQueue`);
  const deliverTotalKg = useTotal(deliveryQueueData.dataList, "kg");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQueue, setSearchQueue] = useState("");
  const [returnRows, setReturnRows] = useState([]);
  const [kgNum, setKgNum] = useState(0);
  const [camOpen, setCamOpen] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [groupMeat, setGroupMeat] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          setScanResult(result);
        },
        {
          highlightCodeOutline: true,
          highlightScanRegion: true,
        }
      );

      scanner.start();

      return () => {
        scanner.stop();
      };
    }
  }, [camOpen]);

  const handleAddDelivery = async () => {
    const dataObject = JSON.parse(scanResult.data);
    const entryIdString = dataObject.num.toString();
    const exists = deliveryQueueData.dataList.find(
      (entry) => entry.id === entryIdString
    );

    if (exists) {
      alert("Already scanned");
      setIsLoading(false);
      setScanResult(null);
      return;
    }
    setCamOpen(false);
    setIsLoading(true);

    try {
      const res = await axios.post(`${url}/delivery-facility/scan-box`, {
        id: entryIdString,
      });

      deliveryQueueData.fetchData();
      setIsLoading(false);
      setScanResult(null);
    } catch (error) {
      console.error("Error adding to Delivery Queue: ", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (scanResult) {
      handleAddDelivery();
    }
  }, [scanResult]);

  const handleRemoveDelivery = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete(`${url}/delivery-facility/remove-box`, {
        data: returnRows,
      });
      setIsLoading(false);
      deliveryQueueData.fetchData();
      setReturnRows([]);
    } catch (error) {
      console.error("Error removing from Delivery Queue: ", error);
      setIsLoading(false);
    }
  };
  const handleRemove = () => {
    if (returnRows.length == 0) {
      alert("Nothing to remove");
      return;
    }
    openConfirmModal();
  };

  const handleChangeButton = async () => {
    try {
      const res = await axios.get(`${url}/delivery-facility/set-kg`);
      console.log("KG num", res.data);
      setKgNum(res.data.kg);
    } catch (error) {
      console.error("Error", error);
    }
  };
  useEffect(() => {
    handleChangeButton();
  }, []);
  const handleDelivery = async () => {
    if (deliveryQueueData.dataList.length === 0) {
      alert("Add items first");
      return;
    }
    try {
      const res = await axios.post(`${url}/delivery-facility/set-delivery`, {
        data: deliverTotalKg,
      });
      handleChangeButton();
    } catch (error) {
      console.error("Error", error);
    }
  };

  //Cancel the delivery
  const handleCancel = async () => {
    try {
      const res = await axios.post(`${url}/delivery-facility/cancel-delivery`);
      handleChangeButton();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRowSelection = (selection) => {
    const returnRowsData = selection.map((id) =>
      deliveryQueueData.dataList.find((row) => row.id === id)
    );
    setReturnRows(returnRowsData);
  };

  const columns = [
    {
      field: "brandId",
      headerName: "ID",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "combined",
      headerName: "Meat",
      flex: 1,
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
      flex: 1,
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
  ];
  useEffect(() => {
    //Calculate every meat in the deliveryQueue table
    const groupedMeatData = deliveryQueueData.dataList.reduce((acc, item) => {
      const key = `${item.combined} ${item.brandName}`;
      if (!acc[key]) {
        acc[key] = {
          meatType: item.combined,
          brandName: item.brandName,
          totalKg: 0,
        };
      }
      acc[key].totalKg += item.kg;
      return acc;
    }, {});

    setGroupMeat(groupedMeatData);
  }, [deliveryQueueData.dataList]);

  return (
    <>
      <div className="content-container">
        <h2>DELIVERY FACILITY</h2>
        {isLoading ? <LoadingModal /> : null}
        <div className="topti d-flex align-items-center">
          <button
            className="btn btn-success me-3"
            onClick={() => setCamOpen(true)}
            disabled={kgNum !== 0}
          >
            Scan
          </button>

          <button
            className="btn btn-danger"
            disabled={kgNum !== 0}
            onClick={handleRemove}
          >
            Remove
          </button>
          <h3 className="ms-auto me-3">Total KG: {deliverTotalKg}</h3>
        </div>
        {groupMeat &&
          Object.values(groupMeat).map((group) => (
            <div key={`${group.meatType}_${group.brandName}`}>
              {group.meatType} ({group.brandName}) : {group.totalKg} kg
            </div>
          ))}
        <SearchBar
          value={searchQueue}
          onChange={(e) => setSearchQueue(e.target.value)}
        />
        <div className="table-container mt-3" style={{ width: "98%" }}>
          <DataGrid
            rows={deliveryQueueData.dataList.filter(
              (value) =>
                value.brandName
                  .toLowerCase()
                  .includes(searchQueue.toLowerCase()) ||
                value.kg.toString().includes(searchQueue.toLowerCase()) ||
                value.id.toLowerCase().includes(searchQueue.toLowerCase())
            )}
            sx={{ height: "400px" }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            columns={columns}
            disableRowSelectionOnClick
            pagination
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowSelectionModelChange={handleDeleteRowSelection}
            selectionModel={returnRows.map((row) => row.id)}
          />
        </div>
        <button
          className="btn btn-primary btn-lg mt-3"
          onClick={handleDelivery}
          style={{ display: kgNum !== 0 ? "none" : "block" }}
        >
          Deliver
        </button>
        <button
          className="btn btn-danger btn-lg mt-3"
          onClick={handleCancel}
          style={{ display: kgNum !== 0 ? "block" : "none" }}
        >
          Cancel
        </button>
      </div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={() => {
          closeConfirmModal();
          handleRemoveDelivery();
        }}
        text="Are you sure you want to remove checked boxes?"
      />

      <Modal
        show={camOpen}
        onHide={() => setCamOpen(false)}
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Scan QR
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <video ref={videoRef} style={{ width: "100%" }} />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DeliveryFacility;
