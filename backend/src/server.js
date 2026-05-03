// Server bootstrap for notifications service.
require("dotenv").config();
const TargetModel = require("./models/targetModel");
const http = require("http");
const app = require("./app");
const { initSocket } = require("./services/socketService");

// --- REDIS QUEUE & SNIPER IMPORTS ---
const cron = require("node-cron");
const { scraperQueue } = require("./services/queueService");

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const server = http.createServer(app);
  await initSocket(server);

  server.listen(PORT, () => console.log(`SignalFlow API listening on ${PORT}`));

  // --- THE NEW BULLMQ CRON JOB ---
  // This manages the "Conveyor Belt" of scraping jobs
  cron.schedule("*/5 * * * *", async () => {
    console.log("[Cron] Waking up to load jobs into Redis...");

    try {
      // 1. Fetch all active URLs from MongoDB
      const targets = await TargetModel.getAllActive();
      console.log(`Adding ${targets.length} targets to the Redis queue.`);

      // 2. Dump them onto the conveyor belt (Redis Queue)!
      for (const target of targets) {
        await scraperQueue.add("scrapeJob", target, {
          removeOnComplete: true, // Keep Redis memory clean after success
          attempts: 3, // If a website is down, retry 3 times automatically!
          backoff: {
            type: "exponential",
            delay: 2000, // Wait 2s, then 4s, then 8s to retry
          },
        });
      }

      console.log("[Cron] Successfully queued all jobs.");
    } catch (error) {
      console.error("Cron job error:", error);
    }
  });

  console.log("Background sniper cron job initialized with Redis BullMQ.");
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
