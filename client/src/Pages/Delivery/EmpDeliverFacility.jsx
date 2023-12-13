import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import LoadingModal from "../../Components/LoadingModal";
import NotifModal from "../../Components/NotifModal";
import useData from "../../customHooks/useData";
import useTotal from "../../customHooks/useTotal";
import Table from "../../Components/Table";
import useLogin from "../../stores/useLogin";
import useDeliveryModal from "../../customHooks/useDeliveryModal";
import SearchBar from "../../Components/SearchBar";
import QrScanner from "qr-scanner";
import useLogIn from "../../stores/useLogin";
import { url } from "../../js/url";
import useGroupMeat from "../../customHooks/useGroupMeat";
import axios from "axios";
const EmpDeliverFacility = () => {
  const { user } = useLogIn();
  const { isDeliveryModalOpen, openDeliveryModal, closeDeliveryModal } =
    useDeliveryModal();
  const deliveryQueueData = useData(`deliveryQueue`);
  const empDeliverList = useData(`emp-deliver-list`);
  const totalMeatKg = useTotal(empDeliverList.dataList, "totalKg");
  const queueGroupMeat = useGroupMeat(
    deliveryQueueData.dataList,
    "kg",
    "combined"
  );
  const empGroupMeat = useGroupMeat(
    empDeliverList.dataList,
    "totalKg",
    "meatType"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [remarksModal, setRemarksModal] = useState(false);
  const [deliveryRemarks, setDeliveryRemarks] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [kgNum, setKgNum] = useState(0);
  const [deliverStatus, setDeliverStatus] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [camOpen, setCamOpen] = useState(false);
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

  useEffect(() => {
    if (scanResult) {
      handleAddTotalKg();
    }
  }, [scanResult]);

  const handleCloseRemarkModal = () => {
    setRemarksModal(false);
    setIsChecked(false);
    setDeliveryRemarks("");
  };
  const handleAddTotalKg = async () => {
    setCamOpen(false);
    setIsLoading(true);
    const dataObject = JSON.parse(scanResult.data);
    const entryIdString = dataObject.num.toString();

    const exists = deliveryQueueData.dataList.find(
      (entry) => entry.id === entryIdString
    );
    const idExist = empDeliverList.dataList.find(
      (entry) => entry.brandId === entryIdString
    );

    if (!exists) {
      alert("Not in the delivery");
      setIsLoading(false);
      setScanResult(null);
      return;
    }
    if (idExist) {
      alert("Already Scanned");
      setIsLoading(false);
      setScanResult(null);
      return;
    }

    try {
      const res = await axios.post(`${url}/emp-facility/scan-box`, {
        id: entryIdString,
      });
      empDeliverList.fetchData();
      setIsLoading(false);
      setScanResult(null);
    } catch (error) {
      console.error("Error adding data: ", error);
      setIsLoading(false);
    }
  };
  const handleDeleteBrand = async (id) => {
    try {
      const res = await axios.delete(`${url}/emp-facility/delete-box/${id}`);
      empDeliverList.fetchData();
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };
  const handleSubmit = async () => {
    if (!isChecked) {
      alert("All boxes should be counted");
      return;
    }
    if (deliveryRemarks.trim() === "") {
      alert("Please input a remarks");
      return;
    }
    setRemarksModal(false);
    setIsLoading(true);
    try {
      const res = await axios.post(`${url}/emp-facility/count-data`, {
        user,
        deliveryRemarks,
      });
      empDeliverList.fetchData();
      setIsLoading(false);
      console.log(res);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    const handleDisableButton = async () => {
      try {
        const res = await axios.get(`${url}/delivery-facility/set-kg`);
        setKgNum(res.data.kg);
      } catch (error) {
        console.error("Error", error);
      }
    };
    const handleDeliveryNotif = async () => {
      const res = await axios.get(`${url}/emp-facility/notification`);
      openDeliveryModal();
      setDeliverStatus(res.data.val);
    };
    handleDisableButton();
    handleDeliveryNotif();
  }, []);

  const columns = [
    {
      field: "brandId",
      headerName: "ID",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "meatType",
      headerName: "Meat Type",
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
      field: "totalKg",
      headerName: "Total Kg",
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
        <h2>Meat Received</h2>
        {isLoading ? <LoadingModal /> : null}

        <button
          className="btn btn-success me-3"
          onClick={() => setCamOpen(true)}
        >
          Scan
        </button>

        {kgNum > 0 ? (
          <button
            className="btn btn-warning ms-3"
            onClick={() => {
              openDeliveryModal();
              setDeliverStatus(1);
            }}
          >
            Details
          </button>
        ) : null}
        <h3>Total KG: {totalMeatKg} </h3>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {empGroupMeat &&
          Object.values(empGroupMeat).map((group) => (
            <div key={`${group.meatType}_${group.brandName}`}>
              {group.meatType} ({group.brandName}) : {group.totalKg} kg
            </div>
          ))}
        <div className="table-container">
          <Table
            rows={empDeliverList.dataList.filter(
              (value) =>
                value.brandName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                value.totalKg.toString().includes(searchQuery.toLowerCase()) ||
                value.meatType.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            columns={columns}
            height={"350px"}
          />
        </div>
        <button
          className="btn btn-primary btn-lg mt-3"
          onClick={() => setRemarksModal(true)}
          disabled={kgNum <= 0 || empDeliverList.length === 0}
        >
          Submit
        </button>
      </div>

      <NotifModal
        isOpen={isDeliveryModalOpen}
        onClose={closeDeliveryModal}
        val={deliverStatus}
        count={deliveryQueueData.dataList.length}
        details={queueGroupMeat}
      />
      <Modal show={remarksModal} onHide={handleCloseRemarkModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delivery Remarks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                placeholder="ID"
                id="edt-name"
                disabled
                value={user}
              />
              <label htmlFor="edt-brand">Name</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                style={{ height: "100px" }}
                value={deliveryRemarks}
                onChange={(e) => setDeliveryRemarks(e.target.value)}
              />
              <label>Leave comment here</label>
            </Form.Floating>
          </Form>
          <Form.Check
            aria-label="option 1"
            label={`All boxes are counted`}
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
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

export default EmpDeliverFacility;
