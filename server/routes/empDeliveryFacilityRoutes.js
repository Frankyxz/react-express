const express = require("express");
const { getDocs, getDoc, setDoc, deleteDoc, writeBatch, doc } = require("firebase/firestore");
const { db, deliveryQRef, empDeliverRef, deliverStats, deliverRef, deliverInfo, deliverTableRef, boxesReceivedRef, expectTotalRef, receivedTableRef } = require("../config/firebase");
const { formattedDate } = require("../dates");

const empDeliveryFacilityRoutes = express.Router();

empDeliveryFacilityRoutes.post("/scan-box/", async (req, res) => {
  const id = req.body.id;
  try {
    const deliveryQueue = doc(deliveryQRef, id);
    const deliveryQueueSnapshot = await getDoc(deliveryQueue);

    const data = deliveryQueueSnapshot.data();
    const addTotalKg = {
      brandId: id,
      brandName: data.brandName,
      totalKg: parseFloat(data.kg),
      meatType: data.combined,
    };

    const empRef = doc(empDeliverRef, id);
    await setDoc(empRef, addTotalKg);
    res.send({ message: "success" });
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});
//Delete
empDeliveryFacilityRoutes.delete("/delete-box/:id", async (req, res) => {
  try {
    const entryRef = doc(empDeliverRef, req.params.id);
    await deleteDoc(entryRef);
    res.send({ message: "success" });
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});
//For disabling modal
empDeliveryFacilityRoutes.post("/close-deliver/", async (req, res) => {
  try {
    await setDoc(deliverStats, { value: parseFloat(0) });
    res.send({ message: "success" });
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});

//For Notification Modal
empDeliveryFacilityRoutes.get("/notification/", async (req, res) => {
  try {
    const data = await getDoc(deliverStats);
    let val = data.data()?.value || 0;
    res.send({ val: val });
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});

empDeliveryFacilityRoutes.post("/count-data/", async (req, res) => {
  try {
    const querySnapshot = await getDocs(deliveryQRef);
    const query2Snapshot = await getDocs(empDeliverRef);

    const totalKgMap = new Map();
    const batch = writeBatch(db);

    querySnapshot.forEach((docSnapshot) => {
      const brandName = docSnapshot.data().brandName;
      const meatType = `${docSnapshot.data().meatType} ${
        docSnapshot.data().meatPart
      }`;
      const totalKg = parseFloat(docSnapshot.data().kg);

      const key = `${brandName}-${meatType}`;
      if (totalKgMap.has(key)) {
        const existingTotalKg = totalKgMap.get(key);
        totalKgMap.set(key, existingTotalKg + totalKg);
      } else {
        totalKgMap.set(key, totalKg);
      }
    });

    const totalKgEmpReceived = new Map();
    query2Snapshot.forEach((docSnapshot) => {
      const brandName = docSnapshot.data().brandName;
      const meatType = `${docSnapshot.data().meatType}`;
      const totalKg = parseFloat(docSnapshot.data().totalKg);

      const key = `${brandName}-${meatType}`;
      if (totalKgEmpReceived.has(key)) {
        const existingTotalKg = totalKgEmpReceived.get(key);
        totalKgEmpReceived.set(key, existingTotalKg + totalKg);
      } else {
        totalKgEmpReceived.set(key, totalKg);
      }
    });

    const totalReceived = [];
    totalKgEmpReceived.forEach((totalKg, key) => {
      const [brandName, meatType] = key.split("-");
      const expectedTotalRef = doc(receivedTableRef, key);

      const expectedTotalPromise = async () => {
        try {
          const expectedTotalSnapshot = await getDoc(expectedTotalRef);
          if (expectedTotalSnapshot.exists()) {
            const existingTotalKg = expectedTotalSnapshot.data().totalKg || 0;
            const newTotalKg = existingTotalKg + totalKg;
            batch.update(expectedTotalRef, { totalKg: newTotalKg });
          } else {
            const addExpectedTotalKg = {
              brandName,
              totalKg,
              meatType,
              date: formattedDate,
            };
            batch.set(expectedTotalRef, addExpectedTotalKg);
          }
        } catch (error) {
          console.error("Error updating expectedTotal:", error);
        }
      };

      totalReceived.push(expectedTotalPromise());
    });
    await Promise.all(totalReceived);

    const expectedTotalPromises = [];
    totalKgMap.forEach((totalKg, key) => {
      const [brandName, meatType] = key.split("-");
      const expectedTotalRef = doc(expectTotalRef, key);

      const expectedTotalPromise = async () => {
        try {
          const expectedTotalSnapshot = await getDoc(expectedTotalRef);
          if (expectedTotalSnapshot.exists()) {
            const existingTotalKg = expectedTotalSnapshot.data().totalKg || 0;
            const newTotalKg = existingTotalKg + totalKg;
            batch.update(expectedTotalRef, { totalKg: newTotalKg });
          } else {
            const addExpectedTotalKg = {
              brandName,
              totalKg,
              meatType,
              date: formattedDate,
            };
            batch.set(expectedTotalRef, addExpectedTotalKg);
          }
        } catch (error) {
          console.error("Error updating expectedTotal:", error);
        }
      };

      expectedTotalPromises.push(expectedTotalPromise());
    });

    await Promise.all(expectedTotalPromises);

    querySnapshot.forEach(async (docSnapshot) => {
      const targetDocRef = doc(deliverTableRef, docSnapshot.id);
      batch.set(targetDocRef, docSnapshot.data());
      batch.delete(docSnapshot.ref);
    });
    query2Snapshot.forEach(async (docSnapshot) => {
      const targetDocRef = doc(boxesReceivedRef, docSnapshot.id);
      batch.set(targetDocRef, docSnapshot.data());
      batch.delete(docSnapshot.ref);
    });

    batch.set(deliverInfo, {
      deliveryBy: req.body.user,
      remarks: req.body.deliveryRemarks,
    });

    await setDoc(deliverRef, { value: 0 });
    await setDoc(deliverStats, { value: 0 });
    await batch.commit();

    res.send({ message: "success" });
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});

module.exports = empDeliveryFacilityRoutes;
