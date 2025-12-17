// backend/src/routes/auth.js

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// --------------------------------------------
// REGISTER
// --------------------------------------------
router.post("/register", async (req, res) => {
  const db = await req.dbPromise;
  const { name, email, password, phone } = req.body;

  if (!email || !password || !phone) {
    return res.status(400).json({ error: "Email, phone, and password required" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const result = await db.run(
      `INSERT INTO User (email, phone, passwordHash, isAdmin)
       VALUES (?, ?, ?, 0)`,
      [email, phone, hash]
    );

    const userID = result.lastID;

    await db.run(
      `INSERT INTO Customer (userID, customerName, email, phone)
       VALUES (?, ?, ?, ?)`,
      [userID, name, email, phone]
    );

    const token = jwt.sign(
      { userID, isAdmin: false },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, userID, name, email, phone, isAdmin: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// LOGIN
// ----------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    const db = await req.dbPromise;
    const { email, password } = req.body;

    console.log("Login attempt for email:", email);

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await db.get(`SELECT * FROM User WHERE email = ?`, [email]);
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      console.log("Invalid password for email:", email);
      return res.status(400).json({ error: "Invalid email or password" });
    }
    
    console.log("Login successful for user:", user.userID, "isAdmin:", user.isAdmin);

    const customer = await db.get(
      `SELECT customerID, customerName, email, phone
       FROM Customer WHERE userID = ?`,
      [user.userID]
    );

    const token = jwt.sign(
      { userID: user.userID, isAdmin: user.isAdmin === 1 },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      userID: user.userID,
      isAdmin: user.isAdmin === 1,
      customerID: customer?.customerID || null,
      name: customer?.customerName || user.email,
      email: user.email,
      phone: customer?.phone || user.phone
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// GET CURRENT USER (ME)
// ----------------------------------------------------
router.get("/me", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const db = await req.dbPromise;
    const user = await db.get(`SELECT * FROM User WHERE userID = ?`, [decoded.userID]);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const customer = await db.get(
      `SELECT customerID, customerName, email, phone
       FROM Customer WHERE userID = ?`,
      [user.userID]
    );

    res.json({
      userID: user.userID,
      isAdmin: user.isAdmin === 1,
      customerID: customer?.customerID || null,
      name: customer?.customerName || user.email,
      email: user.email,
      phone: customer?.phone || user.phone
    });
  } catch (err) {
    console.error("Get me error:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default router;
