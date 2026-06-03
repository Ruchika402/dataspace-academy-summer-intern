import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const SAMPLE_CUSTOMERS = [
  {
    id: 1,
    name: "Amit Sharma",
    age: 42,
    income: 92000,
    spending: 1820,
    cluster: "Premium",
    visits: 14,
    education: "PhD",
  },
  {
    id: 2,
    name: "Priya Mehta",
    age: 31,
    income: 54000,
    spending: 640,
    cluster: "Regular",
    visits: 7,
    education: "Graduation",
  },
  {
    id: 3,
    name: "Ravi Kumar",
    age: 25,
    income: 28000,
    spending: 190,
    cluster: "Budget",
    visits: 3,
    education: "Basic",
  },
  {
    id: 4,
    name: "Sneha Iyer",
    age: 38,
    income: 61000,
    spending: 870,
    cluster: "Regular",
    visits: 9,
    education: "Master",
  },
  {
    id: 5,
    name: "Karan Patel",
    age: 55,
    income: 110000,
    spending: 2400,
    cluster: "Premium",
    visits: 18,
    education: "PhD",
  },
  {
    id: 6,
    name: "Divya Nair",
    age: 29,
    income: 31000,
    spending: 160,
    cluster: "Occasional",
    visits: 2,
    education: "Graduation",
  },
  {
    id: 7,
    name: "Suresh Reddy",
    age: 47,
    income: 75000,
    spending: 1100,
    cluster: "Premium",
    visits: 11,
    education: "Master",
  },
  {
    id: 8,
    name: "Ananya Das",
    age: 33,
    income: 43000,
    spending: 420,
    cluster: "Regular",
    visits: 6,
    education: "Graduation",
  },
  {
    id: 9,
    name: "Mohit Verma",
    age: 22,
    income: 22000,
    spending: 95,
    cluster: "Budget",
    visits: 2,
    education: "Basic",
  },
  {
    id: 10,
    name: "Pooja Singh",
    age: 36,
    income: 58000,
    spending: 730,
    cluster: "Regular",
    visits: 8,
    education: "Master",
  },
  {
    id: 11,
    name: "Vikram Joshi",
    age: 50,
    income: 98000,
    spending: 2100,
    cluster: "Premium",
    visits: 16,
    education: "PhD",
  },
  {
    id: 12,
    name: "Neha Gupta",
    age: 27,
    income: 35000,
    spending: 220,
    cluster: "Budget",
    visits: 3,
    education: "Graduation",
  },
];

const clusterStyle = {
  Premium: { bg: "#EEEDFE", color: "#534AB7" },
  Regular: { bg: "#E1F5EE", color: "#085041" },
  Budget: { bg: "#E6F1FB", color: "#185FA5" },
  Occasional: { bg: "#FAEEDA", color: "#854F0B" },
};

function Customers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = SAMPLE_CUSTOMERS.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || c.cluster === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        {/* Header */}
        <div className="page-header d-flex justify-content-between align-items-center">
          <div>
            <h4>Customers</h4>
            <p>Browse and filter customer segments</p>
          </div>
          <button
            onClick={() => navigate("/predict")}
            style={{
              backgroundColor: "#534AB7",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "9px 20px",
              fontWeight: "600",
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            + New Prediction
          </button>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          {["Premium", "Regular", "Budget", "Occasional"].map((cls) => {
            const count = SAMPLE_CUSTOMERS.filter(
              (c) => c.cluster === cls,
            ).length;
            const style = clusterStyle[cls];
            return (
              <div className="col-6 col-md-3" key={cls}>
                <div className="metric-card text-center">
                  <div className="label">{cls}</div>
                  <div className="value">{count}</div>
                  <span
                    style={{
                      backgroundColor: style.bg,
                      color: style.color,
                      fontSize: "0.72rem",
                      padding: "2px 10px",
                      borderRadius: "20px",
                      fontWeight: "600",
                      display: "inline-block",
                      marginTop: "4px",
                    }}
                  >
                    {Math.round((count / SAMPLE_CUSTOMERS.length) * 100)}% of
                    total
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="panel mb-4">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            {/* Search */}
            <input
              type="text"
              placeholder="🔍 Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: "200px",
                borderRadius: "8px",
                border: "1px solid #e9ecef",
                padding: "8px 14px",
                fontSize: "0.88rem",
                backgroundColor: "#f4f5f7",
              }}
            />

            {/* Filter Buttons */}
            <div className="d-flex gap-2 flex-wrap">
              {["All", "Premium", "Regular", "Budget", "Occasional"].map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: "20px",
                      border: "1px solid",
                      borderColor: filter === f ? "#534AB7" : "#e9ecef",
                      backgroundColor: filter === f ? "#534AB7" : "#fff",
                      color: filter === f ? "#fff" : "#555",
                      fontSize: "0.82rem",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    {f}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="panel">
          <div className="panel-title">
            Showing {filtered.length} customer{filtered.length !== 1 ? "s" : ""}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.88rem",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  {[
                    "#",
                    "Name",
                    "Age",
                    "Education",
                    "Income",
                    "Spending",
                    "Visits",
                    "Cluster",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        fontSize: "0.78rem",
                        color: "#888",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const cs = clusterStyle[c.cluster];
                  return (
                    <tr
                      key={c.id}
                      style={{ borderBottom: "1px solid #f4f5f7" }}
                    >
                      <td style={{ padding: "10px 12px", color: "#aaa" }}>
                        {c.id}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          fontWeight: "600",
                          color: "#1a1a2e",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              backgroundColor: cs.bg,
                              color: cs.color,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "700",
                              fontSize: "0.82rem",
                              flexShrink: 0,
                            }}
                          >
                            {c.name.charAt(0)}
                          </div>
                          {c.name}
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px", color: "#555" }}>
                        {c.age}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#555" }}>
                        {c.education}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#555" }}>
                        ₹{c.income.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#555" }}>
                        ₹{c.spending.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#555" }}>
                        {c.visits}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{
                            backgroundColor: cs.bg,
                            color: cs.color,
                            fontSize: "0.75rem",
                            padding: "3px 10px",
                            borderRadius: "20px",
                            fontWeight: "600",
                          }}
                        >
                          {c.cluster}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <button
                          onClick={() => navigate("/predict")}
                          style={{
                            backgroundColor: "#f4f5f7",
                            color: "#534AB7",
                            border: "1px solid #e9ecef",
                            borderRadius: "6px",
                            padding: "5px 12px",
                            fontSize: "0.78rem",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          Re-predict
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan="9"
                      style={{
                        padding: "32px",
                        textAlign: "center",
                        color: "#aaa",
                      }}
                    >
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customers;
