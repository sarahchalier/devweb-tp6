import express from "express";
const router = express.Router();

let links = {};
let count = 0;

router.get("/", (req, res) => res.json({ count }));

router.post("/", (req, res) => {
  const { url } = req.body;
  if (!url || !/^https?:\/\/.+$/.test(url)) return res.status(400).json({ error: "Invalid URL" });
  const short = Math.random().toString(36).substring(2, 8);
  links[short] = { url, created: new Date(), visits: 0 };
  count++;
  res.json({ short, url });
});

router.get("/status/:url", (req, res) => {
  const { url } = req.params;
  if (!links[url]) return res.status(404).json({ error: "Not Found" });
  const { created, visits } = links[url];
  res.json({ url: links[url].url, created, visits });
});

router.get("/:url", (req, res) => {
  const { url } = req.params;
  if (!links[url]) return res.status(404).json({ error: "Not Found" });
  links[url].visits++;
  res.redirect(links[url].url);
});

router.get("/error", (req, res) => {
  throw new Error("Erreur volontaire");
});

export default router;

