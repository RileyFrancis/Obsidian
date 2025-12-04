// backend/src/server.js

console.log("SERVER CWD:", process.cwd());


import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Must create `app` BEFORE using it
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ----------------------------------------
//  OPEN SQLITE DATABASE (shared instance)
// ----------------------------------------
const dbPromise = open({
  filename: "./db/database.sqlite",   // Adjusted to match your folder structure
  driver: sqlite3.Database
});

// Enable FKs immediately after opening
dbPromise.then(db => {
  db.exec("PRAGMA foreign_keys = ON;");
  console.log("SQLite DB connected from server.js");
});

// ----------------------------------------
//  ROUTES
// ----------------------------------------

// Simple route: get all products
app.get("/api/products", async (req, res) => {
  const db = await dbPromise;

  const products = await db.all(`
    SELECT 
      p.productID,
      p.name,
      p.description,
      p.price,
      COALESCE(i.quantity, 0) AS quantity
    FROM Product p
    LEFT JOIN Inventory i
      ON i.productID = p.productID
     AND i.locationID = 2  -- online store location
  `);

  res.json(products);
});

// Get single product
app.get("/api/products/:id", async (req, res) => {
  const db = await dbPromise;

  const product = await db.get(`
    SELECT 
      p.*,
      COALESCE(i.quantity, 0) AS quantity
    FROM Product p
    LEFT JOIN Inventory i
      ON i.productID = p.productID
     AND i.locationID = 2
    WHERE p.productID = ?
  `, [req.params.id]);

  res.json(product);
});

// ----------------------------------------
//   CHECKOUT ENDPOINT
// ----------------------------------------
app.post("/api/checkout", async (req, res) => {
  const db = await dbPromise;
  const cart = req.body.cart;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  try {
    // Create order (online)
    const result = await db.run(`
      INSERT INTO Orders (orderDate, orderType)
      VALUES (DATE('now'), 'online')
    `);

    const orderID = result.lastID;

    // Insert each cart item
    for (const item of cart) {
      await db.run(`
        INSERT INTO OrderItems (orderID, productID, quantity, salePrice)
        VALUES (?, ?, ?, ?)
      `, [orderID, item.productID, item.quantity, item.price]);
    }

    res.json({ status: "success", orderID });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------
//  START SERVER
// ----------------------------------------
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
