require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const client = require("prom-client");

const authRoutes = require("./routes/auth");
const incidentRoutes = require("./routes/incidents");

const app = express();

// -------------------
// Prometheus Setup
// -------------------

// Create a Registry
const register = new client.Registry();

// Collect default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Create custom HTTP request counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
});

register.registerMetric(httpRequestCounter);

// Middleware to count requests
app.use((req, res, next) => {
  httpRequestCounter.inc();
  next();
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// -------------------

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/incidents", incidentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});