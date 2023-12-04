const express = require("express");
const { getDocs, query, where } = require("firebase/firestore");
const { usersRef } = require("../config/firebase");

const authRoutes = express.Router();

// authRoutes.get("/users", async (req, res) => {
//   try {
//     const response = await getDocs(usersRef);
//     let arr = [];
//     response.forEach((doc) => {
//       arr.push(doc.data());
//     });

//     res.send(arr);
//   } catch (error) {
//     res.send(error);
//   }
// });

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
      res.send({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

module.exports = authRoutes;
