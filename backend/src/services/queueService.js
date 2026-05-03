const { Queue, Worker } = require("bullmq");
const IORedis = require("ioredis");
const { checkStock } = require("./scraperService");

// 1. Connect to Redis (Upstash or Local)
const connection = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  {
    maxRetriesPerRequest: null, // This is REQUIRED by BullMQ
  },
);
// 2. Create the Conveyor Belt (The Queue)
const scraperQueue = new Queue("scraperQueue", { connection });

// 3. Create the Factory Worker
// This worker sits in the background, grabs jobs off the belt, and processes them.
const worker = new Worker(
  "scraperQueue",
  async (job) => {
    const target = job.data;
    console.log(`[Queue Worker] Processing job for: ${target.name}...`);

    // Run the actual scraper
    await checkStock(target.url, target.selector, target.userId, target.name);
  },
  {
    connection,
    concurrency: 2, // It can scrape 2 websites at the exact same time!
  },
);

worker.on("completed", (job) => {
  console.log(`[Queue] Job ${job.id} completed successfully.`);
});

worker.on("failed", (job, err) => {
  console.error(`[Queue] Job ${job.id} failed with error: ${err.message}`);
});

module.exports = { scraperQueue };
