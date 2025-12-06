// frontend/src/pages/CheckoutInfo.jsx
import React, { useState } from "react";
import { useCart } from "../api/cartContext";
import { useNavigate } from "react-router-dom";

export default function CheckoutInfo() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [guest, setGuest] = useState({
    name: "",
    email: "",
    phone: ""
  });

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cart.length) {
      alert("Your cart is empty.");
      navigate("/");
      return;
    }

    const res = await fetch("http://localhost:3001/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, guest })
    });

    const data = await res.json();

    if (data.error) {
      alert("Error: " + data.error);
      return;
    }

    alert("Order placed! Order ID: " + data.orderID);
    clearCart();
    navigate("/");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Checkout Information</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 300 }}>
        <input
          placeholder="Full Name"
          value={guest.name}
          onChange={e => setGuest({ ...guest, name: e.target.value })}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <input
          placeholder="Email"
          value={guest.email}
          onChange={e => setGuest({ ...guest, email: e.target.value })}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <input
          placeholder="Phone"
          value={guest.phone}
          onChange={e => setGuest({ ...guest, phone: e.target.value })}
          style={{ width: "100%", marginBottom: 20 }}
        />

        <button style={{ padding: 10, width: "100%" }}>
          Place Order
        </button>
      </form>
    </div>
  );
}
