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
const { partRef, facilityInventoryRef } = require("../config/firebase");

const meatPartRoutes = express.Router();

//Add
meatPartRoutes.post("/add-part", async (req, res) => {
  const meatPart = {
    meatPart: req.body.meatPart,
    meatType: req.body.meatType,
    combined: req.body.combined,
  };
  try {
    await addDoc(partRef, meatPart);
    res.send({ message: "sucesss" });
  } catch (error) {
    res.send(error);
  }
});
//Delete
meatPartRoutes.delete("/delete-part/:id", async (req, res) => {
  const { id } = req.params;
  const entryRef = doc(partRef, id);
  try {
    const partsRef = query(
      facilityInventoryRef,
      where("meatType", "==", req.body.meatType),
      where("meatPart", "==", req.body.meatPart)
    );

    const querySnapshot = await getDocs(partsRef);
    if (!querySnapshot.empty) {
      res.send({ message: "There are data inside" });
      return;
    }
    await deleteDoc(entryRef);
    res.send({ message: "sucesss" });
  } catch (error) {
    res.send(error);
  }
});
//Validate First
meatPartRoutes.get("/validate-edit/", async (req, res) => {
  try {
    const { meatType, meatPart } = req.query;
    const partsRef = query(
      facilityInventoryRef,
      where("meatType", "==", meatType),
      where("meatPart", "==", meatPart)
    );

    const querySnapshot = await getDocs(partsRef);
    if (!querySnapshot.empty) {
      res
        .status(200)
        .json({ message: "There are data inside", canEdit: false });
      return;
    }
    res.status(200).json({ canEdit: true });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//Edit
//Edit
meatPartRoutes.put("/edit-part/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { meatType, meatPart } = req.body;
    const entryRef = doc(partRef, id);
    await updateDoc(entryRef, {
      meatPart: meatPart.trim().toUpperCase(),
      meatType: meatType,
      combined: `${meatType} ${meatPart.trim().toUpperCase()}`,
    });
    res.status(200).send("Meat updated successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = meatPartRoutes;
