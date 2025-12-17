import React, { useEffect, useState } from "react";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  fetchReorders,
  createReorder,
  orderReorder,
  receiveReorder,
  cancelReorder,
  fetchProducts,
  fetchInventory,
} from "../api/admin";
import "../styles/AdminInventory.css";

export default function AdminReorders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reorders, setReorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showReceiveForm, setShowReceiveForm] = useState(null);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [newReorder, setNewReorder] = useState({
    productID: "",
    locationID: "",
    quantityOrdered: 50,
  });
  const [receiveData, setReceiveData] = useState({
    quantityReceived: "",
    deliveryDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!user.isAdmin) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || !user.isAdmin) return;

    async function loadData() {
      try {
        const [reordersData, productsData, inventoryData] = await Promise.all([
          fetchReorders(),
          fetchProducts(),
          fetchInventory(),
        ]);

        setReorders(reordersData);
        setProducts(productsData);

        // Extract unique locations from inventory
        const locationMap = new Map();
        inventoryData.forEach((item) => {
          if (!locationMap.has(item.locationID)) {
            locationMap.set(item.locationID, {
              locationID: item.locationID,
              locationName: item.locationName,
            });
          }
        });
        setLocations(Array.from(locationMap.values()));
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load reorders: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  async function handleCreateReorder(e) {
    e.preventDefault();
    try {
      await createReorder(
        parseInt(newReorder.productID),
        parseInt(newReorder.locationID),
        parseInt(newReorder.quantityOrdered)
      );
      alert("Reorder created successfully!");
      setShowCreateForm(false);
      setNewReorder({ productID: "", locationID: "", quantityOrdered: 50 });
      
      // Reload reorders
      const data = await fetchReorders();
      setReorders(data);
    } catch (err) {
      alert("Failed to create reorder: " + err.message);
    }
  }

  async function handleOrderReorder(reorderID) {
    if (!window.confirm("Mark this reorder as ordered? Expected delivery in 1 week.")) {
      return;
    }

    try {
      await orderReorder(reorderID);
      alert("Reorder marked as ordered. Expected delivery in 1 week.");
      
      // Reload reorders
      const data = await fetchReorders();
      setReorders(data);
    } catch (err) {
      alert("Failed to order reorder: " + err.message);
    }
  }

  async function handleReceiveReorder(reorderID) {
    try {
      const qty = receiveData.quantityReceived
        ? parseInt(receiveData.quantityReceived)
        : null;
      await receiveReorder(reorderID, qty, receiveData.deliveryDate);
      alert("Reorder received! Inventory has been updated automatically.");
      setShowReceiveForm(null);
      setReceiveData({
        quantityReceived: "",
        deliveryDate: new Date().toISOString().split("T")[0],
      });

      // Reload reorders
      const data = await fetchReorders();
      setReorders(data);
    } catch (err) {
      alert("Failed to receive reorder: " + err.message);
    }
  }

  async function handleCancelReorder(reorderID) {
    if (!window.confirm("Cancel this reorder?")) {
      return;
    }

    try {
      await cancelReorder(reorderID);
      alert("Reorder cancelled");
      
      // Reload reorders
      const data = await fetchReorders();
      setReorders(data);
    } catch (err) {
      alert("Failed to cancel reorder: " + err.message);
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case "Pending":
        return "#ffc107";
      case "Ordered":
        return "#17a2b8";
      case "Received":
        return "#28a745";
      case "Cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  }

  if (loading) {
    return <p className="loading">Loading reorders...</p>;
  }

  return (
    <div className="admin-inventory-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1>Reorder Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: "10px 20px",
            background: showCreateForm ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showCreateForm ? "Cancel" : "+ Create Reorder"}
        </button>
      </div>

      {showCreateForm && (
        <div
          style={{
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: 20,
            background: "#f9f9f9",
          }}
        >
          <h3>Create New Reorder</h3>
          <form onSubmit={handleCreateReorder}>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}>
                Product: *
              </label>
              <select
                value={newReorder.productID}
                onChange={(e) =>
                  setNewReorder({ ...newReorder, productID: e.target.value })
                }
                required
                style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.productID} value={p.productID}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}>
                Location: *
              </label>
              <select
                value={newReorder.locationID}
                onChange={(e) =>
                  setNewReorder({ ...newReorder, locationID: e.target.value })
                }
                required
                style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
              >
                <option value="">Select Location</option>
                {locations.map((l) => (
                  <option key={l.locationID} value={l.locationID}>
                    {l.locationName}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}>
                Quantity: *
              </label>
              <input
                type="number"
                min="1"
                value={newReorder.quantityOrdered}
                onChange={(e) =>
                  setNewReorder({
                    ...newReorder,
                    quantityOrdered: parseInt(e.target.value) || 0,
                  })
                }
                required
                style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Create Reorder
            </button>
          </form>
        </div>
      )}

      {error && (
        <div style={{ padding: 15, background: "#fee", color: "#c33", borderRadius: "8px", marginBottom: 20 }}>
          {error}
        </div>
      )}

      <div className="inventory-table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Reorder ID</th>
              <th>Product</th>
              <th>Manufacturer</th>
              <th>Location</th>
              <th>Request Date</th>
              <th>Quantity</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th>Expected/Actual Delivery</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reorders.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-data">
                  No reorders found
                </td>
              </tr>
            ) : (
              reorders.map((reorder) => (
                <tr key={reorder.reorderID}>
                  <td>#{reorder.reorderID}</td>
                  <td>{reorder.productName}</td>
                  <td>{reorder.manufacturerName}</td>
                  <td>{reorder.locationName}</td>
                  <td>
                    {new Date(reorder.requestDate).toLocaleDateString()}
                  </td>
                  <td>{reorder.quantityOrdered}</td>
                  <td>{reorder.currentQuantity || 0}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        background: getStatusColor(reorder.status),
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    >
                      {reorder.status}
                    </span>
                  </td>
                  <td>
                    {reorder.status === "Ordered" && reorder.expectedDeliveryDate && (
                      <span style={{ fontSize: "12px", color: "#17a2b8" }}>
                        Expected: {new Date(reorder.expectedDeliveryDate).toLocaleDateString()}
                        <br />
                        <small>(1 week from order)</small>
                      </span>
                    )}
                    {reorder.status === "Received" && reorder.deliveryDate && (
                      <span style={{ fontSize: "12px", color: "#28a745" }}>
                        Delivered: {new Date(reorder.deliveryDate).toLocaleDateString()}
                        {reorder.quantityReceived && (
                          <>
                            <br />
                            <small>Qty: {reorder.quantityReceived}</small>
                          </>
                        )}
                      </span>
                    )}
                    {reorder.status === "Pending" && (
                      <span style={{ fontSize: "12px", color: "#999" }}>Not yet ordered</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      {reorder.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleOrderReorder(reorder.reorderID)}
                            style={{
                              padding: "5px 10px",
                              background: "#17a2b8",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            Mark Ordered
                          </button>
                          <button
                            onClick={() => handleCancelReorder(reorder.reorderID)}
                            style={{
                              padding: "5px 10px",
                              background: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {reorder.status === "Ordered" && (
                        <>
                          <button
                            onClick={() => setShowReceiveForm(reorder.reorderID)}
                            style={{
                              padding: "5px 10px",
                              background: "#28a745",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            Receive
                          </button>
                          <button
                            onClick={() => handleCancelReorder(reorder.reorderID)}
                            style={{
                              padding: "5px 10px",
                              background: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Receive Form Modal */}
      {showReceiveForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowReceiveForm(null)}
        >
          <div
            style={{
              background: "white",
              border: "2px solid #28a745",
              borderRadius: "8px",
              padding: 20,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              minWidth: 400,
              maxWidth: 500,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const reorder = reorders.find((r) => r.reorderID === showReceiveForm);
              if (!reorder) return null;
              return (
                <>
                  <h3 style={{ marginTop: 0 }}>Receive Reorder #{reorder.reorderID}</h3>
                  <p>
                    <strong>Product:</strong> {reorder.productName}
                    <br />
                    <strong>Location:</strong> {reorder.locationName}
                    <br />
                    <strong>Quantity Ordered:</strong> {reorder.quantityOrdered}
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleReceiveReorder(reorder.reorderID);
                    }}
                  >
                    <div style={{ marginBottom: 15 }}>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}>
                        Quantity Received (defaults to {reorder.quantityOrdered}):
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={receiveData.quantityReceived}
                        onChange={(e) =>
                          setReceiveData({
                            ...receiveData,
                            quantityReceived: e.target.value,
                          })
                        }
                        placeholder={reorder.quantityOrdered.toString()}
                        style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
                      />
                    </div>
                    <div style={{ marginBottom: 15 }}>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}>
                        Delivery Date:
                      </label>
                      <input
                        type="date"
                        value={receiveData.deliveryDate}
                        onChange={(e) =>
                          setReceiveData({
                            ...receiveData,
                            deliveryDate: e.target.value,
                          })
                        }
                        required
                        style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => setShowReceiveForm(null)}
                        style={{
                          padding: "8px 16px",
                          background: "#6c757d",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          padding: "8px 16px",
                          background: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Confirm Receive
                      </button>
                    </div>
                  </form>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
