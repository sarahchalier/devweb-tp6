import express from "express";
import { db } from "../database/database.mjs";

const router = express.Router();

router.get("/", (req, res) => {
  db.all("SELECT short, url, visits, created FROM links", [], (err, rows) => {
    if (err) return res.status(500).send(err.message);

    res.format({
      "application/json": () => res.json(rows),
      "text/html": () => res.render("root", { links: rows }),
      default: () => res.status(406).send("Not Acceptable")
    });
  });
});

router.post("/", (req, res) => {
  const { url } = req.body;
  if (!url || !/^https?:\/\/.+$/.test(url)) return res.status(400).json({ error: "Invalid URL" });
  const short = Math.random().toString(36).substring(2, 8);
  const created = new Date().toISOString();

  db.run(
    "INSERT INTO links(short, url, created, visits) VALUES(?, ?, ?, 0)",
    [short, url, created],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.format({
        "application/json": () => res.json({ short, url, created, visits: 0 }),
        "text/html": () => res.redirect("/api-v2")
      });
    }
  );
});

router.get("/:url", (req, res) => {
  const { url } = req.params;
  db.get("SELECT * FROM links WHERE short = ?", [url], (err, row) => {
    if (err) return res.status(500).send(err.message);
    if (!row) return res.status(404).send("Not Found");

    db.run("UPDATE links SET visits = visits + 1 WHERE short = ?", [url]);

    res.format({
      "application/json": () => res.json(row),
      "text/html": () => res.redirect(row.url)
    });
  });
});

export default router;
