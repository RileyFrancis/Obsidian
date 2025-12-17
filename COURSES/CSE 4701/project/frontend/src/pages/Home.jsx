// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/products";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError(err.message || "Failed to load products. Please make sure the backend is running on port 3001.");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Storefront</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Storefront</h1>
        <div style={{ 
          background: "#fee", 
          padding: "15px", 
          borderRadius: "8px", 
          border: "1px solid #fcc",
          color: "#c33"
        }}>
          <h3>Error loading products</h3>
          <p>{error}</p>
          <p style={{ fontSize: "14px", marginTop: "10px" }}>
            <strong>Tip:</strong> Make sure the backend is running on port 3001.
            <br />
            Try: <code>cd backend && npm run dev</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Storefront</h1>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map((p) => (
            <div
              key={p.productID}
              style={{
                background: "#b2f6dbff",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 3px 6px rgba(0,0,0,0.5)",
              }}
            >
              <h3>{p.name}</h3>
              <p>${p.price}</p>
              <p>In stock: {p.quantity}</p>
              <Link to={`/product/${p.productID}`}>View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
