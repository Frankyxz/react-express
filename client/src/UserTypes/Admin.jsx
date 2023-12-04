import { Outlet } from "react-router-dom";
function Admin() {
  return (
    <>
      <div className="Admin">This is Admin</div>
      <Outlet />
    </>
  );
}

export default Admin;
