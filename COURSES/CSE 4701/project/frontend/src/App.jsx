// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import { useCart } from "./api/cartContext";
import { useAuth } from "./api/AuthContext";

import Home from "./pages/Home";
import Product from "./pages/Product";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CheckoutInfo from "./pages/CheckoutInfo";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminProducts from "./pages/AdminProducts";
import AdminInventory from "./pages/AdminInventory";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminReorders from "./pages/AdminReorders";

function Header() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header
      style={{
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#f8f9fa",
      }}
    >
      <Link to="/" style={{ textDecoration: "none", fontSize: 24, fontWeight: "bold" }}>
        Electronics Store
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
        {user ? (
          <>
            <span style={{ fontSize: 14 }}>Welcome, {user.email}</span>
            {user.isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                style={{
                  padding: "6px 12px",
                  cursor: "pointer",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Admin Dashboard
              </button>
            )}
            <button
              onClick={logout}
              style={{ padding: "6px 12px", cursor: "pointer", background: "#dc3545", color: "white", border: "none", borderRadius: "4px" }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: "none", fontSize: 14, color: "#007bff" }}>
              Login
            </Link>
            <Link to="/register" style={{ textDecoration: "none", fontSize: 14, color: "#007bff" }}>
              Register
            </Link>
          </>
        )}

        <Link to="/cart" style={{ textDecoration: "none", fontSize: 14, color: "#007bff", fontWeight: "bold" }}>
          🛒 Cart ({count})
        </Link>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Checkout */}
        <Route path="/checkout" element={<CheckoutInfo />} />
  <Route path="/order-confirmation/:orderID" element={<OrderConfirmation />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/:productID" element={<AdminAddProduct />} />
        <Route path="/admin/add-product" element={<AdminAddProduct />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:orderID" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/reorders" element={<AdminReorders />} />
      </Routes>
    </>
  );
}
