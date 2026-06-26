import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/Auth.css";

export default function UserDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchIncidents = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/incidents`, {
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


  const addIncident = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/incidents`, {
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

  const getFilteredIncidents = () => {
    return incidents.filter((i) => {
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
      role="user"
      userName="User Account" // Replace with actual user info
      activePage={activePage}
      setActivePage={setActivePage}
    >
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
                <option value="Open">Open</option>
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
              <span className="count-badge">{filteredIncidents.length} total</span>
            </div>
          </div>

          {filteredIncidents.length === 0 ? (
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
            filteredIncidents.map((inc) => (
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

                <div className="incident-actions">
                  <button className="btn btn-outline" onClick={() => navigate(`/incident/${inc._id}`)}>
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </Layout>
  );
}