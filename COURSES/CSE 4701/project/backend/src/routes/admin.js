import express from "express";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();
const JWT_SECRET = "supersecretkey"; // move to env later

// --------------------------------------------
// MIDDLEWARE: Require admin JWT
// --------------------------------------------
router.use(async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(403).json({ error: "No token provided" });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({ error: "Admin privileges required" });
    }

    req.user = decoded; // save user info
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
});


// ======================================================
// FETCH MANUFACTURERS
// ======================================================
router.get("/manufacturers", async (req, res) => {
  const rows = await db.all(`SELECT * FROM Manufacturer`);
  res.json(rows);
});

// ======================================================
// FETCH CATEGORIES
// ======================================================
router.get("/categories", async (req, res) => {
  const rows = await db.all(`SELECT * FROM Category`);
  res.json(rows);
});

// ======================================================
// CREATE NEW MANUFACTURER
// ======================================================
router.post("/manufacturer", async (req, res) => {
  const { manufacturerName } = req.body;

  if (!manufacturerName) {
    return res.status(400).json({ error: "Manufacturer name required" });
  }

  try {
    const result = await db.run(
      `INSERT INTO Manufacturer (manufacturerName) VALUES (?)`,
      [manufacturerName.trim()]
    );

    res.json({
      status: "success",
      manufacturerID: result.lastID
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================================================
// ADD PRODUCT (support newManufacturer + multiple categories)
// ======================================================
router.post("/add-product", async (req, res) => {
  const {
    name,
    description,
    price,
    manufacturerID,
    newManufacturer,
    categories
  } = req.body;

  try {
    let finalManufacturerID = manufacturerID;

    // If new manufacturer entered, create it
    if (!finalManufacturerID && newManufacturer?.trim()) {
      const result = await db.run(
        `INSERT INTO Manufacturer (manufacturerName) VALUES (?)`,
        [newManufacturer.trim()]
      );
      finalManufacturerID = result.lastID;
    }

    // Insert product
    const productResult = await db.run(
      `INSERT INTO Product (name, description, price, manufacturerID)
       VALUES (?, ?, ?, ?)`,
      [name, description || "", price, finalManufacturerID]
    );

    const productID = productResult.lastID;

    // Insert categories (array)
    for (const cID of categories) {
      await db.run(
        `INSERT INTO ProductCategory (productID, categoryID)
         VALUES (?, ?)`,
        [productID, cID]
      );
    }

    res.json({ status: "success", productID });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================================================
// INVENTORY VIEW
// ======================================================
router.get("/inventory", async (req, res) => {
  const rows = await db.all(`
    SELECT 
      p.productID,
      p.name,
      l.locationID,
      l.locationName,
      COALESCE(i.quantity, 0) AS quantity
    FROM Product p
    JOIN Inventory i ON i.productID = p.productID
    JOIN Location l ON l.locationID = i.locationID
    ORDER BY p.productID, l.locationID;
  `);

  res.json(rows);
});

export default router;
