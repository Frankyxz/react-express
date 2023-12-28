const express = require("express");
const { getDocs, query, where } = require("firebase/firestore");
const { orderHistoryRef } = require("../config/firebase");

const reportRoutes = express.Router();

reportRoutes.get("/moving-products", async (req, res) => {
  const { type, start, end } = req.query;
  try {
    const querySnapshot = await getDocs(
      query(orderHistoryRef, where("type", "==", type))
    );
    const filteredData = querySnapshot.docs.filter((doc) => {
      const order = doc.data();
      const date = order.date;
      return date >= start && date <= end;
    });
    const products = [];

    filteredData.forEach((doc) => {
      const orderData = doc.data().orders;

      orderData.forEach((order) => {
        // Check if the product already exists in the products array
        const existingProductIndex = products.findIndex(
          (product) => product.forReport === order.forReport
        );

        if (existingProductIndex !== -1) {
          // If the product exists, update its total sales
          products[existingProductIndex].totalSales += order.kg;
        } else {
          // If the product doesn't exist, add it to the products array
          products.push({
            forReport: order.forReport,
            totalSales: order.kg,
          });
        }
      });
    });

    products.sort((a, b) => b.totalSales - a.totalSales);

    const topProducts = products;
    res.send({ products: topProducts });
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

reportRoutes.get("/sales", async (req, res) => {
  const { start, end } = req.query;
  try {
    const querySnapshot = await getDocs(
      query(
        orderHistoryRef,
        where("date", ">=", start),
        where("date", "<=", end)
      )
    );
    let sales = 0;

    querySnapshot.forEach((doc) => {
      const totalPrice = doc.data().totalPrice;
      sales += totalPrice;
    });
    res.send({ sales: sales });
  } catch (error) {
    res.send(error);
  }
});

reportRoutes.get("/sales-chart", async (req, res) => {
  const { start, end } = req.query;
  try {
    const salesData = Array(12).fill(0);

    const querySnapshot = await getDocs(
      query(
        orderHistoryRef,
        where("date", ">=", start),
        where("date", "<=", end)
      )
    );
    querySnapshot.forEach((doc) => {
      const sale = doc.data();
      const date = sale.date;
      const totalPrice = sale.totalPrice;

      const [year, month, day] = date.split("-");
      const monthIndex = parseInt(month) - 1;

      // Update the total sales for the corresponding month
      salesData[monthIndex] += totalPrice;
      console.log(salesData);
    });
    res.send({ sales: salesData });
  } catch (error) {
    res.send(error);
  }
});
module.exports = reportRoutes;
