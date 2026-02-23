import { useEffect, useState } from "react";
import "../styles/Auth.css";

export default function UserDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [newIncident, setNewIncident] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Fetch incidents from backend
  const fetchIncidents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/incidents", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

      const data = await res.json();

      if (res.ok) {
        setIncidents(data);
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // 🔹 Create new incident
  const addIncident = async () => {
    if (!newIncident.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/incidents", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
        body: JSON.stringify({
          title: newIncident,
          description: newIncident
        })
      });

      if (res.ok) {
        setNewIncident("");
        fetchIncidents();
      }

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
      <div className="login-card" style={{ width: "800px" }}>
        <h2>User Dashboard</h2>

        <input
          placeholder="Describe issue..."
          value={newIncident}
          onChange={(e) => setNewIncident(e.target.value)}
        />
        <button onClick={addIncident}>Submit Incident</button>

        <h3 style={{ marginTop: "30px" }}>Your Incidents</h3>

        {incidents.map((inc) => (
          <div key={inc._id} style={{ marginTop: "15px" }}>
            <p><strong>{inc.title}</strong></p>
            <p>Status: {inc.status}</p>
            <p>
              Assigned: {inc.assignedTo ? inc.assignedTo.name : "Not Assigned"}
            </p>
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