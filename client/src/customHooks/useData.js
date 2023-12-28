import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../js/url";

const useData = (endPoint) => {
  const [dataList, setDataList] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${url}/fetchData/${endPoint}`);
      setDataList(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return { dataList, fetchData };
};

export default useData;
