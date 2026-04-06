const express = require("express");
const redis = require("redis");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const client = redis.createClient({ url: "redis://localhost:6379" });
client.on("error", (err) => console.error("Redis error:", err));
client.connect();

const database = {
  1: { id: 1, name: "Alice", email: "alice@example.com" },
  2: { id: 2, name: "Bob", email: "bob@example.com" },
  3: { id: 3, name: "Charlie", email: "charlie@example.com" },
};

let TTL = 15;

// GET /user/:id
app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `user:${id}`;
  try {
    const cached = await client.get(cacheKey);
    if (cached) {
      console.log(`✅ CACHE HIT  — key: ${cacheKey}`);
      return res.json({ source: "cache", data: JSON.parse(cached) });
    }
    console.log(`❌ CACHE MISS — key: ${cacheKey}`);
    await new Promise((r) => setTimeout(r, 300));
    const user = database[id];
    if (!user) return res.status(404).json({ error: "User олдсонгүй" });
    await client.setEx(cacheKey, TTL, JSON.stringify(user));
    console.log(`💾 Cache-д хадгалав — key: ${cacheKey}, TTL: ${TTL}s`);
    return res.json({ source: "database", data: user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /user/:id
app.put("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!database[id]) return res.status(404).json({ error: "User олдсонгүй" });
  database[id].name = name;
  await client.del(`user:${id}`);
  console.log(`🗑️  Cache устгав — user:${id}`);
  res.json({ message: "Update амжилттай", data: database[id] });
});

// GET /cache/:id
app.get("/cache/:id", async (req, res) => {
  const cacheKey = `user:${req.params.id}`;
  const cached = await client.get(cacheKey);
  const ttl = await client.ttl(cacheKey);
  if (cached) return res.json({ exists: true, key: cacheKey, ttl_remaining: ttl, data: JSON.parse(cached) });
  res.json({ exists: false, key: cacheKey });
});

// GET /ttl — одоогийн TTL авах
app.get("/ttl", (req, res) => res.json({ ttl: TTL }));

// PUT /ttl — TTL өөрчлөх
app.put("/ttl", async (req, res) => {
  const { value } = req.body;
  if (!value || value < 1) return res.status(400).json({ error: "TTL буруу утга" });
  TTL = value;
  console.log(`⏱️  TTL өөрчлөгдлөө: ${TTL}s`);
  res.json({ message: `TTL → ${TTL}s`, ttl: TTL });
});

app.listen(3000, () => {
  console.log("🚀 Server: http://localhost:3000");
});
