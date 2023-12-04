const express = require("express");
const {
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} = require("firebase/firestore");
const { meatRef, partRef } = require("../config/firebase");

const useMeatRoutes = express.Router();

useMeatRoutes.get("/fetch-meat", async (req, res) => {
  try {
    const querySnapshot = await getDocs(meatRef);
    const options = querySnapshot.docs.map((doc) => doc.data().Meat);

    res.json(options);
  } catch (error) {
    console.error("Error loading meat options: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = useMeatRoutes;
