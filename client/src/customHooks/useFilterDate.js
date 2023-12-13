import React, { useState } from "react";

const useFilterDate = (data, name) => {
  let currentDate = new Date();
  let formattedDate = currentDate.toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedDate);

  const handleFromDate = (e) => {
    if (e.target.value > toDate) {
      alert("Lagpas sa To");
    } else {
      setFromDate(e.target.value);
    }
  };

  const handleToDate = (e) => {
    if (fromDate > e.target.value) {
      alert("Lagpas sa from");
    } else {
      setToDate(e.target.value);
    }
  };
  const filteredData = data.dataList.filter((order) => {
    return order[name] >= fromDate && order[name] <= toDate;
  });

  return { handleFromDate, handleToDate, filteredData, fromDate, toDate };
};

export default useFilterDate;
