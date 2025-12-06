// frontend/src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { registerUser } from "../api/auth";
import { useAuth } from "../api/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await registerUser({
      name,
      email,
      phone,
      password
    });

    if (res.error) {
      alert(res.error);
      return;
    }

    // Auto-login after registration
    login(res.token, res);
    navigate("/");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create an Account</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 300 }}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />

        <button
          style={{
            padding: "8px 16px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%"
          }}
        >
          Create Account
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        Already have an account?{" "}
        <Link to="/login">Log in here</Link>.
      </p>
    </div>
  );
}
