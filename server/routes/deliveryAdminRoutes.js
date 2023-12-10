const express = require("express");
const {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  addDoc,
  getDoc,
  writeBatch,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  limit,
} = require("firebase/firestore");
const { formattedDate } = require("../dates");
const {
  db,
  deliverInfo,
  allTotalRef,
  deliveryHistory,
  deliverTableRef,
  receivedTableRef,
  expectTotalRef,
  boxesReceivedRef,
} = require("../config/firebase");
const { fetchData } = require("../fetchData");
const deliveryAdminRoutes = express.Router();

deliveryAdminRoutes.get("/deliver-details/", async (req, res) => {
  try {
    const docSnapshot = await getDoc(deliverInfo);
    const deliveryBy = docSnapshot.data()?.deliveryBy || "";
    const remarks = docSnapshot.data()?.remarks || "";
    res.send({ deliveryBy, remarks });
  } catch (error) {
    res.send(error);
  }
});

deliveryAdminRoutes.post("/process-delivery/", async (req, res) => {
  const {
    deliverTotalKg,
    receivedTotalKg,
    deliveryInfo,
    remarks,
    user,
    expectedTotalData,
    receivedMeat,
  } = req.body;

  const deliveryBy = deliveryInfo.deliveryBy;
  try {
    const allTotalQuery = query(allTotalRef, orderBy("date"), limit(1));
    const firstAllTotalDocSnapshot = await getDocs(allTotalQuery);
    const firstDocDate = firstAllTotalDocSnapshot.docs[0]?.data()?.date;

    if (firstDocDate && firstDocDate !== formattedDate) {
      res.send({ message: "You still have data from yesterday" });
      return;
    }

    const docRef = doc(deliveryHistory, formattedDate.toString());
    const docSnapshot = await getDoc(docRef);

    let allTotal = {};

    if (docSnapshot.exists()) {
      const existingReceivedMeat = docSnapshot.data().receivedMeat;

      receivedMeat.dataList.forEach((newMeat) => {
        const matchingIndex = existingReceivedMeat.findIndex(
          (existingMeat) =>
            existingMeat.meatType === newMeat.meatType &&
            existingMeat.brandName === newMeat.brandName
        );

        if (matchingIndex !== -1) {
          existingReceivedMeat[matchingIndex].totalKg += newMeat.totalKg;

          if (allTotal[newMeat.meatType]) {
            allTotal[newMeat.meatType] += newMeat.totalKg;
          } else {
            allTotal[newMeat.meatType] = newMeat.totalKg;
          }
        } else {
          existingReceivedMeat.push(newMeat);

          if (allTotal[newMeat.meatType]) {
            allTotal[newMeat.meatType] += newMeat.totalKg;
          } else {
            allTotal[newMeat.meatType] = newMeat.totalKg;
          }
        }
      });

      const existingExpected = docSnapshot.data().expectedTotal;
      expectedTotalData.dataList.forEach((newMeat) => {
        const matchingIndex = existingExpected.findIndex(
          (existingMeat) =>
            existingMeat.meatType === newMeat.meatType &&
            existingMeat.brandName === newMeat.brandName
        );

        if (matchingIndex !== -1) {
          existingExpected[matchingIndex].totalKg += newMeat.totalKg;
        } else {
          existingExpected.push(newMeat);
        }
      });

      await updateDoc(docRef, {
        totalKiloDelivered:
          docSnapshot.data().totalKiloDelivered + parseFloat(deliverTotalKg),
        totalKiloReceived:
          docSnapshot.data().totalKiloReceived + parseFloat(receivedTotalKg),
        receivedMeat: existingReceivedMeat,
        expectedTotal: existingExpected,
      });
    } else {
      await setDoc(docRef, {
        totalKiloDelivered: parseFloat(deliverTotalKg),
        totalKiloReceived: parseFloat(receivedTotalKg),
        dateConfirm: formattedDate,
        remarks: remarks,
        receivedMeat: receivedMeat.dataList,
        deliveryBy: deliveryBy,
        expectedTotal: expectedTotalData.dataList,
        approvedBy: user,
      });

      receivedMeat.dataList.forEach((newMeat) => {
        if (allTotal[newMeat.meatType]) {
          allTotal[newMeat.meatType] += newMeat.totalKg;
        } else {
          allTotal[newMeat.meatType] = newMeat.totalKg;
        }
      });
    }

    for (const meatType in allTotal) {
      const allTotalDocRef = doc(allTotalRef, meatType);
      const allTotalDocSnapshot = await getDoc(allTotalDocRef);

      if (allTotalDocSnapshot.exists()) {
        await updateDoc(allTotalDocRef, {
          totalKg: allTotal[meatType] + allTotalDocSnapshot.data().totalKg,
        });
      } else {
        await setDoc(allTotalDocRef, {
          meatType: meatType,
          totalKg: allTotal[meatType],
          date: formattedDate,
        });
      }
    }
    const querySnapshot = await getDocs(deliverTableRef);
    const receivedQuerySnapshot = await getDocs(receivedTableRef);
    const expectedQuearySnapshot = await getDocs(expectTotalRef);
    const boxesEmp = await getDocs(boxesReceivedRef);
    const batch = writeBatch(db);

    querySnapshot.forEach((docSnapshot) => {
      batch.delete(docSnapshot.ref);
    });
    receivedQuerySnapshot.forEach((docSnapshot) => {
      batch.delete(docSnapshot.ref);
    });
    expectedQuearySnapshot.forEach((docSnapshot) => {
      batch.delete(docSnapshot.ref);
    });
    boxesEmp.forEach((docSnapshot) => {
      batch.delete(docSnapshot.ref);
    });

    await batch.commit();
    await setDoc(deliverInfo, { deliveryBy: "", remarks: "" });

    res.send({ message: "success" });
  } catch (error) {
    res.send(error);
  }
});
module.exports = deliveryAdminRoutes;
