// frontend/src/pages/CartPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../api/cartContext";
import { useAuth } from "../api/AuthContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  // Payment state (required for ALL checkouts)
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("Visa");
  const [exp, setExp] = useState("");

  // Guest info (only required for NOT logged in)
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleCheckout() {
    if (!cardNumber || !exp) {
      alert("Please enter payment details.");
      return;
    }

    const payment = {
      cardNumber,
      cardType,
      exp
    };

    const guest = !user
      ? {
          name: guestName,
          email: guestEmail,
          phone: guestPhone
        }
      : null;

    if (!user && (!guestName || !guestEmail)) {
      alert("Guest checkout requires name and email.");
      return;
    }

    const res = await fetch("http://localhost:3001/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart,
        user,
        guest,
        payment
      })
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert("Order placed! Order ID: " + data.orderID);
      clearCart();
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Cart</h1>

      {cart.length === 0 && <p>Your cart is empty.</p>}

      {cart.map((item) => (
        <div key={item.productID} style={{ marginBottom: 20 }}>
          <h3>{item.name}</h3>
          <p>Qty: {item.quantity}</p>
          <p>Subtotal: ${(item.quantity * item.price).toFixed(2)}</p>

          <button onClick={() => removeFromCart(item.productID)}>
            Remove
          </button>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <h2>Total: ${total.toFixed(2)}</h2>

          {/* Guest fields */}
          {!user && (
            <div style={{ marginTop: 20 }}>
              <h3>Guest Information</h3>
              <input
                placeholder="Full Name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                style={{ width: "100%", marginBottom: 10 }}
              />
              <input
                placeholder="Email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                style={{ width: "100%", marginBottom: 10 }}
              />
              <input
                placeholder="Phone (optional)"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                style={{ width: "100%", marginBottom: 10 }}
              />
            </div>
          )}

          {/* Payment section */}
          <div style={{ marginTop: 20 }}>
            <h3>Payment Information</h3>

            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
            />

            <select
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
            >
              <option>Visa</option>
              <option>MasterCard</option>
              <option>Discover</option>
              <option>AmEx</option>
            </select>

            <input
              type="date"
              value={exp}
              onChange={(e) => setExp(e.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
            />
          </div>

          <button
            style={{
              padding: "10px 20px",
              background: "green",
              color: "white",
              marginTop: 20,
              borderRadius: 6
            }}
            onClick={handleCheckout}
          >
            Checkout
          </button>

          <button onClick={clearCart} style={{ marginLeft: 10 }}>
            Clear Cart
          </button>
        </>
      )}

      <br /><br />
      <Link to="/">← Back to Store</Link>
    </div>
  );
}
