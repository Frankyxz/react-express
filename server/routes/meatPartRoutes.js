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
const { partRef, facilityInventoryRef } = require("../config/firebase");

const meatPartRoutes = express.Router();

//Add
meatPartRoutes.post("/add-part", async (req, res) => {
  const meatPart = {
    meatPart: req.body.meatPart,
    meatType: req.body.meatType,
    combined: req.body.combined,
  };
  try {
    await addDoc(partRef, meatPart);
    res.send({ message: "sucesss" });
  } catch (error) {
    res.send(error);
  }
});
//Delete
meatPartRoutes.delete("/delete-part/:id", async (req, res) => {
  const { id } = req.params;
  const entryRef = doc(partRef, id);
  try {
    const partsRef = query(
      facilityInventoryRef,
      where("meatType", "==", req.body.meatType),
      where("meatPart", "==", req.body.meatPart)
    );

    const querySnapshot = await getDocs(partsRef);
    if (!querySnapshot.empty) {
      res.send({ message: "There are data inside" });
      return;
    }
    await deleteDoc(entryRef);
    res.send({ message: "sucesss" });
  } catch (error) {
    res.send(error);
  }
});
//Validate First
meatPartRoutes.get("/validate-edit/", async (req, res) => {
  try {
    const { meatType, meatPart } = req.query;
    const partsRef = query(
      facilityInventoryRef,
      where("meatType", "==", meatType),
      where("meatPart", "==", meatPart)
    );

    const querySnapshot = await getDocs(partsRef);
    if (!querySnapshot.empty) {
      res
        .status(200)
        .json({ message: "There are data inside", canEdit: false });
      return;
    }
    res.status(200).json({ canEdit: true });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//Edit
meatPartRoutes.put("/edit-part/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { meatType, meatPart } = req.body;
    const entryRef = doc(partRef, id);
    await updateDoc(entryRef, {
      meatPart: meatPart.trim().toUpperCase(),
      meatType: meatType,
      combined: `${meatType} ${meatPart.trim().toUpperCase()}`,
    });
    res.status(200).send("Meat updated successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Fetch combined like PORK JOWLS
meatPartRoutes.get("/fetch-combine/", async (req, res) => {
  try {
    const querySnapshot = await getDocs(partRef);
    const options = querySnapshot.docs.map((doc) => doc.data().combined);
    res.json(options);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// MEAT PART TOTALS
meatPartRoutes.post("/fetch-meatTotal/", async (req, res) => {
  const { meatCollection } = req.body;
  try {
    if (meatCollection && meatCollection.length > 0) {
      // Fetch facility items
      const facilityItems = await getDocs(facilityInventoryRef);
      const facilityItemsArray = facilityItems.docs.map((doc) => doc.data());
      const totalKgs = {};

      meatCollection.forEach((combine) => {
        totalKgs[combine] = 0;
      });

      facilityItemsArray.forEach((item) => {
        const combine = item.combine;
        const kg = item.kg;

        if (meatCollection.includes(combine)) {
          totalKgs[combine] += kg;
        } else {
          console.warn(
            `Combine value "${combine}" not found in meatCollection`
          );
        }
      });

      res.json(totalKgs);
    } else {
      // If meatCollection is empty or not defined, send an empty object
      res.json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = meatPartRoutes;
