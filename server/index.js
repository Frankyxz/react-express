const express = require("express");
const cors = require("cors");

const app = express();

//Routes
const meatRoutes = require("./routes/meatTypeRoutes");
const authRoutes = require("./routes/authRoutes");
const fetchDataRoutes = require("./routes/fetchDataRoutes");
const useMeatRoutes = require("./routes/useMeatRoutes");
const meatPartRoutes = require("./routes/meatPartRoutes");
const brandRoutes = require("./routes/brandRoutes");
const processedMeatRoutes = require("./routes/processedMeatRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const deliveryFacilityRoutes = require("./routes/deliveryFacilityRoutes");
const empDeliveryFacilityRoutes = require("./routes/empDeliveryFacilityRoutes");
const deliveryAdminRoutes = require("./routes/deliveryAdminRoutes");
const calculateRoutes = require("./routes/calculateRoutes");
const historyRoutes = require("./routes/historyRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dispatcherRoutes = require("./routes/dispatcherRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderOptionsRoutes = require("./routes/orderOptionsRoutes");
const rawMeatRoutes = require("./routes/rawMeatRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const reportRoutes = require("./routes/reportRoutes");

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use("/meatType", meatRoutes);
app.use("/auth", authRoutes);
app.use("/fetchData", fetchDataRoutes);
app.use("/useMeat", useMeatRoutes);
app.use("/meatPart", meatPartRoutes);
app.use("/brands", brandRoutes);
app.use("/processed", processedMeatRoutes);
app.use("/facility", facilityRoutes);
app.use("/delivery-facility", deliveryFacilityRoutes);
app.use("/emp-facility", empDeliveryFacilityRoutes);
app.use("/admin-delivery", deliveryAdminRoutes);
app.use("/calculate", calculateRoutes);
app.use("/history", historyRoutes);
app.use("/orders", orderRoutes);
app.use("/dispatcher", dispatcherRoutes);
app.use("/payment", paymentRoutes);
app.use("/order-options", orderOptionsRoutes);
app.use("/raw", rawMeatRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/settings", settingsRoutes);
app.use("/reports", reportRoutes);
app.listen(8000, () => {
  console.log("Firebase backend");
});
