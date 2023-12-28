import { Route, Routes } from "react-router-dom";
import "./css/Layout.css";
import Accounts from "./Pages/Maintenance/Accounts";
import Login from "./Pages/Login";
import Header from "./Components/Header";
import Admin from "./UserTypes/Admin";
import ProtectedRoutes from "./ProtectedRoutes";
import Navbar from "./Components/Navbar";
import User from "./UserTypes/User";
import MeatType from "./Pages/Categories/MeatType";
import MeatParts from "./Pages/Categories/MeatParts";
import Brands from "./Pages/Categories/Brands";
import Facility from "./Pages/Inventory/Facility";
import ProcessedMeatType from "./Pages/Categories/ProcessedMeatType";
import Comissary from "./Pages/Inventory/Comissary";
import DeliveryFacility from "./Pages/Delivery/DeliveryFacility";
import EmpDeliverFacility from "./Pages/Delivery/EmpDeliverFacility";
import DeliveryAdmin from "./Pages/Delivery/DeliveryAdmin";
import Calculate from "./Pages/Delivery/Calculate";
import HistoryDelivery from "./Pages/History/HistoryDelivery";
import HistoryPercentage from "./Pages/History/HistoryPercentage";
import HistoryOrder from "./Pages/History/HistoryOrder";
import HistoryCancel from "./Pages/History/HistoryCancel";
import EmployeeDispatch from "./Pages/Maintenance/EmployeeDispatch";
import Payments from "./Pages/Maintenance/Payments";
import Orders from "./Pages/Orders/Orders";
import ManageOrder from "./Pages/Orders/ManageOrder";
import Pending from "./Pages/Orders/Pending";
import RawMeatOrder from "./Pages/Orders/RawMeatOrder";
import Dashboard from "./Pages/Dashboard";
import Settings from "./Pages/Settings";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<Navbar />}>
            <Route element={<Header />}>
              <Route path="/admin">
                <Route index element={<Admin />} />
                <Route path="meatType" element={<MeatType />} />
                <Route path="meat-parts" element={<MeatParts />} />
                <Route path="brands" element={<Brands />} />
                <Route
                  path="processed-meatType"
                  element={<ProcessedMeatType />}
                />
                <Route path="facility" element={<Facility />} />
                <Route path="comissary" element={<Comissary />} />
                <Route
                  path="delivery-facility"
                  element={<DeliveryFacility />}
                />
                <Route path="delivery-data" element={<DeliveryAdmin />} />
                <Route path="calculate" element={<Calculate />} />
                <Route path="delivery-history" element={<HistoryDelivery />} />
                <Route
                  path="percentage-history"
                  element={<HistoryPercentage />}
                />
                <Route path="order-history" element={<HistoryOrder />} />
                <Route path="cancel-history" element={<HistoryCancel />} />
                <Route path="umaintenace" element={<Accounts />} />
                <Route path="dmaintenance" element={<EmployeeDispatch />} />
                <Route path="pmaintenance" element={<Payments />} />
                <Route path="orders" element={<Orders />} />
                <Route path="manage-orders" element={<ManageOrder />} />
                <Route path="acc-receivable" element={<Pending />} />
                <Route path="raw-order" element={<RawMeatOrder />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/*Users*/}

              <Route path="/user">
                <Route index element={<User />} />
                <Route path="delivery" element={<EmpDeliverFacility />} />
                <Route path="comissary" element={<Comissary />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
