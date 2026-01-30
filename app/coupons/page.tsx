"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import { FiPlus, FiEdit3, FiTrash2, FiTag } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/coupons");
      setCoupons(res.data);
    } catch (error) {
      console.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleToggle = async (id: number) => {
    setTogglingId(id);
    try {
      await api.put(`/admin/coupons/${id}/toggle`);
      // Optimistic UI update or reload
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-10 px-4 md:px-0">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-brandBlack italic font-serif">
              Promotional <span className="text-brandPink">Coupons</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
              <FiTag className="text-brandPink" /> Manage Coupons
            </p>
          </div>

          <Link
            href="/coupons/create"
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 bg-brandBlack text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-brandPink transition-all shadow-lg active:scale-95"
          >
            <FiPlus size={14} /> Create Coupon
          </Link>
        </div>

        {/* CONTENT AREA */}
        <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
          
          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Code</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Value</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Usage</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-300 italic text-xs uppercase tracking-widest">Loading...</td></tr>
                ) : coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4">
                      <span className="font-mono font-bold text-brandBlack bg-gray-100 px-2 py-1 rounded text-xs uppercase tracking-tighter">
                        {c.code}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-brandBlack">
                          {c.type === "PERCENT" ? `${c.value}%` : `₹${c.value}`}
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase">{c.type}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[11px] font-medium text-gray-400 uppercase tracking-tight">
                      {c.usedCount} <span className="text-gray-200">/</span> {c.usageLimit ?? "∞"}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <AnimatedToggle 
                          isActive={c.isActive} 
                          onClick={() => handleToggle(c.id)} 
                          isLoading={togglingId === c.id}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionBtn href={`/coupons/${c.id}/edit`} icon={<FiEdit3 />} color="blue" />
                        <button 
                           onClick={async () => {
                             if (!confirm("Delete permanently?")) return;
                             await api.delete(`/admin/coupons/${c.id}`);
                             loadCoupons();
                           }}
                           className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-full transition-all"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden divide-y divide-gray-100">
            {loading ? (
              <div className="p-10 text-center text-gray-300 italic text-xs uppercase tracking-widest">Loading...</div>
            ) : coupons.map((c) => (
              <div key={c.id} className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="font-mono font-bold text-brandBlack bg-gray-100 px-2 py-1 rounded text-sm uppercase tracking-tighter">
                    {c.code}
                  </span>
                  <AnimatedToggle 
                    isActive={c.isActive} 
                    onClick={() => handleToggle(c.id)} 
                    isLoading={togglingId === c.id}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Value</p>
                    <p className="text-sm font-black text-brandBlack">{c.type === "PERCENT" ? `${c.value}%` : `₹${c.value}`}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Usage</p>
                    <p className="text-sm font-black text-brandBlack">{c.usedCount} / {c.usageLimit ?? "∞"}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link href={`/coupons/${c.id}/edit`} className="flex-1 text-center py-2 bg-gray-50 text-[10px] font-black uppercase tracking-widest rounded-sm border border-gray-100">Edit</Link>
                  <button 
                    onClick={() => { if(confirm("Delete?")) api.delete(`/admin/coupons/${c.id}`).then(loadCoupons) }}
                    className="flex-1 py-2 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-sm border border-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}

/* ---------------- CUSTOM ANIMATED TOGGLE ---------------- */

function AnimatedToggle({ isActive, onClick, isLoading }: { isActive: boolean, onClick: () => void, isLoading: boolean }) {
  return (
    <button 
      onClick={onClick}
      disabled={isLoading}
      className={`relative w-10 h-5 rounded-full transition-colors duration-300 flex items-center p-1 ${
        isActive ? "bg-emerald-500" : "bg-gray-200"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <motion.div
        animate={{ x: isActive ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-3 h-3 bg-white rounded-full shadow-sm"
      />
    </button>
  );
}

function ActionBtn({ href, icon, color }: { href: string, icon: any, color: string }) {
  return (
    <Link
      href={href}
      className={`p-2 hover:bg-${color}-50 hover:text-${color}-600 rounded-full transition-all`}
    >
      {icon}
    </Link>
  );
}
