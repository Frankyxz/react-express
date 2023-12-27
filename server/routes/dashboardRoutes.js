const express = require("express");
const {
  collection,
  query,
  where,
  getDoc,
  getDocs,
} = require("firebase/firestore");
const {
  db,
  deliveryHistory,
  orderListRef,
  pendingTableRef,
  partRef,
  comissaryRef,
  levelStock,
} = require("../config/firebase");
const { formattedDate } = require("../dates");
const dashboardRoutes = express.Router();

dashboardRoutes.get("/levels", async (req, res) => {
  try {
    const levelStockSnapshot = await getDoc(levelStock);

    if (levelStockSnapshot.exists()) {
      const recordData = levelStockSnapshot.data() || {};
      const { raw = [], process = [] } = recordData;
      res.send({ raw, process });
    }
  } catch (error) {
    res.send(error);
  }
});
dashboardRoutes.get("/delivered-today", async (req, res) => {
  try {
    const q = query(deliveryHistory, where("dateConfirm", "==", formattedDate));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const kilo = doc.data().totalKiloDelivered;
      res.send({ kiloDelivered: kilo });
    }
  } catch (error) {
    res.send(error);
  }
});
module.exports = dashboardRoutes;
