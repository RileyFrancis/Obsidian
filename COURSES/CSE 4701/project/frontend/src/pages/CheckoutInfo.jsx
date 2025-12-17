// frontend/src/pages/CheckoutInfo.jsx
import React, { useState } from "react";
import { useCart } from "../api/cartContext";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";
import "./CheckoutInfo.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function CheckoutInfo() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [guest, setGuest] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [payment, setPayment] = useState({
    cardNumber: "",
    cardType: "Visa",
    exp: ""
  });
  const [useAccount, setUseAccount] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!cart.length) {
        alert("Your cart is empty.");
        navigate("/");
        return;
      }

      // Validate cart items have required fields
      const invalidItems = cart.filter(item => !item.productID || !item.quantity || !item.price);
      if (invalidItems.length > 0) {
        console.error("Invalid cart items:", invalidItems);
        alert("Some items in your cart are invalid. Please refresh and try again.");
        setLoading(false);
        return;
      }

      // Guest checkout validation
      if (!user && (!guest.name || !guest.email)) {
        alert("Please fill in guest information.");
        setLoading(false);
        return;
      }

      // Payment validation - either account or card required
      if (!useAccount) {
        if (!payment.cardNumber || !payment.exp || !payment.cardType) {
          alert("Please fill in all payment information.");
          setLoading(false);
          return;
        }
      }

      // Format cart items to ensure they have the right structure
      const formattedCart = cart.map(item => ({
        productID: item.productID,
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.price) || 0,
        name: item.name // Include name for reference, but backend will use productID
      }));

      const payload = {
        cart: formattedCart,
        user: user || null,
        guest: !user ? guest : null,
        payment: useAccount ? null : payment,
        useAccount: useAccount
      };

      console.log("Checkout payload:", payload);
      console.log("API_URL:", API_URL);

      const res = await fetch(`${API_URL}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      console.log("Response status:", res.status);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `HTTP ${res.status}: ${res.statusText}` }));
        throw new Error(errorData.error || `Checkout failed: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Response data:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.orderID) {
        throw new Error("Order was created but no order ID was returned");
      }

      // Navigate to order confirmation page using returned orderID
      clearCart();
      navigate(`/order-confirmation/${data.orderID}`);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed: " + (err.message || "Unknown error. Please try again."));
      setLoading(false);
    }
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-content">
        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cart.length === 0 ? (
              <p style={{ color: "#999" }}>Your cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.productID} className="summary-item">
                  <span>{item.name}</span>
                  <span>
                    {item.quantity} × ${item.price.toFixed(2)}
                  </span>
                  <span className="item-total">
                    ${(item.quantity * item.price).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="summary-total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>

          <button
            onClick={() => navigate("/cart")}
            className="btn-back-to-cart"
          >
            ← Back to Cart
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="checkout-form">
          {!user && (
            <fieldset>
              <legend>Guest Information</legend>
              <input
                type="text"
                placeholder="Full Name"
                value={guest.name}
                onChange={(e) => setGuest({ ...guest, name: e.target.value })}
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={guest.email}
                onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                required
              />

              <input
                type="tel"
                placeholder="Phone (optional)"
                value={guest.phone}
                onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
              />
            </fieldset>
          )}

          {user && (
            <div className="logged-in-info">
              <p>
                <strong>Logged in as:</strong> {user.email}
              </p>
              <label style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                <input
                  type="checkbox"
                  checked={useAccount}
                  onChange={(e) => setUseAccount(e.target.checked)}
                  style={{ marginRight: "8px" }}
                />
                <span>Use monthly account billing (if available)</span>
              </label>
            </div>
          )}

          <fieldset>
            <legend>Payment Information</legend>

            {!useAccount ? (
              <>
                <input
                  type="text"
                  placeholder="Card Number"
                  value={payment.cardNumber}
                  onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                  maxLength="19"
                  required={!useAccount}
                />

            <select
              value={payment.cardType}
              onChange={(e) => setPayment({ ...payment, cardType: e.target.value })}
            >
              <option>Visa</option>
              <option>Mastercard</option>
              <option>American Express</option>
              <option>Discover</option>
            </select>

                <input
                  type="text"
                  placeholder="MM/YYYY"
                  value={payment.exp}
                  onChange={(e) => {
                    // Auto-format as MM/YYYY
                    let value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 6);
                    }
                    setPayment({ ...payment, exp: value });
                  }}
                  maxLength="7"
                  pattern="\d{2}/\d{4}"
                  required={!useAccount}
                />
              </>
            ) : (
              <p style={{ color: "#666", fontStyle: "italic" }}>
                Order will be billed to your monthly account.
              </p>
            )}
          </fieldset>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-checkout">
              {loading ? "Processing..." : `Checkout - $${total.toFixed(2)}`}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
