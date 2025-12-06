import React, { useEffect, useState } from "react";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminInventory() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(true); // ✅ FIXED

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
  }, [user, navigate]); // <-- proper dependencies

  // Fetch inventory only after we verified admin
  useEffect(() => {
    if (!user || !user.isAdmin) return;

    async function fetchInventory() {
      try {
        const res = await fetch("http://localhost:3001/api/admin/inventory", {
          headers: {
            "x-admin-key": "supersecretadminkey",
          },
        });

        const data = await res.json();
        setInventory(data);
      } catch (err) {
        console.error("Inventory fetch failed:", err);
      } finally {
        setLoadingInventory(false);
      }
    }

    fetchInventory();
  }, [user]);

  if (loadingInventory) {
    return <p style={{ padding: 20 }}>Loading inventory...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Inventory</h1>

      <table border="1" cellPadding="8" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Location</th>
            <th>Quantity</th>
          </tr>
        </thead>

        <tbody>
          {inventory.map((row) => (
            <tr key={`${row.productID}-${row.locationID}`}>
              <td>{row.name}</td>
              <td>{row.locationName}</td>
              <td>{row.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
