// frontend/src/api/cartContext.jsx
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(item) {
    console.log("addToCart called with:", item); // DEBUG

    setCart(prev => {
      const existing = prev.find(p => p.productID === item.productID);
      if (existing) {
        return prev.map(p =>
          p.productID === item.productID
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(p => p.productID !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const value = { cart, addToCart, removeFromCart, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    console.warn("useCart called outside of CartProvider!");
  }
  return ctx;
}
