const express = require("express");
const {
  getDocs,
  query,
  where,
  addDoc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  doc,
} = require("firebase/firestore");
const { formattedDate } = require("../dates");
const { facilityInventoryRef, facilityCounter } = require("../config/firebase");

const facilityRoutes = express.Router();

//Add
facilityRoutes.post("/add-box/", async (req, res) => {
  const { brandSelect, meatKg, selectedMeatType, selectedParts } = req.body;
  try {
    const counterDoc = await getDoc(facilityCounter);
    let num = counterDoc.exists() ? counterDoc.data().value : 10000;
    num++;

    const addItem = {
      brandId: num.toString(),
      brandName: brandSelect,
      kg: parseFloat(meatKg),
      dateAdded: formattedDate,
      meatType: selectedMeatType,
      meatPart: selectedParts,
      combine: `${selectedMeatType} ${selectedParts}`,
    };

    const brandName = brandSelect;
    const type = `${selectedMeatType} ${selectedParts}`;

    const docRef = doc(facilityInventoryRef, num.toString());
    await setDoc(docRef, addItem);
    await setDoc(facilityCounter, { value: num });
    res.send({ num, type, brandName, meatKg });
  } catch (error) {
    res.send(error);
  }
});

//Delete
facilityRoutes.delete("/delete-box/:id", async (req, res) => {
  const { id } = req.params;
  const entryRef = doc(facilityInventoryRef, id);
  try {
    await deleteDoc(entryRef);
    res.send({ message: "sucesss" });
  } catch (error) {
    res.send(error);
  }
});

//Edit

facilityRoutes.put("/edit-box/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const kg = req.body.kg;

    const entryRef = doc(facilityInventoryRef, id);

    await updateDoc(entryRef, { kg: parseFloat(kg) });

    res.status(200).json({ message: "Item updated successfully." });
  } catch (error) {
    console.error("Error updating KG:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = facilityRoutes;
