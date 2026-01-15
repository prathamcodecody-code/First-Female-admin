"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { useRouter } from "next/navigation";

export default function CreateCategoryPage() {
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false); // Track submission state
  const router = useRouter();

  const create = async () => {
    if (!name.trim()) return;

    try {
      setCreating(true);
      await api.post("/categories", { name });
      router.push("/categories");
    } catch (err) {
      alert("Error creating category");
    } finally {
      setCreating(false);
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
          New <span className="text-brandPink">Category</span>
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-brandGray mb-2 uppercase tracking-tight">
                Category Name
              </label>
              <input
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink outline-none transition-all text-brandBlack"
                placeholder="Enter category name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && create()}
                autoFocus
              />
            </div>

            <button
              onClick={create}
              disabled={creating || !name.trim()}
              className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-md active:scale-[0.98] ${
                creating || !name.trim() 
                  ? "bg-brandGray cursor-not-allowed opacity-50" 
                  : "bg-brandPink hover:bg-brandPinkLight"
              }`}
            >
              {creating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </span>
              ) : (
                "Save Category"
              )}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
