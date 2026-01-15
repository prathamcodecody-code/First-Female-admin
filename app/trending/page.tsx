"use client";

import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import Link from "next/link";

export default function AdminTrendingProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrending = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/products", {
        params: { trending: "true", limit: 50 },
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching trending products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  const removeTrending = async (id: number) => {
    if (!confirm("Remove this product from trending?")) return;

    try {
      await api.put(`/products/${id}`, {
        isTrending: "false",
      });
      fetchTrending();
    } catch (err) {
      alert("Error removing trending status");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-brandBlack flex items-center gap-2">
            <span className="animate-pulse text-2xl">🔥</span> Trending{" "}
            <span className="text-brandPink">Products</span>
          </h1>
          <p className="text-brandGray text-sm mt-1">
            Managing the spotlight items appearing on the homepage.
          </p>
        </div>
        <div className="bg-brandPink text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
          {products.length} Items Trending
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-[3px] border-brandPink border-t-transparent rounded-full mb-3"></div>
            <p className="text-brandGray text-sm font-medium">Scanning catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-4xl mb-4 text-gray-200">❄️</div>
            <p className="text-brandGray font-medium">No trending products found.</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-left text-sm font-semibold text-brandGray uppercase tracking-wider">Product</th>
                <th className="p-4 text-center text-sm font-semibold text-brandGray uppercase tracking-wider">Price</th>
                <th className="p-4 text-center text-sm font-semibold text-brandGray uppercase tracking-wider">Stock</th>
                <th className="p-4 text-right text-sm font-semibold text-brandGray uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-brandCream/30">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        {p.img1 && (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${p.img1}`}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-brandBlack truncate max-w-[200px] lg:max-w-md">
                          {p.title}
                        </p>
                        <p className="text-xs text-brandGray font-mono">ID: #{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-black text-brandBlack">₹{p.price.toLocaleString()}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      p.stock < 5 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                    }`}>
                      {p.stock} in stock
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2 text-nowrap">
                    <Link
                      href={`/products/edit/${p.id}`}
                      className="inline-block px-4 py-1.5 text-xs font-bold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => removeTrending(p.id)}
                      className="px-4 py-1.5 text-xs font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}