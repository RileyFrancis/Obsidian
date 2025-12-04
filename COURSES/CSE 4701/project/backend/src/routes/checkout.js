import express from "express";
const router = express.Router();
import db from "../db.js";

router.post("/", (req, res) => {
  const { cart } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const orderDate = new Date().toISOString().split("T")[0];
  const orderType = "online";   // fixed for now
  const customerID = null;      // anonymous checkout
  const accountID = null;
  const paymentID = null;

  try {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      // 1. Insert into Orders
      const insertOrderSQL = `
        INSERT INTO Orders (customerID, orderDate, orderType, locationID, accountID, paymentID)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      // online orders may not be tied to a store location
      db.run(
        insertOrderSQL,
        [customerID, orderDate, orderType, null, accountID, paymentID],
        function (err) {
          if (err) {
            db.run("ROLLBACK");
            return res.status(500).json({ error: "Order creation failed", details: err.message });
          }

          const orderID = this.lastID;

          // 2. Insert line items
          const insertItemSQL = `
            INSERT INTO OrderItems (orderID, productID, quantity, salePrice)
            VALUES (?, ?, ?, ?)
          `;

          const stmt = db.prepare(insertItemSQL);

          for (const item of cart) {
            stmt.run(orderID, item.productID, item.quantity, item.price);
            // Inventory will auto-update and reorder triggers will fire
          }

          stmt.finalize();

          db.run("COMMIT", (err) => {
            if (err) {
              return res.status(500).json({ error: "Failed to finalize order" });
            }
            res.json({
              message: "Order placed successfully",
              orderID,
            });
          });
        }
      );
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
