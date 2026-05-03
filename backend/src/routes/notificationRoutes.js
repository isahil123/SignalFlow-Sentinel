// Notification API routes.
const express = require("express");
const { notify } = require("../controllers/notificationController");
const router = express.Router();
router.post("/notify", notify);
module.exports = router;
