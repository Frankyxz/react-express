import React, { useEffect } from "react";
import useSalesStore from "../stores/useSalesStore";
import { formattedDate, formattedStartWeek, formattedEndWeek, formattedStartMonth, formattedEndMonth, formattedStartYear, formattedEndYear } from "../js/dates";
import axios from "axios";
import { url } from "../js/url";
const useCalculateSales = () => {
  const { today, setDay, week, setWeek, month, setMonth, year, setYear } = useSalesStore();
  useEffect(() => {
    const fetchSale = async (start, end, setter) => {
      try {
        const res = await axios.get(
          `${url}/reports/sales?start=${start}&end=${end}`);
        setter(res.data.sales);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchSale(formattedDate, formattedDate, setDay);
    fetchSale(formattedStartWeek, formattedEndWeek, setWeek);
    fetchSale(formattedStartMonth, formattedEndMonth, setMonth);
    fetchSale(formattedStartYear, formattedEndYear, setYear);
  }, []);
  return { today, week, month, year };
};

export default useCalculateSales;
