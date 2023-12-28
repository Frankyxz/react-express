const express = require("express");
const { getDocs, query, where, addDoc, deleteDoc, updateDoc, doc } = require("firebase/firestore");
const { meatRef, partRef } = require("../config/firebase");

const meatRoutes = express.Router();

// Add
meatRoutes.post("/add-meat", async (req, res) => {
  const meat = { Meat: req.body.meatName };
  try {
    const q = query(meatRef, where("Meat", "==", meat.Meat));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(meatRef, meat);
      res.send("Meat added successfully");
    } else {
      res.send("Meat type already exists");
    }
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

//Delete
meatRoutes.delete("/delete-meat/:id", async (req, res) => {
  const { id } = req.params;

  const entryRef = doc(meatRef, id);

  try {
    const querySnapshot = await getDocs(
      query(partRef, where("meatType", "==", req.body.Meat))
    );

    if (querySnapshot.empty) {
      await deleteDoc(entryRef);
      res.status(200).send("Meat deleted successfully.");
    } else {
      res.send("Cannot delete");
    }
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});

//Validate First before edit
meatRoutes.get("/validate-edit/:meatType", async (req, res) => {
  try {
    const { meatType } = req.params;
    const querySnapshot = await getDocs(
      query(partRef, where("meatType", "==", meatType))
    );

    if (querySnapshot.empty) {
      res.send({ canEdit: true });
    } else {
      res.send({ canEdit: false });
    }
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});

//Edit
meatRoutes.put("/edit-meat/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { Meat } = req.body;
    const meatDocRef = doc(meatRef, id);
    await updateDoc(meatDocRef, { Meat: Meat });
    res.send("Meat updated successfully.");
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});

module.exports = meatRoutes;
