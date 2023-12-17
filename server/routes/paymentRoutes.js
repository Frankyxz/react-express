const express = require("express");
const {
  getDocs,
  query,
  where,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} = require("firebase/firestore");
const { paymentsRef } = require("../config/firebase");

const paymentRoutes = express.Router();

paymentRoutes.post("/add", async (req, res) => {
  const paymentName = req.body.name;
  try {
    const payment = {
      paymentName: paymentName.trim().toUpperCase(),
    };
    await addDoc(paymentsRef, payment);
    res.send({ message: "success" });
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

paymentRoutes.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const entryRef = doc(paymentsRef, id);
    await deleteDoc(entryRef);
    res.send({ message: "success" });
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

paymentRoutes.put("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const paymentName = req.body.updateName;
  try {
    const entryRef = doc(paymentsRef, id);
    await updateDoc(entryRef, {
      paymentName: paymentName,
    });
    res.send({ message: "success" });
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

module.exports = paymentRoutes;
