const express = require("express");
const {
  meatRef,
  usersRef,
  partRef,
  brandRef,
  comissaryRef,
  deliveryQRef,
  facilityInventoryRef,
  empDeliverRef,
  deliverTableRef,
  boxesReceivedRef,
  receivedTableRef,
  expectTotalRef,
  totalProcessedRef,
  allTotalRef,
  deliveryHistory,
  percentHistoryRef,
  orderHistoryRef,
  cancelHistoryRef,
} = require("../config/firebase");
const { fetchData } = require("../fetchData");
const fetchDataRoutes = express.Router();

fetchDataRoutes.get("/meatType", fetchData(meatRef));
fetchDataRoutes.get("/users", fetchData(usersRef));
fetchDataRoutes.get("/meatPart", fetchData(partRef));
fetchDataRoutes.get("/brands", fetchData(brandRef));
fetchDataRoutes.get("/processed-meat", fetchData(comissaryRef));
fetchDataRoutes.get("/deliveryQueue", fetchData(deliveryQRef));
fetchDataRoutes.get("/facility-inventory", fetchData(facilityInventoryRef));
fetchDataRoutes.get("/emp-deliver-list", fetchData(empDeliverRef));
fetchDataRoutes.get("/deliver-table", fetchData(deliverTableRef));
fetchDataRoutes.get("/box-received", fetchData(boxesReceivedRef));
fetchDataRoutes.get("/received-table", fetchData(receivedTableRef));
fetchDataRoutes.get("/expected-total", fetchData(expectTotalRef));
fetchDataRoutes.get("/received-total", fetchData(allTotalRef));
fetchDataRoutes.get("/total-data", fetchData(totalProcessedRef));
fetchDataRoutes.get("/history-delivery", fetchData(deliveryHistory));
fetchDataRoutes.get("/history-percentages", fetchData(percentHistoryRef));
fetchDataRoutes.get("/history-order", fetchData(orderHistoryRef));
fetchDataRoutes.get("/history-cancel", fetchData(cancelHistoryRef));
module.exports = fetchDataRoutes;
