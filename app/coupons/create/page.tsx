"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { useRouter } from "next/navigation";

export default function CreateCouponPage() {
  const router = useRouter();

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
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/admin/coupons", {
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrderValue: form.minOrderValue
          ? Number(form.minOrderValue)
          : undefined,
        maxDiscount: form.maxDiscount
          ? Number(form.maxDiscount)
          : undefined,
        usageLimit: form.usageLimit
          ? Number(form.usageLimit)
          : undefined,
        expiresAt: form.expiresAt || undefined,
      });

      router.push("/coupons");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Create Coupon</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >
          {/* CODE */}
          <input
            type="text"
            placeholder="Coupon Code (e.g. FIRST10)"
            className="w-full border rounded px-3 py-2"
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
            required
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
                ? "Discount % (e.g. 10)"
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
            placeholder="Minimum Order Value (optional)"
            className="w-full border rounded px-3 py-2"
            value={form.minOrderValue}
            onChange={(e) =>
              setForm({ ...form, minOrderValue: e.target.value })
            }
          />

          {/* MAX DISCOUNT (ONLY FOR PERCENT) */}
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
            placeholder="Usage Limit (optional)"
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
            {loading ? "Creating..." : "Create Coupon"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
