import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function IncidentForm() {
  const navigate = useNavigate();
  const [incident, setIncident] = useState({
    title: "",
    description: "",
    priority: "Low"
  });

  const handleChange = (e) => {
    setIncident({ ...incident, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Incident submitted!");
    navigate("/dashboard");
  };

  return (
    <div className="incident-container">
      <div className="incident-card">
        <h2>Report New Incident</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Incident Title"
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Incident Description"
            rows="4"
            onChange={handleChange}
            required
          />

          <select name="priority" onChange={handleChange}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <button type="submit">Submit Incident</button>
        </form>
      </div>
    </div>
  );
}
