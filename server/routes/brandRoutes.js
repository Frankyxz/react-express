const express = require("express");
const { addDoc, deleteDoc, updateDoc, doc } = require("firebase/firestore");
const { brandRef } = require("../config/firebase");

const brandRoutes = express.Router();

//Add
brandRoutes.post("/add-brand", async (req, res) => {
  const brand = {
    brandName: req.body.brandName,
    meatType: req.body.meatType,
    meatPart: req.body.meatPart,
  };
  try {
    await addDoc(brandRef, brand);
    res.send({ message: "sucesss" });
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});
//Delete
brandRoutes.delete("/delete-brand/:id", async (req, res) => {
  const { id } = req.params;
  const entryRef = doc(brandRef, id);
  try {
    await deleteDoc(entryRef);
    res.send({ message: "sucesss" });
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});
brandRoutes.put("/edit-brand/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { meatType, meatPart, brandName } = req.body;
    const entryRef = doc(brandRef, id);
    await updateDoc(entryRef, {
      brandName: brandName,
      meatType: meatType,
      meatPart: meatPart,
    });
    res.send("Brand updated successfully.");
  } catch (error) {
  res.send({ message: "Internal server error" });
  }
});
module.exports = brandRoutes;
