"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { HiOutlineUsers, HiOutlineChartBar, HiOutlineShoppingCart } from "react-icons/hi";

/* -------------------------
   Mock Data
------------------------- */
const METRICS = [
  { id: "users", title: "Active Users", value: "12.4k", delta: "+4.2%", icon: HiOutlineUsers },
  { id: "revenue", title: "Monthly Revenue", value: "$48.2k", delta: "+6.8%", icon: HiOutlineChartBar },
  { id: "orders", title: "Orders", value: "1.9k", delta: "-1.4%", icon: HiOutlineShoppingCart },
  { id: "conv", title: "Conversion", value: "3.8%", delta: "+0.5%", icon: HiOutlineChartBar },
];

const SPARK_DATA = [12, 18, 9, 24, 16, 28, 22, 30, 26, 32, 28];

const RECENT_ORDERS = [
  { id: "#A2301", customer: "Anita Sharma", amount: "$420", status: "Completed" },
  { id: "#A2300", customer: "Ravi Patel", amount: "$220", status: "Pending" },
  { id: "#A2299", customer: "Sneha K.", amount: "$86", status: "Cancelled" },
];

const ACTIVITY = [
  { id: 1, who: "Anita Sharma", action: "Created order #A2301", when: "2h ago" },
  { id: 2, who: "Ravi Patel", action: "Updated product SKU-223", when: "4h ago" },
  { id: 3, who: "Sneha K.", action: "Added new user account", when: "Yesterday" },
];

/* -------------------------
   Small Components
------------------------- */
const Sparkline = ({ data, width = 160, height = 40 }: { data: number[]; width?: number; height?: number }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(" ");
  const last = data[data.length - 1];
  const trendPositive = last >= data[0];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={trendPositive ? "#4f46e5" : "#ef4444"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

type StatCardProps = {
  title: string;
  value: string | number;
  delta: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, delta, Icon }) => (
  <motion.div
    style={{ perspective: 1200 }}
    whileHover={{ rotateX: -6, rotateY: 8, scale: 1.03 }}
    transition={{ type: "spring", stiffness: 220, damping: 20 }}
    className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition transform-gpu"
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <h4 className="text-xs font-medium text-gray-500">{title}</h4>
        <div className="flex items-end gap-3 mt-2">
          <span className="text-2xl font-semibold text-gray-900">{value}</span>
          <span className={`text-sm font-medium ${delta.startsWith("-") ? "text-red-500" : "text-green-600"}`}>{delta}</span>
        </div>
      </div>
      <div className="bg-indigo-50 rounded-lg p-2">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
    </div>
    <div className="mt-3">
      <Sparkline data={SPARK_DATA} width={160} height={36} />
    </div>
  </motion.div>
);

/* -------------------------
   Main Dashboard Page
------------------------- */
export default function DashboardPage() {
  const metrics = useMemo(() => METRICS, []);
  const recentOrders = useMemo(() => RECENT_ORDERS, []);
  const activity = useMemo(() => ACTIVITY, []);

  return (
    <main className="min-h-screen p-6 bg-gray-100 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <StatCard key={m.id} title={m.title} value={m.value} delta={m.delta} Icon={m.icon} />
        ))}
      </section>

      {/* Charts / Progress */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ rotateX: -4, rotateY: 6 }}
          style={{ perspective: 1200 }}
          className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Sales (last 30 days)</h3>
              <div className="text-2xl font-semibold text-gray-900">$48,240</div>
            </div>
            <div className="text-sm text-green-600">+6.8%</div>
          </div>
          <div className="mt-4">
            <Sparkline data={SPARK_DATA} width={640} height={80} />
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
            <div className="px-3 py-2 bg-indigo-50 rounded-lg">Revenue</div>
            <div className="px-3 py-2 bg-green-50 rounded-lg">Conversion</div>
            <div className="px-3 py-2 bg-yellow-50 rounded-lg">Orders</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ translateY: -6 }} className="bg-white p-5 rounded-2xl shadow-md">
          <h4 className="text-sm text-gray-500">Conversion</h4>
          <div className="mt-2 text-3xl font-semibold">3.8%</div>
          <div className="mt-3 text-xs text-gray-400">Improve product pages to increase conversions.</div>
          <div className="mt-5">
            <div className="text-xs text-gray-500 mb-2">Goal progress</div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "38%" }} />
            </div>
            <div className="text-xs text-gray-400 mt-2">38% of monthly target</div>
          </div>
        </motion.div>
      </section>

      {/* Recent Orders */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b">
                <th className="py-2">Order</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{r.id}</td>
                  <td className="py-2">{r.customer}</td>
                  <td className="py-2">{r.amount}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        r.status === "Completed" ? "bg-green-50 text-green-600" : r.status === "Pending" ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <ul className="space-y-3">
            {activity.map((a) => (
              <li key={a.id} className="flex justify-between text-sm text-gray-700">
                <div>
                  <div className="font-medium">{a.who}</div>
                  <div className="text-gray-500 text-xs">{a.action}</div>
                </div>
                <div className="text-gray-400 text-xs">{a.when}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Shortcuts */}
      <section className="bg-white p-5 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Shortcuts</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <button className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100">Create Order</button>
          <button className="px-4 py-2 rounded-lg bg-green-50 text-green-700 font-medium hover:bg-green-100">New Product</button>
          <button className="px-4 py-2 rounded-lg bg-yellow-50 text-yellow-700 font-medium hover:bg-yellow-100">Invite Team</button>
        </div>
      </section>
    </main>
  );
}
