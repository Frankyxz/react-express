const express = require("express");
const { meatRef, usersRef, partRef, brandRef } = require("../config/firebase");
const { fetchData } = require("../fetchData");
const fetchDataRoutes = express.Router();

fetchDataRoutes.get("/meatType", fetchData(meatRef));
fetchDataRoutes.get("/users", fetchData(usersRef));
fetchDataRoutes.get("/meatPart", fetchData(partRef));
fetchDataRoutes.get("/brands", fetchData(brandRef));

module.exports = fetchDataRoutes;
