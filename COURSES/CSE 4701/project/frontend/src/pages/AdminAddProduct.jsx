// frontend/src/pages/AdminAddProduct.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../api/AuthContext";

export default function AdminAddProduct() {
  const { user, loading } = useAuth();

  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [manufacturerID, setManufacturerID] = useState("");
  const [newManufacturer, setNewManufacturer] = useState("");
  const [categoryIDs, setCategoryIDs] = useState([]);

  // While auth is loading
  if (loading) {
    return <div style={{ padding: 20 }}>Loading user...</div>;
  }

  // Not logged in
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Access Denied</h1>
        <p>You must be logged in as an admin to use this page.</p>
      </div>
    );
  }

  // Logged in but not admin
  const isAdmin =
    user.isAdmin === true || user.email === "admin@store.com";

  if (!isAdmin) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Access Denied</h1>
        <p>You must be an admin to use this page.</p>
      </div>
    );
  }

  useEffect(() => {
    async function loadAdminData() {
      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const res1 = await fetch("http://localhost:3001/api/admin/manufacturers", { headers });
      const res2 = await fetch("http://localhost:3001/api/admin/categories", { headers });

      const m = await res1.json();
      const c = await res2.json();

      setManufacturers(Array.isArray(m) ? m : []);
      setCategories(Array.isArray(c) ? c : []);
    }

    loadAdminData();
  }, []);


  async function handleSubmit(e) {
    e.preventDefault();

    const body = {
      name,
      description,
      price,
      manufacturerID,
      newManufacturer,
      categories: categoryIDs,
    };

    const res = await fetch(
      "http://localhost:3001/api/admin/add-product",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    alert(data.message || "Product added!");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Add New Product</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <label>Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Price:</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Manufacturer:</label>
        <select
          value={manufacturerID}
          onChange={(e) => setManufacturerID(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        >
          <option value="">Select Existing</option>
          {manufacturers.map((m) => (
            <option key={m.manufacturerID} value={m.manufacturerID}>
              {m.manufacturerName}
            </option>
          ))}
        </select>

        <label>Or add new manufacturer:</label>
        <input
          value={newManufacturer}
          onChange={(e) => setNewManufacturer(e.target.value)}
          placeholder="New Manufacturer Name"
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Categories:</label>
        <div style={{ marginBottom: 10 }}>
          {categories.map((cat) => (
            <label key={cat.categoryID} style={{ display: "block" }}>
              <input
                type="checkbox"
                value={cat.categoryID}
                onChange={(e) => {
                  const id = parseInt(e.target.value, 10);
                  setCategoryIDs((prev) =>
                    prev.includes(id)
                      ? prev.filter((x) => x !== id)
                      : [...prev, id]
                  );
                }}
              />
              {cat.categoryName}
            </label>
          ))}
        </div>

        <button type="submit" style={{ padding: 10, marginTop: 10 }}>
          Add Product
        </button>
      </form>
    </div>
  );
}

