"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { useRouter, useParams } from "next/navigation";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadCategory = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/categories/${id}`);
      setName(res.data.name);
    } catch (err) {
      console.error("Error loading category:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategory();
  }, [id]);

  const update = async () => {
    if (!name.trim()) return;
    
    try {
      setUpdating(true);
      await api.patch(`/categories/${id}`, { name });
      router.push("/categories");
    } catch (err) {
      alert("Error updating category");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-md">
        <button 
          onClick={() => router.back()}
          className="text-brandGray hover:text-brandPink text-sm mb-4 flex items-center transition-colors"
        >
          ← Back to List
        </button>
        
        <h1 className="text-3xl font-extrabold text-brandBlack mb-8">
          Edit <span className="text-brandPink">Category</span>
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="flex flex-col items-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-brandPink border-t-transparent rounded-full mb-2"></div>
              <p className="text-sm text-brandGray">Fetching details...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-brandGray mb-2 uppercase tracking-tight">
                  Category Name
                </label>
                <input
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink outline-none transition-all text-brandBlack"
                  placeholder="e.g. Wedding Cakes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && update()}
                />
              </div>

              <button
                onClick={update}
                disabled={updating || !name.trim()}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-md active:scale-[0.98] ${
                  updating || !name.trim() 
                    ? "bg-brandGray cursor-not-allowed opacity-50" 
                    : "bg-brandPink hover:bg-brandPinkLight"
                }`}
              >
                {updating ? "Saving Changes..." : "Update Category"}
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
