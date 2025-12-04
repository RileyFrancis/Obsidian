------------------------------------------------------------
-- DROP TABLES (for development / reset purposes)
------------------------------------------------------------
-- NOTE: Comment these out if running on a system that
-- does not support IF EXISTS, or if you don't want drops.

DROP TABLE IF EXISTS ReorderDelivery;
DROP TABLE IF EXISTS Reorder;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS Shipping;
DROP TABLE IF EXISTS OrderItems;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS PaymentInfo;   
DROP TABLE IF EXISTS Account;
DROP TABLE IF EXISTS Customer;
DROP TABLE IF EXISTS ProductCategory;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS Manufacturer;
DROP TABLE IF EXISTS Location;

------------------------------------------------------------
-- MANUFACTURER
------------------------------------------------------------
CREATE TABLE Manufacturer (
    manufacturerID   INTEGER PRIMARY KEY,
    manufacturerName VARCHAR(255) NOT NULL UNIQUE
);

------------------------------------------------------------
-- CATEGORY
------------------------------------------------------------
CREATE TABLE Category (
    categoryID   INTEGER PRIMARY KEY,
    categoryName VARCHAR(255) NOT NULL UNIQUE
);

------------------------------------------------------------
-- PRODUCT
------------------------------------------------------------
CREATE TABLE Product (
    productID      INTEGER PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    description    TEXT,
    manufacturerID INTEGER NOT NULL,
    price          DECIMAL(10,2) NOT NULL CHECK (price >= 0),

    CONSTRAINT FK_Product_Manufacturer
        FOREIGN KEY (manufacturerID)
        REFERENCES Manufacturer(manufacturerID)
);

------------------------------------------------------------
-- PRODUCT CATEGORY (many-to-many between Product & Category)
------------------------------------------------------------
CREATE TABLE ProductCategory (
    productID  INTEGER NOT NULL,
    categoryID INTEGER NOT NULL,

    PRIMARY KEY (productID, categoryID),

    CONSTRAINT FK_ProductCategory_Product
        FOREIGN KEY (productID)
        REFERENCES Product(productID),

    CONSTRAINT FK_ProductCategory_Category
        FOREIGN KEY (categoryID)
        REFERENCES Category(categoryID)
);

------------------------------------------------------------
-- LOCATION (stores, warehouses, online store)
------------------------------------------------------------
CREATE TABLE Location (
    locationID   INTEGER PRIMARY KEY,
    locationType VARCHAR(20) NOT NULL, -- e.g., 'store', 'warehouse', 'online'
    locationName VARCHAR(255) NOT NULL,
    address      VARCHAR(255) NOT NULL,

    CONSTRAINT CHK_Location_Type
        CHECK (locationType IN ('store', 'warehouse', 'online'))
);

------------------------------------------------------------
-- CUSTOMER
------------------------------------------------------------
CREATE TABLE Customer (
    customerID   INTEGER PRIMARY KEY,
    customerName VARCHAR(255) NOT NULL,
    email        VARCHAR(255),   -- online-only (may be NULL for in-store-only customers)
    phone        VARCHAR(50),
    has_account  INTEGER NOT NULL DEFAULT 0,  -- 0 = no, 1 = yes

    CONSTRAINT CHK_Customer_has_account
        CHECK (has_account IN (0,1))
);

------------------------------------------------------------
-- ACCOUNT (for customers with monthly billing)
------------------------------------------------------------
CREATE TABLE Account (
    accountID      INTEGER PRIMARY KEY,
    customerID     INTEGER NOT NULL UNIQUE, -- 1 account per customer
    accountNumber  VARCHAR(50) NOT NULL UNIQUE,
    billingAddress VARCHAR(255) NOT NULL,
    billingCycleDate DATE NOT NULL, -- e.g., day of month as actual date

    CONSTRAINT FK_Account_Customer
        FOREIGN KEY (customerID)
        REFERENCES Customer(customerID)
);

------------------------------------------------------------
-- PAYMENT INFO (online-only saved cards)
------------------------------------------------------------
CREATE TABLE PaymentInfo (
    paymentID      INTEGER PRIMARY KEY,
    customerID     INTEGER NOT NULL,
    card_last4     CHAR(4) NOT NULL,
    card_type      VARCHAR(20) NOT NULL, -- e.g., 'Visa', 'MasterCard'
    expiration_date DATE NOT NULL,

    CONSTRAINT FK_PaymentInfo_Customer
        FOREIGN KEY (customerID)
        REFERENCES Customer(customerID)
);

------------------------------------------------------------
-- ORDERS
--
-- Notes (based on your choices):
-- - customerID may be NULL for anonymous online orders.
-- - orderType: 'online' or 'IP' (in-person).
-- - locationID: required for in-person store orders;
--   may be NULL for online orders if you don't want to
--   tie them to a specific warehouse/store.
-- - accountID XOR paymentID (exactly one of them, or both NULL
--   only if you want to allow unpaid/placeholder orders).
------------------------------------------------------------
CREATE TABLE Orders (
    orderID    INTEGER PRIMARY KEY,
    customerID INTEGER,         -- NULL allowed (anonymous online order)
    orderDate  DATE NOT NULL,
    orderType  VARCHAR(10) NOT NULL, -- 'online' or 'IP'
    locationID INTEGER,         -- only required for in-person orders
    accountID  INTEGER,         -- used for billed accounts
    paymentID  INTEGER,         -- used for per-order online payment

    CONSTRAINT CHK_Orders_orderType
        CHECK (orderType IN ('online', 'IP')),

    -- Enforce mutual exclusivity of accountID and paymentID
    -- Option A from your choice:
    CONSTRAINT CHK_Orders_AccountOrPayment
        CHECK (
            (accountID IS NOT NULL AND paymentID IS NULL) OR
            (accountID IS NULL AND paymentID IS NOT NULL) OR
            (accountID IS NULL AND paymentID IS NULL)
        ),

    CONSTRAINT FK_Orders_Customer
        FOREIGN KEY (customerID)
        REFERENCES Customer(customerID),

    CONSTRAINT FK_Orders_Location
        FOREIGN KEY (locationID)
        REFERENCES Location(locationID),

    CONSTRAINT FK_Orders_Account
        FOREIGN KEY (accountID)
        REFERENCES Account(accountID),

    CONSTRAINT FK_Orders_PaymentInfo
        FOREIGN KEY (paymentID)
        REFERENCES PaymentInfo(paymentID)
);

------------------------------------------------------------
-- ORDER ITEMS (line items in an order)
------------------------------------------------------------
CREATE TABLE OrderItems (
    orderID   INTEGER NOT NULL,
    productID INTEGER NOT NULL,
    quantity  INTEGER NOT NULL CHECK (quantity > 0),
    salePrice DECIMAL(10,2) NOT NULL CHECK (salePrice >= 0),

    PRIMARY KEY (orderID, productID),

    CONSTRAINT FK_OrderItems_Orders
        FOREIGN KEY (orderID)
        REFERENCES Orders(orderID),

    CONSTRAINT FK_OrderItems_Product
        FOREIGN KEY (productID)
        REFERENCES Product(productID)
);

------------------------------------------------------------
-- SHIPPING (one shipment per order, for simplicity)
------------------------------------------------------------
CREATE TABLE Shipping (
    shipmentID     INTEGER PRIMARY KEY,
    orderID        INTEGER NOT NULL UNIQUE,
    shippingCompany VARCHAR(100) NOT NULL,
    trackingNumber  VARCHAR(100) NOT NULL,
    shipDate        DATE,
    deliveryDate    DATE,

    CONSTRAINT FK_Shipping_Orders
        FOREIGN KEY (orderID)
        REFERENCES Orders(orderID)
);

------------------------------------------------------------
-- INVENTORY (per product, per location)
------------------------------------------------------------
CREATE TABLE Inventory (
    productID  INTEGER NOT NULL,
    locationID INTEGER NOT NULL,
    quantity   INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),

    PRIMARY KEY (productID, locationID),

    CONSTRAINT FK_Inventory_Product
        FOREIGN KEY (productID)
        REFERENCES Product(productID),

    CONSTRAINT FK_Inventory_Location
        FOREIGN KEY (locationID)
        REFERENCES Location(locationID)
);

------------------------------------------------------------
-- REORDER (when a location needs more of a product)
------------------------------------------------------------
CREATE TABLE Reorder (
    reorderID      INTEGER PRIMARY KEY,
    productID      INTEGER NOT NULL,
    locationID     INTEGER NOT NULL,
    manufacturerID INTEGER NOT NULL,
    requestDate    DATE NOT NULL,
    quantityOrdered INTEGER NOT NULL CHECK (quantityOrdered > 0),
    status         VARCHAR(20) NOT NULL, -- e.g. 'Pending', 'Ordered', 'Received', 'Cancelled'

    CONSTRAINT FK_Reorder_Product
        FOREIGN KEY (productID)
        REFERENCES Product(productID),

    CONSTRAINT FK_Reorder_Location
        FOREIGN KEY (locationID)
        REFERENCES Location(locationID),

    CONSTRAINT FK_Reorder_Manufacturer
        FOREIGN KEY (manufacturerID)
        REFERENCES Manufacturer(manufacturerID),

    CONSTRAINT CHK_Reorder_Status
        CHECK (status IN ('Pending', 'Ordered', 'Received', 'Cancelled'))
);

------------------------------------------------------------
-- REORDER DELIVERY (records of incoming shipments from vendor)
------------------------------------------------------------
CREATE TABLE ReorderDelivery (
    deliveryID      INTEGER PRIMARY KEY,
    reorderID       INTEGER NOT NULL,
    deliveryDate    DATE NOT NULL,
    quantityReceived INTEGER NOT NULL CHECK (quantityReceived > 0),

    CONSTRAINT FK_ReorderDelivery_Reorder
        FOREIGN KEY (reorderID)
        REFERENCES Reorder(reorderID)
);

------------------------------------------------------------
-- INDEXES (optional but useful)
------------------------------------------------------------
CREATE INDEX idx_Product_manufacturerID ON Product(manufacturerID);
CREATE INDEX idx_ProductCategory_categoryID ON ProductCategory(categoryID);
CREATE INDEX idx_Orders_customerID ON Orders(customerID);
CREATE INDEX idx_Orders_orderDate ON Orders(orderDate);
CREATE INDEX idx_OrderItems_productID ON OrderItems(productID);
CREATE INDEX idx_Inventory_product_location ON Inventory(productID, locationID);
CREATE INDEX idx_Reorder_product_location ON Reorder(productID, locationID);

------------------------------------------------------------
-- TRIGGERS (FULLY SQLITE COMPATIBLE)
------------------------------------------------------------

------------------------------------------------------------
-- 1) Prevent selling more units than available in inventory
------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_OrderItems_CheckInventory;

CREATE TRIGGER trg_OrderItems_CheckInventory
BEFORE INSERT ON OrderItems
FOR EACH ROW
BEGIN
    -- Skip check if order has no location (online order)
    SELECT CASE
        WHEN (SELECT locationID FROM Orders WHERE orderID = NEW.orderID) IS NULL
        THEN NULL
        WHEN (
            SELECT quantity
            FROM Inventory
            WHERE productID = NEW.productID
              AND locationID = (SELECT locationID FROM Orders WHERE orderID = NEW.orderID)
        ) < NEW.quantity
        THEN RAISE(ABORT, 'Insufficient inventory for this product at this location')
    END;
END;


------------------------------------------------------------
-- 2) Decrease inventory after sale
------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_OrderItems_DecrementInventory;

CREATE TRIGGER trg_OrderItems_DecrementInventory
AFTER INSERT ON OrderItems
FOR EACH ROW
BEGIN
    UPDATE Inventory
    SET quantity = quantity - NEW.quantity
    WHERE productID = NEW.productID
      AND locationID = (SELECT locationID FROM Orders WHERE orderID = NEW.orderID);
END;


------------------------------------------------------------
-- 3) Auto-create reorder when inventory falls below 5
------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_Inventory_AutoReorder;

CREATE TRIGGER trg_Inventory_AutoReorder
AFTER UPDATE OF quantity ON Inventory
FOR EACH ROW
WHEN NEW.quantity < 5
BEGIN
    INSERT INTO Reorder (
        reorderID,
        productID,
        locationID,
        manufacturerID,
        requestDate,
        quantityOrdered,
        status
    )
    VALUES (
        (SELECT IFNULL(MAX(reorderID), 0) + 1 FROM Reorder),
        NEW.productID,
        NEW.locationID,
        (SELECT manufacturerID FROM Product WHERE productID = NEW.productID),
        DATE('now'),
        50,
        'Pending'
    );
END;


------------------------------------------------------------
-- 4) When delivery comes in, increase inventory + close reorder
------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_ReorderDelivery_UpdateInventory;

CREATE TRIGGER trg_ReorderDelivery_UpdateInventory
AFTER INSERT ON ReorderDelivery
FOR EACH ROW
BEGIN
    UPDATE Inventory
    SET quantity = quantity + NEW.quantityReceived
    WHERE productID = (SELECT productID FROM Reorder WHERE reorderID = NEW.reorderID)
      AND locationID = (SELECT locationID FROM Reorder WHERE reorderID = NEW.reorderID);

    UPDATE Reorder
    SET status = 'Received'
    WHERE reorderID = NEW.reorderID;
END;
