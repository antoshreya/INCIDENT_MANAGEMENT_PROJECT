import { useEffect, useState } from "react";
import "../styles/Auth.css";

export default function EngineerDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const token = localStorage.getItem("token");

  const fetchIncidents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/incidents", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setIncidents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const resolveIncident = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/incidents/resolve/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (res.ok) fetchIncidents();
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const assignedCount = incidents.filter((i) => i.status === "Assigned").length;
  const resolvedCount = incidents.filter((i) => i.status === "Resolved").length;
  const activeIncidents = incidents.filter((i) => i.status !== "Resolved");
  const resolvedIncidents = incidents.filter((i) => i.status === "Resolved");

  const getStatusClass = (status) => {
    switch (status) {
      case "Open": return "badge-open";
      case "Assigned": return "badge-assigned";
      case "Resolved": return "badge-resolved";
      default: return "";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Low": return "badge-low";
      case "Medium": return "badge-medium";
      case "High": return "badge-high";
      case "Critical": return "badge-critical";
      default: return "";
    }
  };

  const getFilteredIncidents = () => {
    switch (activePage) {
      case "assigned": return activeIncidents;
      case "resolved": return resolvedIncidents;
      default: return incidents;
    }
  };

  const filteredIncidents = getFilteredIncidents();

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">⚡</div>
            <div className="sidebar-brand-name">
              Incident<span>IQ</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-label">Main</div>
          <div
            className={`sidebar-link ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => setActivePage("dashboard")}
          >
            <span className="link-icon">📊</span> Dashboard
          </div>
          <div
            className={`sidebar-link ${activePage === "assigned" ? "active" : ""}`}
            onClick={() => setActivePage("assigned")}
          >
            <span className="link-icon">🔧</span> Assigned to Me
            {assignedCount > 0 && <span className="count-badge" style={{ marginLeft: "auto", fontSize: "0.7rem", padding: "2px 8px" }}>{assignedCount}</span>}
          </div>
          <div
            className={`sidebar-link ${activePage === "resolved" ? "active" : ""}`}
            onClick={() => setActivePage("resolved")}
          >
            <span className="link-icon">✅</span> Resolved
          </div>

          <div className="sidebar-label">Account</div>
          <div className="sidebar-link" onClick={logout} style={{ cursor: "pointer" }}>
            <span className="link-icon">🚪</span> Logout
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">E</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">Engineer</div>
              <div className="sidebar-user-role">engineer</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-header">
          <h1>
            {activePage === "dashboard" && "Engineer Dashboard"}
            {activePage === "assigned" && "Active Assignments"}
            {activePage === "resolved" && "Resolved Incidents"}
          </h1>
          <p>
            {activePage === "dashboard" && "Overview of your assigned tasks."}
            {activePage === "assigned" && "Incidents currently assigned to you."}
            {activePage === "resolved" && "History of tickets you've completed."}
          </p>
        </div>

        {/* Stats */}
        {activePage === "dashboard" && (
          <div className="stats-grid">
            <div className="stat-card" onClick={() => setActivePage("dashboard")} style={{ cursor: "pointer" }}>
              <div className="stat-card-header">
                <div className="stat-card-icon blue">📋</div>
              </div>
              <div className="stat-card-value">{incidents.length}</div>
              <div className="stat-card-label">Total Assigned</div>
            </div>
            <div className="stat-card" onClick={() => setActivePage("assigned")} style={{ cursor: "pointer" }}>
              <div className="stat-card-header">
                <div className="stat-card-icon amber">🔧</div>
              </div>
              <div className="stat-card-value">{assignedCount}</div>
              <div className="stat-card-label">Active</div>
            </div>
            <div className="stat-card" onClick={() => setActivePage("resolved")} style={{ cursor: "pointer" }}>
              <div className="stat-card-header">
                <div className="stat-card-icon green">✅</div>
              </div>
              <div className="stat-card-value">{resolvedCount}</div>
              <div className="stat-card-label">Resolved</div>
            </div>
          </div>
        )}

        {/* Incident List */}
        <div className="incidents-section">
          <div className="section-header">
            <h2>
              {activePage === "dashboard" ? "All Your Assignments" : ""}
              {activePage === "assigned" ? "Needs Attention" : ""}
              {activePage === "resolved" ? "Completed" : ""}
            </h2>
            <span className="count-badge">{filteredIncidents.length} incidents</span>
          </div>

          {filteredIncidents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎉</div>
              <h3>
                {activePage === "assigned" ? "All caught up!" : "No incidents here."}
              </h3>
              <p>
                {activePage === "assigned" ? "You have no pending assignments." : "There are no incidents matching this view."}
              </p>
            </div>
          ) : (
            filteredIncidents.map((inc) => (
              <div className="incident-row" key={inc._id}>
                <div className="incident-info">
                  <h3>{inc.title}</h3>
                  {inc.description && <p>{inc.description}</p>}
                  <div className="incident-meta">
                    <span>👤 Reported by: {inc.createdBy?.name || "Unknown"}</span>
                    {/* With assignedTo populated, we can show it! */}
                    <span>🔧 Assigned to: {inc.assignedTo ? inc.assignedTo.name : "You"}</span>
                    <span>📅 {new Date(inc.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <span className={`badge ${getStatusClass(inc.status)}`}>
                  {inc.status}
                </span>

                {inc.priority && (
                  <span className={`badge ${getPriorityClass(inc.priority)}`}>
                    {inc.priority}
                  </span>
                )}

                <div className="incident-actions">
                  {inc.status === "Assigned" && (
                    <button
                      className="btn btn-success"
                      onClick={() => resolveIncident(inc._id)}
                    >
                      ✓ Resolve
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}