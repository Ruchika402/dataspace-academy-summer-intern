import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <div className="container mt-5">
        <div className="row align-items-center">
          {/* Left Text */}
          <div className="col-lg-6 mb-4 hero-copy-col">
            <span className="badge mb-3 hero-kicker">
              ⚡ AI Customer Intelligence
            </span>
            <h1 className="hero-title">
              AI-Powered Customer{" "}
              <span className="hero-highlight">Segmentation</span> & Insights
            </h1>
            <p className="mt-3 hero-copy">
              Transform demographic and transactional customer data into
              actionable business intelligence. Predict segments instantly
              using our trained high-accuracy machine learning classifier.
            </p>
            <button
              className="btn mt-4 px-5 py-3"
              style={{
                backgroundColor: "#1a73e8",
                color: "white",
                fontWeight: "600",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "none",
              }}
              onClick={() => navigate("/predict")}
            >
              Start Analysis →
            </button>
          </div>

          {/* Right Info Cards */}
          <div className="col-lg-6">
            <div className="row g-3">
              <div className="col-6">
                <div
                  className="p-4 rounded-3 text-center"
                  style={{ backgroundColor: "#e8f0fe" }}
                >
                  <div style={{ fontSize: "2rem" }}>🎯</div>
                  <h6 className="mt-2 fw-bold" style={{ color: "#1a73e8" }}>
                    Smart Clustering
                  </h6>
                  <p
                    className="mb-0"
                    style={{ fontSize: "0.85rem", color: "#555" }}
                  >
                    Groups customers by behaviour patterns
                  </p>
                </div>
              </div>

              <div className="col-6">
                <div
                  className="p-4 rounded-3 text-center"
                  style={{ backgroundColor: "#fff3e0" }}
                >
                  <div style={{ fontSize: "2rem" }}>📊</div>
                  <h6 className="mt-2 fw-bold" style={{ color: "#ff6d00" }}>
                    Data Driven
                  </h6>
                  <p
                    className="mb-0"
                    style={{ fontSize: "0.85rem", color: "#555" }}
                  >
                    Based on real transaction data
                  </p>
                </div>
              </div>

              <div className="col-6">
                <div
                  className="p-4 rounded-3 text-center"
                  style={{ backgroundColor: "#e8f5e9" }}
                >
                  <div style={{ fontSize: "2rem" }}>⚡</div>
                  <h6 className="mt-2 fw-bold" style={{ color: "#2e7d32" }}>
                    Instant Results
                  </h6>
                  <p
                    className="mb-0"
                    style={{ fontSize: "0.85rem", color: "#555" }}
                  >
                    Get predictions in seconds
                  </p>
                </div>
              </div>

              <div className="col-6">
                <div
                  className="p-4 rounded-3 text-center"
                  style={{ backgroundColor: "#fce4ec" }}
                >
                  <div style={{ fontSize: "2rem" }}>🤖</div>
                  <h6 className="mt-2 fw-bold" style={{ color: "#c62828" }}>
                    ML Powered
                  </h6>
                  <p
                    className="mb-0"
                    style={{ fontSize: "0.85rem", color: "#555" }}
                  >
                    Trained classification model
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="container mt-5 pt-3 stats-section">
        <div className="row g-4 text-center">
          <div className="col-6 col-lg-3">
            <div
              className="p-4 rounded-4 shadow-sm stats-card"
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                border: "1px solid rgba(15, 23, 42, 0.06)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                className="display-6 fw-extrabold text-primary mb-1"
                style={{ fontSize: "2rem", fontWeight: "900" }}
              >
                2,240+
              </div>
              <div
                className="small text-secondary fw-semibold uppercase-label"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Customers Analyzed
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div
              className="p-4 rounded-4 shadow-sm stats-card"
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                border: "1px solid rgba(15, 23, 42, 0.06)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                className="display-6 fw-extrabold text-success mb-1"
                style={{ fontSize: "2rem", fontWeight: "900", color: "#10b981" }}
              >
                98.4%
              </div>
              <div
                className="small text-secondary fw-semibold uppercase-label"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Model Accuracy
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div
              className="p-4 rounded-4 shadow-sm stats-card"
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                border: "1px solid rgba(15, 23, 42, 0.06)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                className="display-6 fw-extrabold text-info mb-1"
                style={{ fontSize: "2rem", fontWeight: "900", color: "#06b6d4" }}
              >
                4 Dynamic
              </div>
              <div
                className="small text-secondary fw-semibold uppercase-label"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Customer Segments
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div
              className="p-4 rounded-4 shadow-sm stats-card"
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                border: "1px solid rgba(15, 23, 42, 0.06)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                className="display-6 fw-extrabold text-warning mb-1"
                style={{ fontSize: "2rem", fontWeight: "900", color: "#f59e0b" }}
              >
                12.8k+
              </div>
              <div
                className="small text-secondary fw-semibold uppercase-label"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Predictions Generated
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mt-5 pt-4">
        <h2 className="text-center fw-bold mb-4" style={{ color: "#1a1a2e" }}>
          How It Works
        </h2>
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div
              className="p-4 rounded-3 shadow-sm"
              style={{ backgroundColor: "#ffffff" }}
            >
              <div className="mb-3" style={{ fontSize: "2.5rem" }}>📝</div>
              <h5 className="fw-bold">Step 1</h5>
              <p style={{ color: "#555" }}>
                Fill in the customer's personal and purchase details in the form
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="p-4 rounded-3 shadow-sm"
              style={{ backgroundColor: "#ffffff" }}
            >
              <div className="mb-3" style={{ fontSize: "2.5rem" }}>🧠</div>
              <h5 className="fw-bold">Step 2</h5>
              <p style={{ color: "#555" }}>
                Our ML model analyses the data and predicts the cluster
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="p-4 rounded-3 shadow-sm"
              style={{ backgroundColor: "#ffffff" }}
            >
              <div className="mb-3" style={{ fontSize: "2.5rem" }}>✅</div>
              <h5 className="fw-bold">Step 3</h5>
              <p style={{ color: "#555" }}>
                View the customer segment result with a detailed breakdown
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="container mt-5 pt-5 pb-4 border-top">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <div
              className="brand-badge"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                fontSize: "0.7rem",
                boxShadow: "none",
              }}
            >
              IQ
            </div>
            <span className="fw-bold text-primary" style={{ fontSize: "0.95rem" }}>
              CustomerIQ
            </span>
          </div>
          <div className="text-secondary small">
            © {new Date().getFullYear()} CustomerIQ Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
