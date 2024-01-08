const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc } = require("firebase/firestore");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcBrJJYalvY9O6R8K84oqKlroxXA7e6-Q",
  authDomain: "capstone-project-ebf0c.firebaseapp.com",
  projectId: "capstone-project-ebf0c",
  storageBucket: "capstone-project-ebf0c.appspot.com",
  messagingSenderId: "421273579728",
  appId: "1:421273579728:web:f10d0c671c0cc8c881aed5"
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
const allTotalRef = collection(db, "ALL_TOTAL");
const deliveryHistory = collection(db, "DELIVERY_HISTORY");
const percentHistoryRef = collection(db, "PERCENT_HISTORY");
const orderHistoryRef = collection(db, "ORDER_HISTORY");
const cancelHistoryRef = collection(db, "CANCEL_HISTORY");
const totalProcessedRef = collection(db, "TOTAL_PROCESSED");
const orderListRef = collection(db, "ORDERS_LIST");
const dispatcherRef = collection(db, "DISPATCHERS");
const paymentsRef = collection(db, "PAYMENTS");
const ordersRef = collection(db, "ORDERS");
const pendingTableRef = collection(db, "PENDING");
const rawQueueRef = collection(db, "RAW_QUEUEUE");

//Counters
const facilityCounter = doc(db, "counters", "FacilityCounter");
const processCounter = doc(db, "counters", "ProcessCounter");
const scrapCounter = doc(db, "counters", "ScrapCounter");
const orderCounter = doc(db, "counters", "OrderCounter");
const levelStock = doc(db, "stockLevel", "level");

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
  allTotalRef,
  deliveryHistory,
  percentHistoryRef,
  orderHistoryRef,
  cancelHistoryRef,
  totalProcessedRef,
  orderListRef,
  dispatcherRef,
  paymentsRef,
  ordersRef,
  orderCounter,
  pendingTableRef,
  rawQueueRef,
  levelStock,
};
