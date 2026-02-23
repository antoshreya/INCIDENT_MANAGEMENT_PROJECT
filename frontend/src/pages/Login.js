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
    <div className="auth-container">
      <div className="auth-left">
        <img src="/images/login-illustration.png" className="main-image" alt="login" />
        <h1>Incident Management System</h1>
        <p>Manage incidents efficiently with role-based access.</p>
      </div>

      <div className="auth-right">
        <div className="login-card">
          <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />
            )}

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            {isSignup && (
              <select name="role" onChange={handleChange}>
                <option value="user">User</option>
                <option value="engineer">Engineer</option>
                <option value="admin">Admin</option>
              </select>
            )}

            <button type="submit">
              {isSignup ? "Sign Up" : "Login"}
            </button>
          </form>

          <p>
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <span onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? " Login" : " Signup"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}