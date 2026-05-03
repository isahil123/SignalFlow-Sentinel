const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const notificationRoutes = require("./routes/notificationRoutes");
const targetRoutes = require("./routes/targetRoutes");

// --- IMPORT THE SCRAPER ---
const { checkStock } = require("./services/scraperService");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", notificationRoutes);
app.use("/api/targets", targetRoutes);

// --- NEW ROUTE: MANUAL SNIPER TEST ---
// Use this to test the scraper instantly via Postman/Frontend
// without waiting for the 5-minute cron timer.
app.post("/api/sniper/test", async (req, res) => {
  try {
    const { targetUrl, selector, userId } = req.body;

    if (!targetUrl || !selector || !userId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    console.log(`Manual trigger: Checking ${targetUrl}...`);
    const inStock = await checkStock(targetUrl, selector, userId);

    res.json({
      success: true,
      message: inStock
        ? "Item is in stock! Notification sent."
        : "Still out of stock.",
      inStock,
    });
  } catch (err) {
    console.error("Sniper route error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check route
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

module.exports = app;
