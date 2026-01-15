"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import Link from "next/link";

export default function ProductTypesPage() {
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  

  const categoryId = searchParams.get("categoryId");

  const loadTypes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/product-types", {
        params: categoryId ? { categoryId } : {},
      });
      setTypes(res.data);
    } catch (err) {
      console.error("Error loading product types", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTypes();
  }, [categoryId]);

  const deleteType = async (id: number) => {
    if (!confirm("Delete this product type?")) return;
    try {
      await api.delete(`/product-types/${id}`);
      loadTypes();
    } catch {
      alert("Error deleting type");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-brandBlack">
            Product <span className="text-brandPink">Types</span>
          </h1>
          {categoryId && (
            <button 
              onClick={() => router.push('/categories')}
              className="text-xs font-semibold text-brandPink hover:underline mt-1 block"
            >
              ← Clear Filter (Category ID: {categoryId})
            </button>
          )}
        </div>

        <Link
          href={categoryId ? `/product-types/create?categoryId=${categoryId}` : "/product-types/create"}
          className="px-5 py-2.5 bg-brandPink text-white font-semibold rounded-lg hover:bg-brandPinkLight transition-colors shadow-sm"
        >
          + Add Product Type
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-left text-sm font-semibold text-brandGray uppercase tracking-wider">ID</th>
              <th className="p-4 text-left text-sm font-semibold text-brandGray uppercase tracking-wider">Name</th>
              <th className="p-4 text-left text-sm font-semibold text-brandGray uppercase tracking-wider">Category</th>
              <th className="p-4 text-right text-sm font-semibold text-brandGray uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {!loading && types.map((type) => (
              <tr key={type.id} className="transition-colors hover:bg-brandCream/30">
                <td className="p-4 text-brandBlack font-medium">#{type.id}</td>
                <td className="p-4 text-brandBlack font-semibold">{type.name}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-gray-100 text-brandGray text-xs rounded-md">
                    {type.category?.name || "Uncategorized"}
                  </span>
                </td>

                <td className="p-4 text-right space-x-2">
                  <Link
                    href={`/product-types/edit/${type.id}`}
                    className="inline-block px-3 py-1.5 text-xs font-bold bg-brandPink/10 text-brandPink rounded hover:bg-brandPink hover:text-white transition-all"
                  >
                    Edit
                  </Link>

                  <Link
                    href={`/product-subtypes?typeId=${type.id}`}
                    className="inline-block px-3 py-1.5 text-xs font-bold bg-brandPurple/10 text-brandPurple rounded hover:bg-brandPurple hover:text-white transition-all"
                  >
                    Subtypes
                  </Link>

                  <button
                    onClick={() => deleteType(type.id)}
                    className="px-3 py-1.5 text-xs font-bold bg-brandRed/10 text-brandRed rounded hover:bg-brandRed hover:text-white transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Loading Spinner */}
        {loading && (
          <div className="p-12 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-[3px] border-brandPink border-t-transparent rounded-full mb-3"></div>
            <p className="text-brandGray text-sm animate-pulse">Loading product types...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && types.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-gray-300 text-5xl mb-4 text-center">📂</div>
            <p className="text-brandGray font-medium">No product types found.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
