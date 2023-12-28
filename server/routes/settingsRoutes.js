const express = require("express");
const { getDoc, updateDoc } = require("firebase/firestore");
const { levelStock } = require("../config/firebase");
const settingsRoutes = express.Router();

settingsRoutes.put("/set-level", async (req, res) => {
  const editedValues = req.body.data;
  try {
    const level = await getDoc(levelStock);

    const data = level.data();
    const array = data[editedValues.name] || [];

    const newArray = array.map((item) => ({ ...item }));

    // Update the values based on status names
    newArray.find((item) => item.status === "Critical").value =
      editedValues.critical;
    newArray.find((item) => item.status === "Low level").value =
      editedValues.reorder;
    newArray.find((item) => item.status === "Average").value =
      editedValues.average;

    await updateDoc(levelStock, {
      [editedValues.name]: newArray,
    });
    res.send({ message: "success" });
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

module.exports = settingsRoutes;
