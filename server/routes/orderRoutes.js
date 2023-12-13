const express = require("express");
const {
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
} = require("firebase/firestore");
const {
  orderHistoryRef,
  orderListRef,
  cancelHistoryRef,
} = require("../config/firebase");

const orderRoutes = express.Router();

orderRoutes.get("/:dataRef/:id", async (req, res) => {
  const id = req.params.id;
  const dataRef = req.params.dataRef;
  let ref =
    dataRef == "orderHistory"
      ? orderHistoryRef
      : dataRef == "cancel"
      ? cancelHistoryRef
      : orderListRef;
  try {
    const orderRef = doc(ref, id);
    const orderSnapshot = await getDoc(orderRef);
    const orderData = orderSnapshot.data() || {};
    res.send({ orderData });
  } catch (error) {
    res.send(error);
  }
});

module.exports = orderRoutes;
