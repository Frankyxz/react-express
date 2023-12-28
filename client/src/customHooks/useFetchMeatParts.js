import { useEffect } from "react";
import useStockLevelStore from "../stores/useStockLevelStore";
import axios from "axios";
import { url } from "../js/url";
const useFetchMeatPart = () => {
  const { meatCollection, setMeatCollection, meatPartTotals, setMeatPartTotals } = useStockLevelStore();
  const fetchMeatTotal = async () => {
    try {
      const res = await axios.post(`${url}/meatPart/fetch-meatTotal`, 
      { meatCollection });
      setMeatPartTotals(res.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const loadMeatOptions = async () => {
    try {
      const res = await axios.get(`${url}/meatPart/fetch-combine`);
      setMeatCollection(res.data);
    } catch (error) {
      console.error(error.message);
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
