"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

export default function ProductTypesClient() {
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
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-brandBlack">
            Product <span className="text-brandPink">Types</span>
          </h1>

          {categoryId && (
            <button
              onClick={() => router.push("/categories")}
              className="text-xs font-semibold text-brandPink hover:underline mt-1 block"
            >
              ← Clear Filter (Category ID: {categoryId})
            </button>
          )}
        </div>

        <Link
          href={
            categoryId
              ? `/product-types/create?categoryId=${categoryId}`
              : "/product-types/create"
          }
          className="px-5 py-2.5 bg-brandPink text-white font-semibold rounded-lg hover:bg-brandPinkLight transition"
        >
          + Add Product Type
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {!loading &&
              types.map((type) => (
                <tr key={type.id} className="border-b hover:bg-brandCream/30">
                  <td className="p-4">#{type.id}</td>
                  <td className="p-4 font-semibold">{type.name}</td>
                  <td className="p-4">
                    {type.category?.name || "Uncategorized"}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/product-types/edit/${type.id}`}
                      className="px-3 py-1 bg-brandPink/10 text-brandPink rounded"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/product-subtypes?typeId=${type.id}`}
                      className="px-3 py-1 bg-brandPurple/10 text-brandPurple rounded"
                    >
                      Subtypes
                    </Link>

                    <button
                      onClick={() => deleteType(type.id)}
                      className="px-3 py-1 bg-brandRed/10 text-brandRed rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {loading && (
          <div className="p-10 text-center">Loading product types…</div>
        )}

        {!loading && types.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No product types found.
          </div>
        )}
      </div>
    </>
  );
}
