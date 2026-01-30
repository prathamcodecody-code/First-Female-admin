"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import SectionCard from "@/components/common/SectionCard";
import AdminLayout from "@/components/AdminLayout";
import { FiLayout, FiPlus, FiRefreshCw, FiZap } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminHomepage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadSections = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.get("/admin/homepage");
      setSections(res.data);
    } catch (err) {
      console.error("Failed to load sections");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
          <FiLayout className="text-gray-100 w-16 h-16 mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
            Structuring your studio...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto py-10 px-4 md:px-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-gray-100 pb-10">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-brandBlack italic font-serif">
              Homepage <span className="text-brandPink">Canvas</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
              <FiZap className="text-brandPink animate-pulse" /> Curate the first impression for your hauls
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={loadSections}
              disabled={isRefreshing}
              className={`p-3 rounded-sm border border-gray-100 text-gray-400 hover:text-brandBlack transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <FiRefreshCw size={16} />
            </button>
            <Link
              href="/homepage/create"
              className="flex-1 md:flex-none flex justify-center items-center gap-2 px-8 py-4 bg-brandBlack text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-brandPink transition-all shadow-xl active:scale-95"
            >
              <FiPlus size={14} /> Add New Section
            </Link>
          </div>
        </div>

        {/* SECTIONS CONTAINER */}
        <div className="space-y-6">
          {sections.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-100 py-20 rounded-sm text-center">
               <FiLayout className="mx-auto text-gray-200 w-12 h-12 mb-4" />
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No active sections found.</p>
               <p className="text-[10px] text-gray-300 mt-2 uppercase tracking-tighter italic">Click "Add New Section" to begin curation.</p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 gap-6">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SectionCard
                      section={section}
                      onUpdate={loadSections}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* FOOTER INFO */}
        <div className="mt-16 text-center">
           <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">
             Note: The order of sections here determines the layout order for customers.
           </p>
        </div>
      </div>
    </AdminLayout>
  );
}
