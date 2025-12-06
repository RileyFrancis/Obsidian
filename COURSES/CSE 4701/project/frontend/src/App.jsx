// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import { useCart } from "./api/cartContext";
import { useAuth } from "./api/AuthContext";

import Home from "./pages/Home";
import Product from "./pages/Product";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CheckoutInfo from "./pages/CheckoutInfo";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminInventory from "./pages/AdminInventory";

function Header() {
  const { cart } = useCart();
  const { user, logout } = useAuth();

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
      }}
    >
      <Link to="/" style={{ textDecoration: "none", fontSize: 24 }}>
        Electronics Store
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <button
              onClick={logout}
              style={{ padding: "4px 8px", cursor: "pointer" }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: "none", fontSize: 16 }}>
              Login
            </Link>
            <Link
              to="/register"
              style={{ textDecoration: "none", fontSize: 16 }}
            >
              Register
            </Link>
          </>
        )}

        <Link to="/cart" style={{ textDecoration: "none", fontSize: 18 }}>
          Cart ({count})
        </Link>

        {/* Admin links (will only be useful if you actually use them) */}
        <Link to="/admin/add-product" style={{ textDecoration: "none" }}>
          Admin: Products
        </Link>
        <Link to="/admin/inventory" style={{ textDecoration: "none" }}>
          Admin: Inventory
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
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<CartPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Guest checkout info page */}
        <Route path="/checkout-info" element={<CheckoutInfo />} />

        {/* Admin */}
        <Route path="/admin/add-product" element={<AdminAddProduct />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
      </Routes>
    </>
  );
}
