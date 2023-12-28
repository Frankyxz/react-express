const express = require("express");
const { doc, getDocs, setDoc, getDoc, deleteDoc, writeBatch } = require("firebase/firestore");
const { db, facilityInventoryRef, orderCounter, orderListRef, rawQueueRef } = require("../config/firebase");
const { formattedDate } = require("../dates");

const rawMeatRoutes = express.Router();

rawMeatRoutes.post("/scan-box/", async (req, res) => {
  const id = req.body.id;

  try {
    const deliveryQueue = doc(facilityInventoryRef, id);
    const deliveryQueueSnapshot = await getDoc(deliveryQueue);
    if (!deliveryQueueSnapshot.exists()) {
      alert(`No data found`);
      setIsLoading(false);
      setScanResult(null);
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

    const deliveryQueueRef = doc(rawQueueRef, id);
    const entryMeatRef = doc(facilityInventoryRef, id);
    await setDoc(deliveryQueueRef, deliveryItem);
    await deleteDoc(entryMeatRef);
    res.send({ message: "success" });
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});
rawMeatRoutes.delete("/remove-box/", async (req, res) => {
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

        const deliveryQueueRef = doc(rawQueueRef, selectedRow.id);
        const entryMeatRef = doc(facilityInventoryRef, selectedRow.id);

        batch.set(entryMeatRef, deliveryItem);
        batch.delete(deliveryQueueRef);
      }
    }

    await batch.commit();

    res.send({ message: "success" });
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});

rawMeatRoutes.post("/confirm/", async (req, res) => {
  const {
    modeOfPayment,
    customerName,
    itemPrice,
    overAllTotal,
    user,
    dispatchBy,
    rawQueueData,
  } = req.body;
  try {
    const batch = writeBatch(db);
    const ordersSnapshot = await getDocs(rawQueueRef);
    ordersSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    let modePayment = "";
    if (modeOfPayment.trim() === "") {
      modePayment = "PENDING";
    } else {
      modePayment = modeOfPayment.toUpperCase();
    }

    const counterDoc = await getDoc(orderCounter);
    let num = counterDoc.exists() ? counterDoc.data().value : 10000;
    num++;

    const rawOrderDocRef = doc(orderListRef, num.toString());

    await setDoc(rawOrderDocRef, {
      id: num.toString(),
      customerName: customerName.toUpperCase(),
      modeOfPayment: modePayment,
      totalPrice: parseFloat(itemPrice * overAllTotal),
      setPrice: parseFloat(itemPrice),
      date: formattedDate,
      processedBy: user.toUpperCase(),
      dispatcher: dispatchBy.toUpperCase(),
      type: "Raw",
      orders: rawQueueData.dataList,
    });
    await setDoc(orderCounter, { value: num });
    res.send({ message: "success" });
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});

module.exports = rawMeatRoutes;
