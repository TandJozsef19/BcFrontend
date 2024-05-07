import { useSelector } from "react-redux";
import { AdminNav } from "../components";
import { Outlet, Navigate } from "react-router-dom";

const AdminPanel = () => {
  const user = useSelector((state) => state.user.user);

  if (!user || user.role !== "admin") {
    return <Navigate to="/404" />;
  }

  return (
    <div className="rounded-lg mx-auto p-6 max-w-8xl grid grid-cols-1 lg:grid-cols-5 md:grid-cols-2 gap-10">
      <AdminNav />
      <Outlet />
    </div>
  );
};

export default AdminPanel;
