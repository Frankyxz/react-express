import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import QrScanner from "qr-scanner";
import LoadingModal from "../../Components/LoadingModal";
import useData from "../../customHooks/useData";
import useTotal from "../../customHooks/useTotal";
import useLogin from "../../stores/useLogin";
import ConfirmModal from "../../Components/ConfirmModal";
import useConfirmModal from "../../customHooks/useConfirmModal";
import useEmpDispatcher from "../../customHooks/useEmpDispatcher";
import usePaymentLists from "../../customHooks/usePaymentList";
import useGroupMeat from "../../customHooks/useGroupMeat";
import axios from "axios";
import { url } from "../../js/url";
const RawMeatOrder = () => {
  const { user } = useLogin();
  const rawQueueData = useData("raw-queue");
  const [customerName, setCustomerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [returnRows, setReturnRows] = useState([]);
  const [itemPrice, setItemPrice] = useState("");
  const overAllTotal = useTotal(rawQueueData.dataList, "kg");
  const [detailsModal, setDetailsModal] = useState(false);
  const { isConfirmModalOpen, openConfirmModal, closeConfirmModal } =
    useConfirmModal();
  const { dispatchBy, setDispathBy, dispatcherOptions } =
    useEmpDispatcher(detailsModal);
  const { modeOfPayment, setModeOfPayment, paymentOptions } =
    usePaymentLists(detailsModal);
  const groupMeat = useGroupMeat(rawQueueData.dataList, "kg", "combined");
  //Scanner
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef(null);
  const [camOpen, setCamOpen] = useState(false);

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

  useEffect(() => {
    if (scanResult) {
      handleAddDelivery();
    }
  }, [scanResult]);

  const handleCloseDetails = () => {
    setDetailsModal(false);
    setCustomerName("");
    setModeOfPayment("");
    setDispathBy("");
    setItemPrice("");
  };

  const handleAddDelivery = async () => {
    const dataObject = JSON.parse(scanResult.data);
    const id = dataObject.num.toString();
    const exists = rawQueueData.dataList.find((entry) => entry.id === id);

    if (exists) {
      alert("Already scanned");
      setIsLoading(false);
      return;
    }
    setCamOpen(false);
    setIsLoading(true);

    try {
      const res = await axios.post(`${url}/raw/scan-box`, {
        id: id,
      });
      rawQueueData.fetchData();
      setIsLoading(false);
      setScanResult(null);
    } catch (error) {
      console.error("Error : ", error);
      setIsLoading(false);
    }
  };

  const handleDeleteRowSelection = (selection) => {
    const returnRowsData = selection.map((id) =>
      rawQueueData.dataList.find((row) => row.id === id)
    );
    setReturnRows(returnRowsData);
  };
  const handleRemoveDelivery = async () => {
    closeConfirmModal();
    setIsLoading(true);
    try {
      const res = await axios.delete(`${url}/raw/remove-box`, {
        data: returnRows,
      });
      rawQueueData.fetchData();
      setIsLoading(false);
      setReturnRows([]);
    } catch (error) {
      console.error("Error removing : ", error);
      setIsLoading(false);
      setReturnRows([]);
    }
  };

  const handleRemove = () => {
    if (returnRows.length == 0) {
      alert("Nothing to remove");
      return;
    }
    openConfirmModal();
  };
  const handleConfirm = async () => {
    if (itemPrice <= 0) {
      alert("Invalid input");
      return;
    }
    setDetailsModal(false);
    setIsLoading(true);

    try {
      const res = await axios.post(`${url}/raw/confirm`, {
        modeOfPayment,
        customerName,
        itemPrice,
        overAllTotal,
        user,
        dispatchBy,
        rawQueueData,
      });
      rawQueueData.fetchData();
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting: ", error);
      setIsLoading(false);
    }
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
  return (
    <>
      <div className="content-container">
        <h2>Raw Order</h2>
        {isLoading ? <LoadingModal /> : null}
        <div className="topti d-flex align-items-center">
          <div>
            <button
              className="btn btn-success me-3"
              onClick={() => setCamOpen(true)}
            >
              Scan
            </button>

            <button className="btn btn-danger" onClick={handleRemove}>
              Remove
            </button>
          </div>
          <h3 className="ms-auto me-4">Total KG: {overAllTotal} </h3>
        </div>
        {groupMeat &&
          Object.values(groupMeat).map((group) => (
            <div key={`${group.meatType}_${group.brandName}`}>
              {group.meatType} ({group.brandName}) : {group.totalKg} kg
            </div>
          ))}
        <div className="table-container mt-3" style={{ width: "98%" }}>
          <DataGrid
            rows={rawQueueData.dataList}
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
          className="btn btn-lg btn-primary mt-2"
          disabled={rawQueueData.dataList.length === 0}
          onClick={() => setDetailsModal(true)}
        >
          Confirm
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
        show={detailsModal}
        onHide={handleCloseDetails}
        id="eModal"
        tabIndex="-1"
        aria-labelledby="ModalLabel"
        aria-hidden="true"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="ModalLabel">Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name"
                id="edt-brand"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <label htmlFor="edt-brand">Customer Name</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Select
                id="mop"
                aria-label="Floating label select example"
                value={modeOfPayment}
                onChange={(e) => setModeOfPayment(e.target.value)}
              >
                <option value={"PENDING"}> PENDING</option>
                <option value={"CASH"}> CASH</option>
                {paymentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
              <label htmlFor="mop">Mode of Payment</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Select
                id="meatType"
                name="meatType"
                aria-label="Floating label select example"
                value={dispatchBy}
                onChange={(e) => setDispathBy(e.target.value)}
              >
                {dispatcherOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
              <label htmlFor="disp">Dispatch by</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                type="number"
                placeholder="Price"
                id="price"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
              />
              <label htmlFor="disp">Price</label>
            </Form.Floating>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            id="btn-edit-emp"
            onClick={handleConfirm}
            disabled={
              customerName.trim() === "" ||
              dispatchBy.trim() === "" ||
              itemPrice <= 0
            }
          >
            Okay
          </Button>
        </Modal.Footer>
      </Modal>

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

export default RawMeatOrder;
