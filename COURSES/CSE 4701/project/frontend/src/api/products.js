export async function fetchProducts() {
  const res = await fetch("http://localhost:3001/api/products");
  return res.json();
}

export async function fetchProduct(id) {
  const res = await fetch(`http://localhost:3001/api/products/${id}`);
  return res.json();
}