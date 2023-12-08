import { useState, useEffect } from "react";

const useGroupMeat = (dataList, field, type) => {
  const [groupedMeat, setGroupedMeat] = useState({});

  useEffect(() => {
    const newData = dataList.reduce((acc, item) => {
      const key = `${item.combined} ${item.brandName}`;
      if (!acc[key]) {
        acc[key] = {
          meatType: item[type],
          brandName: item.brandName,
          totalKg: 0,
        };
      }
      acc[key].totalKg += item[field];
      return acc;
    }, {});

    setGroupedMeat(newData);
  }, [dataList]);

  return groupedMeat;
};

export default useGroupMeat;
