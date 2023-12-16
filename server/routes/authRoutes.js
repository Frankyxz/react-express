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
const { usersRef } = require("../config/firebase");

const authRoutes = express.Router();

authRoutes.post("/add-user", async (req, res) => {
  const formData = req.body.data;
  try {
    const newUser = {
      userName: formData.username,
      password: formData.password,
      type: formData.employeeType,
    };
    await addDoc(usersRef, newUser);
    res.send({ message: "success" });
  } catch (error) {
    res.send({ success: false, message: "Internal server error" });
  }
});

authRoutes.delete("/delete-user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const entryRef = doc(usersRef, id);
    await deleteDoc(entryRef);
    res.send({ message: "success" });
  } catch (error) {
    res.send({ success: false, message: "Internal server error" });
  }
});

authRoutes.put("/edit-user/:id", async (req, res) => {
  const { editOldPass, editNewPass } = req.body;
  const id = req.params.id;
  try {
    const entryRef = doc(usersRef, id);
    const entrySnapshot = await getDoc(entryRef);
    const userData = entrySnapshot.data();

    if (userData.password !== editOldPass) {
      res.status(400).send({ message: "Incorrect old password." });
      return;
    }
    await updateDoc(entryRef, {
      password: editNewPass,
    });
    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

authRoutes.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const userSnapshot = await getDocs(
      query(usersRef, where("userName", "==", userName))
    );

    if (userSnapshot.empty) {
      res.send({ success: false, message: "User not found" });
      return;
    }
    const user = userSnapshot.docs[0].data();

    if (user.password === password) {
      res.send({ success: true, user });
    } else {
      res.send({ success: false });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

module.exports = authRoutes;
