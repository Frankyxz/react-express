const { initializeApp } = require("firebase/app");
const { getFirestore, collection } = require("firebase/firestore");

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
module.exports = {
  db,
  usersRef,
  meatRef,
  partRef,
  facilityInventoryRef,
  brandRef,
};
