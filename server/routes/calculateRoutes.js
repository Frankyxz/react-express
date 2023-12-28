const express = require("express");
const { query, where, getDocs, addDoc, deleteDoc, writeBatch, doc, setDoc, updateDoc } = require("firebase/firestore");
const { comissaryRef, db, totalProcessedRef, allTotalRef, receivedTableRef, percentHistoryRef } = require("../config/firebase");

const calculateRoutes = express.Router();

calculateRoutes.post("/add-processed-total", async (req, res) => {
  const { partnerMeatType, selectedMeatType, totalProcessed } = req.body;
  try {
    const addTotal = {
      processedMeat: partnerMeatType.trim().toUpperCase(),
      compMeatType: selectedMeatType.includes("- (SCRAP")
        ? `${partnerMeatType} - (SCRAP)`
        : partnerMeatType,
      meatType: selectedMeatType,
      totalKg: parseFloat(totalProcessed),
    };
    await addDoc(totalProcessedRef, addTotal);
    res.send({ message: "sucesss" });
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});

calculateRoutes.delete("/delete-processed-total/:id", async (req, res) => {
  const { id } = req.params;
  const entryRef = doc(totalProcessedRef, id);
  try {
    await deleteDoc(entryRef);
    res.send({ message: "sucesss" });
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});
//Edit
calculateRoutes.put("/edit-processed-total/:id", async (req, res) => {
  const { id } = req.params;
  const entryRef = doc(totalProcessedRef, id);
  try {
    await updateDoc(entryRef, { totalKg: parseFloat(req.body.totalKg) });
    res.send({ message: "sucesss" });
  } catch (error) {
    res.send("Internal Server Error");
  }
});

calculateRoutes.post("/validate/", async (req, res) => {
  const { receivedTotalData, totalData } = req.body;

  const receivedTotalDate =
    receivedTotalData.dataList.length > 0
      ? receivedTotalData.dataList[0].date
      : null;
  try {
    //Check if there are still data in the delivery admin component
    const querySnapshot = await getDocs(
      query(receivedTableRef, where("date", "==", receivedTotalDate))
    );
    const isDateAlreadyExists = !querySnapshot.empty;
    const totalKgSums = {};

    if (isDateAlreadyExists) {
      res
        .status(400)
        .send({ message: "You have still an order in the Delivery Admin" });
      return;
    }
    //Ensure that the data insert is accurate
    if (receivedTotalData.dataList.length * 2 !== totalData.dataList.length) {
      res
        .status(400)
        .send({ message: "You didn't include a Scrap or another Meat Type" });
      return;
    }
    totalData.dataList.forEach((data) => {
      const { meatType, totalKg } = data;
      if (!totalKgSums[meatType]) {
        totalKgSums[meatType] = totalKg;
      } else {
        totalKgSums[meatType] += totalKg;
      }
    });
    //Count if the total of processedMeat + scrap is nont greater than the received
    for (const receivedData of receivedTotalData.dataList) {
      const { meatType, totalKg } = receivedData;
      if (totalKgSums[meatType] > totalKg) {
        res
          .status(400)
          .send({ message: `${meatType} is greater than the received` });
        return;
      }
    }
    res.status(200).send({ message: "sucesss" });
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});

calculateRoutes.post("/submit-processed/", async (req, res) => {
  const { receivedTotalData, totalData, totalKGReceived, totalKgProcessed, totalScrap } = req.body;
  const receivedTotalDate =
    receivedTotalData.dataList.length > 0
      ? receivedTotalData.dataList[0].date
      : null;
  try {
    const totalKgSums = {};

    totalData.dataList.forEach((data) => {
      const { meatType, totalKg } = data;
      if (!totalKgSums[meatType]) {
        totalKgSums[meatType] = totalKg;
      } else {
        totalKgSums[meatType] += totalKg;
      }
    });
    //Calculate the percentages
    const calculatePercentage = (meatType) => {
      const totalKgInTotalData = totalData.dataList.reduce((acc, value) => {
        return value.meatType === meatType ? acc + value.totalKg : acc;
      }, 0);

      const totalKgInReceivedTotalData = receivedTotalData.dataList.reduce(
        (acc, value) => {
          return value.meatType === meatType ? acc + value.totalKg : acc;
        },
        0
      );

      if (totalKgInReceivedTotalData === 0) {
        return 0;
      } else {
        return (
          100 -
          (totalKgInTotalData / totalKgInReceivedTotalData) * 100
        ).toFixed(1);
      }
    };
    const percentages = [];
    for (const meatType of Object.keys(totalKgSums)) {
      const percentage = calculatePercentage(meatType);
      percentages.push({ meatType, percentage: parseFloat(percentage) });
    }
    //These are the data in the percentage History
    const percentageHistoryData = {
      date: receivedTotalDate,
      percentages: percentages,
      totalKGReceived: totalKGReceived,
      totalKgProcessed: totalKgProcessed,
      totalScrap: totalScrap,
      missing: totalKGReceived - (totalKgProcessed + totalScrap),
      madeToday: totalData.dataList,
      receivedToday: receivedTotalData.dataList,
    };

    const docRef = doc(percentHistoryRef, receivedTotalDate.toString());

    await setDoc(docRef, percentageHistoryData);
    const allTotalQuerySnapshot = await getDocs(allTotalRef);
    const totalProcessedQuerySnapshot = await getDocs(totalProcessedRef);
    const batch = writeBatch(db);
    allTotalQuerySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    totalProcessedQuerySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    //Responsible for adding to the commissary inventory
    for (const order of totalData.dataList) {
      const { processedMeat, totalKg } = order;

      const comissaryQuerySnapshot = await getDocs(comissaryRef);
      const comissaryDoc = comissaryQuerySnapshot.docs.find(
        (doc) => doc.data().processedMeat === processedMeat
      );

      if (comissaryDoc) {
        const comissaryDocRef = doc(comissaryRef, comissaryDoc.id);

        const comissaryQuantity = comissaryDoc.data().quantity;

        await updateDoc(comissaryDocRef, {
          quantity: comissaryQuantity + totalKg,
        });
      }
    }

    res.send({ message: "sucesss" });
  } catch (error) {
      res.send({ message: "Internal server error" });
  }
});
module.exports = calculateRoutes;
