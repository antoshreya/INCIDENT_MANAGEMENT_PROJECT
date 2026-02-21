const express = require("express");
const Incident = require("../models/Incident");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const incident = new Incident({
    title: req.body.title,
    description: req.body.description,
    createdBy: req.user.id
  });

  await incident.save();
  res.json(incident);
});

router.get("/", auth, async (req, res) => {
  const incidents = await Incident.find()
    .populate("createdBy", "name")
    .populate("assignedTo", "name");

  res.json(incidents);
});

router.put("/assign/:id", auth, async (req, res) => {
  const { engineerId } = req.body;

  await Incident.findByIdAndUpdate(req.params.id, {
    assignedTo: engineerId,
    status: "Assigned"
  });

  res.json({ message: "Assigned successfully" });
});

router.put("/resolve/:id", auth, async (req, res) => {
  await Incident.findByIdAndUpdate(req.params.id, {
    status: "Resolved"
  });

  res.json({ message: "Resolved successfully" });
});

module.exports = router;