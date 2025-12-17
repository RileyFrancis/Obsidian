const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function registerUser(data) {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    const result = await res.json();
    
    if (!res.ok) {
      throw new Error(result.error || `Registration failed: ${res.status} ${res.statusText}`);
    }
    
    return result;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function loginUser(data) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    const result = await res.json();
    
    if (!res.ok) {
      throw new Error(result.error || `Login failed: ${res.status} ${res.statusText}`);
    }
    
    return result;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function fetchMe(token) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) return null; // avoids JSON parse errors

  return res.json();
}
