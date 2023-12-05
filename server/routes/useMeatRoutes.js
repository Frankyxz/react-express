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
const {
  meatRef,
  partRef,
  facilityInventoryRef,
  brandRef,
} = require("../config/firebase");

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

useMeatRoutes.get("/fetch-part/:selectedMeatType", async (req, res) => {
  try {
    const selectedMeatType = req.params.selectedMeatType;

    const partsRef = query(partRef, where("meatType", "==", selectedMeatType));

    const querySnapshot = await getDocs(partsRef);
    const options = querySnapshot.docs.map((doc) => doc.data().meatPart);

    res.json(options);
  } catch (error) {
    console.error("Error loading meat options: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

useMeatRoutes.get(
  "/fetch-box/:selectedMeatType/:selectedParts",
  async (req, res) => {
    try {
      const { selectedMeatType, selectedParts } = req.params;

      const meatTableRef = query(
        facilityInventoryRef,
        where("meatType", "==", selectedMeatType),
        where("meatPart", "==", selectedParts)
      );
      const meatSnapshot = await getDocs(meatTableRef);
      const data = meatSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.json(data);
    } catch (error) {
      console.error("Error loading meat options: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

useMeatRoutes.get(
  "/fetch-brand/:selectedMeatType/:selectedParts",
  async (req, res) => {
    try {
      const { selectedMeatType, selectedParts } = req.params;

      const ref = query(
        brandRef,
        where("meatType", "==", selectedMeatType),
        where("meatPart", "==", selectedParts)
      );
      const querySnapshot = await getDocs(ref);
      const options = querySnapshot.docs.map((doc) => doc.data().brandName);
      res.json(options);
    } catch (error) {
      console.error("Error loading meat options: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
module.exports = useMeatRoutes;
