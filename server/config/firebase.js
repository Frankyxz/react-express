const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc } = require("firebase/firestore");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBy6eo9bh9AnaRwkzncwG7AjKnwYIQC1f4",
  authDomain: "capstonedb-a41d0.firebaseapp.com",
  databaseURL: "https://capstonedb-a41d0-default-rtdb.firebaseio.com",
  projectId: "capstonedb-a41d0",
  storageBucket: "capstonedb-a41d0.appspot.com",
  messagingSenderId: "233163892330",
  appId: "1:233163892330:web:e5426c9b46e17c835e0c13",
  measurementId: "G-991B9JW8KV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const usersRef = collection(db, "USERS");
const meatRef = collection(db, "MEAT");
const partRef = collection(db, "MEATPART");
const facilityInventoryRef = collection(db, "FACILITY_INVENTORY");
const brandRef = collection(db, "BRAND_CATEGORY");
const comissaryRef = collection(db, "COMISSARY_INVENTORY");
const deliveryQRef = collection(db, "DELIVERY_QUEUEUE");
const empDeliverRef = collection(db, "EMP_DELIVER_DATA");
const deliverTableRef = collection(db, "DELIVERY_ADMIN_DATA");
const boxesReceivedRef = collection(db, "BOXES_EMP_RECEIVED");
const expectTotalRef = collection(db, "EXPECTED_TOTAL");
const receivedTableRef = collection(db, "EMP_RECEIVED_DATA");

//Counters
const facilityCounter = doc(db, "counters", "FacilityCounter");
const processCounter = doc(db, "counters", "ProcessCounter");
const scrapCounter = doc(db, "counters", "ScrapCounter");
const orderCounter = doc(db, "counters", "OrderCounter");

//For Delivery
const deliverProcess = doc(db, "deliverKg", "Ongoing");
const deliverRef = doc(db, "deliverKg", "kgTotal");
const deliverStats = doc(db, "deliverKg", "deliverStatus");
const deliverInfo = doc(db, "deliverKg", "deliveryInfo");
module.exports = {
  db,
  usersRef,
  meatRef,
  partRef,
  facilityInventoryRef,
  brandRef,
  comissaryRef,
  processCounter,
  scrapCounter,
  facilityCounter,
  deliveryQRef,
  deliverProcess,
  deliverRef,
  deliverStats,
  deliverInfo,
  empDeliverRef,
  deliverTableRef,
  boxesReceivedRef,
  expectTotalRef,
  receivedTableRef,
};
