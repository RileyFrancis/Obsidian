# CSE 4701 - Electronic Vendor Database

A full-stack web application for managing an electronic vendor database (similar to Best Buy), built with React frontend and Node.js Express backend connected to SQLite database.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Admin Account Setup](#admin-account-setup)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Useful Commands](#useful-commands)

## 🎯 Project Overview

This application models an electronic vendor system that operates both online and in-store. The system manages:

- **Products and Groupings:** Products organized by type, manufacturer, and categories
- **Customers and Payments:** Contract customers with accounts and infrequent customers with card payments
- **Online Sales and Shipping:** Order tracking with shipping information
- **Inventory Management:** Real-time inventory tracking across stores and warehouses
- **Admin Dashboard:** Product management, inventory control, order tracking, and user management

## 🛠 Tech Stack

- **Frontend:** React 19, Vite, React Router
- **Backend:** Node.js (ESM), Express
- **Database:** SQLite (local development)
- **Authentication:** JWT (JSON Web Tokens)
- **Containerization:** Docker & Docker Compose

## 🚀 Quick Start

### Option 1: Docker Setup (Recommended)

#### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

#### Start Services
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

#### Stop Services
```bash
docker-compose down
```

#### Reset Database
```bash
# Remove volumes and restart
docker-compose down -v
docker-compose up --build
```

#### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Option 2: Local Development

#### Backend Setup
```bash
cd backend
npm install
npm run dev  # Runs on http://localhost:3001
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

**Note:** Make sure the backend is running before starting the frontend.

## 📁 Project Structure

```
CSE-4701-Project/
├── backend/
│   ├── src/
│   │   ├── server.js          # Main server file
│   │   ├── routes/
│   │   │   ├── auth.js        # Authentication routes
│   │   │   ├── admin.js       # Admin routes
│   │   │   └── checkout.js   # Checkout routes
│   │   └── db.js              # Database helper (optional)
│   ├── db/
│   │   ├── schema.sql         # Database schema
│   │   ├── sample_data.sql    # Sample data
│   │   ├── make_admin.sql     # Admin creation script
│   │   └── database.sqlite    # SQLite database file
│   ├── create-admin.js        # Admin account creator
│   ├── entrypoint.sh          # Docker entrypoint
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/             # React pages
│   │   ├── api/               # API client functions
│   │   └── main.jsx           # Entry point
│   └── package.json
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

## 🔧 Local Development

### Backend Development
```bash
cd backend
npm install
npm run dev  # Auto-reload with nodemon
```

The backend will run on `http://localhost:3001` by default.

### Frontend Development
```bash
cd frontend
npm install
npm run dev  # Vite dev server with HMR
```

The frontend will run on `http://localhost:5173` by default.

## 🔐 Environment Variables

### Backend

Create a `.env` file in the `backend/` directory (optional):

```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
```

**Note:** If `JWT_SECRET` is not set, the application will use a default value (not recommended for production).

### Frontend

The frontend uses Vite environment variables. For Docker builds, the API URL is set via build args in `docker-compose.yml`.

For local development, create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3001
```

**Important:** Vite requires the `VITE_` prefix for environment variables to be exposed to the client.

## 👤 Admin Account Setup

### Method 1: Using the Create Admin Script (Recommended)

**Local:**
```bash
cd backend
node create-admin.js admin@store.com admin123 1234567890 "Admin User"
```

**Docker:**
```bash
docker-compose exec backend node create-admin.js admin@store.com admin123 1234567890 "Admin User"
```

### Method 2: Using SQL Script

```bash
sqlite3 backend/db/database.sqlite < backend/db/make_admin.sql
```

### Method 3: Register and Promote

1. Register a new account via the frontend at http://localhost:5173/register
2. Promote to admin:
```bash
sqlite3 backend/db/database.sqlite "UPDATE User SET isAdmin = 1 WHERE email = 'your@email.com';"
```

### Verify Admin Account

```bash
sqlite3 backend/db/database.sqlite "SELECT userID, email, isAdmin FROM User WHERE isAdmin = 1;"
```

## 📡 API Endpoints

### Public Endpoints

- `GET /health` - Health check endpoint
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }
  ```
- `POST /auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- `POST /api/checkout` - Create order (requires authentication)

### Admin Endpoints (Require Admin Token)

All admin endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

- `GET /api/admin/stats/dashboard` - Dashboard statistics
- `GET /api/admin/manufacturers` - List manufacturers
- `POST /api/admin/manufacturer` - Add manufacturer
- `GET /api/admin/categories` - List categories
- `GET /api/admin/products` - List all products (admin view)
- `GET /api/admin/products/:id` - Get product details
- `POST /api/admin/add-product` - Add new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/inventory` - Get inventory across all locations
- `POST /api/admin/inventory/update` - Update inventory
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/orders/:id` - Get order details
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user details

## 🐛 Troubleshooting

### Docker Issues

**Containers not starting:**
```bash
# Check logs
docker-compose logs

# Rebuild images
docker-compose build --no-cache

# Reset everything
docker-compose down -v
docker-compose up --build
```

**Port already in use:**
- Backend: Change port mapping in `docker-compose.yml` (currently `3001:3000`)
- Frontend: Change port mapping in `docker-compose.yml` (currently `5173:5173`)

**Health check failures:**
- Ensure services are fully started before health checks run
- Check logs: `docker-compose logs backend` or `docker-compose logs frontend`

### Local Development Issues

**Backend connection errors:**
```bash
# Verify Node.js version (should be 16+)
node --version

# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Frontend cannot reach API:**
- Verify `VITE_API_URL` is set correctly in `frontend/.env`
- Ensure backend is running on the correct port (3001)
- Check browser console for CORS errors
- Restart the frontend dev server after changing `.env`

**Login returns 400 Bad Request:**
- Verify the database exists and has users
- Check backend logs for errors
- Ensure JWT_SECRET is set (or default is being used)

**Database issues:**
```bash
# Reset database
cd backend/db
rm database.sqlite
# Database will be recreated on next server start with sample data
```

**Native module build errors (Docker):**
```bash
# Rebuild without cache
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Common Errors

**"No token provided" or "Invalid token":**
- Ensure you're logged in
- Check that the token is being sent in the Authorization header
- Verify JWT_SECRET matches between token creation and verification

**"Admin privileges required":**
- Verify your account has `isAdmin = 1` in the database
- Log out and log back in to refresh your token

## 💡 Useful Commands

### Docker Commands

```bash
# Start services
docker-compose up --build

# Start in detached mode
docker-compose up -d --build

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f [service-name]

# Rebuild specific service
docker-compose build --no-cache backend
docker-compose up -d backend

# Enter container shell
docker-compose exec backend sh
docker-compose exec frontend sh

# Check service status
docker-compose ps
```

### Database Commands

```bash
# Query database
sqlite3 backend/db/database.sqlite "SELECT * FROM User LIMIT 10;"

# Create admin via SQL
sqlite3 backend/db/database.sqlite "UPDATE User SET isAdmin = 1 WHERE email = 'admin@store.com';"

# View all admins
sqlite3 backend/db/database.sqlite "SELECT userID, email, isAdmin FROM User WHERE isAdmin = 1;"

# Reset database
rm backend/db/database.sqlite
# Restart backend to recreate
```

### Development Commands

```bash
# Backend
cd backend
npm run dev      # Development with auto-reload
npm start        # Production mode

# Frontend
cd frontend
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## 📝 Notes

- The backend runs on port **3001** by default (mapped from 3000 in Docker)
- The frontend runs on port **5173** by default
- The database file is located at `backend/db/database.sqlite`
- Admin routes require a valid JWT token with `isAdmin: true`
- All API responses are in JSON format
- CORS is enabled for development

## 📄 License

This project is for educational purposes (CSE 4701).
