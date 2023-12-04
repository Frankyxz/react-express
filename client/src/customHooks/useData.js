import { useEffect, useState } from "react";
import axios from "axios";

const useData = (link) => {
  const [dataList, setDataList] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(link);
      console.log(res);
      setDataList(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [link]);

  return { dataList, fetchData };
};

export default useData;
