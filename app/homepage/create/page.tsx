"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import HeroFields from "@/components/common/HeroFields";
import CategoryStripFields from "@/components/common/CategoryStripFields";
import EditorialFields from "@/components/common/EditorialFields";
import AdminLayout from "@/components/AdminLayout";

type SectionType = "HERO" | "CATEGORY_STRIP" | "EDITORIAL";

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

      if (type === "HERO" && (!config.slides || config.slides.length === 0)) {
  setError("Please add at least one hero slide.");
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
console.log("SUBMIT CONFIG →", config);
      router.push("/homepage");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-bold mb-8 uppercase">
        Create Homepage Section
      </h1>

      {/* BASIC INFO */}
      <div className="bg-white border p-6 rounded mb-8 space-y-4">
        <div>
          <label className="text-xs uppercase font-bold text-gray-500">
            Section Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Hero Banner / New In / Categories"
            className="border p-2 w-full mt-1"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">
              Section Type
            </label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as SectionType);
                setConfig({});
              }}
              className="border p-2 w-full mt-1"
            >
              <option value="HERO">Hero Carousel</option>
              <option value="CATEGORY_STRIP">Category Strip</option>
              <option value="EDITORIAL">Editorial / New In</option>
            </select>
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-gray-500">
              Position
            </label>
            <input
              type="number"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              className="border p-2 w-full mt-1"
            />
          </div>

          <div className="flex items-end gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span className="text-xs uppercase font-bold text-gray-600">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* TYPE-SPECIFIC CONFIG */}
      <div className="bg-white border p-6 rounded mb-8">
        {type === "HERO" && (
          <HeroFields value={config} onChange={setConfig} />
        )}

        {type === "CATEGORY_STRIP" && (
          <CategoryStripFields value={config} onChange={setConfig} />
        )}

        {type === "EDITORIAL" && (
          <EditorialFields value={config} onChange={setConfig} />
        )}
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={submit}
          disabled={loading}
          className="bg-black text-white px-6 py-3 text-xs uppercase font-bold disabled:bg-gray-300"
        >
          {loading ? "Saving..." : "Create Section"}
        </button>

        <button
          onClick={() => router.back()}
          className="border px-6 py-3 text-xs uppercase font-bold"
        >
          Cancel
        </button>
      </div>
    </div>
    </AdminLayout>
  );
}
