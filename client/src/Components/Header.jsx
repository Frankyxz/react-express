import "../css/Header.css";
import logout from "../assets/logout.png";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useLogIn from "../stores/useLogin";
const Header = () => {
  const { logOut, user } = useLogIn();
  const navigate = useNavigate();
  const handleLogout = () => {
    logOut();
    navigate("/");
  };
  return (
    <>
      <header>
        <div className="header-container d-flex p-2">
          <div className="title-container"></div>
          <div className="header-info-container d-flex">
            <div className="user-container d-flex gap-2">
              <div className="img-container d-flex justify-content-center align-items-center">
                <i className="bx bxs-user"></i>
              </div>
              <div className="type-of-user d-flex align-items-center">
                <p className="me-3 m-0" id="welcomeMessage">
                  Welcome {user}!
                </p>
              </div>
            </div>
            <div className="logOut-container d-flex gap-2 align-items-center ">
              <div className="img-container d-flex justify-content-center align-items-center">
                <img src={logout} className="img-header" />
              </div>
              <div className="me-2" id="logout" onClick={handleLogout}>
                <p className="m-0">Logout</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default Header;
