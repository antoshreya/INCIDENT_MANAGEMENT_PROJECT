import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/Auth.css";

export default function EngineerDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    let baseList = incidents;
    if (activePage === "assigned") baseList = activeIncidents;
    if (activePage === "resolved") baseList = resolvedIncidents;

    return baseList.filter((i) => {
      const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (i.description && i.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "All" || i.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || i.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  };

  const filteredIncidents = getFilteredIncidents();

  return (
    <Layout
      role="engineer"
      userName="Engineer" // Use actual user info if available
      activePage={activePage}
      setActivePage={setActivePage}
    >
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
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search..."
              className="form-input"
              style={{ padding: '6px 12px', fontSize: '0.9rem', width: '200px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="form-select"
              style={{ padding: '6px 30px 6px 12px', fontSize: '0.9rem', width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Assigned">Assigned</option>
              <option value="Resolved">Resolved</option>
            </select>
            <select
              className="form-select"
              style={{ padding: '6px 30px 6px 12px', fontSize: '0.9rem', width: 'auto' }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <span className="count-badge">{filteredIncidents.length} incidents</span>
          </div>
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
                <button className="btn btn-outline" onClick={() => navigate(`/incident/${inc._id}`)}>
                  View
                </button>
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
    </Layout>
  );
}