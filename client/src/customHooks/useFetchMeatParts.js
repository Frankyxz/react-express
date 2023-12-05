import { useEffect, useState } from "react";
import useStockLevelStore from "../stores/useStockLevelStore";
import axios from "axios";
import { url } from "../js/url";
const useFetchMeatPart = () => {
  const {
    meatCollection,
    setMeatCollection,
    meatPartTotals,
    setMeatPartTotals,
  } = useStockLevelStore();
  const fetchMeatTotal = async () => {
    try {
      const res = await axios.post(`${url}/meatPart/fetch-meatTotal`, {
        meatCollection,
      });
      setMeatPartTotals(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(`Error fetching data:`, error);
    }
  };

  const loadMeatOptions = async () => {
    try {
      const res = await axios.get(`${url}/meatPart/fetch-combine`);
      setMeatCollection(res.data);
      console.log(res);
    } catch (error) {
      console.error("Error loading meat options: ", error);
    }
  };
  useEffect(() => {
    loadMeatOptions();
  }, []);
  useEffect(() => {
    fetchMeatTotal();
  }, [meatCollection]);

  return { meatCollection, loadMeatOptions, fetchMeatTotal, meatPartTotals };
};

export default useFetchMeatPart;
