import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Auth.css";

export default function Layout({ children, role, userName, activePage, setActivePage }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const pageTitle = () => {
    switch (activePage) {
      case "dashboard":   return "Dashboard";
      case "open":        return "Open Incidents";
      case "assigned":    return "Assigned Incidents";
      case "resolved":    return "Resolved Incidents";
      case "engineers":   return "Engineering Team";
      case "incidents":   return "My Incidents";
      case "report":      return "Report Incident";
      default:            return "Dashboard";
    }
  };

  const roleLabel = () => {
    switch (role) {
      case "admin":    return "Administrator";
      case "engineer": return "Engineer";
      case "user":     return "User";
      default:         return role;
    }
  };

  return (
    <div className="dashboard-layout">

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand" onClick={() => navigate("/dashboard")}>
            <div className="sidebar-brand-icon">⚡</div>
            <div className="sidebar-brand-name">Incident<span>IQ</span></div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* ── Overview ── */}
          <div className="sidebar-label">Overview</div>
          <div
            className={`sidebar-link ${activePage === "dashboard" || location.pathname === "/dashboard" ? "active" : ""}`}
            onClick={() => { if (setActivePage) setActivePage("dashboard"); navigate("/dashboard"); }}
          >
            <span className="link-icon">📊</span> Dashboard
          </div>

          {/* ── Admin links ── */}
          {role === "admin" && (
            <>
              <div className="sidebar-label">Incidents</div>
              <div
                className={`sidebar-link ${activePage === "open" ? "active" : ""}`}
                onClick={() => { if (setActivePage) setActivePage("open"); navigate("/dashboard"); }}
              >
                <span className="link-icon">🔔</span> Open
              </div>
              <div
                className={`sidebar-link ${activePage === "assigned" ? "active" : ""}`}
                onClick={() => { if (setActivePage) setActivePage("assigned"); navigate("/dashboard"); }}
              >
                <span className="link-icon">👤</span> Assigned
              </div>
              <div
                className={`sidebar-link ${activePage === "resolved" ? "active" : ""}`}
                onClick={() => { if (setActivePage) setActivePage("resolved"); navigate("/dashboard"); }}
              >
                <span className="link-icon">✅</span> Resolved
              </div>

              <div className="sidebar-label">Team</div>
              <div
                className={`sidebar-link ${activePage === "engineers" ? "active" : ""}`}
                onClick={() => { if (setActivePage) setActivePage("engineers"); navigate("/dashboard"); }}
              >
                <span className="link-icon">👥</span> Engineers
              </div>
            </>
          )}

          {/* ── Engineer links ── */}
          {role === "engineer" && (
            <>
              <div className="sidebar-label">My Tasks</div>
              <div
                className={`sidebar-link ${activePage === "assigned" ? "active" : ""}`}
                onClick={() => { if (setActivePage) setActivePage("assigned"); navigate("/dashboard"); }}
              >
                <span className="link-icon">🔧</span> My Incidents
              </div>
              <div
                className={`sidebar-link ${activePage === "resolved" ? "active" : ""}`}
                onClick={() => { if (setActivePage) setActivePage("resolved"); navigate("/dashboard"); }}
              >
                <span className="link-icon">✅</span> Resolved
              </div>
            </>
          )}

          {/* ── User links ── */}
          {role === "user" && (
            <>
              <div className="sidebar-label">My Incidents</div>
              <div
                className={`sidebar-link ${activePage === "incidents" ? "active" : ""}`}
                onClick={() => { if (setActivePage) setActivePage("incidents"); navigate("/dashboard"); }}
              >
                <span className="link-icon">📋</span> My Reports
              </div>
              <div
                className={`sidebar-link ${activePage === "report" ? "active" : ""}`}
                onClick={() => { if (setActivePage) setActivePage("report"); navigate("/dashboard"); }}
              >
                <span className="link-icon">➕</span> Report Incident
              </div>
            </>
          )}

          {/* ── Account ── */}
          <div className="sidebar-label">Account</div>
          <div className="sidebar-link" onClick={logout}>
            <span className="link-icon">🚪</span> Logout
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{userName || "User"}</div>
              <div className="sidebar-user-role">{roleLabel()}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="main-content">

        {/* Top Navbar */}
        <div className="top-navbar">
          <div className="top-navbar-title">{pageTitle()}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              background: "var(--primary-bg)",
              border: "1px solid rgba(14,165,233,0.18)",
              padding: "5px 14px",
              borderRadius: "999px",
              fontWeight: 600,
              letterSpacing: "0.2px"
            }}>
              {roleLabel()}
            </div>
            <div style={{
              width: "36px", height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #38bdf8, #0284c7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, color: "white", fontSize: "15px",
              boxShadow: "0 2px 8px rgba(14,165,233,0.35)",
              cursor: "pointer"
            }}>
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
}
