"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

export default function CreateProductSubtypePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [productTypeId, setProductTypeId] = useState<number | "">("");
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadProductTypes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/product-types");
      setProductTypes(res.data);
    } catch (err) {
      console.error("Failed to load product types", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !productTypeId) return;

    try {
      setSubmitting(true);
      await api.post("/product-subtypes", {
        name,
        typeId: productTypeId,
      });
      router.push("/product-subtypes");
    } catch (err) {
      alert("Error creating product subtype");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <button 
          onClick={() => router.back()}
          className="text-brandGray hover:text-brandPink text-sm mb-4 transition-colors"
        >
          ← Back to Subtypes
        </button>

        <h1 className="text-3xl font-extrabold text-brandBlack mb-8">
          New <span className="text-brandPink">Subtype</span>
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="py-10 text-center">
              <div className="animate-spin inline-block w-8 h-8 border-2 border-brandPink border-t-transparent rounded-full mb-3"></div>
              <p className="text-brandGray text-sm font-medium">Preparing form...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subtype Name */}
              <div>
                <label className="block text-sm font-semibold text-brandGray mb-2 uppercase tracking-tight">
                  Subtype Name
                </label>
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink outline-none transition-all text-brandBlack"
                  placeholder="e.g. Small, Medium, Large"
                  required
                />
              </div>

              {/* Product Type Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-brandGray mb-2 uppercase tracking-tight">
                  Parent Product Type
                </label>
                <select
                  value={productTypeId}
                  onChange={(e) => setProductTypeId(Number(e.target.value))}
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink outline-none bg-white transition-all text-brandBlack cursor-pointer"
                  required
                >
                  <option value="">Select a product type</option>
                  {productTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2.5 rounded-lg font-semibold text-brandGray hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting || !name.trim() || !productTypeId}
                  className={`px-8 py-2.5 rounded-lg font-bold text-white shadow-md transition-all active:scale-95 flex items-center gap-2 ${
                    submitting || !name.trim() || !productTypeId
                      ? "bg-brandGray cursor-not-allowed opacity-70" 
                      : "bg-brandPink hover:bg-brandPinkLight"
                  }`}
                >
                  {submitting && (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  )}
                  {submitting ? "Creating..." : "Create Subtype"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}