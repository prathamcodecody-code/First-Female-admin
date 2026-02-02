"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { FiArrowLeft, FiMail, FiPhone, FiCalendar, FiTag, FiMessageSquare, FiUser, FiShoppingBag } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ContactDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/contact/${id}`)
      .then((res) => setContact(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    try {
      await api.patch(`/contact/${id}/status`, { status });
      setContact((prev: any) => ({ ...prev, status }));
    } catch (err) {
      console.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-brandPink border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Opening Archive...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!contact) return <AdminLayout>Not found</AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto py-10 px-6 pb-24">
        
        {/* HEADER AREA */}
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-gray-100 rounded-full transition-all group"
          >
            <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic font-serif text-brandBlack leading-none">
              Inquiry <span className="text-brandPink">Details</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mt-3">
              Reference: #{id?.toString().slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: MAIN MESSAGE & CONTEXT (8 COLUMNS) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* CORE MESSAGE */}
            <section className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-6">
                <FiMessageSquare className="text-brandPink" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack">Customer Narrative</h2>
              </div>
              <div className="bg-gray-50/50 p-6 rounded-sm min-h-[200px]">
                <p className="text-sm text-brandBlack font-medium leading-relaxed whitespace-pre-line italic font-serif">
                  "{contact.message}"
                </p>
              </div>
            </section>

            {/* RELATED ASSETS (Order/User Info) */}
            {(contact.user || contact.order) && (
              <section className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                {contact.user && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                      <FiUser /> Account Profile
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                      <p className="text-[11px] font-black text-brandBlack">ID: {contact.user.id}</p>
                      <p className="text-[10px] font-medium text-gray-500 mt-1">{contact.user.email}</p>
                    </div>
                  </div>
                )}
                {contact.order && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                      <FiShoppingBag /> Linked Order
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                      <p className="text-[11px] font-black text-brandBlack uppercase">Ref: {contact.order.id}</p>
                      <button className="text-[9px] font-black text-brandPink uppercase tracking-widest mt-2 hover:underline">
                        View Full Order Details →
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* RIGHT: METADATA & ACTIONS (4 COLUMNS) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* STATUS MANAGEMENT */}
            <section className="bg-brandBlack text-white p-8 rounded-sm shadow-2xl">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] border-b border-white/10 pb-4 mb-6">Workflow Status</h2>
              <div className="space-y-4">
                <select
                  value={contact.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="w-full bg-white/5 border-none px-4 py-4 rounded-sm text-[10px] font-black uppercase tracking-widest outline-none focus:ring-1 ring-brandPink transition-all cursor-pointer"
                >
                  <option value="NEW" className="bg-brandBlack text-white">New Request</option>
                  <option value="IN_PROGRESS" className="bg-brandBlack text-white">Currently Reviewing</option>
                  <option value="RESOLVED" className="bg-brandBlack text-white">Issue Resolved</option>
                </select>
                
                <div className={`p-4 rounded-sm text-center border ${
                  contact.status === "NEW" ? "border-blue-500/20 bg-blue-500/5 text-blue-400" :
                  contact.status === "IN_PROGRESS" ? "border-amber-500/20 bg-amber-500/5 text-amber-400" :
                  "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                }`}>
                  <p className="text-[9px] font-black uppercase tracking-[0.4em]">Current Vibe: {contact.status.replace("_", " ")}</p>
                </div>
              </div>
            </section>

            {/* SENDER INTEL */}
            <section className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm space-y-8">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack border-b border-gray-50 pb-4 mb-2">Intel</h2>
              
              <div className="space-y-6">
                <FieldIcon icon={<FiUser />} label="Client" value={contact.name || "Guest User"} />
                <FieldIcon icon={<FiMail />} label="Email" value={contact.email} isLowercase />
                <FieldIcon icon={<FiPhone />} label="Contact" value={contact.phone || "No Phone Provided"} />
                <FieldIcon icon={<FiTag />} label="Topic" value={contact.subject || contact.reason || "General Inquiry"} />
                <FieldIcon 
                  icon={<FiCalendar />} 
                  label="Logged At" 
                  value={new Date(contact.createdAt).toLocaleString(undefined, {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })} 
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ---------- UI HELPERS ---------- */

function FieldIcon({ icon, label, value, isLowercase = false }: { icon: any, label: string, value: string, isLowercase?: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="text-gray-300 mt-1">{icon}</div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</p>
        <p className={`text-xs font-bold text-brandBlack mt-0.5 ${isLowercase ? 'lowercase' : 'uppercase tracking-tight'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}