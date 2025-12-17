// frontend/src/pages/CartPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../api/cartContext";
import "./CartPage.css";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button onClick={() => navigate("/")} className="btn-continue">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.productID} className="cart-item">
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-meta">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>

                <div className="item-total">
                  ${(item.quantity * item.price).toFixed(2)}
                </div>

                <button
                  onClick={() => removeFromCart(item.productID)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>

            <div className="summary-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="cart-actions">
              <button onClick={handleCheckout} className="btn-checkout">
                Proceed to Checkout
              </button>

              <button onClick={clearCart} className="btn-clear-cart">
                Clear Cart
              </button>

              <button
                onClick={() => navigate("/")}
                className="btn-continue-shopping"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
