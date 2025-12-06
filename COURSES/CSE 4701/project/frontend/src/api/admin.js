const ADMIN_KEY = "supersecretadminkey"; // must match backend

export async function fetchManufacturers() {
  const res = await fetch("http://localhost:3001/api/admin/manufacturers", {
    headers: { "x-admin-key": ADMIN_KEY }
  });
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch("http://localhost:3001/api/admin/categories", {
    headers: { "x-admin-key": ADMIN_KEY }
  });
  return res.json();
}

export async function addManufacturer(name) {
  const res = await fetch("http://localhost:3001/api/admin/manufacturer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": ADMIN_KEY
    },
    body: JSON.stringify({ manufacturerName: name })
  });
  return res.json();
}

export async function addProduct(data) {
  const res = await fetch("http://localhost:3001/api/admin/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": ADMIN_KEY
    },
    body: JSON.stringify(data)
  });
  return res.json();
}
