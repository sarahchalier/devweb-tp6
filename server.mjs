import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";
import favicon from "serve-favicon";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

import apiV1Router from "./router/api-v1.mjs";
import apiV2Router from "./router/api-v2.mjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();


const faviconPath = path.join(__dirname, "static", "logo_univ_16.png");
if (fs.existsSync(faviconPath)) {
  app.use(favicon(faviconPath));
} else {
  console.warn(` Favicon not found at ${faviconPath}`);
}

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Bienvenue sur le raccourcisseur d'URL !");
});

app.use("/static", express.static(path.join(__dirname, "static")));


app.use((req, res, next) => {
  res.setHeader("X-API-Version", "1.0.0");
  next();
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use("/api-v1", apiV1Router);
app.use("/api-v2", apiV2Router);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(` Serveur lancé sur http://localhost:${PORT}/api-v2`);
});
