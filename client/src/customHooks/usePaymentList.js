import { useState, useEffect } from "react";
import { url } from "../js/url";
import axios from "axios";
const usePaymentLists = (ref) => {
  const [modeOfPayment, setModeOfPayment] = useState("");
  const [paymentOptions, setPaymentOptions] = useState([]);

  useEffect(() => {
    const loadPaymentOptions = async () => {
      try {
        const res = await axios.get(`${url}/order-options/payments`);
        setPaymentOptions(res.data.options);
      } catch (error) {
        console.error("Error options: ", error);
      }
    };

    loadPaymentOptions();
  }, [ref]);
  return { modeOfPayment, setModeOfPayment, paymentOptions };
};

export default usePaymentLists;
