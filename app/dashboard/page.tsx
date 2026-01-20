"use client";

import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import RevenueLineChart from "@/components/charts/RevenueLineChart";
import OrdersBarChart from "@/components/charts/OrdersBarChart";
import OrderStatusPie from "@/components/charts/OrderStatusPie";
import UserStatsCards from "@/components/common/UserStatsCards";
import UsersLineChart from "@/components/charts/UsersChart";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, chartsRes, stockRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/charts"),
          api.get("/products/admin/low-stock"),
        ]);

        setStats(statsRes.data);
        setCharts(chartsRes.data);
        setLowStockItems(stockRes.data || []);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-gray-500 animate-pulse text-lg">Loading dashboard…</p>
        </div>
      </AdminLayout>
    );
  }

  if (!stats || !charts) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-red-500 font-medium">Failed to load dashboard data.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto w-full space-y-8 p-4">
        
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin <span className="text-brandPink">Dashboard</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
  
  {/* These 3 cards will now take 1 slot each in the 8-column grid */}
  <UserStatsCards users={stats.users} />

  {/* These 5 cards will follow immediately after */}
  {[
    { label: "Products", value: stats.products },
    { label: "Orders", value: stats.totalOrders },
    { label: "Today Orders", value: stats.todayOrders },
    { label: "Revenue", value: `₹${stats.revenue}` },
    { label: "Today Revenue", value: `₹${stats.todayRevenue}` },
  ].map((item, i) => (
    <div
      key={i}
      className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex flex-col justify-center min-h-[110px]"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
        {item.label}
      </p>
      <p className="text-2xl font-bold text-gray-800">
        {item.value}
      </p>
    </div>
  ))}
</div>

        {/* ================= LOW STOCK ALERT ================= */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <span className="text-red-600 mr-2">⚠️</span>
              <h3 className="font-bold text-red-800">Low Stock Alert</h3>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
              {lowStockItems.map((p) => (
                <li key={p.id} className="text-red-700 bg-white/50 p-2 rounded border border-red-100">
                  {p.title} — <span className="font-bold">{p.stock}</span> units left
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ================= CHARTS GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-gray-700 font-bold mb-6 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Users (Last 7 Days)
            </h3>
            <div className="h-[300px] w-full">
               <UsersLineChart data={charts.usersTrend} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-gray-700 font-bold mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Revenue (Last 7 Days)
            </h3>
            <div className="h-[300px] w-full">
              <RevenueLineChart data={charts.revenueTrend} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-gray-700 font-bold mb-6 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Orders (Last 7 Days)
            </h3>
            <div className="h-[300px] w-full">
              <OrdersBarChart data={charts.ordersTrend} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-gray-700 font-bold mb-6 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Order Status
            </h3>
            <div className="h-[300px] w-full flex justify-center">
              <OrderStatusPie data={charts.orderStatus} />
            </div>
          </div>
        </div>

        {/* ================= RECENT PRODUCTS ================= */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <h2 className="text-lg font-bold text-gray-800">Recent Products</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {stats.recentProducts.map((p: any) => (
              <div
                key={p.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${p.img1}`}
                  alt={p.title}
                  className="w-14 h-14 rounded-lg object-cover border border-gray-100 shadow-sm"
                />

                <div className="flex-1">
                  <p className="font-bold text-gray-800 leading-tight">{p.title}</p>
                  <p className="text-sm text-brandPink font-medium mt-1">₹{p.price}</p>
                </div>

                <a
                  href={`/products/edit/${p.id}`}
                  className="px-4 py-2 text-brandPink font-bold text-xs uppercase tracking-widest border border-brandPink/20 rounded-lg hover:bg-brandPink hover:text-white transition-all"
                >
                  Edit
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
