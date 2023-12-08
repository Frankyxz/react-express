import React, { useEffect, useState, useRef } from "react";
import "../css/Navbar.css";
import { Link, Outlet } from "react-router-dom";
import useLogIn from "../stores/useLogin";
const Navbar = () => {
  const { isAdmin } = useLogIn();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [isInventoryMenuOpen, setIsInventoryMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isDeliveryMenuOpen, setIsDeliveryMenuOpen] = useState(false);
  const [isHistoryMenuOpen, setIsHistoryMenuOpen] = useState(false);
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  useEffect(() => {
    const handleDocumentClick = (event) => {
      const sidebar = sidebarRef.current;
      const isSidebarClick = sidebar.contains(event.target);

      if (!isSidebarClick && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isSidebarOpen]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prevOpen) => !prevOpen);
  };

  const handleInventoryMenuToggle = () => {
    setIsInventoryMenuOpen((prevOpen) => !prevOpen);
  };

  const handleCategoryMenuToggle = () => {
    setIsCategoryMenuOpen((prevOpen) => !prevOpen);
  };

  const handleDeliveryMenuToggle = () => {
    setIsDeliveryMenuOpen((prevOpen) => !prevOpen);
  };
  const handleHistoryMenuToggle = () => {
    setIsHistoryMenuOpen((prevOpen) => !prevOpen);
  };
  const handleOrderMenuToggle = () => {
    setIsOrderMenuOpen((prevOpen) => !prevOpen);
  };
  const handleMaintenanceToggle = () => {
    setIsMaintenanceOpen((prevOpen) => !prevOpen);
  };
  if (isAdmin) {
    return (
      <>
        <div
          className={`sidebar ${isSidebarOpen ? "" : "close"}`}
          ref={sidebarRef}
        >
          <div className="logo-details">
            <div className="logo_name">J.A.B Meats</div>
            <i
              className={`bx ${
                isSidebarOpen ? "bx-menu-alt-right" : "bx-menu"
              }`}
              id="btn"
              onClick={handleSidebarToggle}
            ></i>
          </div>
          <ul className="nav-links">
            <li className="dashboard">
              <Link to="/admin/dashboard">
                <i className="bx bx-grid-alt"></i>
                <span className="link_name">Dashboard</span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
              </ul>
            </li>
            <li
              className={`inventory ${isInventoryMenuOpen ? "showMenu" : ""}`}
            >
              <div className="iocn-link" onClick={handleInventoryMenuToggle}>
                <a href="#">
                  <i className="bx bx-package"></i>
                  <span className="link_name">Inventory</span>
                </a>
                <i className="bx bxs-chevron-down arrow"></i>
              </div>
              <ul className="sub-menu">
                <li>
                  <a className="link_name" href="#">
                    Inventory
                  </a>
                </li>
                <li className="comissary-inventory">
                  <Link to="/admin/comissary">Comissary</Link>
                </li>
                <li className="facility-invi">
                  <Link to="/admin/facility">Facility</Link>
                </li>
              </ul>
            </li>
            <li className={`order ${isOrderMenuOpen ? "showMenu" : ""}`}>
              <div className="iocn-link" onClick={handleOrderMenuToggle}>
                <a href="#">
                  <i className="bx bxs-cart"></i>
                  <span className="link_name">Order</span>
                </a>
                <i className="bx bxs-chevron-down arrow"></i>
              </div>
              <ul className="sub-menu">
                <li>
                  <a className="link_name" href="#">
                    Orders
                  </a>
                </li>
                <li>
                  <Link to="/admin/orders">Order</Link>
                </li>
                <li>
                  <Link to="/admin/raw-order">Raw Order</Link>
                </li>
                <li>
                  <Link to="/admin/manage-orders">Manage Order</Link>
                </li>
                <li>
                  <Link to="/admin/acc-receivable">Account Receivable</Link>
                </li>
              </ul>
            </li>
            <li className="analytics">
              <Link to="/admin/reports">
                <i className="bx bx-pie-chart-alt-2"></i>
                <span className="link_name">Reports</span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <Link to="/admin/reports">Reports</Link>
                </li>
              </ul>
            </li>
            <li className={`category ${isCategoryMenuOpen ? "showMenu" : ""}`}>
              <div className="iocn-link" onClick={handleCategoryMenuToggle}>
                <a href="#">
                  <i className="bx bxs-notepad"></i>
                  <span className="link_name">Categories</span>
                </a>
                <i className="bx bxs-chevron-down arrow"></i>
              </div>
              <ul className="sub-menu">
                <li>
                  <a className="link_name" href="#">
                    Category
                  </a>
                </li>
                <li>
                  <Link to="/admin/meatType">Meat Type</Link>
                </li>
                <li>
                  <Link to="/admin/meat-parts">Meat Parts</Link>
                </li>
                <li>
                  <Link to="/admin/brands">Brands</Link>
                </li>
                <li>
                  <Link to="/admin/processed-meatType">Processed</Link>
                </li>
              </ul>
            </li>
            <li className={`delivery ${isDeliveryMenuOpen ? "showMenu" : ""}`}>
              <div className="iocn-link" onClick={handleDeliveryMenuToggle}>
                <a href="#">
                  <i className="bx bxs-truck"></i>
                  <span className="link_name">Delivery</span>
                </a>
                <i className="bx bxs-chevron-down arrow"></i>
              </div>
              <ul className="sub-menu">
                <li>
                  <a className="link_name" href="#">
                    Delivery
                  </a>
                </li>
                <li>
                  <Link to="/admin/delivery-facility">From Facility</Link>
                </li>
                <li>
                  <Link to="/admin/delivery-data">Delivery Data</Link>
                </li>
                <li>
                  <Link to="/admin/calculate">Calculate</Link>
                </li>
              </ul>
            </li>
            <li className={`history ${isHistoryMenuOpen ? "showMenu" : ""}`}>
              <div className="iocn-link" onClick={handleHistoryMenuToggle}>
                <a href="#">
                  <i className="bx bx-history"></i>
                  <span className="link_name">History</span>
                </a>
                <i className="bx bxs-chevron-down arrow"></i>
              </div>
              <ul className="sub-menu">
                <li>
                  <a className="link_name" href="#">
                    History
                  </a>
                </li>
                <li>
                  <Link to="/admin/delivery-history">Delivery History</Link>
                </li>
                <li>
                  <Link to="/admin/percentage-history">Percentage History</Link>
                </li>
                <li>
                  <Link to="/admin/order-history">Order History</Link>
                </li>
                <li>
                  <Link to="/admin/cancel-history">Canceled Order History</Link>
                </li>
              </ul>
            </li>

            <li
              className={`maintenance ${isMaintenanceOpen ? "showMenu" : ""}`}
            >
              <div className="iocn-link" onClick={handleMaintenanceToggle}>
                <a href="#">
                  <i className="bx bxs-user-detail"></i>
                  <span className="link_name">Maintenance</span>
                </a>
                <i className="bx bxs-chevron-down arrow"></i>
              </div>
              <ul className="sub-menu">
                <li>
                  <a className="link_name" href="#">
                    Maintenance
                  </a>
                </li>
                <li>
                  <Link to="/admin/umaintenance">Accounts</Link>
                </li>
                <li>
                  <Link to="/admin/dmaintenance">Dipatchers</Link>
                </li>
                <li>
                  <Link to="/admin/pmaintenance">Mode of Payments</Link>
                </li>
              </ul>
            </li>

            <li className="settings">
              <Link to="/admin/settings">
                <i className="bx bx-cog"></i>
                <span className="link_name">Setting</span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <Link to="/admin/settings">Setting</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <Outlet />
      </>
    );
  } else {
    return (
      <>
        <div
          className={`sidebar ${isSidebarOpen ? "" : "close"}`}
          ref={sidebarRef}
        >
          <div className="logo-details">
            <div className="logo_name">J.A.B Meats</div>
            <i
              className={`bx ${
                isSidebarOpen ? "bx-menu-alt-right" : "bx-menu"
              }`}
              id="btn"
              onClick={handleSidebarToggle}
            ></i>
          </div>
          <ul className="nav-links">
            <li className="user-received">
              <Link to="/user/delivery">
                <i className="bx bxs-truck"></i>
                <span className="link_name">Received Delivery</span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <Link to="/user/delivery">Received Delivery</Link>
                </li>
              </ul>
            </li>
            <li className="user-commi">
              <Link to="/user/comissary">
                <i className="bx bx-package"></i>
                <span className="link_name">Comissary</span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <Link to="/user/comissary">Comissary</Link>
                </li>
              </ul>
            </li>

            <li className={`order ${isOrderMenuOpen ? "showMenu" : ""}`}>
              <div className="iocn-link" onClick={handleOrderMenuToggle}>
                <a href="#">
                  <i className="bx bxs-cart"></i>
                  <span className="link_name">Order</span>
                </a>
                <i className="bx bxs-chevron-down arrow"></i>
              </div>
              <ul className="sub-menu">
                <li>
                  <a className="link_name" href="#">
                    Orders
                  </a>
                </li>
                <li>
                  <Link to="/user/orders">Order</Link>
                </li>
                <li>
                  <Link to="/user/manage-orders">Manage Order</Link>
                </li>
              </ul>
            </li>

            <li className="user-calc">
              <Link to="/user/calculate">
                <i className="bx bx-calculator"></i>
                <span className="link_name">Calculate</span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <Link to="/user/calculate">Calculate</Link>
                </li>
              </ul>
            </li>

            <li className={`history ${isHistoryMenuOpen ? "showMenu" : ""}`}>
              <div className="iocn-link" onClick={handleHistoryMenuToggle}>
                <a href="#">
                  <i className="bx bx-history"></i>
                  <span className="link_name">History</span>
                </a>
                <i className="bx bxs-chevron-down arrow"></i>
              </div>
              <ul className="sub-menu">
                <li>
                  <a className="link_name" href="#">
                    History
                  </a>
                </li>
                <li>
                  <Link to="/user/delivery-history">Delivery History</Link>
                </li>
                <li>
                  <Link to="/user/percentage-history">Percentage History</Link>
                </li>
                <li>
                  <Link to="/user/order-history">Order History</Link>
                </li>
                <li>
                  <Link to="/user/cancel-history">Canceled Order History</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <Outlet />
      </>
    );
  }
};

export default Navbar;
