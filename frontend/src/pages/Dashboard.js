import { useEffect, useState } from "react";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import EngineerDashboard from "./EngineerDashboard";

export default function Dashboard() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (!token) {
      window.location.href = "/";
    } else {
      setRole(savedRole);
    }
  }, []);

  if (!role) return null;

  if (role === "user") return <UserDashboard />;
  if (role === "admin") return <AdminDashboard />;
  if (role === "engineer") return <EngineerDashboard />;

  return <h2>Invalid Role</h2>;
}