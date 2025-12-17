import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../api/AuthContext";
import { fetchOrders, fetchOrder, addShippingInfo } from "../api/admin";
import "../styles/AdminOrders.css";

export default function AdminOrders() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { orderID } = useParams();

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [error, setError] = useState(null);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingForm, setShippingForm] = useState({
    shippingCompany: "",
    trackingNumber: "",
    shipDate: "",
    deliveryDate: ""
  });
  const [savingShipping, setSavingShipping] = useState(false);

  // Check auth
  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Load orders
  useEffect(() => {
    if (!user || !user.isAdmin) return;

    async function loadOrders() {
      try {
        const data = await fetchOrders();
        setOrders(data);

        // Load specific order if orderID provided
        if (orderID) {
          const orderData = await fetchOrder(orderID);
          setSelectedOrder(orderData);
        }
      } catch (err) {
        setError("Failed to load orders");
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    }

    loadOrders();
  }, [user, orderID]);

  async function handleSelectOrder(order) {
    setLoadingOrderDetails(true);
    setShowShippingForm(false);
    try {
      // Fetch full order details with items
      const orderData = await fetchOrder(order.orderID);
      setSelectedOrder(orderData);
      
      // Pre-fill shipping form if shipping info exists
      if (orderData.shipping) {
        setShippingForm({
          shippingCompany: orderData.shipping.shippingCompany || "",
          trackingNumber: orderData.shipping.trackingNumber || "",
          shipDate: orderData.shipping.shipDate ? orderData.shipping.shipDate.split('T')[0] : "",
          deliveryDate: orderData.shipping.deliveryDate ? orderData.shipping.deliveryDate.split('T')[0] : ""
        });
      } else {
        setShippingForm({
          shippingCompany: "",
          trackingNumber: "",
          shipDate: "",
          deliveryDate: ""
        });
      }
    } catch (err) {
      console.error("Failed to load order details:", err);
      setError("Failed to load order details");
      // Fallback to basic order info if fetch fails
      setSelectedOrder(order);
    } finally {
      setLoadingOrderDetails(false);
    }
  }

  async function handleSaveShipping(e) {
    e.preventDefault();
    if (!selectedOrder) return;

    setSavingShipping(true);
    try {
      await addShippingInfo(selectedOrder.orderID, shippingForm);
      alert("Shipping information saved successfully!");
      setShowShippingForm(false);
      // Reload order details to show updated shipping info
      const orderData = await fetchOrder(selectedOrder.orderID);
      setSelectedOrder(orderData);
    } catch (err) {
      console.error("Failed to save shipping:", err);
      alert("Failed to save shipping information: " + err.message);
    } finally {
      setSavingShipping(false);
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;

  return (
    <div className="admin-orders">
      <h1>Order Management</h1>

      <div className="orders-container">
        <div className="orders-list">
          <h2>All Orders</h2>
          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.orderID}
                      onClick={() => handleSelectOrder(order)}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedOrder?.orderID === order.orderID
                            ? "#e3f2fd"
                            : "white",
                      }}
                    >
                      <td>#{order.orderID}</td>
                      <td>{order.customerName || "Guest"}</td>
                      <td>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td>{order.itemCount || 0}</td>
                      <td>${(order.totalAmount || 0).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="order-details">
          <h2>Order Details</h2>
          {loadingOrderDetails ? (
            <p>Loading order details...</p>
          ) : selectedOrder ? (
            <div className="detail-card">
              <div className="detail-row">
                <span className="label">Order ID:</span>
                <span>{selectedOrder.orderID}</span>
              </div>

              <div className="detail-row">
                <span className="label">Customer:</span>
                <span>{selectedOrder.customerName || "Guest"}</span>
              </div>

              <div className="detail-row">
                <span className="label">Email:</span>
                <span>{selectedOrder.email || "N/A"}</span>
              </div>

              <div className="detail-row">
                <span className="label">Phone:</span>
                <span>{selectedOrder.phone || "N/A"}</span>
              </div>

              <div className="detail-row">
                <span className="label">Order Type:</span>
                <span>{selectedOrder.orderType}</span>
              </div>

              <div className="detail-row">
                <span className="label">Order Date:</span>
                <span>
                  {new Date(selectedOrder.orderDate).toLocaleDateString()}
                </span>
              </div>

              <div className="detail-row">
                <span className="label">Location:</span>
                <span>{selectedOrder.locationName || "Online"}</span>
              </div>

              <h3 style={{ marginTop: 20 }}>Items</h3>
              <table border="1" cellPadding="8" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item) => (
                      <tr key={item.orderItemID}>
                        <td>{item.name}</td>
                        <td>${parseFloat(item.priceAtPurchase).toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>
                          ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", color: "#999" }}>
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="detail-row" style={{ marginTop: 20 }}>
                <span className="label" style={{ fontSize: 16, fontWeight: "bold" }}>
                  Total:
                </span>
                <span style={{ fontSize: 16, fontWeight: "bold" }}>
                  ${(
                    selectedOrder.items?.reduce(
                      (sum, item) => sum + item.priceAtPurchase * item.quantity,
                      0
                    ) || 0
                  ).toFixed(2)}
                </span>
              </div>

              {/* Shipping Information Section - Only for online orders */}
              {selectedOrder.orderType === "online" && (
                <div style={{ marginTop: 30, padding: 15, border: "1px solid #ddd", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <h3 style={{ margin: 0 }}>Shipping Information</h3>
                    <button
                      onClick={() => setShowShippingForm(!showShippingForm)}
                      style={{
                        padding: "5px 15px",
                        background: showShippingForm ? "#6c757d" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      {showShippingForm ? "Cancel" : selectedOrder.shipping ? "Edit Shipping" : "Add Shipping"}
                    </button>
                  </div>

                  {showShippingForm ? (
                    <form onSubmit={handleSaveShipping}>
                      <div style={{ marginBottom: 10 }}>
                        <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                          Shipping Company: *
                        </label>
                        <input
                          type="text"
                          value={shippingForm.shippingCompany}
                          onChange={(e) => setShippingForm({ ...shippingForm, shippingCompany: e.target.value })}
                          placeholder="e.g., FedEx, UPS, USPS"
                          required
                          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                        />
                      </div>

                      <div style={{ marginBottom: 10 }}>
                        <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                          Tracking Number: *
                        </label>
                        <input
                          type="text"
                          value={shippingForm.trackingNumber}
                          onChange={(e) => setShippingForm({ ...shippingForm, trackingNumber: e.target.value })}
                          placeholder="Enter tracking number"
                          required
                          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                        />
                      </div>

                      <div style={{ marginBottom: 10 }}>
                        <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                          Ship Date:
                        </label>
                        <input
                          type="date"
                          value={shippingForm.shipDate}
                          onChange={(e) => setShippingForm({ ...shippingForm, shipDate: e.target.value })}
                          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                        />
                      </div>

                      <div style={{ marginBottom: 10 }}>
                        <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                          Delivery Date:
                        </label>
                        <input
                          type="date"
                          value={shippingForm.deliveryDate}
                          onChange={(e) => setShippingForm({ ...shippingForm, deliveryDate: e.target.value })}
                          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={savingShipping}
                        style={{
                          padding: "10px 20px",
                          background: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: savingShipping ? "not-allowed" : "pointer",
                          opacity: savingShipping ? 0.6 : 1
                        }}
                      >
                        {savingShipping ? "Saving..." : "Save Shipping Info"}
                      </button>
                    </form>
                  ) : selectedOrder.shipping ? (
                    <div>
                      <div className="detail-row">
                        <span className="label">Shipping Company:</span>
                        <span>{selectedOrder.shipping.shippingCompany}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Tracking Number:</span>
                        <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                          {selectedOrder.shipping.trackingNumber}
                        </span>
                      </div>
                      {selectedOrder.shipping.shipDate && (
                        <div className="detail-row">
                          <span className="label">Ship Date:</span>
                          <span>{new Date(selectedOrder.shipping.shipDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {selectedOrder.shipping.deliveryDate && (
                        <div className="detail-row">
                          <span className="label">Delivery Date:</span>
                          <span>{new Date(selectedOrder.shipping.deliveryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p style={{ color: "#999", fontStyle: "italic" }}>
                      No shipping information added yet. Click "Add Shipping" to add tracking details.
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: "#999" }}>Select an order to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
