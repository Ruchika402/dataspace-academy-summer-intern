import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Automatically log the user in after successful registration
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.username);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setError(data.error || "Failed to register. Please check your inputs.");
      }
    } catch (err) {
      setError("Unable to connect to the authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`landing-wrapper ${theme}-theme`}>
      {/* Background Graphic Effects */}
      <div className="bg-grid-dots"></div>
      <div className="glowing-blob-left"></div>
      <div className="glowing-blob-right"></div>
      <div className="accent-circle-float"></div>

      {/* Header */}
      <header className="landing-header">
        <div className="header-container">
          <Link className="brand-wrapper" to="/">
            <div className="brand-logo-container">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#4f46e5"/>
                <rect x="7" y="16" width="4" height="8" rx="1.5" fill="white"/>
                <rect x="14" y="11" width="4" height="13" rx="1.5" fill="white"/>
                <rect x="21" y="7" width="4" height="17" rx="1.5" fill="white"/>
                <circle cx="23" cy="7" r="2" fill="#a78bfa"/>
              </svg>
            </div>
            <span className="brand-text">CustomerIQ</span>
          </Link>
          <div className="header-actions">
            <button className="theme-toggle-btn" title="Toggle Theme" aria-label="Toggle Theme" onClick={toggleTheme}>
              {theme === "light" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px", position: "relative", zIndex: 5 }}>
        <div style={{
          background: theme === "light" ? "rgba(255, 255, 255, 0.45)" : "rgba(30, 41, 59, 0.45)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: theme === "light" ? "1px solid rgba(226, 232, 240, 0.8)" : "1px solid rgba(51, 65, 85, 0.5)",
          borderRadius: "24px",
          padding: "40px 32px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: theme === "light" ? "0 20px 40px -15px rgba(0,0,0,0.05)" : "0 20px 40px -15px rgba(0,0,0,0.3)"
        }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "8px", letterSpacing: "-0.02em" }}>
              Create Account
            </h2>
            <p style={{ color: "var(--text-sub)", fontSize: "0.925rem" }}>
              Sign up to start segmenting and managing customers
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#ef4444",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "0.88rem",
              marginBottom: "20px",
              lineHeight: "1.5"
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              color: "#10b981",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "0.88rem",
              marginBottom: "20px",
              lineHeight: "1.5"
            }}>
              Registration successful! Redirecting to dashboard...
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                style={{
                  width: "100%",
                  padding: "11px 16px",
                  borderRadius: "10px",
                  border: theme === "light" ? "1px solid #cbd5e1" : "1px solid #475569",
                  backgroundColor: theme === "light" ? "#ffffff" : "#1e293b",
                  color: "var(--text-main)",
                  fontSize: "0.925rem",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                style={{
                  width: "100%",
                  padding: "11px 16px",
                  borderRadius: "10px",
                  border: theme === "light" ? "1px solid #cbd5e1" : "1px solid #475569",
                  backgroundColor: theme === "light" ? "#ffffff" : "#1e293b",
                  color: "var(--text-main)",
                  fontSize: "0.925rem",
                  outline: "none"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="cta-primary"
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "0.95rem",
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              {loading ? "Registering..." : "Register"}
              {!loading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              )}
            </button>

            <div style={{ textAlign: "center", marginTop: "16px", fontSize: "0.875rem", color: "var(--text-sub)" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--accent-color)", fontWeight: "600", textDecoration: "none" }}>
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer" style={{ padding: "30px 24px" }}>
        <div className="footer-bottom-layout">
          <div>
            © {new Date().getFullYear()} CustomerIQ. All rights reserved.
          </div>
          <div className="footer-bottom-links">
            <Link className="footer-bottom-link" to="/privacy">Privacy Policy</Link>
            <Link className="footer-bottom-link" to="/terms">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Register;
