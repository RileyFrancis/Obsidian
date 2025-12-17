// frontend/src/pages/Product.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProduct } from "../api/products";
import { useCart } from "../api/cartContext";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);   // NEW

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct(id).then(setProduct);
  }, [id]);

  if (!product) return <p>Loading...</p>;

  function handleAdd() {
    console.log("Add to cart clicked with:", product, "qty:", quantity);

    addToCart({
      ...product,
      quantity,   // pass quantity into cart item
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <h2>${product.price}</h2>

      {/* Quantity Selector */}
      <div style={{ margin: "15px 0" }}>
        <label style={{ marginRight: "10px" }}>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{
            width: "60px",
            padding: "5px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Add to Cart Button */}
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

      <br /><br />
      <Link to="/">← Back to Store</Link>
    </div>
  );
}
