------------------------------------------------------------
-- DROP TABLES (for development / reset)
------------------------------------------------------------
DROP TABLE IF EXISTS ReorderDelivery;
DROP TABLE IF EXISTS Reorder;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS Shipping;
DROP TABLE IF EXISTS OrderItems;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS PaymentInfo;   
DROP TABLE IF EXISTS Account;
DROP TABLE IF EXISTS Customer;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS ProductCategory;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS Manufacturer;
DROP TABLE IF EXISTS Location;

------------------------------------------------------------
-- USER (Authentication + Roles)
------------------------------------------------------------
CREATE TABLE User (
    userID INTEGER PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone INTEGER NOT NULL, 
    passwordHash TEXT NOT NULL,
    isAdmin INTEGER NOT NULL DEFAULT 0 CHECK (isAdmin IN (0,1))
);

------------------------------------------------------------
-- CUSTOMER (Guest or linked to a user)
------------------------------------------------------------
CREATE TABLE Customer (
    customerID INTEGER PRIMARY KEY,
    userID INTEGER,  -- NULL → guest checkout
    customerName VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),

    CONSTRAINT FK_Customer_User
        FOREIGN KEY (userID)
        REFERENCES User(userID)
);

------------------------------------------------------------
-- MANUFACTURER
------------------------------------------------------------
CREATE TABLE Manufacturer (
    manufacturerID INTEGER PRIMARY KEY,
    manufacturerName VARCHAR(255) NOT NULL UNIQUE
);

------------------------------------------------------------
-- CATEGORY
------------------------------------------------------------
CREATE TABLE Category (
    categoryID INTEGER PRIMARY KEY,
    categoryName VARCHAR(255) NOT NULL UNIQUE
);

------------------------------------------------------------
-- PRODUCT
------------------------------------------------------------
CREATE TABLE Product (
    productID INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manufacturerID INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),

    CONSTRAINT FK_Product_Manufacturer
        FOREIGN KEY (manufacturerID)
        REFERENCES Manufacturer(manufacturerID)
);

------------------------------------------------------------
-- PRODUCT CATEGORY (many-to-many)
------------------------------------------------------------
CREATE TABLE ProductCategory (
    productID INTEGER NOT NULL,
    categoryID INTEGER NOT NULL,

    PRIMARY KEY (productID, categoryID),

    CONSTRAINT FK_PC_Product
        FOREIGN KEY (productID)
        REFERENCES Product(productID),

    CONSTRAINT FK_PC_Category
        FOREIGN KEY (categoryID)
        REFERENCES Category(categoryID)
);

------------------------------------------------------------
-- LOCATION
------------------------------------------------------------
CREATE TABLE Location (
    locationID INTEGER PRIMARY KEY,
    locationType VARCHAR(20) NOT NULL CHECK (locationType IN ('store','warehouse','online')),
    locationName VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL
);

------------------------------------------------------------
-- ACCOUNT (Optional monthly billing)
------------------------------------------------------------
CREATE TABLE Account (
    accountID INTEGER PRIMARY KEY,
    userID INTEGER NOT NULL UNIQUE,
    accountNumber VARCHAR(50) NOT NULL UNIQUE,
    billingAddress VARCHAR(255) NOT NULL,
    billingCycleDate DATE NOT NULL,

    CONSTRAINT FK_Account_User
        FOREIGN KEY (userID)
        REFERENCES User(userID)
);

------------------------------------------------------------
-- PAYMENT INFO
------------------------------------------------------------
CREATE TABLE PaymentInfo (
    paymentID INTEGER PRIMARY KEY,
    userID INTEGER DEFAULT NULL,
    card_last4 CHAR(4) NOT NULL,
    card_type VARCHAR(20) NOT NULL,
    expiration_date DATE NOT NULL,

    CONSTRAINT FK_Payment_User
        FOREIGN KEY (userID)
        REFERENCES User(userID)
);

------------------------------------------------------------
-- ORDERS
------------------------------------------------------------
CREATE TABLE Orders (
    orderID INTEGER PRIMARY KEY,
    customerID INTEGER,  -- guest checkout allowed
    orderDate DATE NOT NULL,
    orderType VARCHAR(10) NOT NULL CHECK (orderType IN ('online','IP')),
    locationID INTEGER,   -- online orders auto-use online location
    accountID INTEGER,    -- exclusive with paymentID
    paymentID INTEGER,

    CONSTRAINT FK_Orders_Customer
        FOREIGN KEY (customerID)
        REFERENCES Customer(customerID),

    CONSTRAINT FK_Orders_Location
        FOREIGN KEY (locationID)
        REFERENCES Location(locationID),

    CONSTRAINT FK_Orders_Account
        FOREIGN KEY (accountID)
        REFERENCES Account(accountID),

    CONSTRAINT FK_Orders_Payment
        FOREIGN KEY (paymentID)
        REFERENCES PaymentInfo(paymentID),

    CONSTRAINT CHK_Orders_ExclusivePayment
        CHECK (
            (accountID IS NOT NULL AND paymentID IS NULL) OR
            (accountID IS NULL AND paymentID IS NOT NULL) OR
            (accountID IS NULL AND paymentID IS NULL)
        )
);

------------------------------------------------------------
-- ORDER ITEMS
------------------------------------------------------------
CREATE TABLE OrderItems (
    orderItemID INTEGER PRIMARY KEY,
    orderID INTEGER NOT NULL,
    productID INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    priceAtPurchase DECIMAL(10,2) NOT NULL,

    CONSTRAINT FK_OI_Order
        FOREIGN KEY (orderID)
        REFERENCES Orders(orderID),

    CONSTRAINT FK_OI_Product
        FOREIGN KEY (productID)
        REFERENCES Product(productID)
);

------------------------------------------------------------
-- SHIPPING
------------------------------------------------------------
CREATE TABLE Shipping (
    shipmentID INTEGER PRIMARY KEY,
    orderID INTEGER NOT NULL UNIQUE,
    shippingCompany VARCHAR(100) NOT NULL,
    trackingNumber VARCHAR(100) NOT NULL,
    shipDate DATE,
    deliveryDate DATE,

    CONSTRAINT FK_Shipping_Order
        FOREIGN KEY (orderID)
        REFERENCES Orders(orderID)
);

------------------------------------------------------------
-- INVENTORY
------------------------------------------------------------
CREATE TABLE Inventory (
    productID INTEGER NOT NULL,
    locationID INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),

    PRIMARY KEY (productID, locationID),

    CONSTRAINT FK_Inv_Product
        FOREIGN KEY (productID)
        REFERENCES Product(productID),

    CONSTRAINT FK_Inv_Location
        FOREIGN KEY (locationID)
        REFERENCES Location(locationID)
);

------------------------------------------------------------
-- REORDER
------------------------------------------------------------
CREATE TABLE Reorder (
    reorderID INTEGER PRIMARY KEY,
    productID INTEGER NOT NULL,
    locationID INTEGER NOT NULL,
    manufacturerID INTEGER NOT NULL,
    requestDate DATE NOT NULL,
    quantityOrdered INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Pending','Ordered','Received','Cancelled')),

    CONSTRAINT FK_Re_Product FOREIGN KEY (productID) REFERENCES Product(productID),
    CONSTRAINT FK_Re_Location FOREIGN KEY (locationID) REFERENCES Location(locationID),
    CONSTRAINT FK_Re_Manufacturer FOREIGN KEY (manufacturerID) REFERENCES Manufacturer(manufacturerID)
);

------------------------------------------------------------
-- REORDER DELIVERY
------------------------------------------------------------
CREATE TABLE ReorderDelivery (
    deliveryID INTEGER PRIMARY KEY,
    reorderID INTEGER NOT NULL,
    deliveryDate DATE NOT NULL,
    quantityReceived INTEGER NOT NULL CHECK (quantityReceived > 0),

    CONSTRAINT FK_RDel_Reorder
        FOREIGN KEY (reorderID)
        REFERENCES Reorder(reorderID)
);

------------------------------------------------------------
-- TRIGGERS
------------------------------------------------------------

------------------------------------------------------------
-- Prevent selling more than inventory
------------------------------------------------------------
CREATE TRIGGER trg_CheckInventory
BEFORE INSERT ON OrderItems
FOR EACH ROW
BEGIN
    SELECT CASE
        WHEN (SELECT locationID FROM Orders WHERE orderID = NEW.orderID) IS NULL THEN NULL
        WHEN (
            SELECT quantity FROM Inventory
            WHERE productID = NEW.productID
              AND locationID = (SELECT locationID FROM Orders WHERE orderID = NEW.orderID)
        ) < NEW.quantity
        THEN RAISE(ABORT, 'Insufficient inventory')
    END;
END;

------------------------------------------------------------
-- Decrease inventory after sale
------------------------------------------------------------
CREATE TRIGGER trg_DecrementInventory
AFTER INSERT ON OrderItems
FOR EACH ROW
BEGIN
    UPDATE Inventory
    SET quantity = quantity - NEW.quantity
    WHERE productID = NEW.productID
      AND locationID = (SELECT locationID FROM Orders WHERE orderID = NEW.orderID);
END;

------------------------------------------------------------
-- Auto-create reorder when quantity < 5
------------------------------------------------------------
CREATE TRIGGER trg_AutoReorder
AFTER UPDATE OF quantity ON Inventory
FOR EACH ROW
WHEN NEW.quantity < 5
BEGIN
    INSERT INTO Reorder (
        reorderID, productID, locationID, manufacturerID,
        requestDate, quantityOrdered, status
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
-- Apply inventory after reorder delivery
------------------------------------------------------------
CREATE TRIGGER trg_ReceiveReorder
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
