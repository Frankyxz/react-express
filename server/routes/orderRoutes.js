const express = require("express");
const {
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
  writeBatch,
} = require("firebase/firestore");
const {
  db,
  orderHistoryRef,
  orderListRef,
  cancelHistoryRef,
  comissaryRef,
  ordersRef,
  orderCounter,
  facilityInventoryRef,
  pendingTableRef,
} = require("../config/firebase");
const { formattedDate } = require("../dates");

const orderRoutes = express.Router();

orderRoutes.get("/:dataRef/:id", async (req, res) => {
  const id = req.params.id;
  const dataRef = req.params.dataRef;
  let ref =
    dataRef == "orderHistory"
      ? orderHistoryRef
      : dataRef == "cancel"
      ? cancelHistoryRef
      : dataRef == "order-list"
      ? orderListRef
      : pendingTableRef;
  try {
    const orderRef = doc(ref, id);
    const orderSnapshot = await getDoc(orderRef);
    const orderData = orderSnapshot.data() || {};
    res.send({ orderData });
  } catch (error) {
    res.send(error);
  }
});

orderRoutes.get("/processed-list", async (req, res) => {
  try {
    const querySnapshot = await getDocs(comissaryRef);
    const options = querySnapshot.docs
      .map((doc) => doc.data())
      .filter((data) => data.quantity > 0)
      .map((data) => data.processedMeat);
    res.send({ options });
  } catch (error) {
    res.send(error);
  }
});

orderRoutes.post("/add", async (req, res) => {
  const { typePrice, inputQuantity, selectedProcessedMeat } = req.body;
  try {
    const comissaryQuerySnapshot = await getDocs(comissaryRef);
    const selectedProcessedMeatDoc = comissaryQuerySnapshot.docs.find(
      (doc) => doc.data().processedMeat === selectedProcessedMeat
    );
    const comissaryQuantity = selectedProcessedMeatDoc.data().quantity;

    if (inputQuantity > comissaryQuantity) {
      res.status(400).send({
        message: "Entered quantity is greater than available quantity",
      });
      return;
    }

    const totalPrice =
      inputQuantity *
      (typePrice === "Retail"
        ? selectedProcessedMeatDoc.data().retail
        : selectedProcessedMeatDoc.data().wholeSale);

    const order = {
      brandName: selectedProcessedMeat,
      price:
        typePrice === "Retail"
          ? selectedProcessedMeatDoc.data().retail
          : selectedProcessedMeatDoc.data().wholeSale,
      kg: parseFloat(inputQuantity),
      forReport: selectedProcessedMeat,
      totalPrice: parseFloat(totalPrice),
    };

    await addDoc(ordersRef, order);
    res.status(200).send({ message: "success" });
  } catch (error) {
    res.status(500).send(error);
  }
});

orderRoutes.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const entryRef = doc(ordersRef, id);
    await deleteDoc(entryRef);
    res.status(200).send({ message: "success" });
  } catch (error) {
    res.status(500).send(error);
  }
});

orderRoutes.put("/edit/", async (req, res) => {
  const editItem = req.body.editItem;
  try {
    const comissaryQuerySnapshot = await getDocs(comissaryRef);

    const comissaryDoc = comissaryQuerySnapshot.docs.find(
      (doc) => doc.data().processedMeat === editItem.brandName
    );

    if (comissaryDoc) {
      const comissaryQuantity = comissaryDoc.data().quantity;

      if (editItem.kg > comissaryQuantity) {
        res.status(400).send({
          message: "Entered quantity is greater than available quantity",
        });
        return;
      }
    }

    const orderRef = doc(ordersRef, editItem.id);
    await updateDoc(orderRef, {
      kg: parseFloat(editItem.kg),
      totalPrice: parseFloat(editItem.kg * editItem.price),
    });
    res.status(200).send({ message: "success" });
  } catch (error) {
    res.status(500).send(error);
  }
});

orderRoutes.post("/confirm/", async (req, res) => {
  const { dispatchBy, customerName, user, totalPrice, modeOfPayment, orders } =
    req.body;
  try {
    for (const order of orders.dataList) {
      const { brandName, kg } = order;
      const comissaryQuerySnapshot = await getDocs(comissaryRef);
      const comissaryDoc = comissaryQuerySnapshot.docs.find(
        (doc) => doc.data().processedMeat === brandName
      );

      if (comissaryDoc) {
        const comissaryDocRef = doc(comissaryRef, comissaryDoc.id);

        const comissaryQuantity = comissaryDoc.data().quantity;

        await updateDoc(comissaryDocRef, {
          quantity: comissaryQuantity - kg,
        });
      }
    }

    const batch = writeBatch(db);

    const ordersSnapshot = await getDocs(ordersRef);
    ordersSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    const counterDoc = await getDoc(orderCounter);
    let num = counterDoc.exists() ? counterDoc.data().value : 10000;
    num++;

    const OrderDocRef = doc(orderListRef, num.toString());
    await setDoc(OrderDocRef, {
      id: num.toString(),
      customerName: customerName.toUpperCase(),
      modeOfPayment: modeOfPayment,
      totalPrice: parseFloat(totalPrice),
      date: formattedDate,
      processedBy: user.toUpperCase(),
      dispatcher: dispatchBy.toUpperCase(),
      type: "Processed",
      orders: orders.dataList,
    });

    await setDoc(orderCounter, { value: num });
    res.status(200).send({ message: "success" });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Manage Order
orderRoutes.post("/cancel-order/", async (req, res) => {
  const { cancelOrder, user, cancelRemarks } = req.body;
  try {
    const orderRef = doc(orderListRef, cancelOrder.id);
    const orderSnapshot = await getDoc(orderRef);
    const orderData = orderSnapshot.data();
    const { orders = [], type = "" } = orderData;

    const batch = writeBatch(db);

    for (const order of orders) {
      if (type === "Raw") {
        const { brandId, brandName, dateAdded, id, kg, meatType, meatPart } =
          order;

        const facilityRef = doc(facilityInventoryRef, id);

        batch.set(facilityRef, {
          brandId,
          brandName,
          dateAdded,
          kg,
          meatType,
          meatPart,
          combine: `${meatType} ${meatPart}`,
        });
      } else {
        const { brandName, kg } = order;
        const comissaryQuerySnapshot = await getDocs(comissaryRef);
        const comissaryDoc = comissaryQuerySnapshot.docs.find(
          (doc) => doc.data().processedMeat === brandName
        );

        if (comissaryDoc) {
          const comissaryDocRef = doc(comissaryRef, comissaryDoc.id);
          const comissaryQuantity = comissaryDoc.data().quantity;

          batch.update(comissaryDocRef, {
            quantity: comissaryQuantity + kg,
          });
        }
      }
    }
    const newCancelDocRef = doc(cancelHistoryRef, cancelOrder.id);

    const cancelHistory = {
      id: cancelOrder.id,
      customerName: cancelOrder.customerName,
      date: cancelOrder.date,
      orders: orders,
      remarks: cancelRemarks,
      cancelBy: user,
      totalPrice: cancelOrder.totalPrice,
      type: cancelOrder.type,
      setPrice:
        cancelOrder.type === "Raw" && cancelOrder.setPrice !== undefined
          ? cancelOrder.setPrice
          : null,
    };

    batch.delete(orderRef);
    batch.set(newCancelDocRef, cancelHistory);
    await batch.commit();
    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

orderRoutes.post("/confirm-order/:id", async (req, res) => {
  const confirmID = req.params.id;
  try {
    const batch = writeBatch(db);
    const orderRef = doc(orderListRef, confirmID);
    const orderSnapshot = await getDoc(orderRef);

    const orderData = orderSnapshot.data();
    const {
      id,
      customerName,
      date,
      modeOfPayment,
      orders,
      processedBy,
      totalPrice,
      type,
      setPrice = "",
    } = orderData;

    batch.delete(orderRef);

    const newOrderDocRef = doc(orderHistoryRef, id);
    const dataToTransfer = {
      id,
      customerName,
      date,
      modeOfPayment,
      orders,
      processedBy,
      totalPrice,
      type,
      setPrice: type === "Raw" ? setPrice : null,
    };

    batch.set(newOrderDocRef, dataToTransfer);

    if (modeOfPayment === "PENDING") {
      const newPendingDocRef = doc(pendingTableRef, id);
      const dataForPending = {
        ...dataToTransfer,
      };
      batch.set(newPendingDocRef, dataForPending);
    }

    await batch.commit();
    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

//Pending Order
orderRoutes.put("/confirm-pending/:id", async (req, res) => {
  const id = req.params.id;
  const modeOfPayment = req.body.mop;
  try {
    const historyRef = doc(orderHistoryRef, id);
    const pendingRef = doc(pendingTableRef, id);

    await updateDoc(historyRef, {
      modeOfPayment: modeOfPayment.toUpperCase(),
    });
    await deleteDoc(pendingRef, id);
    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

module.exports = orderRoutes;
