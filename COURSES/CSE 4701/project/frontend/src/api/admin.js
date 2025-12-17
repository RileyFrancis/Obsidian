// Get API URL from environment, with fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(res) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    const message = (data && data.error) || res.statusText || "Request failed";
    throw new Error(message);
  }

  return data;
}

// ==================== DASHBOARD ====================
export async function fetchDashboardStats() {
  const res = await fetch(`${API_URL}/api/admin/stats/dashboard`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// ==================== MANUFACTURERS ====================
export async function fetchManufacturers() {
  const res = await fetch(`${API_URL}/api/admin/manufacturers`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function addManufacturer(name) {
  const res = await fetch(`${API_URL}/api/admin/manufacturer`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ manufacturerName: name }),
  });
  return res.json();
}

// ==================== CATEGORIES ====================
export async function fetchCategories() {
  const res = await fetch(`${API_URL}/api/admin/categories`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

// ==================== PRODUCTS ====================
export async function fetchProducts() {
  const res = await fetch(`${API_URL}/api/admin/products`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function fetchProduct(productID) {
  const res = await fetch(`${API_URL}/api/admin/products/${productID}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function addProduct(data) {
  const res = await fetch(`${API_URL}/api/admin/add-product`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProduct(productID, data) {
  const res = await fetch(`${API_URL}/api/admin/products/${productID}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProduct(productID) {
  const res = await fetch(`${API_URL}/api/admin/products/${productID}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return res.json();
}

// ==================== INVENTORY ====================
export async function fetchInventory() {
  const res = await fetch(`${API_URL}/api/admin/inventory`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function updateInventory(productID, locationID, quantity) {
  const res = await fetch(`${API_URL}/api/admin/inventory/update`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ productID, locationID, quantity }),
  });
  return res.json();
}

// ==================== ORDERS ====================
export async function fetchOrders() {
  const res = await fetch(`${API_URL}/api/admin/orders`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function fetchOrder(orderID) {
  const res = await fetch(`${API_URL}/api/admin/orders/${orderID}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// ==================== SHIPPING ====================
export async function addShippingInfo(orderID, shippingData) {
  const res = await fetch(`${API_URL}/api/admin/shipping`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ orderID, ...shippingData }),
  });
  return handleResponse(res);
}

export async function fetchShippingInfo(orderID) {
  const res = await fetch(`${API_URL}/api/admin/shipping/${orderID}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// ==================== REORDERS ====================
export async function fetchReorders() {
  const res = await fetch(`${API_URL}/api/admin/reorders`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function createReorder(productID, locationID, quantityOrdered) {
  const res = await fetch(`${API_URL}/api/admin/reorders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ productID, locationID, quantityOrdered }),
  });
  return handleResponse(res);
}

export async function orderReorder(reorderID) {
  const res = await fetch(`${API_URL}/api/admin/reorders/${reorderID}/order`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function receiveReorder(reorderID, quantityReceived, deliveryDate) {
  const res = await fetch(`${API_URL}/api/admin/reorders/${reorderID}/receive`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ quantityReceived, deliveryDate }),
  });
  return handleResponse(res);
}

export async function cancelReorder(reorderID) {
  const res = await fetch(`${API_URL}/api/admin/reorders/${reorderID}/cancel`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// ==================== USERS ====================
export async function fetchUsers() {
  const res = await fetch(`${API_URL}/api/admin/users`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function fetchUser(userID) {
  const res = await fetch(`${API_URL}/api/admin/users/${userID}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}
