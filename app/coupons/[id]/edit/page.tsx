"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { useRouter, useParams } from "next/navigation";
import { number } from "framer-motion";

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  const couponId = params.id;

  const [form, setForm] = useState({
    code: "",
    type: "PERCENT",
    value: "",
    minOrderValue: "",
    maxDiscount: "",
    usageLimit: "",
    expiresAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH COUPON ================= */
  useEffect(() => {
    if (!couponId) return;

    api
      .get(`/admin/coupons/${couponId}`)
      .then((res) => {
        const c = res.data;

        setForm({
          code: c.code,
          type: c.type,
          value: String(c.value),
          minOrderValue: c.minOrderValue ? String(c.minOrderValue) : "",
          maxDiscount: c.maxDiscount ? String(c.maxDiscount) : "",
          usageLimit: c.usageLimit ? String(c.usageLimit) : "",
          expiresAt: c.expiresAt
            ? c.expiresAt.split("T")[0]
            : "",
        });
      })
      .catch(() => {
        setError("Failed to load coupon");
      })
      .finally(() => setFetching(false));
  }, [couponId]);

  /* ================= UPDATE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.patch(`/admin/coupons/${couponId}`, {
  type: form.type,
  value: Number(form.value),
  minOrderValue: form.minOrderValue
    ? Number(form.minOrderValue)
    : undefined,
  maxDiscount:
    form.type === "PERCENT" && form.maxDiscount
      ? Number(form.maxDiscount)
      : undefined,
  usageLimit: form.usageLimit
    ? Number(form.usageLimit)
    : undefined,
  expiresAt: form.expiresAt || undefined,
});


      router.push("/coupons");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update coupon");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <p className="text-center py-20 text-gray-400">Loading coupon…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Edit Coupon</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >
          {/* CODE (READ ONLY) */}
          <input
            type="text"
            className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            value={form.code}
            disabled
          />

          {/* TYPE */}
          <select
            className="w-full border rounded px-3 py-2"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="PERCENT">Percent (%)</option>
            <option value="FLAT">Flat (₹)</option>
          </select>

          {/* VALUE */}
          <input
            type="number"
            placeholder={
              form.type === "PERCENT"
                ? "Discount %"
                : "Discount Amount (₹)"
            }
            className="w-full border rounded px-3 py-2"
            value={form.value}
            onChange={(e) =>
              setForm({ ...form, value: e.target.value })
            }
            required
          />

          {/* MIN ORDER */}
          <input
            type="number"
            placeholder="Minimum Order Value"
            className="w-full border rounded px-3 py-2"
            value={form.minOrderValue}
            onChange={(e) =>
              setForm({ ...form, minOrderValue: e.target.value })
            }
          />

          {/* MAX DISCOUNT */}
          {form.type === "PERCENT" && (
            <input
              type="number"
              placeholder="Max Discount Cap (₹)"
              className="w-full border rounded px-3 py-2"
              value={form.maxDiscount}
              onChange={(e) =>
                setForm({ ...form, maxDiscount: e.target.value })
              }
            />
          )}

          {/* USAGE LIMIT */}
          <input
            type="number"
            placeholder="Usage Limit"
            className="w-full border rounded px-3 py-2"
            value={form.usageLimit}
            onChange={(e) =>
              setForm({ ...form, usageLimit: e.target.value })
            }
          />

          {/* EXPIRY */}
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={form.expiresAt}
            onChange={(e) =>
              setForm({ ...form, expiresAt: e.target.value })
            }
          />

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-brandPink text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Updating..." : "Update Coupon"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
