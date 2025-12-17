#!/usr/bin/env node

/**
 * Create Admin Account Script
 * Usage: node create-admin.js [email] [password] [phone] [name]
 * 
 * Examples:
 *   node create-admin.js admin@store.com admin123 1234567890 "Admin User"
 *   node create-admin.js admin@example.com mypassword 5551234567
 */

import bcrypt from 'bcryptjs';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

// Parse command line arguments
const args = process.argv.slice(2);
const ADMIN_EMAIL = args[0] || 'admin@store.com';
const ADMIN_PASSWORD = args[1] || 'admin123';
const ADMIN_PHONE = args[2] || '1234567890';
const ADMIN_NAME = args[3] || 'Admin User';

async function createAdmin() {
  try {
    console.log('🔐 Creating Admin Account...\n');

    // Open database
    const db = await open({
      filename: './db/database.sqlite',
      driver: sqlite3.Database,
    });

    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON;');

    // Check if user already exists
    const existingUser = await db.get(
      'SELECT userID, isAdmin FROM User WHERE email = ?',
      [ADMIN_EMAIL]
    );

    if (existingUser) {
      console.log(`ℹ️  User already exists. Updating password and ensuring admin status...\n`);
      
      // Hash the new password
      const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      
      // Update user with new password and ensure admin status
      await db.run(
        'UPDATE User SET passwordHash = ?, isAdmin = 1 WHERE email = ?',
        [hash, ADMIN_EMAIL]
      );
      
      // Update customer record if it exists
      const existingCustomer = await db.get(
        'SELECT customerID FROM Customer WHERE userID = ?',
        [existingUser.userID]
      );
      
      if (existingCustomer) {
        await db.run(
          'UPDATE Customer SET customerName = ?, phone = ? WHERE userID = ?',
          [ADMIN_NAME, ADMIN_PHONE, existingUser.userID]
        );
      } else {
        await db.run(
          `INSERT INTO Customer (userID, customerName, email, phone)
           VALUES (?, ?, ?, ?)`,
          [existingUser.userID, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE]
        );
      }
      
      console.log(`✅ Admin account updated successfully!`);
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log(`   Phone: ${ADMIN_PHONE}`);
      console.log(`   Name: ${ADMIN_NAME}`);
      console.log(`   User ID: ${existingUser.userID}\n`);
      console.log('🚀 You can now log in with these credentials!\n');
      
      await db.close();
      return;
    }

    // Hash the password
    console.log('🔐 Hashing password...');
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Insert user
    console.log('📝 Creating user record...');
    const userResult = await db.run(
      `INSERT INTO User (email, phone, passwordHash, isAdmin)
       VALUES (?, ?, ?, 1)`,
      [ADMIN_EMAIL, ADMIN_PHONE, hash]
    );

    const userID = userResult.lastID;

    // Insert customer record
    console.log('👤 Creating customer record...');
    await db.run(
      `INSERT INTO Customer (userID, customerName, email, phone)
       VALUES (?, ?, ?, ?)`,
      [userID, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE]
    );

    // Verify
    const newAdmin = await db.get(
      'SELECT userID, email, isAdmin FROM User WHERE userID = ?',
      [userID]
    );

    console.log('\n✅ Admin account created successfully!\n');
    console.log('📊 Account Details:');
    console.log(`   Email:  ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Phone:  ${ADMIN_PHONE}`);
    console.log(`   Name:   ${ADMIN_NAME}`);
    console.log(`   User ID: ${userID}`);
    console.log(`   Is Admin: ${newAdmin.isAdmin === 1 ? 'Yes ✅' : 'No ❌'}\n`);

    console.log('🚀 You can now log in with these credentials!\n');

    await db.close();

  } catch (error) {
    console.error('\n❌ Error creating admin account:');
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }
}

createAdmin();
