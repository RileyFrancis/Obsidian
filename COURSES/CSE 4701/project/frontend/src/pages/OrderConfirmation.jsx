import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./CheckoutInfo.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function OrderConfirmation() {
  const { orderID } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/checkout/${orderID}`);
        if (!res.ok) throw new Error(`Failed to load order: ${res.status}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderID]);

  if (loading) return <div className="checkout-container"><h2>Loading order...</h2></div>;
  if (error) return <div className="checkout-container"><h2>Error</h2><p>{error}</p></div>;
  if (!order) return <div className="checkout-container"><h2>No order found</h2></div>;

  return (
    <div className="checkout-container">
      <h1>Order Confirmation</h1>

      <div className="confirmation-box">
        <p><strong>Order ID:</strong> {order.orderID}</p>
        <p><strong>Order Date:</strong> {order.orderDate}</p>
        <p><strong>Customer:</strong> {order.customerName || "Guest"} ({order.email || ""})</p>
        <p><strong>Shipping From:</strong> {order.locationName || "Online"}</p>

        <h3>Items</h3>
        <div className="summary-items">
          {order.items && order.items.length ? (
            order.items.map((it) => (
              <div key={it.orderItemID} className="summary-item">
                <span>{it.name}</span>
                <span>
                  {it.quantity} × ${Number(it.priceAtPurchase).toFixed(2)}
                </span>
                <span className="item-total">${(it.quantity * it.priceAtPurchase).toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p>No items in order.</p>
          )}
        </div>

        <div className="summary-total">
          <strong>Total: ${Number(order.totalAmount || 0).toFixed(2)}</strong>
        </div>

        <div style={{ marginTop: 20 }}>
          <Link to="/">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
