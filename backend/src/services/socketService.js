// Socket service for realtime notifications.
const { createAdapter } = require("@socket.io/redis-adapter");
const {
  pubClient,
  subClient,
  connectRedis,
  isRedisReady,
} = require("../config/redis");
const { NOTIF_CH } = require("./notificationService");

async function initSocket(httpServer) {
  const io = require("socket.io")(httpServer, { cors: { origin: "*" } });

  try {
    if (!isRedisReady()) {
      await connectRedis();
    }

    const adapterPubClient = pubClient.duplicate();
    const adapterSubClient = subClient.duplicate();

    await Promise.all([adapterPubClient.connect(), adapterSubClient.connect()]);
    io.adapter(createAdapter(adapterPubClient, adapterSubClient));

    // Listen to Redis channel and forward to proper room
    subClient.subscribe(NOTIF_CH, (raw) => {
      const { type, data } = JSON.parse(raw);
      if (type === "NEW_NOTIFICATION")
        io.to(`user:${data.userId}`).emit("notification", data);
    });
  } catch (error) {
    console.warn(
      "Redis unavailable, starting Socket.IO without adapter:",
      error.message,
    );
  }

  io.on("connection", (socket) => {
    const { userId } = socket.handshake.query;
    if (userId) socket.join(`user:${userId}`);
  });

  return io;
}
module.exports = { initSocket };
