------------------------------------------------------------
-- TEST SCRIPT FOR ELECTRONICS RETAILER DATABASE
-- Exercises: inserts, orders, auto-reorder, deliveries, etc.
------------------------------------------------------------

PRINT '--- STARTING TEST SCRIPT ---';

------------------------------------------------------------
-- 1. Insert Manufacturers
------------------------------------------------------------
INSERT INTO Manufacturer (manufacturerID, manufacturerName)
VALUES 
    (1, 'Sony'),
    (2, 'Apple');

------------------------------------------------------------
-- 2. Insert Categories
------------------------------------------------------------
INSERT INTO Category (categoryID, categoryName)
VALUES
    (1, 'Laptops'),
    (2, 'Headphones'),
    (3, 'TVs');

------------------------------------------------------------
-- 3. Insert Products
------------------------------------------------------------
INSERT INTO Product (productID, name, description, manufacturerID, price)
VALUES
    (101, 'Sony WH-1000XM5', 'Noise cancelling headphones', 1, 399.99),
    (102, 'MacBook Air M3', '13-inch laptop', 2, 1199.00),
    (103, 'Sony Bravia 55"', '4K OLED TV', 1, 1599.99);

------------------------------------------------------------
-- 4. Product-Category Mapping
------------------------------------------------------------
INSERT INTO ProductCategory (productID, categoryID) VALUES
    (101, 2),
    (102, 1),
    (103, 3);

------------------------------------------------------------
-- 5. Insert Locations (Store + Online + Warehouse)
------------------------------------------------------------
INSERT INTO Location (locationID, locationType, locationName, address)
VALUES
    (1, 'store',    'Storrs Store',  '100 Main St'),
    (2, 'online',   'Online Store',  'N/A'),
    (3, 'warehouse','CT Warehouse',  '500 Warehouse Rd');

------------------------------------------------------------
-- 6. Create Inventory
------------------------------------------------------------
INSERT INTO Inventory (productID, locationID, quantity) VALUES
    (101, 1, 10),   -- Sony headphones in store
    (102, 1, 6),    -- MacBooks in store
    (103, 1, 4),    -- TV already low (should reorder soon)
    (101, 2, 5),    -- online store inventory
    (102, 2, 2),
    (103, 2, 1);

------------------------------------------------------------
-- 7. Insert Customers
------------------------------------------------------------
INSERT INTO Customer (customerID, customerName, email, phone, has_account)
VALUES
    (1, 'Alice Doe', 'alice@email.com', '555-1000', 1),
    (2, 'Bob Smith', NULL, '555-2000', 0); -- in-store-only

------------------------------------------------------------
-- 8. Create Account for Alice
------------------------------------------------------------
INSERT INTO Account (accountID, customerID, accountNumber, billingAddress, billingCycleDate)
VALUES
    (10, 1, 'ACCT-0001', '100 Billing Rd', '2025-01-10');

------------------------------------------------------------
-- 9. Add Payment Info for Alice
------------------------------------------------------------
INSERT INTO PaymentInfo (paymentID, customerID, card_last4, card_type, expiration_date)
VALUES
    (20, 1, '1234', 'Visa', '2027-02-01');

------------------------------------------------------------
-- 10. Create an IN-PERSON ORDER for Bob (customerID = 2)
------------------------------------------------------------
INSERT INTO Orders (orderID, customerID, orderDate, orderType, locationID, accountID, paymentID)
VALUES
    (1000, 2, '2025-12-01', 'IP', 1, NULL, NULL);

------------------------------------------------------------
-- 11. Add Order Items (trigger should reduce inventory)
------------------------------------------------------------
-- Bob buys 3 Sony TVs (productID 103) → inventory from 4 → 1
INSERT INTO OrderItems (orderID, productID, quantity, salePrice)
VALUES (1000, 103, 3, 1499.99);

------------------------------------------------------------
-- *** AUTO-REORDER SHOULD FIRE HERE ***
-- Because inventory for product 103 at location 1 is now 1 (<5)
------------------------------------------------------------

------------------------------------------------------------
-- 12. Check reorders
------------------------------------------------------------
SELECT 'REORDERS AFTER LOW INVENTORY EVENT:' AS section;
SELECT * FROM Reorder;

------------------------------------------------------------
-- 13. Simulate receiving delivery for the reorder
-- Get the reorderID from the previous query; assume reorderID=1
------------------------------------------------------------
INSERT INTO ReorderDelivery (deliveryID, reorderID, deliveryDate, quantityReceived)
VALUES
    (5001, (SELECT reorderID FROM Reorder ORDER BY reorderID DESC LIMIT 1),
     '2025-12-05', 50);

------------------------------------------------------------
-- Inventory for product 103 at store 1 should increase by 50.
------------------------------------------------------------

SELECT 'INVENTORY AFTER DELIVERY:' AS section;
SELECT * FROM Inventory WHERE productID = 103 AND locationID = 1;

------------------------------------------------------------
-- 14. Create ONLINE ORDER for Alice
------------------------------------------------------------
INSERT INTO Orders (orderID, customerID, orderDate, orderType, locationID, accountID, paymentID)
VALUES
    (2000, 1, '2025-12-02', 'online', NULL, 10, NULL);

------------------------------------------------------------
-- Add items (should decrement ONLINE inventory only)
------------------------------------------------------------
INSERT INTO OrderItems (orderID, productID, quantity, salePrice)
VALUES
    (2000, 101, 2, 379.99);

------------------------------------------------------------
-- 15. Add shipping for the online order
------------------------------------------------------------
INSERT INTO Shipping (shipmentID, orderID, shippingCompany, trackingNumber, shipDate, deliveryDate)
VALUES
    (3000, 2000, 'UPS', '1Z999AA', '2025-12-03', NULL);

------------------------------------------------------------
-- 16. View all tables at end of test
------------------------------------------------------------
SELECT 'FINAL INVENTORY:' AS section;
SELECT * FROM Inventory;

SELECT 'FINAL ORDERS:' AS section;
SELECT * FROM Orders;

SELECT 'FINAL ORDER ITEMS:' AS section;
SELECT * FROM OrderItems;

SELECT 'FINAL SHIPPING:' AS section;
SELECT * FROM Shipping;

SELECT 'FINAL REORDERS:' AS section;
SELECT * FROM Reorder;

SELECT 'FINAL REORDER DELIVERIES:' AS section;
SELECT * FROM ReorderDelivery;
