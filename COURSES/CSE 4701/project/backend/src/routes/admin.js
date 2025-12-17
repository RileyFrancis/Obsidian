// backend/src/routes/admin.js

import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware: admin only
router.use(async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(403).json({ error: "No token provided" });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({ error: "Admin privileges required" });
    }

    req.user = decoded;
    // Get database from promise
    req.db = await req.dbPromise;
    next();
  } catch (err) {
    console.error("Admin auth error:", err);
    res.status(403).json({ error: "Invalid token" });
  }
});

// ==================== DASHBOARD ====================
router.get("/stats/dashboard", async (req, res) => {
  const db = req.db;
  try {
    // Get total products
    const totalProductsResult = await db.get(`SELECT COUNT(*) as count FROM Product`);
    const totalProducts = totalProductsResult?.count || 0;

    // Get total orders
    const totalOrdersResult = await db.get(`SELECT COUNT(*) as count FROM Orders`);
    const totalOrders = totalOrdersResult?.count || 0;

    // Get total users
    const totalUsersResult = await db.get(`SELECT COUNT(*) as count FROM User`);
    const totalUsers = totalUsersResult?.count || 0;

    // Get low stock items
    const lowStockResult = await db.get(`
      SELECT COUNT(*) as count 
      FROM Inventory 
      WHERE quantity < 5
    `);
    const lowStockItems = lowStockResult?.count || 0;

    // Calculate total revenue (sum of all order items)
    const revenueResult = await db.get(`
      SELECT COALESCE(SUM(oi.quantity * oi.priceAtPurchase), 0) as totalRevenue
      FROM OrderItems oi
    `);
    const totalRevenue = revenueResult?.totalRevenue || 0;

    // Get recent orders (last 10)
    const recentOrders = await db.all(`
      SELECT 
        o.orderID,
        o.orderDate,
        o.orderType,
        c.customerName,
        COUNT(oi.orderItemID) as itemCount,
        SUM(oi.quantity * oi.priceAtPurchase) as amount
      FROM Orders o
      LEFT JOIN Customer c ON o.customerID = c.customerID
      LEFT JOIN OrderItems oi ON o.orderID = oi.orderID
      GROUP BY o.orderID
      ORDER BY o.orderDate DESC, o.orderID DESC
      LIMIT 10
    `);

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      lowStockItems,
      recentOrders: recentOrders || [],
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== MANUFACTURERS ====================
router.get("/manufacturers", async (req, res) => {
  const db = req.db;
  try {
    const rows = await db.all(`SELECT * FROM Manufacturer ORDER BY manufacturerName`);
    res.json(rows);
  } catch (err) {
    console.error("Fetch manufacturers error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/manufacturer", async (req, res) => {
  const db = req.db;
  const { manufacturerName } = req.body;

  if (!manufacturerName) {
    return res.status(400).json({ error: "Manufacturer name required" });
  }

  try {
    const result = await db.run(
      `INSERT INTO Manufacturer (manufacturerName) VALUES (?)`,
      [manufacturerName]
    );
    res.json({ 
      status: "success", 
      manufacturerID: result.lastID,
      message: "Manufacturer added successfully"
    });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint")) {
      return res.status(400).json({ error: "Manufacturer already exists" });
    }
    console.error("Add manufacturer error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== CATEGORIES ====================
router.get("/categories", async (req, res) => {
  const db = req.db;
  try {
    const rows = await db.all(`SELECT * FROM Category ORDER BY categoryName`);
    res.json(rows);
  } catch (err) {
    console.error("Fetch categories error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== PRODUCTS ====================
router.get("/products", async (req, res) => {
  const db = req.db;
  try {
    const products = await db.all(`
      SELECT 
        p.productID,
        p.name,
        p.description,
        p.price,
        p.manufacturerID,
        m.manufacturerName,
        GROUP_CONCAT(c.categoryID) as categoryIDs,
        GROUP_CONCAT(c.categoryName) as categoryNames
      FROM Product p
      LEFT JOIN Manufacturer m ON p.manufacturerID = m.manufacturerID
      LEFT JOIN ProductCategory pc ON p.productID = pc.productID
      LEFT JOIN Category c ON pc.categoryID = c.categoryID
      GROUP BY p.productID
      ORDER BY p.productID
    `);

    // Format products with categories array
    const formatted = products.map(p => ({
      ...p,
      categories: p.categoryIDs 
        ? p.categoryIDs.split(',').map((id, idx) => ({
            categoryID: parseInt(id),
            categoryName: p.categoryNames.split(',')[idx]
          }))
        : []
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/products/:id", async (req, res) => {
  const db = req.db;
  const { id } = req.params;

  try {
    const product = await db.get(`
      SELECT 
        p.*,
        m.manufacturerName
      FROM Product p
      LEFT JOIN Manufacturer m ON p.manufacturerID = m.manufacturerID
      WHERE p.productID = ?
    `, [id]);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Get categories
    const categories = await db.all(`
      SELECT c.categoryID, c.categoryName
      FROM ProductCategory pc
      JOIN Category c ON pc.categoryID = c.categoryID
      WHERE pc.productID = ?
    `, [id]);

    res.json({ ...product, categories });
  } catch (err) {
    console.error("Fetch product error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/add-product", async (req, res) => {
  const db = req.db;
  const { name, description, price, manufacturerID, newManufacturer, categories } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and price required" });
  }

  try {
    let finalManufacturerID = manufacturerID;

    // Create new manufacturer if provided
    if (newManufacturer && !manufacturerID) {
      const mfgResult = await db.run(
        `INSERT INTO Manufacturer (manufacturerName) VALUES (?)`,
        [newManufacturer]
      );
      finalManufacturerID = mfgResult.lastID;
    }

    if (!finalManufacturerID) {
      return res.status(400).json({ error: "Manufacturer required" });
    }

    // Insert product
    const productResult = await db.run(
      `INSERT INTO Product (name, description, price, manufacturerID)
       VALUES (?, ?, ?, ?)`,
      [name, description || null, price, finalManufacturerID]
    );

    const productID = productResult.lastID;

    // Add categories
    if (categories && Array.isArray(categories) && categories.length > 0) {
      for (const categoryID of categories) {
        await db.run(
          `INSERT INTO ProductCategory (productID, categoryID) VALUES (?, ?)`,
          [productID, categoryID]
        );
      }
    }

    res.json({ 
      status: "success", 
      productID,
      message: "Product added successfully"
    });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/products/:id", async (req, res) => {
  const db = req.db;
  const { id } = req.params;
  const { name, description, price, manufacturerID, newManufacturer, categories } = req.body;

  try {
    let finalManufacturerID = manufacturerID;

    // Create new manufacturer if provided
    if (newManufacturer && !manufacturerID) {
      const mfgResult = await db.run(
        `INSERT INTO Manufacturer (manufacturerName) VALUES (?)`,
        [newManufacturer]
      );
      finalManufacturerID = mfgResult.lastID;
    }

    // Update product
    await db.run(
      `UPDATE Product 
       SET name = ?, description = ?, price = ?, manufacturerID = ?
       WHERE productID = ?`,
      [name, description || null, price, finalManufacturerID, id]
    );

    // Update categories - remove old, add new
    await db.run(`DELETE FROM ProductCategory WHERE productID = ?`, [id]);

    if (categories && Array.isArray(categories) && categories.length > 0) {
      for (const categoryID of categories) {
        await db.run(
          `INSERT INTO ProductCategory (productID, categoryID) VALUES (?, ?)`,
          [id, categoryID]
        );
      }
    }

    res.json({ 
      status: "success",
      message: "Product updated successfully"
    });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/products/:id", async (req, res) => {
  const db = req.db;
  const { id } = req.params;

  try {
    // Delete product categories first (foreign key constraint)
    await db.run(`DELETE FROM ProductCategory WHERE productID = ?`, [id]);
    
    // Delete product
    const result = await db.run(`DELETE FROM Product WHERE productID = ?`, [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ 
      status: "success",
      message: "Product deleted successfully"
    });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== INVENTORY ====================
router.get("/inventory", async (req, res) => {
  const db = req.db;
  try {
    const inventory = await db.all(`
      SELECT 
        i.productID,
        i.locationID,
        i.quantity,
        p.name,
        l.locationName
      FROM Inventory i
      JOIN Product p ON i.productID = p.productID
      JOIN Location l ON i.locationID = l.locationID
      ORDER BY p.name, l.locationName
    `);
    res.json(inventory);
  } catch (err) {
    console.error("Fetch inventory error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/inventory/update", async (req, res) => {
  const db = req.db;
  const { productID, locationID, quantity } = req.body;

  if (!productID || !locationID || quantity === undefined) {
    return res.status(400).json({ error: "productID, locationID, and quantity required" });
  }

  try {
    // Check if inventory record exists
    const existing = await db.get(
      `SELECT * FROM Inventory WHERE productID = ? AND locationID = ?`,
      [productID, locationID]
    );

    if (existing) {
      // Update existing
      await db.run(
        `UPDATE Inventory SET quantity = ? WHERE productID = ? AND locationID = ?`,
        [quantity, productID, locationID]
      );
    } else {
      // Insert new
      await db.run(
        `INSERT INTO Inventory (productID, locationID, quantity) VALUES (?, ?, ?)`,
        [productID, locationID, quantity]
      );
    }

    res.json({ 
      status: "success",
      message: "Inventory updated successfully"
    });
  } catch (err) {
    console.error("Update inventory error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== ORDERS ====================
router.get("/orders", async (req, res) => {
  const db = req.db;
  try {
    const orders = await db.all(`
      SELECT 
        o.orderID,
        o.orderDate,
        o.orderType,
        c.customerName,
        c.email,
        l.locationName,
        SUM(oi.quantity * oi.priceAtPurchase) as totalAmount,
        COUNT(oi.orderItemID) as itemCount
      FROM Orders o
      LEFT JOIN Customer c ON o.customerID = c.customerID
      LEFT JOIN Location l ON o.locationID = l.locationID
      LEFT JOIN OrderItems oi ON o.orderID = oi.orderID
      GROUP BY o.orderID
      ORDER BY o.orderDate DESC, o.orderID DESC
    `);
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/orders/:id", async (req, res) => {
  const db = req.db;
  const { id } = req.params;

  try {
    const order = await db.get(`
      SELECT 
        o.orderID,
        o.orderDate,
        o.orderType,
        c.customerID,
        c.customerName,
        c.email,
        c.phone,
        l.locationName
      FROM Orders o
      LEFT JOIN Customer c ON o.customerID = c.customerID
      LEFT JOIN Location l ON o.locationID = l.locationID
      WHERE o.orderID = ?
    `, [id]);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const items = await db.all(`
      SELECT 
        oi.orderItemID,
        oi.productID,
        p.name,
        oi.priceAtPurchase,
        oi.quantity
      FROM OrderItems oi
      JOIN Product p ON oi.productID = p.productID
      WHERE oi.orderID = ?
    `, [id]);

    const totalAmount = items.reduce((sum, item) => 
      sum + (item.priceAtPurchase * item.quantity), 0
    );

    // Get shipping information if it exists
    const shipping = await db.get(
      `SELECT * FROM Shipping WHERE orderID = ?`,
      [id]
    );

    res.json({ ...order, items, totalAmount, shipping: shipping || null });
  } catch (err) {
    console.error("Fetch order error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== USERS ====================
router.get("/users", async (req, res) => {
  const db = req.db;
  try {
    const users = await db.all(`
      SELECT 
        u.userID,
        u.email,
        u.phone,
        u.isAdmin,
        c.customerID,
        c.customerName,
        COUNT(DISTINCT o.orderID) as orderCount
      FROM User u
      LEFT JOIN Customer c ON u.userID = c.userID
      LEFT JOIN Orders o ON c.customerID = o.customerID
      GROUP BY u.userID
      ORDER BY u.userID
    `);
    res.json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== REORDERS ====================
router.get("/reorders", async (req, res) => {
  const db = req.db;
  try {
    const reorders = await db.all(`
      SELECT 
        r.reorderID,
        r.productID,
        r.locationID,
        r.manufacturerID,
        r.requestDate,
        r.quantityOrdered,
        r.status,
        p.name as productName,
        m.manufacturerName,
        l.locationName,
        i.quantity as currentQuantity,
        rd.deliveryDate,
        rd.quantityReceived
      FROM Reorder r
      JOIN Product p ON r.productID = p.productID
      JOIN Manufacturer m ON r.manufacturerID = m.manufacturerID
      JOIN Location l ON r.locationID = l.locationID
      LEFT JOIN Inventory i ON r.productID = i.productID AND r.locationID = i.locationID
      LEFT JOIN ReorderDelivery rd ON r.reorderID = rd.reorderID
      ORDER BY r.requestDate DESC, r.reorderID DESC
    `);
    
    // Calculate expected delivery date for "Ordered" status (1 week from request date)
    const formatted = reorders.map(r => {
      if (r.status === 'Ordered' && !r.deliveryDate) {
        const requestDate = new Date(r.requestDate);
        requestDate.setDate(requestDate.getDate() + 7);
        r.expectedDeliveryDate = requestDate.toISOString().split('T')[0];
      }
      return r;
    });
    
    res.json(formatted);
  } catch (err) {
    console.error("Fetch reorders error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/reorders", async (req, res) => {
  const db = req.db;
  const { productID, locationID, quantityOrdered } = req.body;

  if (!productID || !locationID || !quantityOrdered) {
    return res.status(400).json({ error: "productID, locationID, and quantityOrdered required" });
  }

  try {
    // Get manufacturer from product
    const product = await db.get(
      `SELECT manufacturerID FROM Product WHERE productID = ?`,
      [productID]
    );

    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }

    const result = await db.run(
      `INSERT INTO Reorder (productID, locationID, manufacturerID, requestDate, quantityOrdered, status)
       VALUES (?, ?, ?, DATE('now'), ?, 'Pending')`,
      [productID, locationID, product.manufacturerID, quantityOrdered]
    );

    res.json({
      status: "success",
      reorderID: result.lastID,
      message: "Reorder created successfully"
    });
  } catch (err) {
    console.error("Create reorder error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/reorders/:id/order", async (req, res) => {
  const db = req.db;
  const { id } = req.params;

  try {
    // Mark reorder as "Ordered" and set expected delivery date (1 week from now)
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);
    const deliveryDateStr = expectedDeliveryDate.toISOString().split('T')[0];

    await db.run(
      `UPDATE Reorder SET status = 'Ordered' WHERE reorderID = ?`,
      [id]
    );

    res.json({
      status: "success",
      message: "Reorder marked as ordered. Expected delivery in 1 week.",
      expectedDeliveryDate: deliveryDateStr
    });
  } catch (err) {
    console.error("Order reorder error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/reorders/:id/receive", async (req, res) => {
  const db = req.db;
  const { id } = req.params;
  const { quantityReceived, deliveryDate } = req.body;

  try {
    // Get reorder details
    const reorder = await db.get(
      `SELECT * FROM Reorder WHERE reorderID = ?`,
      [id]
    );

    if (!reorder) {
      return res.status(404).json({ error: "Reorder not found" });
    }

    if (reorder.status === 'Received') {
      return res.status(400).json({ error: "Reorder has already been received" });
    }

    // Use provided quantity or default to quantityOrdered
    const qtyReceived = quantityReceived || reorder.quantityOrdered;
    const delDate = deliveryDate || new Date().toISOString().split('T')[0];

    // Create ReorderDelivery record - this triggers the inventory update
    await db.run(
      `INSERT INTO ReorderDelivery (reorderID, deliveryDate, quantityReceived)
       VALUES (?, ?, ?)`,
      [id, delDate, qtyReceived]
    );

    // Status is automatically updated to 'Received' by trigger

    res.json({
      status: "success",
      message: "Reorder received. Inventory has been updated automatically."
    });
  } catch (err) {
    console.error("Receive reorder error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/reorders/:id/cancel", async (req, res) => {
  const db = req.db;
  const { id } = req.params;

  try {
    await db.run(
      `UPDATE Reorder SET status = 'Cancelled' WHERE reorderID = ? AND status != 'Received'`,
      [id]
    );

    res.json({
      status: "success",
      message: "Reorder cancelled"
    });
  } catch (err) {
    console.error("Cancel reorder error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== SHIPPING ====================
router.post("/shipping", async (req, res) => {
  const db = req.db;
  const { orderID, shippingCompany, trackingNumber, shipDate, deliveryDate } = req.body;

  if (!orderID || !shippingCompany || !trackingNumber) {
    return res.status(400).json({ error: "orderID, shippingCompany, and trackingNumber required" });
  }

  try {
    // Check if shipping record already exists
    const existing = await db.get(
      `SELECT shipmentID FROM Shipping WHERE orderID = ?`,
      [orderID]
    );

    if (existing) {
      // Update existing shipping record
      await db.run(
        `UPDATE Shipping 
         SET shippingCompany = ?, trackingNumber = ?, shipDate = ?, deliveryDate = ?
         WHERE orderID = ?`,
        [shippingCompany, trackingNumber, shipDate || null, deliveryDate || null, orderID]
      );
      res.json({ 
        status: "success",
        message: "Shipping information updated successfully"
      });
    } else {
      // Create new shipping record
      const result = await db.run(
        `INSERT INTO Shipping (orderID, shippingCompany, trackingNumber, shipDate, deliveryDate)
         VALUES (?, ?, ?, ?, ?)`,
        [orderID, shippingCompany, trackingNumber, shipDate || null, deliveryDate || null]
      );
      res.json({ 
        status: "success",
        shipmentID: result.lastID,
        message: "Shipping information added successfully"
      });
    }
  } catch (err) {
    console.error("Shipping error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/shipping/:orderID", async (req, res) => {
  const db = req.db;
  const { orderID } = req.params;

  try {
    const shipping = await db.get(
      `SELECT * FROM Shipping WHERE orderID = ?`,
      [orderID]
    );

    if (!shipping) {
      return res.status(404).json({ error: "Shipping information not found" });
    }

    res.json(shipping);
  } catch (err) {
    console.error("Fetch shipping error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== USERS ====================
router.get("/users/:id", async (req, res) => {
  const db = req.db;
  const { id } = req.params;

  try {
    const user = await db.get(`
      SELECT 
        u.userID,
        u.email,
        u.phone,
        u.isAdmin,
        c.customerID,
        c.customerName
      FROM User u
      LEFT JOIN Customer c ON u.userID = c.userID
      WHERE u.userID = ?
    `, [id]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get order count and orders (only if customerID exists)
    if (user.customerID) {
      const orderCountResult = await db.get(`
        SELECT COUNT(*) as count
        FROM Orders o
        WHERE o.customerID = ?
      `, [user.customerID]);
      
      user.orderCount = orderCountResult?.count || 0;

      // Get all orders for this user
      const orders = await db.all(`
        SELECT 
          o.orderID,
          o.orderDate,
          o.orderType,
          l.locationName,
          SUM(oi.quantity * oi.priceAtPurchase) as totalAmount
        FROM Orders o
        LEFT JOIN Location l ON o.locationID = l.locationID
        LEFT JOIN OrderItems oi ON o.orderID = oi.orderID
        WHERE o.customerID = ?
        GROUP BY o.orderID
        ORDER BY o.orderDate DESC, o.orderID DESC
      `, [user.customerID]);

      user.orders = orders || [];
    } else {
      user.orderCount = 0;
      user.orders = [];
    }

    res.json(user);
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
