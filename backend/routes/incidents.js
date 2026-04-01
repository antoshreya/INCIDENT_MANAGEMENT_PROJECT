const express = require("express");
const router = express.Router();
const Incident = require("../models/Incident");
const auth = require("../middleware/authMiddleware");

/* ============================= */
/* CREATE INCIDENT (User Only)  */
/* ============================= */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "user")
      return res.status(403).json({ message: "Only users can create incidents" });

    const { title, description, priority } = req.body;

    const incident = new Incident({
      title,
      description,
      priority,
      createdBy: req.user.id,
    });

    await incident.save();

    res.status(201).json(incident);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===================================== */
/* GET INCIDENTS (Role-Based Filtering) */
/* ===================================== */
router.get("/", auth, async (req, res) => {
  try {
    let incidents;

    if (req.user.role === "admin") {
      incidents = await Incident.find()
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");

    } else if (req.user.role === "engineer") {
      incidents = await Incident.find({
        assignedTo: req.user.id,
      })
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");

    } else {
      incidents = await Incident.find({
        createdBy: req.user.id,
      })
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");
    }

    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================= */
/* ASSIGN INCIDENT (Admin Only) */
/* ============================= */
router.put("/assign/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const { engineerId } = req.body;

    const incident = await Incident.findById(req.params.id);
    if (!incident)
      return res.status(404).json({ message: "Incident not found" });

    incident.assignedTo = engineerId;
    incident.status = "Assigned";

    await incident.save();

    res.json({ message: "Incident assigned successfully", incident });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================= */
/* RESOLVE INCIDENT (Engineer)  */
/* ============================= */
router.put("/resolve/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "engineer")
      return res.status(403).json({ message: "Access denied" });

    const incident = await Incident.findById(req.params.id);
    if (!incident)
      return res.status(404).json({ message: "Incident not found" });

    if (incident.assignedTo.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your assigned incident" });

    incident.status = "Resolved";
    await incident.save();

    res.json({ message: "Incident resolved successfully", incident });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================= */
/* DELETE INCIDENT (Admin Only) */
/* ============================= */
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const incident = await Incident.findById(req.params.id);
    if (!incident)
      return res.status(404).json({ message: "Incident not found" });

    await incident.deleteOne();

    res.json({ message: "Incident deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;