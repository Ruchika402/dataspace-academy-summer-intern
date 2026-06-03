import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/predict", icon: "🔍", label: "Predict" },
    { path: "/customers", icon: "👥", label: "Customers" },
    { path: "/billing", icon: "🧾", label: "Billing" },
  ];

  return (
    <div
      style={{
        width: "210px",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e9ecef",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
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

      {/* User Footer */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid #e9ecef" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 10px",
            backgroundColor: "#f4f5f7",
            borderRadius: "8px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#9FE1CB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: "600",
              color: "#085041",
            }}
          >
            A
          </div>
          <div>
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#1a1a2e",
              }}
            >
              Admin
            </div>
            <div style={{ fontSize: "0.7rem", color: "#888" }}>
              admin@cip.com
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "7px",
            borderRadius: "7px",
            border: "1px solid #e9ecef",
            backgroundColor: "#fff",
            color: "#D85A30",
            fontSize: "0.82rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
