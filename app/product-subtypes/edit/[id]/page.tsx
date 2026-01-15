"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

export default function EditProductSubtypePage() {
  const router = useRouter();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [productTypeId, setProductTypeId] = useState<number | "">("");
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // To handle slow API response

  const loadData = async () => {
    try {
      setLoading(true);
      // Run both requests in parallel to save time
      const [typesRes, subtypeRes] = await Promise.all([
        api.get("/product-types"),
        api.get(`/product-subtypes/${id}`)
      ]);
      
      setProductTypes(typesRes.data);
      setName(subtypeRes.data.name);
      setProductTypeId(subtypeRes.data.productTypeId);
    } catch (err) {
      console.error("Failed to load data", err);
      alert("Error loading subtype details");
      router.push("/product-subtypes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !productTypeId) return;

    try {
      setSubmitting(true);
      await api.patch(`/product-subtypes/${id}`, {
        name,
        typeId: productTypeId,
      });
      router.push("/product-subtypes");
    } catch (err) {
      alert("Error updating product subtype");
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
          Edit <span className="text-brandPink">Subtype</span>
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="py-10 text-center">
              <div className="animate-spin inline-block w-8 h-8 border-2 border-brandPink border-t-transparent rounded-full mb-3"></div>
              <p className="text-brandGray text-sm">Loading details...</p>
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink outline-none transition-all text-brandBlack"
                  placeholder="e.g. Extra Small"
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
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink outline-none bg-white transition-all text-brandBlack"
                  required
                >
                  <option value="">Select product type</option>
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
                  disabled={submitting}
                  className={`px-8 py-2.5 rounded-lg font-bold text-white shadow-md transition-all active:scale-95 flex items-center gap-2 ${
                    submitting ? "bg-brandGray cursor-not-allowed" : "bg-brandPink hover:bg-brandPinkLight"
                  }`}
                >
                  {submitting && (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  )}
                  {submitting ? "Saving..." : "Update Subtype"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}