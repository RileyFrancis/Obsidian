import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();
const JWT_SECRET = "supersecretkey"; // TODO: move to .env

//------------------------------------------------------------
// REGISTER
//------------------------------------------------------------
// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!email || !password || !phone) {
    return res.status(400).json({ error: "Email, phone, and password required" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const resultUser = await db.run(
      `INSERT INTO User (email, phone, passwordHash, isAdmin)
       VALUES (?, ?, ?, 0)`,
      [email, phone, hash]
    );

    const userID = resultUser.lastID;

    await db.run(
      `INSERT INTO Customer (userID, customerName, email, phone)
       VALUES (?, ?, ?, ?)`,
      [userID, name, email, phone]
    );

    // 🔥 FIX: include isAdmin in token
    const token = jwt.sign(
      {
        userID,
        isAdmin: false
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      userID,
      name,
      email,
      phone,
      isAdmin: false
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//------------------------------------------------------------
// LOGIN
//------------------------------------------------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const db = await req.dbPromise;
  const user = await db.get(`SELECT * FROM User WHERE email = ?`, [email]);
  if (!user) return res.status(400).json({ error: "Invalid email or password" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ error: "Invalid email or password" });

  const customer = await db.get(
    `SELECT customerID, customerName, email, phone
     FROM Customer WHERE userID = ?`,
    [user.userID]
  );

  // 🔥 FIX: include isAdmin in token
  const token = jwt.sign(
    {
      userID: user.userID,
      isAdmin: user.isAdmin === 1
    },
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
});


export default router;
