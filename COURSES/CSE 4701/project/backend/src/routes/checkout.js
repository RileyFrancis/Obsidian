// checkout.js
import express from "express";
import db from "../db.js";

const router = express.Router();

// Online store location
const ONLINE_LOCATION_ID = 1;

router.post("/", async (req, res) => {
  const { cart, user, guest, payment } = req.body;

  try {
    //--------------------------------------------------------
    // 0. VALIDATE PAYMENT INPUT
    //--------------------------------------------------------
    if (!payment || !payment.cardNumber || !payment.exp || !payment.cardType) {
      return res.status(400).json({ error: "Payment information required." });
    }

    const last4 = payment.cardNumber.slice(-4); // extract last 4 digits
    const exp = payment.exp;

    //--------------------------------------------------------
    // 1. DETERMINE CUSTOMER
    //--------------------------------------------------------
    let customerID = null;

    // Logged-in user → use attached customerID
    if (user && user.customerID) {
      customerID = user.customerID;
    }

    // Guest checkout → create a Customer row
    if (!customerID && guest) {
      const result = await db.run(
        `INSERT INTO Customer (userID, customerName, email, phone)
         VALUES (NULL, ?, ?, ?)`,
        [guest.name, guest.email, guest.phone]
      );
      customerID = result.lastID;
    }

    //--------------------------------------------------------
    // 2. INSERT PAYMENT INFO
    //--------------------------------------------------------
    let paymentUserID = user ? user.userID : null;

    const paymentResult = await db.run(
      `INSERT INTO PaymentInfo (userID, card_last4, card_type, expiration_date)
       VALUES (?, ?, ?, ?)`,
      [paymentUserID, last4, payment.cardType, exp]
    );

    const paymentID = paymentResult.lastID;

    //--------------------------------------------------------
    // 3. CREATE ORDER
    //--------------------------------------------------------
    const orderResult = await db.run(
      `INSERT INTO Orders (orderDate, orderType, customerID, locationID, paymentID)
       VALUES (DATE('now'), 'online', ?, ?, ?)`,
      [customerID, ONLINE_LOCATION_ID, paymentID]
    );

    const orderID = orderResult.lastID;

    //--------------------------------------------------------
    // 4. INSERT ORDER ITEMS
    //--------------------------------------------------------
    for (const item of cart) {
      await db.run(
        `INSERT INTO OrderItems (orderID, productID, quantity, salePrice)
         VALUES (?, ?, ?, ?)`,
        [orderID, item.productID, item.quantity, item.price]
      );
    }

    //--------------------------------------------------------
    // 5. DONE
    //--------------------------------------------------------
    res.json({
      status: "success",
      orderID,
      paymentID,
      message: "Order placed successfully!",
    });

  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
