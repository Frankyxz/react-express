import React, { useState, useEffect } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Button, Modal, Form } from "react-bootstrap";
import LoadingModal from "../../Components/LoadingModal";
import useData from "../../customHooks/useData";
import MeatSelect from "../../Components/MeatSelect";
import useTotal from "../../customHooks/useTotal";
import useEditModal from "../../customHooks/useEditModal";
import TextField from "@mui/material/TextField";
import Table from "../../Components/Table";
import useLogin from "../../stores/useLogin";
import useEmpDispatcher from "../../customHooks/useEmpDispatcher";
import usePaymentLists from "../../customHooks/usePaymentList";
import axios from "axios";
import { url } from "../../js/url";
const Orders = () => {
  const { user } = useLogin();
  const orders = useData("orders");
  const totalPrice = useTotal(orders.dataList, "totalPrice");
  const {
    editItem,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    setEditItem,
  } = useEditModal();
  const [processedTypeOptions, setProcessedTypeOptions] = useState([]);
  const [selectedProcessedMeat, setSelectedProcessedMeat] = useState(null);
  const [inputQuantity, setInputQuantity] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typePrice, setTypePrice] = useState("Select Price Type");
  const [detailsModal, setDetailsModal] = useState(false);
  const { dispatchBy, setDispathBy, dispatcherOptions } =
    useEmpDispatcher(detailsModal);
  const { modeOfPayment, setModeOfPayment, paymentOptions } =
    usePaymentLists(detailsModal);

  useEffect(() => {
    const loadProcessedMeat = async () => {
      try {
        const res = await axios.get(`${url}/orders/processed-list`);
        setProcessedTypeOptions(res.data.options);
        setSelectedProcessedMeat(res.data.options[0] || "");
      } catch (error) {
        console.error("Error", error);
      }
    };
    loadProcessedMeat();
  }, []);

  const handleAddOrder = async () => {
    if (inputQuantity <= 0 || inputQuantity === "") {
      alert("Input a valid quantity");
      return;
    }

    if (typePrice === "Select Price Type") {
      alert("Select first");
      return;
    }
    const orderExists = orders.dataList.find(
      (order) => order.brandName === selectedProcessedMeat
    );

    if (orderExists) {
      alert("Selected meat already exists in the orders");
      return;
    }

    try {
      const res = await axios.post(`${url}/orders/add`, {
        typePrice,
        inputQuantity,
        selectedProcessedMeat,
      });
      orders.fetchData();
      setInputQuantity("");
    } catch (error) {
      console.error("Error adding order: ", error);
      alert(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${url}/orders/delete/${id}`);
      orders.fetchData();
    } catch (error) {
      console.error("Error deleting order: ", error);
    }
  };
  const handleEditQuanti = async () => {
    if (!editItem || editItem.kg <= 0) {
      alert("Input a valid quantity");
      return;
    }

    try {
      const res = await axios.put(`${url}/orders/edit`, {
        editItem,
      });
      closeEditModal();
      orders.fetchData();
    } catch (error) {
      console.error("Error updating order: ", error);
    }
  };
  const handleConfirm = async () => {
    setDetailsModal(false);
    setIsLoading(true);
    try {
      const res = await axios.post(`${url}/orders/confirm`, {
        orders,
        modeOfPayment,
        totalPrice,
        customerName,
        dispatchBy,
        user,
      });
      orders.fetchData();
      setIsLoading(false);
    } catch (error) {
      console.error("Error confirming order: ", error);
      setIsLoading(false);
    }
  };
  const handleCloseDetails = () => {
    setDetailsModal(false);
    setCustomerName("");
    setModeOfPayment("");
    setDispathBy("");
  };
  const columns = [
    {
      field: "brandName",
      headerName: "Processed Meat",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "price",
      headerName: "Price",
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
      field: "totalPrice",
      headerName: "Total Price",
      headerAlign: "center",
      flex: 1,
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
            className="btn btn-success ms-2  d-flex align-items-center p-2"
            onClick={() => openEditModal(params.row)}
          >
            <i className="bx bxs-edit"></i>
          </button>
          <button
            className="btn btn-danger ms-2  d-flex align-items-center p-2"
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
        <h2>Orders</h2>
        <FormControl sx={{ mx: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label">Type </InputLabel>
          <Select
            disabled={orders.dataList.length > 0}
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="Brand"
            value={typePrice}
            onChange={(e) => {
              setTypePrice(e.target.value);
              localStorage.setItem("typePrice", e.target.value);
            }}
          >
            <MenuItem value={"Select Price Type"}>Select Price Type</MenuItem>
            <MenuItem value={"Retail"}>Retail</MenuItem>
            <MenuItem value={"Whole Sale"}>Whole Sale</MenuItem>
          </Select>
        </FormControl>

        <MeatSelect
          label="Processed Meat Type"
          options={processedTypeOptions}
          value={selectedProcessedMeat || ""}
          onChange={(e) => setSelectedProcessedMeat(e.target.value)}
        />

        <TextField
          sx={{ mx: 1 }}
          type="number"
          id="outlined-size-small"
          label="Kg"
          variant="outlined"
          size="small"
          value={inputQuantity}
          onChange={(e) => setInputQuantity(e.target.value)}
        />

        <button
          type="button"
          id="btn-meat"
          className="px-3 btn-primary btn"
          onClick={handleAddOrder}
        >
          Add
        </button>
        <h2>Grand Total : {totalPrice}</h2>
        <div className="table-container mt-3">
          <Table rows={orders.dataList} columns={columns} height={"400px"} />
        </div>
        <button
          className="btn btn-primary btn-lg mt-3"
          onClick={() => setDetailsModal(true)}
          disabled={orders.length === 0}
        >
          Confirm
        </button>
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
          <Modal.Title id="ModalLabel">Edit Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                placeholder="ID"
                id="edt-brand"
                value={editItem ? editItem.brandName : ""}
                disabled
              />
              <label htmlFor="edt-brand">Brand</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                type="number"
                value={editItem ? editItem.kg : ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, kg: e.target.value })
                }
              />
              <label htmlFor="edt-id">Quantity</label>
            </Form.Floating>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
          <Button
            variant="primary"
            id="btn-edit-emp"
            onClick={handleEditQuanti}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            id="btn-edit-emp"
            onClick={handleConfirm}
            disabled={customerName.trim() === "" || dispatchBy.trim() === ""}
          >
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Orders;
