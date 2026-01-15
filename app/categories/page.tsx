"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Track loading state

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.log("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const deleteCategory = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      loadCategories();
    } catch (err) {
      alert("Error deleting category");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-brandBlack">
          Categories <span className="text-brandPink text-lg font-medium">({categories.length})</span>
        </h1>

        <Link
          href="/categories/create"
          className="px-5 py-2.5 rounded-lg bg-brandPink text-white font-semibold transition-colors hover:bg-brandPinkLight shadow-sm"
        >
          + Add Category
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-left text-sm font-semibold text-brandGray uppercase tracking-wider">ID</th>
              <th className="p-4 text-left text-sm font-semibold text-brandGray uppercase tracking-wider">Name</th>
              <th className="p-4 text-right text-sm font-semibold text-brandGray uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="transition-colors hover:bg-brandCream/50">
                <td className="p-4 text-brandBlack font-medium">#{cat.id}</td>
                <td className="p-4 text-brandBlack">{cat.name}</td>
                <td className="p-4 text-right space-x-2">
                  <Link
                    href={`/categories/edit/${cat.id}`}
                    className="inline-block px-4 py-1.5 text-xs font-bold bg-brandPink/10 text-brandPink rounded hover:bg-brandPink hover:text-white transition-all"
                  >
                    Edit
                  </Link>

                  <Link
                    href={`/product-types?categoryId=${cat.id}`}
                    className="inline-block px-4 py-1.5 text-xs font-bold bg-brandPurple/10 text-brandPurple rounded hover:bg-brandPurple hover:text-white transition-all"
                  >
                    Types
                  </Link>

                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="px-4 py-1.5 text-xs font-bold bg-brandRed/10 text-brandRed rounded hover:bg-brandRed hover:text-white transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Loading State UI */}
        {loading && (
          <div className="p-10 text-center">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-brandPink border-t-transparent rounded-full mb-2"></div>
            <p className="text-brandGray text-sm">Loading your categories...</p>
          </div>
        )}

        {/* Empty State UI */}
        {!loading && categories.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-brandGray">No categories found.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
