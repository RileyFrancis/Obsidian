import sqlite3 from "sqlite3";
import { open } from "sqlite";

sqlite3.verbose();

const db = await open({
  filename: "./db/database.sqlite",   // ← FIXED for your project layout
  driver: sqlite3.Database,
});

// Enforce FK constraints
await db.exec("PRAGMA foreign_keys = ON;");

console.log("Connected to SQLite at ../../db/database.sqlite");

export default db;
