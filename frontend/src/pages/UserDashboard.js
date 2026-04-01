import { useEffect, useState } from "react";
import "../styles/Auth.css";

export default function UserDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
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

  const addIncident = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, priority })
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        setPriority("Low");
        fetchIncidents();
        setActivePage("incidents"); // navigate to incidents view after creation
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
            className={`sidebar-link ${activePage === "incidents" ? "active" : ""}`}
            onClick={() => setActivePage("incidents")}
          >
            <span className="link-icon">📋</span> My Incidents
          </div>
          <div
            className={`sidebar-link ${activePage === "report" ? "active" : ""}`}
            onClick={() => setActivePage("report")}
          >
            <span className="link-icon">➕</span> Report Incident
          </div>

          <div className="sidebar-label">Account</div>
          <div className="sidebar-link" onClick={logout} style={{ cursor: "pointer" }}>
            <span className="link-icon">🚪</span> Logout
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">U</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">User Account</div>
              <div className="sidebar-user-role">user</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-header">
          <h1>
            {activePage === "dashboard" && "User Dashboard"}
            {activePage === "incidents" && "My Incidents"}
            {activePage === "report" && "Report an Incident"}
          </h1>
          <p>
            {activePage === "dashboard" && "Overview of your reported incidents."}
            {activePage === "incidents" && "Track the status of your submissions."}
            {activePage === "report" && "Submit a new incident for the team to review."}
          </p>
        </div>

        {/* Dashboard Overview */}
        {activePage === "dashboard" && (
          <div className="stats-grid">
            <div className="stat-card" onClick={() => setActivePage("incidents")} style={{ cursor: "pointer" }}>
              <div className="stat-card-header">
                <div className="stat-card-icon blue">📋</div>
              </div>
              <div className="stat-card-value">{totalIncidents}</div>
              <div className="stat-card-label">Total Reported</div>
            </div>
            <div className="stat-card" onClick={() => setActivePage("incidents")} style={{ cursor: "pointer" }}>
              <div className="stat-card-header">
                <div className="stat-card-icon amber">🔔</div>
              </div>
              <div className="stat-card-value">{openCount}</div>
              <div className="stat-card-label">Open</div>
            </div>
            <div className="stat-card" onClick={() => setActivePage("incidents")} style={{ cursor: "pointer" }}>
              <div className="stat-card-header">
                <div className="stat-card-icon blue">👤</div>
              </div>
              <div className="stat-card-value">{assignedCount}</div>
              <div className="stat-card-label">In Progress</div>
            </div>
            <div className="stat-card" onClick={() => setActivePage("incidents")} style={{ cursor: "pointer" }}>
              <div className="stat-card-header">
                <div className="stat-card-icon green">✅</div>
              </div>
              <div className="stat-card-value">{resolvedCount}</div>
              <div className="stat-card-label">Resolved</div>
            </div>
          </div>
        )}

        {/* Report Incident Form */}
        {(activePage === "report" || activePage === "dashboard") && (
          <div className="create-incident-section">
            <h3>➕ Report New Incident</h3>
            <form className="create-form" onSubmit={addIncident}>
              <div className="form-group">
                <label>Title</label>
                <input
                  className="form-input"
                  placeholder="Brief incident title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  className="form-input"
                  placeholder="Describe the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <button className="btn btn-primary" type="submit" style={{ height: "fit-content", alignSelf: "end", width: "auto", padding: "10px 24px" }}>
                Submit
              </button>
            </form>
          </div>
        )}

        {/* Incidents List (Shown on Dashboard or My Incidents) */}
        {(activePage === "incidents" || activePage === "dashboard") && (
          <div className="incidents-section">
            <div className="section-header">
              <h2>Your Incidents</h2>
              <span className="count-badge">{totalIncidents} total</span>
            </div>

            {incidents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>No incidents reported</h3>
                <p>Use the form {activePage === "dashboard" ? "above" : ""} to report a new incident.</p>
                {activePage === "incidents" && (
                  <button className="btn btn-primary" onClick={() => setActivePage("report")} style={{ marginTop: "12px", width: "auto" }}>
                    Report Incident
                  </button>
                )}
              </div>
            ) : (
              incidents.map((inc) => (
                <div className="incident-row" key={inc._id}>
                  <div className="incident-info">
                    <h3>{inc.title}</h3>
                    {inc.description && (
                      <p>{inc.description}</p>
                    )}
                    <div className="incident-meta">
                      <span>
                        🔧{" "}
                        {inc.assignedTo ? inc.assignedTo.name : "Not assigned yet"}
                      </span>
                      <span>
                        📅{" "}
                        {new Date(inc.createdAt).toLocaleDateString()}
                      </span>
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
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}