import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";
import { fetchDashboardStats } from "../api/admin";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // Check auth
  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Load stats
  useEffect(() => {
    if (!user || !user.isAdmin) return;

    async function loadStats() {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard stats");
        console.error(err);
      }
    }

    loadStats();
  }, [user]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  if (!stats) return <div style={{ padding: 20 }}>Loading stats...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.email}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.totalProducts}</div>
          <div className="stat-label">Total Products</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">${(stats.totalRevenue || 0).toFixed(2)}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
      </div>

      <div className="admin-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button
            className="action-btn"
            onClick={() => navigate("/admin/products")}
          >
            📦 Manage Products
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/admin/inventory")}
          >
            📊 Manage Inventory
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/admin/orders")}
          >
            📋 View Orders
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/admin/reorders")}
          >
            📦 Manage Reorders
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/admin/users")}
          >
            👥 Manage Users
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/admin/add-product")}
          >
            ➕ Add Product
          </button>
        </div>
      </div>

      <div className="recent-orders">
        <h2>Recent Orders</h2>
        {stats.recentOrders && stats.recentOrders.length > 0 ? (
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.orderID}>
                  <td>
                    <button
                      onClick={() => navigate(`/admin/orders`)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "blue",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      #{order.orderID}
                    </button>
                  </td>
                  <td>{order.customerName || "Guest"}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>{order.itemCount || 0}</td>
                  <td>${(order.amount || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "#999" }}>No recent orders</p>
        )}
      </div>
    </div>
  );
}
