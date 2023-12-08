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
  writeBatch,
  doc,
} = require("firebase/firestore");
const {
  db,
  facilityInventoryRef,
  deliveryQRef,
  deliverRef,
  deliverStats,
} = require("../config/firebase");

const deliveryFacilityRoutes = express.Router();

//Add box through scanning
deliveryFacilityRoutes.post("/scan-box/", async (req, res) => {
  const id = req.body.id;

  try {
    const deliveryQueue = doc(facilityInventoryRef, id);
    const deliveryQueueSnapshot = await getDoc(deliveryQueue);

    if (!deliveryQueueSnapshot.exists()) {
      res.status(400).send({ message: "No Data Found" });
      return;
    }
    const data = deliveryQueueSnapshot.data();
    const deliveryItem = {
      brandId: data.brandId,
      brandName: data.brandName,
      kg: parseFloat(data.kg),
      dateAdded: data.dateAdded,
      meatType: data.meatType,
      meatPart: data.meatPart,
      combined: `${data.meatType} ${data.meatPart}`,
    };
    const deliveryQueueRef = doc(deliveryQRef, id);
    const entryMeatRef = doc(facilityInventoryRef, id);
    await setDoc(deliveryQueueRef, deliveryItem);
    await deleteDoc(entryMeatRef);
    res.send({ message: "success" });
  } catch (error) {
    res.send(error);
  }
});

//Delete selected box
deliveryFacilityRoutes.delete("/remove-box/", async (req, res) => {
  const returnRows = req.body;
  try {
    const batch = writeBatch(db);
    for (const selectedRow of returnRows) {
      if (selectedRow) {
        const deliveryItem = {
          brandId: selectedRow.brandId,
          brandName: selectedRow.brandName,
          kg: parseFloat(selectedRow.kg),
          dateAdded: selectedRow.dateAdded,
          meatType: selectedRow.meatType,
          meatPart: selectedRow.meatPart,
          combine: `${selectedRow.meatType} ${selectedRow.meatPart}`,
        };

        const deliveryQueueRef = doc(deliveryQRef, selectedRow.id);
        const entryMeatRef = doc(facilityInventoryRef, selectedRow.id);

        batch.set(entryMeatRef, deliveryItem);
        batch.delete(deliveryQueueRef);
      }
    }
    await batch.commit();
    res.send({ message: "success" });
  } catch (error) {
    res.send(error);
  }
});

//Set the Delivery
deliveryFacilityRoutes.post("/set-delivery/", async (req, res) => {
  const deliverTotalKg = req.body.data;
  try {
    await setDoc(deliverRef, { value: parseFloat(deliverTotalKg) });
    await setDoc(deliverStats, { value: parseFloat(1) });

    res.send({ message: "success" });
  } catch (error) {
    res.send(error);
  }
});
//Set the kg
deliveryFacilityRoutes.post("/cancel-delivery/", async (req, res) => {
  try {
    await setDoc(deliverRef, { value: 0 });
    await setDoc(deliverStats, { value: parseFloat(2) });
    res.send({ message: "success" });
  } catch (error) {
    res.send(error);
  }
});

//Set the kg
deliveryFacilityRoutes.get("/set-kg/", async (req, res) => {
  try {
    const data = await getDoc(deliverRef);
    let kgNum = data.data()?.value || 0;
    res.send({ kg: kgNum });
  } catch (error) {
    res.send(error);
  }
});

module.exports = deliveryFacilityRoutes;
