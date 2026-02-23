import { useEffect, useState } from "react";
import "../styles/Auth.css";

export default function AdminDashboard() {
  const [incidents, setIncidents] = useState([]);
  const token = localStorage.getItem("token");

  // 🔹 Fetch all incidents
  const fetchIncidents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/incidents", {
        headers: {
          Authorization: token
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

  // 🔹 Assign engineer
  const assignEngineer = async (id, engineerId) => {
    try {
      await fetch(`http://localhost:5000/api/incidents/assign/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({ engineerId })
      });

      fetchIncidents();

    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Delete incident
  const deleteIncident = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/incidents/${id}`, {
        method: "DELETE",
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
      <div className="login-card" style={{ width: "900px" }}>
        <h2>Admin Dashboard</h2>

        {incidents.map((inc) => (
          <div key={inc._id} style={{ marginTop: "15px" }}>
            <p><strong>{inc.title}</strong></p>
            <p>Status: {inc.status}</p>
            <p>Created By: {inc.createdBy?.name}</p>
            <p>
              Assigned: {inc.assignedTo ? inc.assignedTo.name : "Not Assigned"}
            </p>

            {inc.status === "Open" && (
              <button
                onClick={() =>
                  assignEngineer(inc._id, prompt("Enter Engineer ID"))
                }
              >
                Assign Engineer
              </button>
            )}

            <button
              style={{ marginLeft: "10px", background: "red" }}
              onClick={() => deleteIncident(inc._id)}
            >
              Delete
            </button>

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