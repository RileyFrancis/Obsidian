export async function registerUser(data) {
  const res = await fetch("http://localhost:3001/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function loginUser(data) {
  const res = await fetch("http://localhost:3001/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchMe(token) {
  const res = await fetch("http://localhost:3001/auth/me", {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) return null; // avoids JSON parse errors

  return res.json();
}
