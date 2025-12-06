// frontend/src/pages/LoginPage.jsx
import React, { useState } from "react";
import { loginUser } from "../api/auth";
import { useAuth } from "../api/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await loginUser({ email, password });

    if (res.error) {
      alert(res.error);
      return;
    }

    login(res.token, res);
    navigate("/");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 300 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button style={{ width: "100%", padding: 10 }}>Login</button>
      </form>

      <p style={{ marginTop: 20 }}>
        Don't have an account?{" "}
        <Link to="/register">Create one here</Link>.
      </p>
    </div>
  );
}
