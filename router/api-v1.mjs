import express from "express";
import { initDb } from "../database/database.mjs";
import crypto from "crypto";

const router = express.Router();

router.get("/", async (req, res) => {
  const db = await initDb();
  const result = await db.get("SELECT COUNT(*) as count FROM links");
  res.json({ count: result.count });
});

router.post("/", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  const db = await initDb();
  const short = crypto.randomBytes(3).toString("hex");
  const secret = crypto.randomBytes(6).toString("hex");

  await db.run(
    "INSERT INTO links (url, short, secret) VALUES (?, ?, ?)",
    url,
    short,
    secret
  );

  res.json({ url, short, secret });
});

export default router;
