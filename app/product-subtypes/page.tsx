"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ProductSubtypesPage() {
  const [subtypes, setSubtypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
const typeId = searchParams.get("typeId");

  const loadSubtypes = async () => {
  try {
    setLoading(true);
    const res = await api.get("/product-subtypes", {
      params: typeId ? { typeId } : {},
    });
    setSubtypes(res.data);
  } catch (err) {
    console.error("Error loading subtypes:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadSubtypes();
  }, [typeId]);

  const deleteSubtype = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subtype?")) return;
    try {
      await api.delete(`/product-subtypes/${id}`);
      loadSubtypes();
    } catch (err) {
      alert("Error deleting subtype");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-brandBlack">
            Product <span className="text-brandPink">Subtypes</span>
          </h1>
          <p className="text-brandGray text-sm mt-1">Manage specific variations for your product types.</p>
        </div>

        <Link
          href="/product-subtypes/create"
          className="px-5 py-2.5 bg-brandPink text-white font-semibold rounded-lg hover:bg-brandPinkLight transition-all shadow-sm active:scale-95"
        >
          + Add Subtype
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-left text-sm font-semibold text-brandGray uppercase tracking-wider">ID</th>
              <th className="p-4 text-left text-sm font-semibold text-brandGray uppercase tracking-wider">Subtype Name</th>
              <th className="p-4 text-left text-sm font-semibold text-brandGray uppercase tracking-wider">Parent Type</th>
              <th className="p-4 text-right text-sm font-semibold text-brandGray uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {!loading && subtypes.map((s) => (
              <tr key={s.id} className="transition-colors hover:bg-brandCream/30">
                <td className="p-4 text-brandBlack font-medium">#{s.id}</td>
                <td className="p-4 text-brandBlack font-semibold">{s.name}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-brandPurple/10 text-brandPurple text-xs font-medium rounded-full">
                    {s.type?.name || "N/A"}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2 text-nowrap">
                  <Link
                    href={`/product-subtypes/edit/${s.id}`}
                    className="inline-block px-4 py-1.5 text-xs font-bold bg-brandPink/10 text-brandPink rounded hover:bg-brandPink hover:text-white transition-all"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteSubtype(s.id)}
                    className="px-4 py-1.5 text-xs font-bold bg-brandRed/10 text-brandRed rounded hover:bg-brandRed hover:text-white transition-all"
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
          <div className="p-16 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-[3px] border-brandPink border-t-transparent rounded-full mb-3"></div>
            <p className="text-brandGray text-sm font-medium">Fetching subtypes...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && subtypes.length === 0 && (
          <div className="p-16 text-center">
            <p className="text-brandGray font-medium">No subtypes found. Start by adding one!</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}