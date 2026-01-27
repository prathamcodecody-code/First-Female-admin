"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);

  const loadCoupons = async () => {
    const res = await api.get("/admin/coupons");
    setCoupons(res.data);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Coupons</h1>

          <Link
            href="/coupons/create"
            className="px-4 py-2 bg-brandPink text-white rounded-lg text-sm"
          >
            + Create Coupon
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-left">Code</th>
                <th className="p-3">Type</th>
                <th className="p-3">Value</th>
                <th className="p-3">Usage</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3 font-semibold">{c.code}</td>
                  <td className="p-3">{c.type}</td>
                  <td className="p-3">
                    {c.type === "PERCENT" ? `${c.value}%` : `₹${c.value}`}
                  </td>
                  <td className="p-3">
                    {c.usedCount} / {c.usageLimit ?? "∞"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        c.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {c.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-3 justify-center"> {/* ✅ Added opening tag */}
  <button
    onClick={async () => {
      await api.put(`/admin/coupons/${c.id}/toggle`);
      loadCoupons();
    }}
    className="text-xs text-orange-600 font-medium hover:underline"
  >
    Toggle
  </button>

  <button
    onClick={async () => {
      if (!confirm("Delete coupon?")) return;
      await api.delete(`/admin/coupons/${c.id}`);
      loadCoupons();
    }}
    className="text-xs text-red-600 font-medium hover:underline"
  >
    Delete
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}


