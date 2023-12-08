import { Route, Routes } from "react-router-dom";
import "./css/Layout.css";
import Accounts from "./Pages/Accounts";
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
                <Route path="umaintenace" element={<Accounts />} />
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
