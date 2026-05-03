const express = require("express");
const TargetModel = require("../models/targetModel");
const router = express.Router();

// POST: Add a new URL for the sniper to watch
router.post("/add", async (req, res) => {
  try {
    const { userId, name, url, selector } = req.body;

    if (!userId || !name || !url || !selector) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const newTarget = await TargetModel.create({ userId, name, url, selector });
    res.status(201).json({ success: true, target: newTarget });
  } catch (error) {
    console.error("Error saving target:", error);
    res.status(500).json({ error: "Failed to save target." });
  }
});

// GET: View all active targets (good for debugging)
router.get("/list", async (req, res) => {
  try {
    const targets = await TargetModel.getAllActive();
    res.json({ success: true, count: targets.length, targets });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch targets." });
  }
});

module.exports = router;
