"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import { FiSearch, FiCalendar, FiUser, FiClock, FiMail, FiArrowRight } from "react-icons/fi";

export default function AdminContacts() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState("");

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/contact", {
        params: {
          page,
          limit: 15,
          status: status || undefined,
          search: search || undefined,
        },
      });
      setData(res.data.items);
      setPages(res.data.meta.pages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, status]);

  return (
    <AdminLayout>
      <div className="p-8 max-w-[1200px] mx-auto">
        {/* HEADER & FILTERS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic font-serif text-brandBlack leading-none">
              Inquiries <span className="text-brandPink">Studio</span>
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold mt-3">
              Archives of incoming boutique requests
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                placeholder="SEARCH NAME/EMAIL..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 bg-gray-50 border-none rounded-sm text-[10px] font-bold uppercase tracking-widest focus:ring-1 ring-brandPink outline-none w-full md:w-64 transition-all"
              />
            </div>
            
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="bg-gray-50 border-none px-4 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest outline-none focus:ring-1 ring-brandPink cursor-pointer"
            >
              <option value="">Sort: All Status</option>
              <option value="NEW">New Arrivals</option>
              <option value="IN_PROGRESS">In Review</option>
              <option value="RESOLVED">Completed</option>
            </select>

            <button
              onClick={() => { setPage(1); fetchContacts(); }}
              className="bg-brandBlack text-white px-8 py-3 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brandPink transition-all shadow-xl shadow-black/5 active:scale-95"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* COMPACT MINIMALIST TABLE */}
        <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Identity</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Status</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Timestamp</th>
                <th className="p-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 animate-pulse">Loading Archives...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={4} className="p-20 text-center text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">No Inquiries Stored</td></tr>
              ) : (
                data.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/80 transition-all group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brandBlack text-white flex items-center justify-center text-[10px] font-black shadow-lg">
                          {c.name ? c.name.charAt(0).toUpperCase() : <FiUser />}
                        </div>
                        <div>
                          <p className="text-xs font-black text-brandBlack uppercase tracking-tight group-hover:text-brandPink transition-colors">
                            {c.name || "Anonymous Client"}
                          </p>
                          <div className="flex items-center gap-1.5 text-gray-400 mt-0.5">
                            <FiMail size={10} />
                            <span className="text-[10px] font-bold lowercase tracking-normal">{c.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <span className={`inline-block text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full border shadow-sm
                        ${c.status === "NEW" ? "bg-blue-50 text-blue-600 border-blue-100" : 
                          c.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-600 border-amber-100" : 
                          "bg-emerald-50 text-emerald-600 border-emerald-100"}
                      `}>
                        {c.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="p-5 text-right">
                      <div className="flex flex-col items-end">
                        <p className="text-[10px] font-black text-brandBlack uppercase tracking-tighter">
                          {new Date(c.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold mt-0.5 uppercase">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </td>

                    <td className="p-5">
                      <Link href={`/contacts/${c.id}`}>
                        <div className="p-2 text-gray-300 group-hover:text-brandPink group-hover:translate-x-1 transition-all">
                          <FiArrowRight size={18} />
                        </div>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER / PAGINATION */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-10 gap-4 border-t border-gray-100 pt-8">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
            Volume Page {page} <span className="mx-2 text-gray-200">|</span> Total {pages}
          </p>
          <div className="flex gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-8 py-3 bg-white border border-gray-200 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:border-brandBlack transition-all active:scale-95"
            >
              Back
            </button>
            <button
              disabled={page === pages}
              onClick={() => setPage((p) => p + 1)}
              className="px-8 py-3 bg-brandBlack text-white text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:bg-brandPink transition-all active:scale-95 shadow-lg shadow-black/10"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}