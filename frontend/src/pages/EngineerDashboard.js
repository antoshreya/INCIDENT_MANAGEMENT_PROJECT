import { useEffect, useState } from "react";
import "../styles/Auth.css";

export default function EngineerDashboard() {
  const [incidents, setIncidents] = useState([]);
  const token = localStorage.getItem("token");

  // 🔹 Fetch incidents
  const fetchIncidents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/incidents", {
        headers: {
          Authorization: token
        }
      });

      const data = await res.json();

      if (res.ok) {
        // Filter only assigned incidents
        const assigned = data.filter(
          (inc) => inc.assignedTo && inc.status !== "Resolved"
        );
        setIncidents(assigned);
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // 🔹 Mark as resolved
  const resolveIncident = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/incidents/resolve/${id}`, {
        method: "PUT",
        headers: {
          Authorization: token
        }
      });

      fetchIncidents();

    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="auth-container">
      <div className="login-card" style={{ width: "850px" }}>
        <h2>Engineer Dashboard</h2>

        {incidents.length === 0 && <p>No assigned incidents</p>}

        {incidents.map((inc) => (
          <div key={inc._id} style={{ marginTop: "15px" }}>
            <p><strong>{inc.title}</strong></p>
            <p>Status: {inc.status}</p>
            <p>Created By: {inc.createdBy?.name}</p>

            {inc.status !== "Resolved" && (
              <button onClick={() => resolveIncident(inc._id)}>
                Mark as Resolved
              </button>
            )}

            <hr />
          </div>
        ))}

        <button
          style={{ marginTop: "30px", background: "black" }}
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}