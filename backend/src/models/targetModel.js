const { connectDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const TargetModel = {
  // 1. Add a new product to watch
  async create({ userId, name, url, selector }) {
    const db = await connectDB();
    const result = await db.collection("targets").insertOne({
      userId,
      name, // e.g., "Air Jordan 1"
      url, // e.g., "https://store.com/shoes"
      selector, // e.g., ".add-to-cart-btn"
      isActive: true,
      createdAt: new Date(),
    });

    return {
      id: result.insertedId.toString(),
      userId,
      name,
      url,
      selector,
    };
  },

  // 2. Get all active targets for the background sniper
  async getAllActive() {
    const db = await connectDB();
    return await db.collection("targets").find({ isActive: true }).toArray();
  },

  // 3. Optional: Delete a target after they buy it
  async remove(targetId) {
    const db = await connectDB();
    await db.collection("targets").deleteOne({ _id: new ObjectId(targetId) });
  },
};

module.exports = TargetModel;
