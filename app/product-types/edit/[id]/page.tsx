"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";

export default function EditProductTypePage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetches both concurrently to reduce wait time
      const [typeRes, catRes] = await Promise.all([
        api.get(`/product-types/${id}`),
        api.get("/categories"),
      ]);

      setName(typeRes.data.name);
      setCategoryId(typeRes.data.categoryId);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Could not load product type data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const update = async () => {
    if (!name.trim() || !categoryId) return;

    try {
      setUpdating(true);
      await api.patch(`/product-types/${id}`, {
        name,
        categoryId: Number(categoryId),
      });
      router.push("/product-types");
    } catch {
      alert("Error updating product type");
    } finally {
      setUpdating(false);
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
          Edit <span className="text-brandPink">Product Type</span>
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="py-10 text-center">
              <div className="animate-spin inline-block w-8 h-8 border-2 border-brandPink border-t-transparent rounded-full mb-3"></div>
              <p className="text-brandGray text-sm font-medium">Loading details...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-brandGray mb-2 uppercase tracking-tight">
                  Type Name
                </label>
                <input
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink outline-none transition-all text-brandBlack"
                  placeholder="Enter type name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brandGray mb-2 uppercase tracking-tight">
                  Category
                </label>
                <select
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink outline-none bg-white transition-all text-brandBlack cursor-pointer"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={update}
                disabled={updating || !name.trim()}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 ${
                  updating || !name.trim()
                    ? "bg-brandGray cursor-not-allowed opacity-70"
                    : "bg-brandPink hover:bg-brandPinkLight"
                }`}
              >
                {updating && (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                )}
                {updating ? "Saving Changes..." : "Update Product Type"}
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
