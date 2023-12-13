import { useState } from "react";
import { url } from "../js/url";
import axios from "axios";
const useSeeDetails = (dataRef) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  //Fetch the details of the order depends on the id
  const handleSeeDetails = async (id) => {
    setShowModal(true);
    try {
      const res = await axios.get(`${url}/orders/${dataRef}/${id}`);
      setOrderDetails(res.data.orderData);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };
  //Reset the see details when close
  const handleCloseModal = () => {
    setShowModal(false);
    setOrderDetails(null);
  };
  return {
    orderDetails,
    showModal,
    handleSeeDetails,
    handleCloseModal,
  };
};

export default useSeeDetails;
