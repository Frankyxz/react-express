import React, { useState, useEffect } from "react";
import SearchBar from "../../Components/SearchBar";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, Form } from "react-bootstrap";
import Box from "@mui/material/Box";
import LoadingModal from "../../Components/LoadingModal";
import useData from "../../customHooks/useData";
import useTotal from "../../customHooks/useTotal";
import useLogIn from "../../stores/useLogin";
import { url } from "../../js/url";
import axios from "axios";
const DeliveryAdmin = () => {
  const { user } = useLogIn();
  const [remarksModal, setRemarksModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const deliverData = useData(`${url}/fetchData/deliver-table`);
  const boxesReceived = useData(`${url}/fetchData/box-received`);
  const receivedMeat = useData(`${url}/fetchData/received-table`);
  const expectedTotalData = useData(`${url}/fetchData/expected-total`);
  const deliverTotalKg = useTotal(expectedTotalData.dataList, "totalKg");
  const receivedTotalKg = useTotal(receivedMeat.dataList, "totalKg");
  const [searchQuery, setSearchQuery] = useState("");
  const [remarks, setRemarks] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState({
    deliveryBy: "",
    remarks: "",
  });
  const handleCloseRemarkModal = () => {
    setRemarksModal(false);
    setRemarks("");
  };
  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      try {
        const res = await axios.get(`${url}/admin-delivery/deliver-details`);
        setDeliveryInfo({
          deliveryBy: res.data.deliveryBy,
          remarks: res.data.remarks,
        });
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchDeliveryInfo();
  }, []);

  const handleToDeliveryHistory = async () => {
    try {
      if (remarks.trim() == "") {
        alert("Input a remarks");
        return;
      }
      setIsLoading(true);
      setRemarksModal(false);
      const res = await axios.post(`${url}/admin-delivery/process-delivery`, {
        deliverTotalKg,
        receivedTotalKg,
        deliveryInfo,
        remarks,
        user,
        expectedTotalData,
        receivedMeat,
      });
      setIsLoading(false);
      setDeliveryInfo({
        deliveryBy: "",
        remarks: "",
      });
      //   deliverData.fetchData();
      //   boxesReceived.fetchData();
      //   receivedMeat.fetchData();
      //   expectedTotalData.fetchData();
    } catch (error) {
      console.error("Error: ", error);
      setIsLoading(false);
    }
  };
  const combinedData = expectedTotalData.dataList.map((expectedItem) => {
    const matchingReceivedItem = receivedMeat.dataList.find(
      (receivedItem) =>
        receivedItem.meatType === expectedItem.meatType &&
        receivedItem.brandName === expectedItem.brandName
    );

    return {
      id: `${expectedItem.meatType}_${expectedItem.brandName}`,
      meatType: expectedItem.meatType,
      brandName: expectedItem.brandName,
      receivedMeat: matchingReceivedItem ? matchingReceivedItem.totalKg : 0,
      expectedTotal: expectedItem.totalKg,
    };
  });

  const combinedColumns = [
    {
      field: "meatType",
      headerName: "Meat Type",
      flex: 1,
    },
    {
      field: "brandName",
      headerName: "Brand Name",
      flex: 1,
    },
    {
      field: "receivedMeat",
      headerName: "Received Meat",
      flex: 1,
    },
    {
      field: "expectedTotal",
      headerName: "Expected Total",
      flex: 1,
    },
  ];
  const boxesColumns = [
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
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "combined",
      headerName: "Meat Type",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];
  //Responsible for changing the color if the same meatType is not matched the kg
  const isMismatched = (meatType, brandName) => {
    const receivedMeatItem = receivedMeat.dataList.find(
      (item) => item.meatType === meatType && item.brandName === brandName
    );
    const expectedTotalItem = expectedTotalData.dataList.find(
      (item) => item.meatType === meatType && item.brandName === brandName
    );

    if (receivedMeatItem && expectedTotalItem) {
      return receivedMeatItem.totalKg !== expectedTotalItem.totalKg;
    }

    return true;
  };
  const isDelivered = (id) => {
    const receivedMeatItem = boxesReceived.dataList.find(
      (item) => item.brandId == id
    );

    return receivedMeatItem;
  };

  return (
    <>
      <div className="content-container">
        <h2>Delivery - Admin</h2>
        {isLoading ? <LoadingModal /> : null}
        <div>
          Remarks By: {deliveryInfo.deliveryBy} - {deliveryInfo.remarks}
        </div>
        <div style={{ width: "98%" }}>
          <Box
            sx={{
              height: 400,
              width: "100%",
              "& .hot": {
                backgroundColor: "#ff943975",
                color: "#1a3e72",
              },
            }}
          >
            <DataGrid
              rows={combinedData}
              columns={combinedColumns}
              disableRowSelectionOnClick
              getRowClassName={(params) => {
                const isMisMatched = isMismatched(
                  params.row.meatType,
                  params.row.brandName
                );
                return isMisMatched ? "hot" : "";
              }}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pagination
              pageSizeOptions={[5, 10]}
            />
          </Box>
        </div>
        <h3 className="mt-3">BOXES DELIVERED</h3>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="table-container">
          <Box
            sx={{
              height: 400,
              width: "100%",
              "& .hot": {
                backgroundColor: "#ff943975",
                color: "#1a3e72",
              },
            }}
          >
            <DataGrid
              rows={deliverData.dataList.filter(
                (value) =>
                  value.brandName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  value.kg.toString().includes(searchQuery.toLowerCase()) ||
                  value.dateAdded
                    .toString()
                    .includes(searchQuery.toLowerCase()) ||
                  value.brandId
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  value.combined
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
              )}
              columns={boxesColumns}
              disableRowSelectionOnClick
              getRowClassName={(params) => {
                const isMisMatched = isDelivered(params.row.brandId);
                return isMisMatched ? "" : "hot";
              }}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pagination
              pageSizeOptions={[5, 10]}
            />
          </Box>
        </div>
        <button
          className="btn btn-primary btn-lg mt-3"
          onClick={() => setRemarksModal(true)}
          disabled={
            deliverData.dataList.length === 0 ||
            receivedMeat.dataList.length === 0 ||
            expectedTotalData.dataList.length === 0
          }
        >
          Okay
        </button>
      </div>

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
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              <label>Leave comment here</label>
            </Form.Floating>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleToDeliveryHistory}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeliveryAdmin;
