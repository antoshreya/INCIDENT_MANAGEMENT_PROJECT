import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignup) {
        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        });

        const data = await res.json();
        alert(data.message);
        setIsSignup(false);

      } else {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password
          })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message);
          return;
        }

        // Store token & role
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        navigate("/dashboard");
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      {/* Left side info */}
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div className="auth-brand">
            <div className="auth-brand-icon">⚡</div>
            <div className="auth-brand-name">
              Incident<span>IQ</span>
            </div>
          </div>
          <h1>Streamline Your Incident Management</h1>
          <p>
            Track, assign, and resolve incidents in real-time with role-based dashboards built for modern teams.
          </p>

          <ul className="auth-features">
            <li>
              <div className="feature-icon">📋</div>
              Create and track incidents with priority levels
            </li>
            <li>
              <div className="feature-icon">👥</div>
              Assign engineers and manage workload
            </li>
            <li>
              <div className="feature-icon">📊</div>
              Real-time status tracking and resolution
            </li>
            <li>
              <div className="feature-icon">🔒</div>
              Role-based access — Admin, Engineer, User
            </li>
          </ul>
        </div>
      </div>

      {/* Right side form */}
      <div className="auth-form-section">
        <div className="auth-card">
          <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
          <p className="auth-subtitle">
            {isSignup ? "Join your team's workspace" : "Sign in to your dashboard"}
          </p>

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  name="name"
                  className="form-input"
                  placeholder="e.g. Jane Doe"
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                className="form-input"
                placeholder="name@company.com"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
            </div>

            {isSignup && (
              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  className="form-select"
                  onChange={handleChange}
                  defaultValue="user"
                >
                  <option value="user">User</option>
                  <option value="engineer">Engineer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn btn-primary">
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div className="auth-toggle">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <span onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Sign In" : "Sign Up"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}