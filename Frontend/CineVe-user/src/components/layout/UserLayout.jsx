import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <div className="user-layout">
      <main className="user-layout-main">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;
