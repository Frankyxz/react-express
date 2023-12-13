import { useState } from "react";
import { url } from "../js/url";
import axios from "axios";

const useRecords = (type) => {
  const [records, setRecords] = useState(null);
  const [recordModal, setRecordModal] = useState(false);

  const handleRecords = async (id) => {
    setRecordModal(true);
    try {
      const res = await axios.get(`${url}/history/${type}/${id}`);
      setRecords(res.data);
    } catch (error) {
      console.error("Error fetching records: ", error);
    }
  };
  const handleCloseRecord = () => {
    setRecordModal(false);
    setRecords(null);
  };

  return {
    records,
    recordModal,
    handleCloseRecord,
    handleRecords,
  };
};

export default useRecords;
