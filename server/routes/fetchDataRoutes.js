const express = require("express");
const {
  meatRef,
  usersRef,
  partRef,
  brandRef,
  comissaryRef,
} = require("../config/firebase");
const { fetchData } = require("../fetchData");
const fetchDataRoutes = express.Router();

fetchDataRoutes.get("/meatType", fetchData(meatRef));
fetchDataRoutes.get("/users", fetchData(usersRef));
fetchDataRoutes.get("/meatPart", fetchData(partRef));
fetchDataRoutes.get("/brands", fetchData(brandRef));
fetchDataRoutes.get("/processed-meat", fetchData(comissaryRef));

module.exports = fetchDataRoutes;
