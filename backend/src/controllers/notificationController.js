// Notification controller handlers.
const { publishNotify } = require("../services/notificationService");

exports.notify = async (req, res, next) => {
  try {
    const { userId, title, message } = req.body;
    if (!userId || !title || !message)
      return res.status(400).json({ error: "Missing fields" });
    const notif = await publishNotify({ userId, title, message });
    res.status(201).json({ notification: notif });
  } catch (e) {
    next(e);
  }
};
