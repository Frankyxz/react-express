import { useState, useEffect } from "react";
import { url } from "../js/url";
import axios from "axios";
const useEmpDispatcher = (ref) => {
  const [dispatchBy, setDispathBy] = useState("");
  const [dispatcherOptions, setDispatcherOptions] = useState([]);

  useEffect(() => {
    const loadDispatcherOptions = async () => {
      try {
        const res = await axios.get(`${url}/order-options/dispatchers`);
        setDispatcherOptions(res.data.options);
        setDispathBy(res.data.options[0] || "");
      } catch (error) {
        console.error("Error options: ", error);
      }
    };

    loadDispatcherOptions();
  }, [ref]);
  return { dispatchBy, setDispathBy, dispatcherOptions };
};

export default useEmpDispatcher;
