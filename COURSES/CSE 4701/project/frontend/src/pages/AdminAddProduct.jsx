// frontend/src/pages/AdminAddProduct.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../api/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchManufacturers,
  fetchCategories,
  addProduct,
  updateProduct,
  fetchProduct,
} from "../api/admin";

export default function AdminAddProduct() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { productID } = useParams();

  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [manufacturerID, setManufacturerID] = useState("");
  const [newManufacturer, setNewManufacturer] = useState("");
  const [categoryIDs, setCategoryIDs] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Check auth
  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Load dropdowns and product data
  useEffect(() => {
    if (!user || !user.isAdmin) return;

    async function loadData() {
      try {
        const mfg = await fetchManufacturers();
        const cat = await fetchCategories();
        setManufacturers(Array.isArray(mfg) ? mfg : []);
        setCategories(Array.isArray(cat) ? cat : []);

        // If editing, load product data
        if (productID) {
          const product = await fetchProduct(productID);
          setName(product.name);
          setDescription(product.description || "");
          setPrice(product.price);
          setManufacturerID(product.manufacturerID);
          setCategoryIDs(product.categories?.map((c) => c.categoryID) || []);
        }
      } catch (err) {
        alert("Failed to load data: " + err.message);
      }
    }

    loadData();
  }, [user, productID]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const finalManufacturerID = manufacturerID || null;

      const body = {
        name,
        description,
        price: parseFloat(price),
        manufacturerID: finalManufacturerID,
        newManufacturer,
        categories: categoryIDs,
      };

      let result;
      if (productID) {
        result = await updateProduct(productID, body);
      } else {
        result = await addProduct(body);
      }

      if (result.status === "success" || result.message) {
        alert(result.message || "Product saved successfully!");
        navigate("/admin/products");
      } else {
        alert("Error: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      alert("Failed to save product: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>{productID ? "Edit Product" : "Add New Product"}</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}>
            Product Name:
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}>
            Description:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}>
            Price:
          </label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}>
            Manufacturer:
          </label>
          <select
            value={manufacturerID}
            onChange={(e) => setManufacturerID(e.target.value)}
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          >
            <option value="">Select Existing Manufacturer</option>
            {manufacturers.map((m) => (
              <option key={m.manufacturerID} value={m.manufacturerID}>
                {m.manufacturerName}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}>
            Or Create New Manufacturer:
          </label>
          <input
            value={newManufacturer}
            onChange={(e) => setNewManufacturer(e.target.value)}
            placeholder="New Manufacturer Name"
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: 5 }}>
            Categories:
          </label>
          <div style={{ border: "1px solid #ddd", padding: 10, borderRadius: 4 }}>
            {categories.length === 0 ? (
              <p>No categories available</p>
            ) : (
              categories.map((cat) => (
                <label
                  key={cat.categoryID}
                  style={{ display: "block", marginBottom: 8 }}
                >
                  <input
                    type="checkbox"
                    checked={categoryIDs.includes(cat.categoryID)}
                    onChange={(e) => {
                      const id = cat.categoryID;
                      if (e.target.checked) {
                        setCategoryIDs([...categoryIDs, id]);
                      } else {
                        setCategoryIDs(categoryIDs.filter((x) => x !== id));
                      }
                    }}
                    style={{ marginRight: 8 }}
                  />
                  {cat.categoryName}
                </label>
              ))
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "10px 20px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? "Saving..." : productID ? "Update Product" : "Add Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            style={{
              padding: "10px 20px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
