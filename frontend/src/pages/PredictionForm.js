import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

// Move styles OUTSIDE the component - THIS IS THE FIX
const inputStyle = {
  borderRadius: "8px",
  border: "1px solid #e9ecef",
  padding: "9px 12px",
  fontSize: "0.88rem",
  backgroundColor: "#f4f5f7",
  width: "100%",
};

const labelStyle = {
  fontSize: "0.82rem",
  fontWeight: "600",
  color: "#444",
  marginBottom: "5px",
  display: "block",
};

// Field component defined outside to prevent re-renders
const Field = ({
  label,
  name,
  type = "number",
  placeholder,
  options,
  value,
  onChange,
}) => (
  <div className="col-md-6 col-lg-4">
    <label style={labelStyle}>{label}</label>
    {options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={inputStyle}
        required
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={inputStyle}
        required
      />
    )}
  </div>
);

// Section component defined outside
const Section = ({ title, children }) => (
  <div className="panel mb-4">
    <div className="panel-title" style={{ color: "#534AB7", fontSize: "1rem" }}>
      {title}
    </div>
    <div className="row g-3">{children}</div>
  </div>
);

function PredictionForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error] = useState("");
  const [formData, setFormData] = useState({
    age: "",
    education: "",
    married: "",
    hasKids: "",
    numChildren: "",
    income: "",
    totalSpending: "",
    daysCustomer: "",
    amtWines: "",
    amtFruits: "",
    amtMeat: "",
    amtFish: "",
    amtSweets: "",
    amtGold: "",
    numWebPurchases: "",
    numCatalogPurchases: "",
    numStorePurchases: "",
    numDiscountPurchases: "",
    numPromoAccepted: "",
    numWebVisits: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/result", { state: { formData } });
    }, 1500);
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        {/* Header */}
        <div className="mb-4 form-header">
          <h2 className="form-header__title">
            AI-Powered Customer Segmentation
          </h2>
          <p className="form-header__copy">
            Input demographic and behavioral customer profiles below. Our machine learning classifier will analyze the data to immediately predict their exact segment.
          </p>
          {error ? (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          ) : null}
          <hr />
        </div>

        <form onSubmit={handleSubmit}>
          <Section title="Personal Information">
            <Field
              label="Age"
              name="age"
              placeholder="e.g. 35"
              value={formData.age}
              onChange={handleChange}
            />
            <Field
              label="Education"
              name="education"
              options={[
                { value: "Basic", label: "Basic" },
                { value: "2n Cycle", label: "2n Cycle" },
                { value: "Graduation", label: "Graduation" },
                { value: "Master", label: "Master" },
                { value: "PhD", label: "PhD" },
              ]}
              value={formData.education}
              onChange={handleChange}
            />
            <Field
              label="Married"
              name="married"
              options={[
                { value: "1", label: "Yes" },
                { value: "0", label: "No" },
              ]}
              value={formData.married}
              onChange={handleChange}
            />
            <Field
              label="Has Kids"
              name="hasKids"
              options={[
                { value: "1", label: "Yes" },
                { value: "0", label: "No" },
              ]}
              value={formData.hasKids}
              onChange={handleChange}
            />
            <Field
              label="Number of Children"
              name="numChildren"
              placeholder="e.g. 2"
              value={formData.numChildren}
              onChange={handleChange}
            />
            <Field
              label="Income"
              name="income"
              placeholder="e.g. 60000"
              value={formData.income}
              onChange={handleChange}
            />
            <Field
              label="Total Spending"
              name="totalSpending"
              placeholder="e.g. 1200"
              value={formData.totalSpending}
              onChange={handleChange}
            />
            <Field
              label="Days as Customer"
              name="daysCustomer"
              placeholder="e.g. 365"
              value={formData.daysCustomer}
              onChange={handleChange}
            />
          </Section>

          <Section title="🛒 Spending in Last 2 Years">
            <Field
              label="Wines"
              name="amtWines"
              placeholder="e.g. 300"
              value={formData.amtWines}
              onChange={handleChange}
            />
            <Field
              label="Fruits"
              name="amtFruits"
              placeholder="e.g. 50"
              value={formData.amtFruits}
              onChange={handleChange}
            />
            <Field
              label="Meat"
              name="amtMeat"
              placeholder="e.g. 200"
              value={formData.amtMeat}
              onChange={handleChange}
            />
            <Field
              label="Fish"
              name="amtFish"
              placeholder="e.g. 80"
              value={formData.amtFish}
              onChange={handleChange}
            />
            <Field
              label="Sweets"
              name="amtSweets"
              placeholder="e.g. 40"
              value={formData.amtSweets}
              onChange={handleChange}
            />
            <Field
              label="Gold"
              name="amtGold"
              placeholder="e.g. 60"
              value={formData.amtGold}
              onChange={handleChange}
            />
          </Section>

          <Section title="Purchase Behaviour">
            <Field
              label="Web Purchases"
              name="numWebPurchases"
              placeholder="e.g. 5"
              value={formData.numWebPurchases}
              onChange={handleChange}
            />
            <Field
              label="Catalogue Purchases"
              name="numCatalogPurchases"
              placeholder="e.g. 3"
              value={formData.numCatalogPurchases}
              onChange={handleChange}
            />
            <Field
              label="Store Purchases"
              name="numStorePurchases"
              placeholder="e.g. 8"
              value={formData.numStorePurchases}
              onChange={handleChange}
            />
            <Field
              label="Discount Purchases"
              name="numDiscountPurchases"
              placeholder="e.g. 2"
              value={formData.numDiscountPurchases}
              onChange={handleChange}
            />
            <Field
              label="Promos Accepted"
              name="numPromoAccepted"
              placeholder="e.g. 1"
              value={formData.numPromoAccepted}
              onChange={handleChange}
            />
            <Field
              label="Web Visits / Month"
              name="numWebVisits"
              placeholder="e.g. 4"
              value={formData.numWebVisits}
              onChange={handleChange}
            />
          </Section>

          {/* Submit */}
          <div className="text-center mb-5">
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? "#9b93d4" : "#534AB7",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px 48px",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                minWidth: "260px",
              }}
            >
              {loading ? "⏳ Predicting..." : "🔍 Predict Customer Cluster"}
            </button>
          </div>
        </form>

        {/* Footer Section */}
        <footer className="container mt-5 pt-4 pb-4 border-top">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <div className="brand-badge" style={{ width: "32px", height: "32px", borderRadius: "10px", fontSize: "0.7rem", boxShadow: "none" }}>
                IQ
              </div>
              <span className="fw-bold text-primary" style={{ fontSize: "0.95rem" }}>CustomerIQ</span>
            </div>
            <div className="text-secondary small">
              © {new Date().getFullYear()} CustomerIQ Platform. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default PredictionForm;
