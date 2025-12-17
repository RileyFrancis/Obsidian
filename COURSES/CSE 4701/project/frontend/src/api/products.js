const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function fetchProducts() {
  try {
    const url = `${API_URL}/api/products`;
    console.log("Fetching products from:", url);
    console.log("API_URL value:", API_URL);
    console.log("VITE_API_URL env:", import.meta.env.VITE_API_URL);
    
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    console.error("Attempted URL:", `${API_URL}/api/products`);
    throw error;
  }
}

export async function fetchProduct(id) {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}