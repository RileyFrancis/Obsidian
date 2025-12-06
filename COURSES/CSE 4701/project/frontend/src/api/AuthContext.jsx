// frontend/src/api/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { fetchMe } from "./auth";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchMe(token);
        if (!data) {
          setUser(null);
        } else {
          // Normalize whatever the backend sends
          const normalized = {
            userID: data.userID ?? null,
            customerID: data.customerID ?? null,
            name: data.name || data.customerName || "User",
            email: data.email || null,
            phone: data.phone ?? null,
            // accept 1/0 or true/false
            isAdmin:
              data.isAdmin === true ||
              data.isAdmin === 1 ||
              data.email === "admin@store.com", // fallback
          };

          setUser(normalized);
          console.log("AuthContext loaded user:", normalized);
        }
      } catch (err) {
        console.error("Error in fetchMe:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  function login(token, userInfo) {
    localStorage.setItem("token", token);

    const normalized = {
      userID: userInfo.userID ?? null,
      customerID: userInfo.customerID ?? null,
      name: userInfo.name || "User",
      email: userInfo.email || null,
      phone: userInfo.phone ?? null,
      isAdmin:
        userInfo.isAdmin === true ||
        userInfo.isAdmin === 1 ||
        userInfo.email === "admin@store.com",
    };

    console.log("AuthContext login normalized:", normalized);
    setUser(normalized);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
