import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isStaff = localStorage.getItem("isStaff") === "true";

  const navItems = [
    { path: "/dashboard", icon: "📊", label: "Dashboard", adminOnly: true },
    { path: "/predict", icon: "🔍", label: "Predict" },
    { path: "/customers", icon: "👥", label: "Customers", adminOnly: true },
    { path: "/billing", icon: "🧾", label: "Billing", adminOnly: true },
  ].filter(item => !item.adminOnly || isStaff);

  return (
    <div className="app-sidebar">
      {/* Logo */}
      <div style={{ padding: "20px 16px", borderBottom: "1px solid #e9ecef" }}>
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "#534AB7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            CIP
          </div>
          <span
            style={{ fontWeight: "700", fontSize: "16px", color: "#1a1a2e" }}
          >
            Customer Intelligence Platform
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "12px 8px" }}>
        <div
          style={{
            fontSize: "0.7rem",
            color: "#aaa",
            padding: "8px 8px 4px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Menu
        </div>

        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 10px",
                borderRadius: "8px",
                marginBottom: "2px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: isActive ? "600" : "400",
                backgroundColor: isActive ? "#EEEDFE" : "transparent",
                color: isActive ? "#534AB7" : "#555",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Logged In User Profile Card */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #e9ecef", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "#EEEDFE",
          color: "#534AB7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "700",
          fontSize: "14px",
          textTransform: "uppercase",
          flexShrink: 0
        }}>
          {(localStorage.getItem("username") || "U").charAt(0)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#1a1a2e", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
            {localStorage.getItem("username") || "User"}
          </span>
          <span style={{ fontSize: "0.7rem", color: "#888" }}>
            Active Profile
          </span>
        </div>
      </div>

      {/* Sidebar Footer actions */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid #e9ecef", display: "flex", flexDirection: "column", gap: "8px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "7px",
            border: "1px solid #e9ecef",
            backgroundColor: "#fff",
            color: "#534AB7",
            fontSize: "0.82rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          🏠 Back to Home
        </button>
        <button
          onClick={async () => {
            try {
              const token = localStorage.getItem("authToken");
              if (token) {
                await fetch("/api/logout/", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                  }
                });
              }
            } catch (err) {
              console.error("Failed to logout from backend:", err);
            } finally {
              localStorage.removeItem("authToken");
              localStorage.removeItem("username");
              localStorage.removeItem("isStaff");
              localStorage.removeItem("isAdmin");
              navigate("/");
            }
          }}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "7px",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            color: "#ef4444",
            fontSize: "0.82rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.2s ease"
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(239, 68, 68, 0.1)"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(239, 68, 68, 0.05)"}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
