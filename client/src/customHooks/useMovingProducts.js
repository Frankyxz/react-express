import React, { useState, useEffect } from "react";
import {
  formattedDate,
  formattedStartWeek,
  formattedEndWeek,
  formattedStartMonth,
  formattedEndMonth,
} from "../js/dates";
import axios from "axios";
import { url } from "../js/url";
const useMovingProducts = (type, sortBy) => {
  const [movingProducts, setMovingProducts] = useState([]);
  useEffect(() => {
    const fetchMovingProducts = async () => {
      let start, end;

      if (sortBy === "Daily") {
        start = formattedDate;
        end = formattedDate;
      } else if (sortBy === "Weekly") {
        start = formattedStartWeek;
        end = formattedEndWeek;
      } else if (sortBy === "Monthly") {
        start = formattedStartMonth;
        end = formattedEndMonth;
      }
      try {
        const res = await axios.get(
          `${url}/reports/moving-products?type=${type}&start=${start}&end=${end}`
        );

        setMovingProducts(
          res.data.products.length === 0
            ? [
                { forReport: "Product A", totalSales: 50 },
                { forReport: "Product B", totalSales: 30 },
                { forReport: "Product C", totalSales: 20 },
              ]
            : res.data.products
        );
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchMovingProducts();
  }, [sortBy]);
  return movingProducts;
};

export default useMovingProducts;
