// Notification business logic service.
const NotificationModel = require("../models/notificationModel");
const { pubClient, connectRedis, isRedisReady } = require("../config/redis");
const NOTIF_CH = "notifications";

async function publishNotify(payload) {
  const notif = await NotificationModel.create(payload);
  try {
    if (!isRedisReady()) {
      await connectRedis();
    }

    await pubClient.publish(
      NOTIF_CH,
      JSON.stringify({ type: "NEW_NOTIFICATION", data: notif }),
    );
  } catch (error) {
    console.warn("Redis publish skipped:", error.message);
  }
  return notif;
}
module.exports = { publishNotify, NOTIF_CH };
