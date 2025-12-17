-- Create Admin User Account
-- Password hash for 'admin123' (generated with bcryptjs at 10 rounds)
-- To generate your own hash, use: bcrypt.hash('your-password', 10)

INSERT INTO User (email, phone, passwordHash, isAdmin)
VALUES (
    'admin@store.com',
    1234567890,
    '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Q0lq7s.2eGqkdEYY5o1a',
    1
);

-- Create corresponding customer record for admin user
INSERT INTO Customer (userID, customerName, email, phone)
VALUES (
    (SELECT userID FROM User WHERE email = 'admin@store.com'),
    'Admin User',
    'admin@store.com',
    '1234567890'
);
