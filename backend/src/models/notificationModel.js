const { connectDB } = require("../config/db");

const NotificationModel = {
  async create({ userId, title, message }) {
    const db = await connectDB();
    const result = await db.collection("notifications").insertOne({
      userId,
      title,
      message,
      isRead: false,
      createdAt: new Date(),
    });

    return {
      id: result.insertedId.toString(),
      userId,
      title,
      message,
      isRead: false,
    };
  },

  async unreadCount(userId) {
    const db = await connectDB();
    return await db.collection("notifications").countDocuments({
      userId,
      isRead: false,
    });
  },

  async markRead(userId) {
    const db = await connectDB();
    await db
      .collection("notifications")
      .updateMany({ userId, isRead: false }, { $set: { isRead: true } });
  },
};

module.exports = NotificationModel;
