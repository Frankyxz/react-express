const express = require("express");
const { meatRef, usersRef, partRef } = require("../config/firebase");
const { fetchData } = require("../fetchData");
const fetchDataRoutes = express.Router();

fetchDataRoutes.get("/meatType", fetchData(meatRef));
fetchDataRoutes.get("/users", fetchData(usersRef));
fetchDataRoutes.get("/meatPart", fetchData(partRef));

module.exports = fetchDataRoutes;
