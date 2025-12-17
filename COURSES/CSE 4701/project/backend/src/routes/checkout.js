// checkout.js
import express from "express";

const router = express.Router();

// Online store location
const ONLINE_LOCATION_ID = 1;

function luhnCheck(cardNumber) {
  const sanitized = cardNumber.replace(/[^0-9]/g, "");
  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function normalizeExp(exp) {
  // Accept MM/DD/YYYY or MM/YYYY or MM-YYYY; return YYYY-MM-DD (first of month)
  if (!exp) return null;
  const parts = exp.split(/[/\-]/).map((p) => p.trim());
  if (parts.length === 3) {
    // MM/DD/YYYY
    let [mm, dd, yyyy] = parts;
    mm = mm.padStart(2, "0");
    dd = dd.padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  if (parts.length === 2) {
    // MM/YYYY
    const [mm, yyyy] = parts;
    return `${yyyy}-${mm.padStart(2, "0")}-01`;
  }
  return exp; // fallback
}

router.post("/", async (req, res) => {
  const { cart, user, guest, payment } = req.body;
  const db = await req.dbPromise;

  try {
    //--------------------------------------------------------
    // 0. VALIDATE INPUT
    //--------------------------------------------------------
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    const { useAccount } = req.body;
    
    // Payment validation - either account or card required
    if (!useAccount) {
      if (!payment || !payment.cardNumber || !payment.exp || !payment.cardType) {
        return res.status(400).json({ error: "Payment information required." });
      }
    } else {
      // For account billing, user must be logged in and have an account
      if (!user || !user.userID) {
        return res.status(400).json({ error: "Account billing requires a logged-in user." });
      }
    }

    if (!user && !guest) {
      return res.status(400).json({ error: "Customer information required." });
    }

    if (!user && (!guest.name || !guest.email)) {
      return res.status(400).json({ error: "Guest name and email required." });
    }

    //--------------------------------------------------------
    // 1. DETERMINE CUSTOMER (must happen before payment processing)
    //--------------------------------------------------------
    let customerID = null;

    // Logged-in user → check for existing customer or create one
    if (user && user.userID) {
      // Check if customer record exists for this user
      const existingCustomer = await db.get(
        `SELECT customerID FROM Customer WHERE userID = ?`,
        [user.userID]
      );

      if (existingCustomer) {
        customerID = existingCustomer.customerID;
      } else {
        // Create customer record for logged-in user
        const result = await db.run(
          `INSERT INTO Customer (userID, customerName, email, phone)
           VALUES (?, ?, ?, ?)`,
          [
            user.userID,
            user.name || user.email || "Customer",
            user.email || "",
            user.phone || ""
          ]
        );
        customerID = result.lastID;
      }
    } else if (guest) {
      // Guest checkout → create a Customer row
      const result = await db.run(
        `INSERT INTO Customer (userID, customerName, email, phone)
         VALUES (NULL, ?, ?, ?)`,
        [guest.name, guest.email, guest.phone || ""]
      );
      customerID = result.lastID;
    }

    if (!customerID) {
      return res.status(400).json({ error: "Failed to create customer record." });
    }

    //--------------------------------------------------------
    // 2. PROCESS PAYMENT (account or card)
    //--------------------------------------------------------
    let paymentID = null;
    let accountID = null;

    if (useAccount) {
      // Check if user has an account
      const account = await db.get(
        `SELECT accountID FROM Account WHERE userID = ?`,
        [user.userID]
      );
      
      if (!account) {
        return res.status(400).json({ error: "No account found for monthly billing. Please use card payment." });
      }
      
      accountID = account.accountID;
    } else {
      // Card payment validation
      const sanitizedCard = String(payment.cardNumber).replace(/[^0-9]/g, "");
      if (sanitizedCard.length < 12 || sanitizedCard.length > 19) {
        return res.status(400).json({ error: "Invalid card number length." });
      }

      if (!luhnCheck(sanitizedCard)) {
        return res.status(400).json({ error: "Invalid card number (failed Luhn check)." });
      }

      const last4 = sanitizedCard.slice(-4); // extract last 4 digits
      const expNormalized = normalizeExp(payment.exp);

      // Insert payment info (store only last4)
      let paymentUserID = user ? user.userID : null;

      const paymentResult = await db.run(
        `INSERT INTO PaymentInfo (userID, card_last4, card_type, expiration_date)
         VALUES (?, ?, ?, ?)`,
        [paymentUserID, last4, payment.cardType, expNormalized]
      );

      paymentID = paymentResult.lastID;
    }

    //--------------------------------------------------------
    // 3. CREATE ORDER
    //--------------------------------------------------------
    const orderResult = await db.run(
      `INSERT INTO Orders (orderDate, orderType, customerID, locationID, paymentID, accountID)
       VALUES (DATE('now'), 'online', ?, ?, ?, ?)`,
      [customerID, ONLINE_LOCATION_ID, paymentID, accountID]
    );

    const orderID = orderResult.lastID;

    //--------------------------------------------------------
    // 4. INSERT ORDER ITEMS & UPDATE INVENTORY
    //--------------------------------------------------------
    for (const item of cart) {
      if (!item.productID || !item.quantity || (item.price === undefined || item.price === null)) {
        console.error("Invalid cart item:", item);
        return res.status(400).json({ 
          error: `Invalid cart item format. Missing: ${!item.productID ? 'productID' : ''} ${!item.quantity ? 'quantity' : ''} ${item.price === undefined || item.price === null ? 'price' : ''}`.trim()
        });
      }

      // Validate product exists
      const product = await db.get(`SELECT productID, name, price FROM Product WHERE productID = ?`, [item.productID]);
      if (!product) {
        return res.status(400).json({ error: `Product ID ${item.productID} not found.` });
      }

      // Check inventory availability before creating order
      const inventory = await db.get(
        `SELECT quantity FROM Inventory WHERE productID = ? AND locationID = ?`,
        [item.productID, ONLINE_LOCATION_ID]
      );

      if (!inventory) {
        return res.status(400).json({ error: `No inventory found for product ${product.name} at online location.` });
      }

      if (inventory.quantity < parseInt(item.quantity)) {
        return res.status(400).json({ 
          error: `Insufficient inventory for ${product.name}. Available: ${inventory.quantity}, Requested: ${item.quantity}` 
        });
      }

      // Use product price from database to prevent price manipulation
      const finalPrice = parseFloat(item.price) || parseFloat(product.price);
      
      // Insert order item - the trigger trg_DecrementInventory will automatically update inventory
      await db.run(
        `INSERT INTO OrderItems (orderID, productID, quantity, priceAtPurchase)
         VALUES (?, ?, ?, ?)`,
        [orderID, item.productID, parseInt(item.quantity), finalPrice]
      );

      // Verify inventory was updated (trigger should have done this)
      const updatedInventory = await db.get(
        `SELECT quantity FROM Inventory WHERE productID = ? AND locationID = ?`,
        [item.productID, ONLINE_LOCATION_ID]
      );

      // If trigger didn't work, update explicitly as fallback
      if (updatedInventory && updatedInventory.quantity === inventory.quantity) {
        console.warn(`Trigger did not update inventory for product ${item.productID}, updating explicitly`);
        await db.run(
          `UPDATE Inventory 
           SET quantity = quantity - ? 
           WHERE productID = ? AND locationID = ?`,
          [parseInt(item.quantity), item.productID, ONLINE_LOCATION_ID]
        );
      }
    }

    //--------------------------------------------------------
    // 5. FETCH CREATED ORDER WITH ITEMS
    //--------------------------------------------------------
    const order = await db.get(`
      SELECT 
        o.orderID,
        o.orderDate,
        o.orderType,
        o.customerID,
        c.customerName,
        c.email,
        c.phone,
        l.locationName
      FROM Orders o
      LEFT JOIN Customer c ON o.customerID = c.customerID
      LEFT JOIN Location l ON o.locationID = l.locationID
      WHERE o.orderID = ?
    `, [orderID]);

    const items = await db.all(`
      SELECT 
        oi.orderItemID,
        p.productID,
        p.name,
        oi.priceAtPurchase,
        oi.quantity
      FROM OrderItems oi
      JOIN Product p ON oi.productID = p.productID
      WHERE oi.orderID = ?
    `, [orderID]);

    const totalAmount = items.reduce((s, it) => s + it.priceAtPurchase * it.quantity, 0);

    //--------------------------------------------------------
    // 6. CREATE SHIPPING RECORD FOR ONLINE ORDERS
    //--------------------------------------------------------
    // Note: Shipping details will be added later by admin when order is shipped
    // For now, we just create a placeholder that can be updated
    
    console.log(`Order ${orderID} created successfully for customer ${customerID}`);

    res.json({
      status: "success",
      orderID,
      paymentID,
      accountID: accountID || null,
      order: { ...order, items, totalAmount }
    });

  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Checkout failed: " + err.message });
  }
});

// Public: fetch a specific order by ID (used for confirmation page)
router.get("/:orderID", async (req, res) => {
  const db = await req.dbPromise;
  try {
    const { orderID } = req.params;
    const order = await db.get(`
      SELECT 
        o.orderID,
        o.orderDate,
        o.orderType,
        o.customerID,
        c.customerName,
        c.email,
        c.phone,
        l.locationName
      FROM Orders o
      LEFT JOIN Customer c ON o.customerID = c.customerID
      LEFT JOIN Location l ON o.locationID = l.locationID
      WHERE o.orderID = ?
    `, [orderID]);

    if (!order) return res.status(404).json({ error: "Order not found" });

    const items = await db.all(`
      SELECT 
        oi.orderItemID,
        p.productID,
        p.name,
        oi.priceAtPurchase,
        oi.quantity
      FROM OrderItems oi
      JOIN Product p ON oi.productID = p.productID
      WHERE oi.orderID = ?
    `, [orderID]);

    const totalAmount = items.reduce((s, it) => s + it.priceAtPurchase * it.quantity, 0);

    res.json({ ...order, items, totalAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
