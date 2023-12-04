import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../js/url";
import useLogIn from "../stores/useLogin";
const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setLoggedIn, setUser, setIsAdmin } = useLogIn();

  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${url}/auth/login`, {
        userName,
        password,
      });

      const { success, user } = response.data;

      if (success) {
        const { type, userName } = user;

        if (type === "Employee") {
          setUser(userName);
          setIsAdmin(false);
          setLoggedIn(true);
          navigate("/user");
          console.log("Sucess Emp");
        } else if (type === "Admin") {
          setUser(userName);
          setIsAdmin(true);
          setLoggedIn(true);
          navigate("/admin/umaintenace");
          console.log("Sucess Admin");
        } else {
          console.log("Invalid role");
        }
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.log("Error signing in:", error.message);
      alert("An error occurred while signing in");
    }
  };
  return (
    <>
      <section className="vh-100">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card shadow-2-strong">
                <div className="card-body p-5 text-center">
                  <h3 className="mb-5">Log in</h3>

                  <div className="form-outline mb-4">
                    <input
                      type="text"
                      id="userName"
                      className="form-control form-control-lg"
                      placeholder="Username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      id="pass"
                      className="form-control form-control-lg"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    className="btn btn-primary btn-lg btn-block"
                    id="login-btn"
                    type="submit"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
