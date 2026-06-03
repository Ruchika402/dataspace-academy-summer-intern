import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const TAX_RATE = 0.18;

function BillingCounter() {
  const [items, setItems] = useState([{ id: 1, name: "", qty: 1, price: "" }]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [billGenerated, setBillGenerated] = useState(false);

  // Add new row
  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", qty: 1, price: "" }]);
  };

  // Remove a row
  const removeItem = (id) => {
    if (items.length === 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  // Update a field in a row
  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => {
    return sum + (parseFloat(item.price) || 0) * (parseInt(item.qty) || 0);
  }, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const handleGenerateBill = () => {
    if (!customerName || items.some((i) => !i.name || !i.price)) {
      alert("Please fill in customer name and all item details.");
      return;
    }
    setBillGenerated(true);
  };

  const handleReset = () => {
    setItems([{ id: 1, name: "", qty: 1, price: "" }]);
    setCustomerName("");
    setCustomerPhone("");
    setPaymentMethod("Cash");
    setBillGenerated(false);
  };

  const inputStyle = {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #e9ecef",
    fontSize: "0.88rem",
    backgroundColor: "#f4f5f7",
    width: "100%",
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        {/* Header */}
        <div className="page-header">
          <h4>Billing Counter</h4>
          <p>Generate customer bills and calculate totals</p>
        </div>

        <div className="row g-4">
          {/* Left — Bill Form */}
          <div className="col-lg-7">
            {/* Customer Info */}
            <div className="panel mb-4">
              <div className="panel-title">👤 Customer Details</div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: "600",
                      color: "#444",
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    Customer Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Amit Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div className="col-md-6">
                  <label
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: "600",
                      color: "#444",
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div className="col-md-6">
                  <label
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: "600",
                      color: "#444",
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={inputStyle}
                  >
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Net Banking</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="panel mb-4">
              <div className="panel-title d-flex justify-content-between align-items-center">
                <span>🛒 Items</span>
                <button
                  onClick={addItem}
                  style={{
                    backgroundColor: "#534AB7",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "5px 14px",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  + Add Item
                </button>
              </div>

              {/* Column Headers */}
              <div className="row g-2 mb-2">
                <div className="col-5">
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: "600",
                      color: "#888",
                    }}
                  >
                    Item Name
                  </span>
                </div>
                <div className="col-2">
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: "600",
                      color: "#888",
                    }}
                  >
                    Qty
                  </span>
                </div>
                <div className="col-3">
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: "600",
                      color: "#888",
                    }}
                  >
                    Price (₹)
                  </span>
                </div>
                <div className="col-2">
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: "600",
                      color: "#888",
                    }}
                  >
                    Total
                  </span>
                </div>
              </div>

              {/* Item Rows */}
              {items.map((item) => (
                <div className="row g-2 mb-2 align-items-center" key={item.id}>
                  <div className="col-5">
                    <input
                      type="text"
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, "name", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div className="col-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="1"
                      value={item.qty}
                      onChange={(e) =>
                        updateItem(item.id, "qty", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div className="col-3">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(item.id, "price", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div className="col-2 d-flex align-items-center justify-content-between">
                    <span
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color: "#1a1a2e",
                      }}
                    >
                      ₹
                      {(
                        (parseFloat(item.price) || 0) *
                        (parseInt(item.qty) || 0)
                      ).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#D85A30",
                        cursor: "pointer",
                        fontSize: "1rem",
                        padding: "0 4px",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateBill}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#534AB7",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              🧾 Generate Bill
            </button>
          </div>

          {/* Right — Bill Summary */}
          <div className="col-lg-5">
            <div
              className="panel"
              style={{
                border: billGenerated
                  ? "2px solid #534AB7"
                  : "1px solid #e9ecef",
              }}
            >
              <div className="panel-title">🧾 Bill Summary</div>

              {!billGenerated ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                    color: "#aaa",
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "12px" }}>
                    🧾
                  </div>
                  <p style={{ fontSize: "0.88rem" }}>
                    Fill in the details and click
                    <br />
                    "Generate Bill" to see the summary
                  </p>
                </div>
              ) : (
                <>
                  {/* Bill Header */}
                  <div
                    style={{
                      backgroundColor: "#EEEDFE",
                      borderRadius: "8px",
                      padding: "14px",
                      marginBottom: "16px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "800",
                        fontSize: "1.1rem",
                        color: "#534AB7",
                      }}
                    >
                      Customer Intelligence Platform
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "#777",
                        marginTop: "2px",
                      }}
                    >
                      Customer Bill Receipt
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div style={{ marginBottom: "14px" }}>
                    {[
                      { label: "Customer", value: customerName },
                      { label: "Phone", value: customerPhone || "—" },
                      { label: "Payment", value: paymentMethod },
                      {
                        label: "Date",
                        value: new Date().toLocaleDateString("en-IN"),
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "5px 0",
                          borderBottom: "1px solid #f0f0f0",
                          fontSize: "0.85rem",
                        }}
                      >
                        <span style={{ color: "#888" }}>{row.label}</span>
                        <span style={{ fontWeight: "600", color: "#1a1a2e" }}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Items */}
                  <div style={{ marginBottom: "14px" }}>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: "600",
                        color: "#888",
                        marginBottom: "6px",
                      }}
                    >
                      ITEMS PURCHASED
                    </div>
                    {items
                      .filter((i) => i.name && i.price)
                      .map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "5px 0",
                            borderBottom: "1px solid #f0f0f0",
                            fontSize: "0.85rem",
                          }}
                        >
                          <span style={{ color: "#444" }}>
                            {item.name} × {item.qty}
                          </span>
                          <span style={{ fontWeight: "600", color: "#1a1a2e" }}>
                            ₹
                            {(
                              (parseFloat(item.price) || 0) *
                              (parseInt(item.qty) || 0)
                            ).toLocaleString()}
                          </span>
                        </div>
                      ))}
                  </div>

                  {/* Totals */}
                  <div
                    style={{
                      backgroundColor: "#f4f5f7",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                  >
                    {[
                      {
                        label: "Subtotal",
                        value: `₹${subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
                      },
                      {
                        label: `Tax (${TAX_RATE * 100}% GST)`,
                        value: `₹${tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "4px 0",
                          fontSize: "0.85rem",
                        }}
                      >
                        <span style={{ color: "#888" }}>{row.label}</span>
                        <span style={{ color: "#444" }}>{row.value}</span>
                      </div>
                    ))}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0 0",
                        marginTop: "6px",
                        borderTop: "2px solid #534AB7",
                        fontSize: "1rem",
                      }}
                    >
                      <span style={{ fontWeight: "700", color: "#1a1a2e" }}>
                        Total
                      </span>
                      <span
                        style={{
                          fontWeight: "800",
                          color: "#534AB7",
                          fontSize: "1.1rem",
                        }}
                      >
                        ₹
                        {total.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={handleReset}
                    style={{
                      width: "100%",
                      marginTop: "16px",
                      padding: "10px",
                      backgroundColor: "#fff",
                      color: "#534AB7",
                      border: "2px solid #534AB7",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                    }}
                  >
                    🔄 New Bill
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingCounter;
