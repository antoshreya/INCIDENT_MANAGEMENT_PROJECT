import { useEffect, useState } from "react";
import "../styles/Auth.css";

export default function AdminDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [engineers, setEngineers] = useState([]);
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
      console.error("Error fetching incidents:", err);
    }
  };

  const fetchEngineers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/engineers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setEngineers(data);
    } catch (err) {
      console.error("Error fetching engineers:", err);
    }
  };

  useEffect(() => {
    fetchIncidents();
    fetchEngineers();
  }, []);

  const assignEngineer = async (incidentId, engineerId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/incidents/assign/${incidentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ engineerId })
        }
      );
      const data = await res.json();
      if (res.ok) {
        fetchIncidents();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error assigning engineer:", err);
    }
  };

  const deleteIncident = async (id) => {
    if (!window.confirm("Are you sure you want to delete this incident?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/incidents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchIncidents();
    } catch (err) {
      console.error("Error deleting incident:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const totalIncidents = incidents.length;
  const openCount = incidents.filter((i) => i.status === "Open").length;
  const assignedCount = incidents.filter((i) => i.status === "Assigned").length;
  const resolvedCount = incidents.filter((i) => i.status === "Resolved").length;

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

  // Filtered incidents per page
  const getFilteredIncidents = () => {
    switch (activePage) {
      case "open": return incidents.filter((i) => i.status === "Open");
      case "assigned": return incidents.filter((i) => i.status === "Assigned");
      case "resolved": return incidents.filter((i) => i.status === "Resolved");
      default: return incidents;
    }
  };

  const getPageTitle = () => {
    switch (activePage) {
      case "dashboard": return "Admin Dashboard";
      case "open": return "Open Incidents";
      case "assigned": return "Assigned Incidents";
      case "resolved": return "Resolved Incidents";
      case "engineers": return "Engineers";
      default: return "Dashboard";
    }
  };

  const getPageSubtitle = () => {
    switch (activePage) {
      case "dashboard": return "Overview of all incidents and team status.";
      case "open": return "Incidents awaiting engineer assignment.";
      case "assigned": return "Incidents currently being worked on.";
      case "resolved": return "Incidents that have been resolved.";
      case "engineers": return "All registered engineers in the system.";
      default: return "";
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
            <div className="sidebar-brand-name">Incident<span>IQ</span></div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-label">Overview</div>
          <div
            className={`sidebar-link ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => setActivePage("dashboard")}
          >
            <span className="link-icon">📊</span> Dashboard
          </div>

          <div className="sidebar-label">Incidents</div>
          <div
            className={`sidebar-link ${activePage === "open" ? "active" : ""}`}
            onClick={() => setActivePage("open")}
          >
            <span className="link-icon">🔔</span> Open
            {openCount > 0 && <span className="count-badge" style={{ marginLeft: "auto", fontSize: "0.7rem", padding: "2px 8px" }}>{openCount}</span>}
          </div>
          <div
            className={`sidebar-link ${activePage === "assigned" ? "active" : ""}`}
            onClick={() => setActivePage("assigned")}
          >
            <span className="link-icon">👤</span> Assigned
            {assignedCount > 0 && <span className="count-badge" style={{ marginLeft: "auto", fontSize: "0.7rem", padding: "2px 8px" }}>{assignedCount}</span>}
          </div>
          <div
            className={`sidebar-link ${activePage === "resolved" ? "active" : ""}`}
            onClick={() => setActivePage("resolved")}
          >
            <span className="link-icon">✅</span> Resolved
          </div>

          <div className="sidebar-label">Team</div>
          <div
            className={`sidebar-link ${activePage === "engineers" ? "active" : ""}`}
            onClick={() => setActivePage("engineers")}
          >
            <span className="link-icon">👥</span> Engineers
            <span className="count-badge" style={{ marginLeft: "auto", fontSize: "0.7rem", padding: "2px 8px" }}>{engineers.length}</span>
          </div>

          <div className="sidebar-label">Account</div>
          <div className="sidebar-link" onClick={logout}>
            <span className="link-icon">🚪</span> Logout
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">A</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">Administrator</div>
              <div className="sidebar-user-role">admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-header">
          <h1>{getPageTitle()}</h1>
          <p>{getPageSubtitle()}</p>
        </div>

        {/* Stats — show on dashboard page */}
        {activePage === "dashboard" && (
          <div className="stats-grid">
            <div className="stat-card" onClick={() => setActivePage("dashboard")} style={{ cursor: "pointer" }}>
              <div className="stat-card-header">
                <div className="stat-card-icon blue">📋</div>
              </div>
              <div className="stat-card-value">{totalIncidents}</div>
              <div className="stat-card-label">Total Incidents</div>
            </div>
            <div className="stat-card" onClick={() => setActivePage("open")} style={{ cursor: "pointer" }}>
              <div className="stat-card-header">
                <div className="stat-card-icon amber">🔔</div>
              </div>
              <div className="stat-card-value">{openCount}</div>
              <div className="stat-card-label">Open</div>
            </div>
            <div className="stat-card" onClick={() => setActivePage("assigned")} style={{ cursor: "pointer" }}>
              <div className="stat-card-header">
                <div className="stat-card-icon blue">👤</div>
              </div>
              <div className="stat-card-value">{assignedCount}</div>
              <div className="stat-card-label">Assigned</div>
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

        {/* Engineers Page */}
        {activePage === "engineers" ? (
          <div className="incidents-section">
            <div className="section-header">
              <h2>Registered Engineers</h2>
              <span className="count-badge">{engineers.length} engineers</span>
            </div>
            {engineers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <h3>No engineers found</h3>
                <p>No users with the engineer role have registered yet.</p>
              </div>
            ) : (
              engineers.map((eng) => (
                <div className="engineer-row" key={eng._id}>
                  <div className="engineer-avatar">
                    {eng.name ? eng.name.charAt(0).toUpperCase() : "E"}
                  </div>
                  <div className="engineer-info">
                    <h4>{eng.name}</h4>
                    <p>{eng.email}</p>
                  </div>
                  <span className="badge badge-assigned">Engineer</span>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Incident Table */
          <div className="incidents-section">
            <div className="section-header">
              <h2>
                {activePage === "dashboard" ? "All Incidents" : getPageTitle()}
              </h2>
              <span className="count-badge">{filteredIncidents.length} incidents</span>
            </div>

            {filteredIncidents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>No incidents found</h3>
                <p>
                  {activePage === "open"
                    ? "All incidents have been assigned."
                    : activePage === "resolved"
                    ? "No resolved incidents yet."
                    : "Incidents created by users will appear here."}
                </p>
              </div>
            ) : (
              filteredIncidents.map((inc) => (
                <div className="incident-row" key={inc._id}>
                  <div className="incident-info">
                    <h3>{inc.title}</h3>
                    <div className="incident-meta">
                      <span>👤 {inc.createdBy?.name || "Unknown"}</span>
                      <span>🔧 {inc.assignedTo ? inc.assignedTo.name : "Unassigned"}</span>
                      {inc.priority && <span>⚠️ {inc.priority}</span>}
                    </div>
                  </div>

                  <span className={`badge ${getStatusClass(inc.status)}`}>{inc.status}</span>

                  {inc.priority && (
                    <span className={`badge ${getPriorityClass(inc.priority)}`}>{inc.priority}</span>
                  )}

                  <div className="incident-actions">
                    {inc.status === "Open" && (
                      <select
                        className="assign-select"
                        onChange={(e) => assignEngineer(inc._id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Assign Engineer</option>
                        {engineers.map((eng) => (
                          <option key={eng._id} value={eng._id}>{eng.name}</option>
                        ))}
                      </select>
                    )}
                    <button className="btn btn-danger" onClick={() => deleteIncident(inc._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}