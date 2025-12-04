// frontend/src/pages/Product.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProduct } from "../api/products";
import { useCart } from "../api/cartContext";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct(id).then(setProduct);
  }, [id]);

  if (!product) return <p>Loading...</p>;

  function handleAdd() {
    console.log("Add to cart clicked with:", product);
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <h2>${product.price}</h2>

      <button
        type="button"
        onClick={handleAdd}
        style={{
          padding: "10px 15px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Add to Cart
      </button>

      {added && (
        <p style={{ color: "green", marginTop: 10 }}>Added to cart!</p>
      )}

      <br />
      <br />
      <Link to="/">← Back to Store</Link>
    </div>
  );
}
