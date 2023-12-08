import { useState } from "react";
import { url } from "../js/url";
import axios from "axios";
const useDeliveryModal = () => {
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  const openDeliveryModal = () => {
    setIsDeliveryModalOpen(true);
  };

  const closeDeliveryModal = async () => {
    setIsDeliveryModalOpen(false);
    await axios.post(`${url}/emp-facility/close-deliver`);
  };

  return {
    isDeliveryModalOpen,
    openDeliveryModal,
    closeDeliveryModal,
  };
};

export default useDeliveryModal;
