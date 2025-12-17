import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";
import { fetchProducts, deleteProduct } from "../api/admin";
import "../styles/AdminProducts.css";

export default function AdminProducts() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);

  // Check auth
  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Load products
  useEffect(() => {
    if (!user || !user.isAdmin) return;

    async function loadProducts() {
      try {
        setError(null);
        const data = await fetchProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError(err.message || "Failed to load products. Please check your connection and try again.");
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, [user]);

  async function handleDelete(productID) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProduct(productID);
      setProducts(products.filter((p) => p.productID !== productID));
      alert("Product deleted successfully");
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Manage Products</h1>
        <div style={{ 
          background: "#fee", 
          padding: "15px", 
          borderRadius: "8px", 
          border: "1px solid #fcc",
          color: "#c33"
        }}>
          <h3>Error loading products</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: "10px", padding: "8px 16px" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="products-header">
        <h1>Manage Products</h1>
        <button
          className="add-btn"
          onClick={() => navigate("/admin/add-product")}
        >
          + Add New Product
        </button>
      </div>

      {loadingProducts ? (
        <p>Loading products...</p>
      ) : (
        <div className="products-table-container">
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Manufacturer</th>
                <th>Price</th>
                <th>Categories</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.productID}>
                    <td>{product.productID}</td>
                    <td>{product.name}</td>
                    <td>{product.manufacturerName || "N/A"}</td>
                    <td>${parseFloat(product.price).toFixed(2)}</td>
                    <td>
                      {product.categories && product.categories.length > 0
                        ? Array.isArray(product.categories)
                          ? product.categories.map(c => c.categoryName || c).join(", ")
                          : product.categories
                        : "None"}
                    </td>
                    <td className="actions-cell">
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/admin/products/${product.productID}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(product.productID)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
