const axios = require("axios");
const cheerio = require("cheerio");
const { publishNotify } = require("./notificationService");
const { sendEmailAlert } = require("./emailService");
const { pubClient } = require("../config/redis"); // Your Redis connection!

// Added 'itemName' here with a default value of "Item" just in case!
async function checkStock(targetUrl, selector, userId, itemName = "Item") {
  try {
    // --- REDIS CACHING (THE BOUNCER) ---
    // Ask Redis: "Did we already scrape this exact URL recently?"
    const cacheKey = `cache:${targetUrl}`;
    const cachedData = await pubClient.get(cacheKey);

    if (cachedData) {
      console.log(
        `[Cache Hit] Skipping scrape. We already checked ${itemName} recently!`,
      );
      return false; // Skip the heavy HTTP request!
    }
    // ------------------------------------

    // 1. Disguise our Node server as a real web browser
    const { data } = await axios.get(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    // 2. Load the HTML into Cheerio so we can search it
    const $ = cheerio.load(data);

    // 3. Look for the "Add to Cart" or "Buy" button based on the selector
    const buttonText = $(selector).text().trim().toLowerCase();

    // --- SAVE TO CACHE ---
    // We just did the hard work. Save it to Redis so we don't do it again for 60 seconds.
    await pubClient.set(cacheKey, "checked", { EX: 60 });
    // ---------------------

    // 4. The Trigger Logic
    if (buttonText && !buttonText.includes("out of stock")) {
      console.log(`[ALARM] Item in stock at ${targetUrl}!`);

      // 5. Send the web/socket notification
      await publishNotify({
        userId: userId,
        title: "🔥 IT'S IN STOCK!",
        message: `Quick! Buy it here: ${targetUrl}`,
      });

      // 6. SEND THE EMAIL!
      await sendEmailAlert(targetUrl, itemName);

      return true; // Found it!
    } else {
      console.log(`[Log] Checked ${targetUrl} - Still out of stock.`);
      return false;
    }
  } catch (error) {
    console.error(`Error scraping ${targetUrl}:`, error.message);
  }
}

module.exports = { checkStock };
