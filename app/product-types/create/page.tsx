"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateProductTypePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error loading categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const create = async () => {
    if (!name.trim() || !categoryId) return;

    try {
      setCreating(true);
      await api.post("/product-types", {
        name,
        categoryId: Number(categoryId),
      });
      router.push("/product-types");
    } catch {
      alert("Error creating product type");
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-md">
        <button 
          onClick={() => router.back()}
          className="text-brandGray hover:text-brandPink text-sm mb-4 transition-colors"
        >
          ← Back to Types
        </button>

        <h1 className="text-3xl font-extrabold text-brandBlack mb-8">
          Create <span className="text-brandPink">Product Type</span>
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="py-6 text-center">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-brandPink border-t-transparent rounded-full mb-2"></div>
              <p className="text-sm text-brandGray">Loading categories...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-brandGray mb-2 uppercase tracking-tight">
                  Type Name
                </label>
                <input
                  autoFocus
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink outline-none transition-all text-brandBlack"
                  placeholder="e.g. Wedding Cakes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brandGray mb-2 uppercase tracking-tight">
                  Select Category
                </label>
                <select
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink outline-none bg-white transition-all text-brandBlack cursor-pointer"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">-- Choose Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={create}
                disabled={creating || !name.trim() || !categoryId}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 ${
                  creating || !name.trim() || !categoryId
                    ? "bg-brandGray cursor-not-allowed opacity-70"
                    : "bg-brandPink hover:bg-brandPinkLight"
                }`}
              >
                {creating && (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                )}
                {creating ? "Saving..." : "Save Product Type"}
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
