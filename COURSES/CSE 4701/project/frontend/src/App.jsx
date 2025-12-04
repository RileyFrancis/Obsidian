// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useCart } from "./api/cartContext";

import Home from "./pages/Home";
import Product from "./pages/Product";
import CartPage from "./pages/CartPage";

function Header() {
  const { cart } = useCart();
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

      <Link to="/cart" style={{ textDecoration: "none", fontSize: 18 }}>
        Cart ({count})
      </Link>
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
      </Routes>
    </>
  );
}
