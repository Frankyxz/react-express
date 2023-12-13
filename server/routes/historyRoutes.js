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
const { deliveryHistory, percentHistoryRef } = require("../config/firebase");

const historyRoutes = express.Router();

historyRoutes.get("/delivery/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const recordRef = doc(deliveryHistory, id);
    const recordSnapshot = await getDoc(recordRef);
    const recordData = recordSnapshot.data() || {};
    const {
      expectedTotal = [],
      receivedMeat = [],
      dateConfirm = "",
    } = recordData;
    res.send({ expectedTotal, receivedMeat, dateConfirm });
  } catch (error) {
    res.send(error);
  }
});
historyRoutes.get("/percentages/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const recordRef = doc(percentHistoryRef, id);
    const recordSnapshot = await getDoc(recordRef);
    const recordData = recordSnapshot.data() || {};
    const {
      madeToday = [],
      receivedToday = [],
      date = "",
      percentages = [],
    } = recordData;
    res.send({ madeToday, receivedToday, date, percentages });
  } catch (error) {
    res.send(error);
  }
});
module.exports = historyRoutes;
