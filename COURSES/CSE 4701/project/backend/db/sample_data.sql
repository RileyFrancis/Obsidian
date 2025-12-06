PRAGMA foreign_keys = OFF;

-- ------------------------------------------------------------
-- -- USER (Login accounts)
-- ------------------------------------------------------------
-- INSERT INTO User (email, phone, passwordHash, isAdmin)
-- VALUES
--  ('admin@store.com',
--   1234567890,
--   '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Q0lq7s.2eGqkdEYY5o1a',
--   1
--  ); -- passwordHash decrypts to 'password'

------------------------------------------------------------
-- CUSTOMERS (Guests OR linked to a User)
------------------------------------------------------------
INSERT INTO Customer (customerID, userID, customerName, email, phone) VALUES
    (1, 2, 'Alice Johnson', 'alice@example.com', '860-111-2222'),
    (2, 3, 'Bob Miller', 'bob@example.com', '860-333-4444'),
    (3, 4, 'Charlie Davis', 'charlie@example.com', '860-555-6666'),
    (4, NULL, 'Guest Checkout Person', 'guest@none.com', '860-777-8888');

------------------------------------------------------------
-- MANUFACTURERS
------------------------------------------------------------
INSERT INTO Manufacturer (manufacturerID, manufacturerName) VALUES
    (1, 'Sony'),
    (2, 'Samsung'),
    (3, 'Apple'),
    (4, 'Microsoft'),
    (5, 'Lenovo');

------------------------------------------------------------
-- CATEGORIES
------------------------------------------------------------
INSERT INTO Category (categoryID, categoryName) VALUES
    (1, 'Laptops'),
    (2, 'Tablets'),
    (3, 'Smartphones'),
    (4, 'Televisions'),
    (5, 'Gaming'),
    (6, 'Accessories'),
    (7, 'Audio'),
    (8, 'Cameras');

------------------------------------------------------------
-- PRODUCTS
------------------------------------------------------------
INSERT INTO Product (productID, name, description, manufacturerID, price) VALUES
    (1, 'Sony Bravia 55" TV', '4K HDR Smart Television', 1, 799.99),
    (2, 'Samsung Galaxy S23', 'Latest Samsung flagship phone', 2, 999.99),
    (3, 'Apple iPhone 15', 'Newest iPhone model', 3, 1099.99),
    (4, 'MacBook Air M3', 'Lightweight Apple laptop', 3, 1299.99),
    (5, 'Surface Pro 9', 'Microsoft premium tablet/laptop hybrid', 4, 1199.99),
    (6, 'Lenovo ThinkPad X1', 'Business-class laptop', 5, 1499.99),
    (7, 'PS5 Console', 'Next-gen PlayStation', 1, 499.99),
    (8, 'Xbox Series X', 'Powerful gaming console', 4, 499.99),
    (9, 'Sony WH-1000XM5', 'Premium noise-canceling headphones', 1, 349.99),
    (10,'Canon EOS R10', 'Mirrorless camera system', 1, 979.99),
    (11,'Apple Watch Series 9', 'Smart wearable device', 3, 399.99),
    (12,'Samsung Galaxy Tab S9', 'High-end Android tablet', 2, 899.99);

------------------------------------------------------------
-- PRODUCT CATEGORY LINKS
------------------------------------------------------------
INSERT INTO ProductCategory (productID, categoryID) VALUES
    (1, 4),  -- Sony TV -> TV
    (2, 3),  -- Samsung S23 -> Smartphone
    (3, 3),  
    (4, 1),  
    (5, 2),  
    (6, 1),  
    (7, 5),  
    (8, 5),  
    (9, 7),  
    (10, 8),
    (11, 6),
    (12, 2);

------------------------------------------------------------
-- LOCATIONS
------------------------------------------------------------
INSERT INTO Location (locationID, locationType, locationName, address) VALUES
    (1, 'online', 'Online Store', 'store.myshop.com'),
    (2, 'warehouse', 'Main Warehouse', '123 Warehouse Rd'),
    (3, 'store', 'Downtown Retail Store', '55 Market St');

------------------------------------------------------------
-- INVENTORY (per-product, per-location)
------------------------------------------------------------
-- Online Store inventory (locationID = 1)
INSERT INTO Inventory (productID, locationID, quantity) VALUES
    (1, 1, 25), (2, 1, 40), (3, 1, 30), (4, 1, 15),
    (5, 1, 20), (6, 1, 10), (7, 1, 50), (8, 1, 35),
    (9, 1, 60), (10, 1, 12), (11, 1, 45), (12, 1, 18);

-- Warehouse inventory (locationID = 2)
INSERT INTO Inventory (productID, locationID, quantity) VALUES
    (1, 2, 100), (2, 2, 150), (3, 2, 120), (4, 2, 70),
    (5, 2, 80), (6, 2, 50), (7, 2, 200), (8, 2, 160),
    (9, 2, 300), (10, 2, 40), (11, 2, 100), (12, 2, 90);

-- Retail Store inventory (locationID = 3)
INSERT INTO Inventory (productID, locationID, quantity) VALUES
    (1, 3, 8), (2, 3, 15), (3, 3, 12), (4, 3, 5),
    (5, 3, 6), (6, 3, 3), (7, 3, 10), (8, 3, 7),
    (9, 3, 20), (10, 3, 4), (11, 3, 14), (12, 3, 6);

PRAGMA foreign_keys = ON;
