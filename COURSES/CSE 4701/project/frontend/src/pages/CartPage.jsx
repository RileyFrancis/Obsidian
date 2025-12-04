// frontend/src/pages/CartPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../api/cartContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ---------------------------
  // CHECKOUT FUNCTION
  // ---------------------------
  async function handleCheckout() {
    try {
      const res = await fetch("http://localhost:3001/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart })
      });

      const data = await res.json();

      if (data.error) {
        alert("Checkout failed: " + data.error);
        return;
      }

      alert("Order placed! Order ID: " + data.orderID);

      // Clear cart after a successful purchase
      clearCart();

    } catch (err) {
      alert("Checkout error: " + err.message);
    }
  }

  // ---------------------------
  // MAIN COMPONENT RENDER
  // ---------------------------
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

          {/* CHECKOUT BUTTON */}
          <button
            style={{
              padding: "10px 20px",
              background: "green",
              color: "white",
              borderRadius: 6,
              marginRight: 10,
            }}
            onClick={handleCheckout}
          >
            Checkout
          </button>

          {/* CLEAR CART BUTTON */}
          <button onClick={clearCart}>Clear Cart</button>
        </>
      )}

      <br />
      <br />
      <Link to="/">← Back to Store</Link>
    </div>
  );
}
