import React, { useEffect, useState } from "react";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchInventory, updateInventory } from "../api/admin";
import "../styles/AdminInventory.css";

export default function AdminInventory() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Redirect rules inside useEffect (required by React)
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

  // Fetch inventory only after we verified admin
  useEffect(() => {
    if (!user || !user.isAdmin) return;

    async function fetchInv() {
      try {
        const data = await fetchInventory();
        setInventory(data);
      } catch (err) {
        console.error("Inventory fetch failed:", err);
        alert("Failed to load inventory: " + err.message);
      } finally {
        setLoadingInventory(false);
      }
    }

    fetchInv();
  }, [user]);

  async function handleUpdateQuantity(productID, locationID, newQuantity) {
    try {
      await updateInventory(productID, locationID, parseInt(newQuantity));
      // Update local state
      setInventory(
        inventory.map((row) =>
          row.productID === productID && row.locationID === locationID
            ? { ...row, quantity: parseInt(newQuantity) }
            : row
        )
      );
      setEditingKey(null);
      alert("Inventory updated successfully");
    } catch (err) {
      alert("Failed to update inventory: " + err.message);
    }
  }

  if (loadingInventory) {
    return <p className="loading">Loading inventory...</p>;
  }

  return (
    <div className="admin-inventory-container">
      <h1>Admin Inventory</h1>

      <div className="inventory-table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Location</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No inventory data
                </td>
              </tr>
            ) : (
              inventory.map((row) => {
                const key = `${row.productID}-${row.locationID}`;
                const isEditing = editingKey === key;

                return (
                  <tr key={key}>
                    <td>{row.productID}</td>
                    <td>{row.name}</td>
                    <td>{row.locationName}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="quantity-input"
                        />
                      ) : (
                        row.quantity
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                row.productID,
                                row.locationID,
                                editValue
                              )
                            }
                            className="btn-save"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingKey(null)}
                            className="btn-cancel"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingKey(key);
                            setEditValue(row.quantity);
                          }}
                          className="btn-edit"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
