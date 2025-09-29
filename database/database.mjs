import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const DB_FILE = process.env.DB_FILE || "./database/database.sqlite";
const DB_SCHEMA = process.env.DB_SCHEMA || "./database/database.sql";

let db;

export async function initDb() {
  if (!db) {

    if (!fs.existsSync("./database")) fs.mkdirSync("./database");
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, "");
    }

    db = await open({
      filename: DB_FILE,
      driver: sqlite3.Database
    });

    const schema = fs.readFileSync(DB_SCHEMA, "utf-8");
    await db.exec(schema);
  }
  return db;
}
