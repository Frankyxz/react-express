const express = require("express");
const { addDoc, doc, deleteDoc, updateDoc } = require("firebase/firestore");
const { dispatcherRef } = require("../config/firebase");

const dispatcherRoutes = express.Router();

dispatcherRoutes.post("/add", async (req, res) => {
  const empName = req.body.name;
  try {
    const dispatcher = {
      empName: empName.trim().toUpperCase(),
    };
    await addDoc(dispatcherRef, dispatcher);
    res.send({ message: "success" });
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

dispatcherRoutes.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const entryRef = doc(dispatcherRef, id);
    await deleteDoc(entryRef);
    res.send({ message: "success" });
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

dispatcherRoutes.put("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const empName = req.body.updateName;
  try {
    const entryRef = doc(dispatcherRef, id);
    await updateDoc(entryRef, {
      empName: empName,
    });
    res.send({ message: "success" });
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

module.exports = dispatcherRoutes;
