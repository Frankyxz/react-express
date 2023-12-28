const express = require("express");
const { getDocs } = require("firebase/firestore");
const { dispatcherRef, paymentsRef } = require("../config/firebase");

const orderOptionsRoutes = express.Router();

orderOptionsRoutes.get("/dispatchers", async (req, res) => {
  try {
    const querySnapshot = await getDocs(dispatcherRef);
    const options = querySnapshot.docs.map((doc) => doc.data().empName);
    res.send({ options });
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});

orderOptionsRoutes.get("/payments", async (req, res) => {
  try {
    const querySnapshot = await getDocs(paymentsRef);
    const options = querySnapshot.docs.map((doc) => doc.data().paymentName);
    res.send({ options });
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});
module.exports = orderOptionsRoutes;
