# CSE 4701 Group Project - Electronic Vendor Database

A full-stack web application for managing an electronic vendor database (similar to Best Buy), built with React frontend and Python Flask backend connected to Oracle SQL database.

## Project Overview

This project implements a comprehensive database system for an electronics vendor that operates both online and in-store. The system manages:

- **Products and Groupings:** Products organized by type, manufacturer, and categories
- **Customers and Payments:** Contract customers with accounts and infrequent customers with card payments
- **Online Sales and Shipping:** Order tracking with shipping information
- **Inventory Management:** Real-time inventory tracking across stores and warehouses
- **Sales Analytics:** Data analysis for corporate planning

## Tech Stack

- **Frontend:** React 18, Vite, React Router
- **Backend:** Python 3.8+, Flask, cx_Oracle
- **Database:** Oracle SQL
- **API:** RESTful API with JSON responses

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Oracle Database
- Oracle Instant Client

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Oracle database credentials
python app/main.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Database Setup

Run the SQL schema script in your Oracle database:

```bash
sqlplus username/password@database < db/schema.sql
```

## Project Structure

```
CSE-4701-Project/
├── backend/          # Flask API server
│   ├── app/          # Application package
│   ├── config/       # Configuration
│   ├── database/     # Database connection
│   ├── routes/       # API endpoints
│   └── ...
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── ...
└── db/              # Database scripts
    └── schema.sql   # Oracle schema
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `GET /api/customers` - List all customers
- `GET /api/orders` - List all orders
- `GET /api/inventory` - Get inventory levels
- `GET /api/analytics/sales` - Sales analytics
- `GET /api/reorders` - List reorders

## Database Schema

The database includes 14 tables:
- Core: Manufacturer, Category, Product, Location, Customer, Payment_Info
- Transactional: Order, Order_Item, Product_Category, Inventory
- Logistical: Shipment, Reorder, Reorder_Delivery

See `db/schema.sql` for complete schema.

## Documentation

- [SETUP.md](SETUP.md) - Detailed setup instructions
- [db/schema.sql](db/schema.sql) - Database schema

## Development

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5173`
- API proxy configured in `vite.config.js`

## License

This project is for educational purposes (CSE 4701).
