import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";
import { fetchUsers, fetchUser } from "../api/admin";
import "../styles/AdminUsers.css";

export default function AdminUsers() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [error, setError] = useState(null);

  // Check auth
  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Load users
  useEffect(() => {
    if (!user || !user.isAdmin) return;

    async function loadUsers() {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError("Failed to load users");
        console.error(err);
      } finally {
        setLoadingUsers(false);
      }
    }

    loadUsers();
  }, [user]);

  async function handleSelectUser(user) {
    setLoadingUserDetails(true);
    try {
      // Fetch full user details with orders
      const userData = await fetchUser(user.userID);
      setSelectedUser(userData);
    } catch (err) {
      console.error("Failed to load user details:", err);
      setError("Failed to load user details");
      // Fallback to basic user info if fetch fails
      setSelectedUser(user);
    } finally {
      setLoadingUserDetails(false);
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;

  return (
    <div className="admin-users">
      <h1>User Management</h1>

      <div className="users-container">
        <div className="users-list">
          <h2>All Users</h2>
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Orders</th>
                  <th>Admin</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u.userID}
                      onClick={() => handleSelectUser(u)}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedUser?.userID === u.userID
                            ? "#e3f2fd"
                            : "white",
                      }}
                    >
                      <td>{u.userID}</td>
                      <td>{u.email}</td>
                      <td>{u.customerName || "N/A"}</td>
                      <td>{u.phone || "N/A"}</td>
                      <td>{u.orderCount || 0}</td>
                      <td>{u.isAdmin ? "Yes" : "No"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="user-details">
          <h2>User Details</h2>
          {loadingUserDetails ? (
            <p>Loading user details...</p>
          ) : selectedUser ? (
            <div className="detail-card">
              <div className="detail-row">
                <span className="label">User ID:</span>
                <span>{selectedUser.userID}</span>
              </div>

              <div className="detail-row">
                <span className="label">Email:</span>
                <span>{selectedUser.email}</span>
              </div>

              <div className="detail-row">
                <span className="label">Phone:</span>
                <span>{selectedUser.phone || "N/A"}</span>
              </div>

              <div className="detail-row">
                <span className="label">Customer Name:</span>
                <span>{selectedUser.customerName || "N/A"}</span>
              </div>

              <div className="detail-row">
                <span className="label">Admin:</span>
                <span>{selectedUser.isAdmin ? "Yes" : "No"}</span>
              </div>

              <div className="detail-row">
                <span className="label">Total Orders:</span>
                <span>{selectedUser.orderCount || 0}</span>
              </div>

              <h3 style={{ marginTop: 20 }}>Order History</h3>
              {selectedUser.orders && selectedUser.orders.length > 0 ? (
                <table border="1" cellPadding="8" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUser.orders.map((order) => (
                      <tr key={order.orderID}>
                        <td>
                          <button
                            onClick={() =>
                              navigate(`/admin/orders`)
                            }
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
                        <td>
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td>{order.orderType}</td>
                        <td>${(order.totalAmount || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: "#999" }}>No orders found for this user.</p>
              )}
            </div>
          ) : (
            <p style={{ color: "#999" }}>Select a user to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
