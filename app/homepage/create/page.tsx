"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import HeroFields from "@/components/common/HeroFields";
import CategoryStripFields from "@/components/common/CategoryStripFields";
import EditorialFields from "@/components/common/EditorialFields";
import InfluencerFields from "@/components/common/InfluencerFields";
import AdminLayout from "@/components/AdminLayout";
import { FiArrowLeft, FiLayers, FiSettings, FiCheckCircle, FiInstagram } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

type SectionType = "HERO" | "CATEGORY_STRIP" | "EDITORIAL" | "INFLUENCER";

export default function CreateHomepageSectionPage() {
  const router = useRouter();

  const [type, setType] = useState<SectionType>("HERO");
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [config, setConfig] = useState<any>({
    slides: [
      {
        mediaId: null,
        title: "",
        subtitle: "",
        ctaText: "",
        ctaLink: "",
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ Validation for HERO
      if (type === "HERO" && (!config.slides || config.slides.length === 0)) {
        setError("Please add at least one hero slide.");
        setLoading(false);
        return;
      }

      // ✅ Validation for INFLUENCER
      if (type === "INFLUENCER" && (!config.items || config.items.length === 0)) {
        setError("Please add at least one influencer reel.");
        setLoading(false);
        return;
      }

      await api.post("/admin/homepage", {
        title,
        type,
        position,
        isActive,
        config,
      });
      router.push("/homepage");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto py-10 px-6 pb-24">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-brandBlack italic font-serif leading-none">
              New <span className="text-brandPink">Canvas Section</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-3">
              Blueprint for your homepage architecture
            </p>
          </div>
        </div>

        <div className="space-y-10">
          
          {/* 1. CORE BLUEPRINT INFO */}
          <section className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <FiLayers className="text-brandPink" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack">Section Core</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
                  Internal Section Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.G., SUMMER EDITORIAL / TOP CATEGORIES"
                  className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-widest outline-none ring-1 ring-gray-100 focus:ring-brandPink transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
                    Blueprint Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value as SectionType);
                      setConfig({}); // Reset config when switching types
                    }}
                    className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold outline-none ring-1 ring-gray-100 focus:ring-brandPink"
                  >
                    <option value="HERO">Hero Storyboard</option>
                    <option value="CATEGORY_STRIP">Category Strip</option>
                    <option value="EDITORIAL">Editorial / New In</option>
                    <option value="INFLUENCER">Influencer Reel</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
                    Position Index
                  </label>
                  <input
                    type="number"
                    value={position}
                    onChange={(e) => setPosition(Number(e.target.value))}
                    className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold outline-none ring-1 ring-gray-100"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6 md:pt-0">
                  <button 
                    onClick={() => setIsActive(!isActive)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${
                      isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-100 text-gray-400 border border-gray-200"
                    }`}
                  >
                    {isActive ? <FiCheckCircle /> : null} {isActive ? "Live" : "Draft Mode"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 2. DYNAMIC CONFIGURATION */}
          <section className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm min-h-[400px]">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-8">
              {type === "INFLUENCER" ? <FiInstagram className="text-brandPink" /> : <FiSettings className="text-brandPink" />}
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack">
                {type.replace("_", " ")} Configuration
              </h2>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {type === "HERO" && <HeroFields value={config} onChange={setConfig} />}
                {type === "CATEGORY_STRIP" && <CategoryStripFields value={config} onChange={setConfig} />}
                {type === "EDITORIAL" && <EditorialFields value={config} onChange={setConfig} />}
                {type === "INFLUENCER" && <InfluencerFields value={config} onChange={setConfig} />}
              </motion.div>
            </AnimatePresence>
          </section>

          {/* ERROR DISPLAY */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 p-4 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">{error}</p>
            </div>
          )}

          {/* 3. FINAL ACTIONS */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={submit}
              disabled={loading}
              className="flex-1 bg-brandBlack text-white py-6 rounded-sm font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl hover:bg-brandPink transition-all active:scale-95 disabled:bg-gray-200"
            >
              {loading ? "Publishing Canvas..." : "Publish Section"}
            </button>
            <button
              onClick={() => router.back()}
              className="px-12 py-6 border border-gray-200 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-50 transition-all text-gray-400"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
