import UserDashboard from "./UserDashboard";
import EngineerDashboard from "./EngineerDashboard";
import AdminDashboard from "./AdminDashboard";

export default function DashboardRouter() {
  const role = localStorage.getItem("role");

  if (role === "user") return <UserDashboard />;
  if (role === "engineer") return <EngineerDashboard />;
  if (role === "admin") return <AdminDashboard />;

  return <h2>No Role Found</h2>;
}