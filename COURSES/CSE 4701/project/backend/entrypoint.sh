#!/bin/sh
# Initialize database if it doesn't exist

DB_FILE="./db/database.sqlite"

if [ ! -f "$DB_FILE" ]; then
  echo "📦 Initializing database..."
  
  # Create schema
  echo "Creating schema..."
  sqlite3 "$DB_FILE" < ./db/schema.sql
  
  # Load sample data
  echo "Loading sample data..."
  sqlite3 "$DB_FILE" < ./db/sample_data.sql
  
  echo "✅ Database initialized successfully!"
else
  echo "✅ Database already exists"
fi

# Start the application
npm start
