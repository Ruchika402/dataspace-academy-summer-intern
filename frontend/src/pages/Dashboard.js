import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const clusterDist = [
  { name: "Premium", value: 32, color: "#534AB7" },
  { name: "Regular", value: 41, color: "#1D9E75" },
  { name: "Budget", value: 18, color: "#185FA5" },
  { name: "Occasional", value: 9, color: "#EF9F27" },
];

const ageData = [
  { age: "18-25", customers: 120 },
  { age: "26-35", customers: 340 },
  { age: "36-45", customers: 290 },
  { age: "46-55", customers: 180 },
  { age: "55+", customers: 70 },
];

const revenueData = [
  { name: "Premium", revenue: 48000 },
  { name: "Regular", revenue: 31000 },
  { name: "Budget", revenue: 12000 },
  { name: "Occasional", revenue: 7000 },
];

const spendingData = [
  { range: "0-200", customers: 90 },
  { range: "200-500", customers: 210 },
  { range: "500-1K", customers: 180 },
  { range: "1K-2K", customers: 130 },
  { range: "2K+", customers: 80 },
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        {/* Header */}
        <div className="page-header d-flex justify-content-between align-items-center">
          <div>
            <h4>Dashboard</h4>
            <p>Customer segmentation overview</p>
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

        {/* Metric Cards */}
        <div className="row g-3 mb-4">
          {[
            {
              label: "Total Customers",
              value: "1,000",
              trend: "↑ 12% this month",
              up: true,
            },
            {
              label: "Total Revenue",
              value: "₹98K",
              trend: "↑ 8% this month",
              up: true,
            },
            {
              label: "No. of Clusters",
              value: "4",
              trend: "Premium · Regular · Budget · Occasional",
              up: true,
            },
            {
              label: "Avg Spending",
              value: "₹3,200",
              trend: "↓ 2% this month",
              up: false,
            },
          ].map((m) => (
            <div className="col-6 col-md-3" key={m.label}>
              <div className="metric-card">
                <div className="label">{m.label}</div>
                <div className="value">{m.value}</div>
                <div className={`trend ${m.up ? "trend-up" : "trend-down"}`}>
                  {m.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="row g-3 mb-4">
          {/* Pie Chart */}
          <div className="col-md-5">
            <div className="panel">
              <div className="panel-title">
                Customer Distribution by Cluster
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={clusterDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {clusterDist.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Legend
                    iconType="circle"
                    iconSize={9}
                    formatter={(v) => (
                      <span style={{ fontSize: "0.8rem" }}>{v}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Bar Chart */}
          <div className="col-md-7">
            <div className="panel">
              <div className="panel-title">Revenue Contribution by Cluster</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenueData} barSize={36}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `₹${v / 1000}K`}
                  />
                  <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                    {revenueData.map((_, i) => (
                      <Cell key={i} fill={clusterDist[i].color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="row g-3">
          {/* Age Distribution */}
          <div className="col-md-6">
            <div className="panel">
              <div className="panel-title">Age Group Distribution</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ageData} barSize={28}>
                  <XAxis dataKey="age" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="customers"
                    fill="#534AB7"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spending Distribution */}
          <div className="col-md-6">
            <div className="panel">
              <div className="panel-title">Spending Score Distribution</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={spendingData} barSize={28}>
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="customers"
                    fill="#1D9E75"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
