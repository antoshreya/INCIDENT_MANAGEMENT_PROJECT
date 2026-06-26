import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/Auth.css";

export default function IncidentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/incidents`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        const found = data.find(i => i._id === id);
        if (found) {
          setIncident(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncident();
  }, [id, token]);

  if (loading) {
    return (
      <Layout role={role} activePage="dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <h2>Loading incident details...</h2>
        </div>
      </Layout>
    );
  }

  if (!incident) {
    return (
      <Layout role={role} activePage="dashboard">
        <div className="empty-state">
          <div className="empty-state-icon">❌</div>
          <h3>Incident Not Found</h3>
          <p>The incident you are looking for does not exist or you do not have permission to view it.</p>
          <button className="btn btn-primary" onClick={() => navigate("/dashboard")} style={{ marginTop: '16px' }}>Back to Dashboard</button>
        </div>
      </Layout>
    );
  }

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

  // Mock timeline events based on createdAt and updatedAt
  const timelineEvents = [
    {
      id: 1,
      title: "Incident Created",
      description: `Created by ${incident.createdBy?.name || "User"}`,
      date: new Date(incident.createdAt).toLocaleString(),
      icon: "📝"
    }
  ];

  if (incident.assignedTo) {
    timelineEvents.push({
      id: 2,
      title: "Engineer Assigned",
      description: `Assigned to ${incident.assignedTo.name}`,
      date: new Date(incident.updatedAt).toLocaleString(), // Approx time
      icon: "👤"
    });
  }

  if (incident.status === "Resolved") {
    timelineEvents.push({
      id: 3,
      title: "Incident Resolved",
      description: "The issue has been marked as resolved.",
      date: new Date(incident.updatedAt).toLocaleString(),
      icon: "✅"
    });
  }

  return (
    <Layout role={role} activePage="dashboard">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          className="btn btn-outline" 
          onClick={() => navigate("/dashboard")}
          style={{ padding: '6px 12px', fontSize: '0.9rem' }}
        >
          ← Back
        </button>
        <div>
          <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            {incident.title}
            <span className={`badge ${getStatusClass(incident.status)}`} style={{ fontSize: '0.9rem' }}>{incident.status}</span>
            {incident.priority && (
              <span className={`badge ${getPriorityClass(incident.priority)}`} style={{ fontSize: '0.9rem' }}>{incident.priority}</span>
            )}
          </h1>
          <p style={{ marginTop: '4px' }}>Reported on {new Date(incident.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Details */}
        <div className="incidents-section" style={{ padding: '24px', overflow: 'visible' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.2rem' }}>Description</h3>
          <div style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {incident.description || "No description provided."}
          </div>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '16px', fontSize: '1.2rem' }}>Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Reporter</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '12px' }}>
                  {incident.createdBy?.name?.charAt(0) || "U"}
                </div>
                {incident.createdBy?.name || "Unknown User"}
              </div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Assigned Engineer</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {incident.assignedTo ? (
                  <>
                    <div style={{ width: '24px', height: '24px', background: 'var(--status-warning)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '12px' }}>
                      {incident.assignedTo.name.charAt(0)}
                    </div>
                    {incident.assignedTo.name}
                  </>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Not assigned</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="incidents-section" style={{ padding: '24px', overflow: 'visible' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '24px', fontSize: '1.2rem' }}>Activity Timeline</h3>
          
          <div style={{ position: 'relative' }}>
            {/* Vertical Line */}
            <div style={{ position: 'absolute', left: '16px', top: '0', bottom: '0', width: '2px', background: 'var(--border)' }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {timelineEvents.map((event, index) => (
                <div key={event.id} style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--border)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', flexShrink: 0 }}>
                    {event.icon}
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-primary)', margin: '0 0 4px 0', fontSize: '1rem' }}>{event.title}</h4>
                    <p style={{ color: 'var(--text-secondary)', margin: '0 0 4px 0', fontSize: '0.95rem' }}>{event.description}</p>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{event.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
