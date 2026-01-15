"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import DiscountModal from "@/components/modals/DiscountModal";
import AdminLayout from "@/components/AdminLayout";

export default function DiscountsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching products for discounts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-brandBlack">
              Product <span className="text-brandPink">Discounts</span>
            </h1>
            <p className="text-brandGray text-sm mt-1">
              Apply percentage-based discounts to your catalog.
            </p>
          </div>
          <div className="bg-brandPink/10 text-brandPink px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
            {products.filter(p => p.discountType === "PERCENT").length} Active Offers
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="animate-spin w-10 h-10 border-[3px] border-brandPink border-t-transparent rounded-full mb-4"></div>
            <p className="text-brandGray animate-pulse">Calculating prices...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((p) => {
              const hasDiscount = p.discountType === "PERCENT";
              const price = Number(p.price);
              const discountValue = Number(p.discountValue || 0);
              const finalPrice = hasDiscount ? price - (price * discountValue) / 100 : price;

              return (
                <div
                  key={p.id}
                  className="group flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-brandPink/20 transition-all duration-300"
                >
                  {/* LEFT: INFO */}
                  <div className="flex-1 w-full md:pr-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-brandGray uppercase tracking-tighter">
                        ID: #{p.id}
                      </span>
                      {hasDiscount && (
                        <span className="bg-green-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-brandBlack text-lg line-clamp-1 group-hover:text-brandPink transition-colors">
                      {p.title}
                    </h3>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-brandGray font-bold uppercase">Final Price</span>
                        <span className="text-2xl font-black text-brandBlack">
                          ₹{finalPrice.toFixed(0)}
                        </span>
                      </div>

                      {hasDiscount && (
                        <>
                          <div className="h-8 w-[1px] bg-gray-100 mx-2" />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-brandGray font-bold uppercase">Original</span>
                            <span className="text-sm text-gray-400 line-through font-medium">
                              ₹{p.price}
                            </span>
                          </div>
                          <div className="bg-brandPink text-white px-3 py-1 rounded-lg text-xs font-black shadow-sm">
                            -{p.discountValue}%
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: ACTIONS */}
                  <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="hidden lg:block text-right">
                      <p className="text-[10px] font-bold text-brandGray uppercase">Status</p>
                      <p className="text-sm font-semibold">
                        {hasDiscount ? "Discounted" : "Regular Price"}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelected(p)}
                      className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm ${
                        hasDiscount
                          ? "bg-brandPink text-white hover:bg-brandPinkLight"
                          : "bg-brandBlack text-white hover:bg-gray-800"
                      }`}
                    >
                      {hasDiscount ? "Edit Discount" : "Add Discount"}
                    </button>
                  </div>
                </div>
              );
            })}

            {products.length === 0 && (
              <div className="bg-white p-20 text-center rounded-2xl border-2 border-dashed border-gray-100">
                <p className="text-brandGray font-medium">No products found to discount.</p>
              </div>
            )}
          </div>
        )}

        {/* MODAL */}
        {selected && (
          <DiscountModal
            product={selected}
            onClose={() => setSelected(null)}
            onSaved={() => {
              setSelected(null);
              fetchProducts();
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
