import express from "express";
import { initDb } from "../database/database.mjs";
import crypto from "crypto";

const router = express.Router();

router.get("/", async (req, res) => {
  const db = await initDb();
  const links = await db.all("SELECT * FROM links");

  res.format({
    "application/json": () => res.json({ links }),
    "text/html": () => res.render("root", { links }),
    default: () => res.status(406).send("Not Acceptable")
  });
});

router.post("/", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  const db = await initDb();
  const short = crypto.randomBytes(3).toString("hex");
  const secret = crypto.randomBytes(6).toString("hex");

  await db.run("INSERT INTO links (url, short, secret) VALUES (?, ?, ?)", url, short, secret);

  res.format({
    "application/json": () => res.json({ url, short, secret }),
    "text/html": async () => {
      const links = await db.all("SELECT * FROM links");
      res.render("root", { links });
    },
    default: () => res.status(406).send("Not Acceptable")
  });
});

router.get("/:short", async (req, res) => {
  const db = await initDb();
  const { short } = req.params;
  const link = await db.get("SELECT * FROM links WHERE short = ?", short);
  if (!link) return res.status(404).json({ error: "Link not found" });

  if (req.accepts("json") && !req.accepts("html")) {
    return res.json(link);
  }

  await db.run("UPDATE links SET visits = visits + 1 WHERE id = ?", link.id);
  res.redirect(link.url);
});

router.delete("/:short", async (req, res) => {
  const db = await initDb();
  const { short } = req.params;
  const key = req.header("X-API-Key");

  if (!key) return res.status(401).json({ error: "Missing X-API-Key" });

  const link = await db.get("SELECT * FROM links WHERE short = ?", short);
  if (!link) return res.status(404).json({ error: "Link not found" });

  if (link.secret !== key) return res.status(403).json({ error: "Forbidden" });

  await db.run("DELETE FROM links WHERE id = ?", link.id);
  res.status(200).json({ success: true });
});

export default router;
