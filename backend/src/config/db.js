const { MongoClient } = require("mongodb");

let _db;

async function connectDB() {
  if (_db) return _db;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI not set. Example: mongodb+srv://user:pass@cluster0.xxxxxx.mongodb.net/signalflow?retryWrites=true&w=majority",
    );
  }

  const client = new MongoClient(uri);

  await client.connect();
  _db = client.db("signalflow");
  console.log("Connected to MongoDB");
  return _db;
}

module.exports = { connectDB };
