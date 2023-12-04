import { Outlet } from "react-router-dom";
function User() {
  return (
    <>
      <div className="User">This is User</div>
      <Outlet />
    </>
  );
}

export default User;
