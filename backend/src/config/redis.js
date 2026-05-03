const { createClient } = require("redis");

const url = process.env.REDIS_URL || "redis://redis:6379";
const pubClient = createClient({ url });
const subClient = createClient({ url });

let connectPromise;
let redisReady = false;

async function connectRedis() {
  if (!connectPromise) {
    connectPromise = Promise.all([pubClient.connect(), subClient.connect()])
      .then(() => {
        redisReady = true;
      })
      .catch((error) => {
        redisReady = false;
        connectPromise = null;
        throw error;
      });
  }

  await connectPromise;
  return { pubClient, subClient };
}

function isRedisReady() {
  return redisReady;
}

module.exports = { pubClient, subClient, connectRedis, isRedisReady };
