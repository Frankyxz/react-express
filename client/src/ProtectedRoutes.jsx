import { Outlet, Navigate } from "react-router-dom";
import useLogIn from "./stores/useLogin";
const useAuth = () => {
  const { loggedIn } = useLogIn();
  return loggedIn;
};
function ProtectedRoutes() {
  const isAuth = useAuth();

  return isAuth ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoutes;
