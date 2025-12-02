------------------------------------------------------------
-- MANUFACTURER
------------------------------------------------------------
CREATE TABLE Manufacturer (
    manufacturerID   INT PRIMARY KEY,
    manufacturerName VARCHAR(255) NOT NULL UNIQUE
);

------------------------------------------------------------
-- CATEGORY
------------------------------------------------------------
CREATE TABLE Category (
    categoryID   INT PRIMARY KEY,
    categoryName VARCHAR(255) NOT NULL UNIQUE
);

------------------------------------------------------------
-- PRODUCT
------------------------------------------------------------
CREATE TABLE Product (
    productID       INT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    manufacturerID  INT NOT NULL,
    price           DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (manufacturerID)
        REFERENCES Manufacturer(manufacturerID)
);

------------------------------------------------------------
-- PRODUCT ↔ CATEGORY (many-to-many)
------------------------------------------------------------
CREATE TABLE ProductCategory (
    productID  INT NOT NULL,
    categoryID INT NOT NULL,

    PRIMARY KEY (productID, categoryID),

    FOREIGN KEY (productID) REFERENCES Product(productID),
    FOREIGN KEY (categoryID) REFERENCES Category(categoryID)
);

------------------------------------------------------------
-- CUSTOMER
------------------------------------------------------------
CREATE TABLE Customer (
    customerID   INT PRIMARY KEY,
    customerName VARCHAR(255) NOT NULL,
    email        VARCHAR(255),     -- online-only customers
    phone        VARCHAR(50),
    has_account  BOOLEAN NOT NULL DEFAULT 0
);

------------------------------------------------------------
-- ACCOUNT (contract customers)
------------------------------------------------------------
CREATE TABLE Account (
    accountID       INT PRIMARY KEY,
    customerID      INT NOT NULL,
    accountNumber   VARCHAR(255) NOT NULL UNIQUE,
    billingAddress  VARCHAR(255),
    billingCycleDate DATE,

    FOREIGN KEY (customerID)
        REFERENCES Customer(customerID)
);

------------------------------------------------------------
-- PAYMENT INFO (ONLINE ONLY)
------------------------------------------------------------
CREATE TABLE PaymentInfo (
    paymentID   INT PRIMARY KEY,
    customerID  INT NOT NULL,
    card_last4  CHAR(4) NOT NULL,
    card_type   VARCHAR(50) NOT NULL,
    expiration_date DATE NOT NULL,

    FOREIGN KEY (customerID)
        REFERENCES Customer(customerID)
);

------------------------------------------------------------
-- LOCATION (stores, warehouses)
------------------------------------------------------------
CREATE TABLE Location (
    locationID   INT PRIMARY KEY,
    locationType VARCHAR(50) NOT NULL, -- 'store', 'warehouse'
    locationName VARCHAR(255) NOT NULL,
    address      VARCHAR(255) NOT NULL
);

------------------------------------------------------------
-- INVENTORY (per location)
------------------------------------------------------------
CREATE TABLE Inventory (
    productID  INT NOT NULL,
    locationID INT NOT NULL,
    quantity   INT NOT NULL DEFAULT 0,

    PRIMARY KEY (productID, locationID),

    FOREIGN KEY (productID)  REFERENCES Product(productID),
    FOREIGN KEY (locationID) REFERENCES Location(locationID)
);

------------------------------------------------------------
-- ORDER
------------------------------------------------------------
CREATE TABLE Orders (
    orderID     INT PRIMARY KEY,
    customerID  INT,          -- NULL if placed online w/ no account
    orderDate   DATE NOT NULL,
    orderType   VARCHAR(10) NOT NULL, -- 'online' or 'IP'
    locationID  INT,          -- only required for in-person orders
    accountID   INT,          -- nullable
    paymentID   INT,          -- only for online orders

    FOREIGN KEY (customerID) REFERENCES Customer(customerID),
    FOREIGN KEY (locationID) REFERENCES Location(locationID),
    FOREIGN KEY (accountID)  REFERENCES Account(accountID),
    FOREIGN KEY (paymentID)  REFERENCES PaymentInfo(paymentID)
);

------------------------------------------------------------
-- ORDER ITEMS
------------------------------------------------------------
CREATE TABLE OrderItems (
    orderID   INT NOT NULL,
    productID INT NOT NULL,
    quantity  INT NOT NULL,
    salePrice DECIMAL(10,2) NOT NULL,

    PRIMARY KEY (orderID, productID),

    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (productID) REFERENCES Product(productID)
);

------------------------------------------------------------
-- SHIPPING (ONLINE ORDERS)
------------------------------------------------------------
CREATE TABLE Shipping (
    shipmentID     INT PRIMARY KEY,
    orderID        INT NOT NULL,
    shippingCompany VARCHAR(255) NOT NULL,
    trackingNumber  VARCHAR(255) NOT NULL,
    shipDate        DATE,
    deliveryDate    DATE,

    FOREIGN KEY (orderID) REFERENCES Orders(orderID)
);

------------------------------------------------------------
-- REORDER (when inventory is low)
------------------------------------------------------------
CREATE TABLE Reorder (
    reorderID       INT PRIMARY KEY,
    productID       INT NOT NULL,
    locationID      INT NOT NULL,
    manufacturerID  INT NOT NULL,
    requestDate     DATE NOT NULL,
    quantityOrdered INT NOT NULL,
    status          VARCHAR(50) NOT NULL,

    FOREIGN KEY (productID)      REFERENCES Product(productID),
    FOREIGN KEY (locationID)     REFERENCES Location(locationID),
    FOREIGN KEY (manufacturerID) REFERENCES Manufacturer(manufacturerID)
);

------------------------------------------------------------
-- REORDER DELIVERY
------------------------------------------------------------
CREATE TABLE ReorderDelivery (
    deliveryID       INT PRIMARY KEY,
    reorderID        INT NOT NULL,
    deliveryDate     DATE NOT NULL,
    quantityReceived INT NOT NULL,

    FOREIGN KEY (reorderID) REFERENCES Reorder(reorderID)
);


----------------------------------------------------------



CREATE TRIGGER auto_reorder_after_inventory_update
AFTER UPDATE ON Inventory
FOR EACH ROW
WHEN NEW.quantity < 10  -- threshold for low inventory
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
    SELECT 
        (SELECT IFNULL(MAX(reorderID), 0) + 1 FROM Reorder),
        NEW.productID,
        NEW.locationID,
        p.manufacturerID,
        DATE('now'),
        50,             -- Default reorder quantity
        'requested'
    FROM Product p
    WHERE p.productID = NEW.productID;
END;
