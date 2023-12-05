const express = require("express");
const {
  getDocs,
  query,
  getDoc,
  where,
  addDoc,
  deleteDoc,
  updateDoc,
  setDoc,
  writeBatch,
  doc,
} = require("firebase/firestore");

const {
  db,
  comissaryRef,
  processCounter,
  scrapCounter,
} = require("../config/firebase");

const processedMeatRoutes = express.Router();

processedMeatRoutes.post("/add-process", async (req, res) => {
  try {
    const {
      meatProcessedName,
      retailPrice,
      wholeSalePrice,
      selectedParts,
      retailScrap,
      wholeSaleScrap,
    } = req.body;

    // Fetch counters
    const counterDoc = await getDoc(processCounter);
    const scrapCounterDoc = await getDoc(scrapCounter);

    let num = counterDoc.exists() ? counterDoc.data().value : 1;
    num++;

    let scrapNum = scrapCounterDoc.exists() ? scrapCounterDoc.data().value : 1;
    scrapNum++;

    // Comissary Inventory Document
    const comInventory = {
      id: "C-" + num.toString(),
      processedMeat: meatProcessedName.toUpperCase().trim(),
      retail: parseFloat(retailPrice),
      wholeSale: parseFloat(wholeSalePrice),
      meatType: selectedParts,
      scrapId: "S-" + scrapNum.toString(),
      quantity: parseFloat(0),
    };

    // Meat Scrap Processed Comissary Document
    const meatScrapProcessedComi = {
      scrapId: "S-" + scrapNum.toString(),
      processedMeat: meatProcessedName.toUpperCase().trim() + "- (SCRAP)",
      meatProcessedId: "C-" + num.toString(),
      retail: parseFloat(retailScrap),
      meatType: selectedParts,
      wholeSale: parseFloat(wholeSaleScrap),
      quantity: parseFloat(0),
    };

    // Firestore Document References
    const comInventoryRef = doc(comissaryRef, "C-" + num.toString());
    const meatScrapProcessedComiRef = doc(
      comissaryRef,
      "S-" + scrapNum.toString()
    );

    // Write Batch
    const batch = writeBatch(db);
    batch.set(comInventoryRef, comInventory);
    batch.set(meatScrapProcessedComiRef, meatScrapProcessedComi);

    // Commit Batch
    await batch.commit();

    // Update Counters
    await setDoc(processCounter, { value: num });
    await setDoc(scrapCounter, { value: scrapNum });

    res.status(200).json({ message: "Meat processing successful." });
  } catch (error) {
    console.error("Error processing meat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Delete
processedMeatRoutes.delete(
  "/delete-process/:id&:scrapItemId",
  async (req, res) => {
    const { id, scrapItemId } = req.params;

    try {
      const batch = writeBatch(db);
      const comissaryEntryRef = doc(comissaryRef, id);
      batch.delete(comissaryEntryRef);

      const scrapEntryRef = doc(comissaryRef, scrapItemId);
      batch.delete(scrapEntryRef);

      await batch.commit();

      res.send({ message: "sucesss" });
    } catch (error) {
      res.send(error);
    }
  }
);
//Get quantity
processedMeatRoutes.get("/quantity-process/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const comInventoryRef = doc(comissaryRef, id);

    const comInventorySnapshot = await getDoc(comInventoryRef);
    const quantity = comInventorySnapshot.data().quantity;

    res.status(200).json({ quantity });
  } catch (error) {
    res.send(error);
  }
});

// Edit the price in the Processed Meat Module
processedMeatRoutes.put("/edit-process/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const editItem = req.body;

    const comInventoryRef = doc(comissaryRef, id);
    const updatedProcessedMeatName = editItem.processedMeat.toUpperCase();

    const batch = writeBatch(db);

    batch.update(comInventoryRef, {
      processedMeat: updatedProcessedMeatName,
      retail: parseFloat(editItem.retail),
      wholeSale: parseFloat(editItem.wholeSale),
    });

    await batch.commit();

    res.status(200).json({ message: "Item updated successfully." });
  } catch (error) {
    console.error("Error updating KG:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Edit the Quantity in the Comissary Inventory

processedMeatRoutes.put("/edit-process-quantity/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const quantity = req.body.quantity;

    const entryRef = doc(comissaryRef, id);

    await updateDoc(entryRef, { quantity: parseFloat(quantity) });

    res.status(200).json({ message: "Item updated successfully." });
  } catch (error) {
    console.error("Error updating KG:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = processedMeatRoutes;
