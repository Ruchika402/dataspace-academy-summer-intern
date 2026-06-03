import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple mock login — replace with real API call later
    if (email === "admin@cip.com" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } else {
      setError("Invalid email or password. Try admin@cip.com / admin123");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f5f7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          border: "1px solid #e9ecef",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#534AB7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "22px",
              margin: "0 auto 12px",
            }}
          >
            CIP
          </div>
          <h4 style={{ fontWeight: "700", color: "#1a1a2e" }}>
            Welcome to Customer Intelligence Platform
          </h4>
          <p style={{ color: "#6c757d", fontSize: "0.88rem" }}>
            Sign in to access your dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: "#fff5f5",
              border: "1px solid #f5c6cb",
              color: "#D85A30",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#1a1a2e",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="admin@neuron.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                borderRadius: "8px",
                fontSize: "0.9rem",
                padding: "10px 14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#1a1a2e",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderRadius: "8px",
                fontSize: "0.9rem",
                padding: "10px 14px",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "11px",
              backgroundColor: "#534AB7",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            Sign In →
          </button>
        </form>

        {/* Hint */}
        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            backgroundColor: "#f4f5f7",
            borderRadius: "8px",
            fontSize: "0.8rem",
            color: "#6c757d",
            textAlign: "center",
          }}
        >
          Demo credentials: <strong>admin@cip.com</strong> /{" "}
          <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
}

export default Login;
