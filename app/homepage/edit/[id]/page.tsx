"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";

import HeroFields from "@/components/common/HeroFields";
import CategoryStripFields from "@/components/common/CategoryStripFields";
import EditorialFields from "@/components/common/EditorialFields";
import AdminLayout from "@/components/AdminLayout";

type SectionType = "HERO" | "CATEGORY_STRIP" | "EDITORIAL";

export default function EditHomepageSectionPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<SectionType>("HERO");
  const [position, setPosition] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [config, setConfig] = useState<any>({});

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  /* ================= LOAD SECTION ================= */
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/admin/homepage/${id}`);
        const s = res.data;

        setTitle(s.title || "");
        setType(s.type);
        setPosition(s.position);
        setIsActive(s.isActive);
        setConfig(s.config || {});
      } catch {
        setError("Failed to load section");
      } finally {
        setFetching(false);
      }
    }

    if (id) load();
  }, [id]);

  /* ================= UPDATE ================= */
  const update = async () => {
    try {
      setLoading(true);
      setError("");

      await api.put(`/admin/homepage/${id}`, {
        title,
        type,
        position,
        isActive,
        config,
      });

      router.push("/admin/homepage");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-10 text-sm text-gray-400">
        Loading section...
      </div>
    );
  }

  return (
    <AdminLayout>
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-bold mb-8 uppercase">
        Edit Homepage Section
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
              <option value="EDITORIAL">Editorial</option>
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

      {/* CONFIG */}
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

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={update}
          disabled={loading}
          className="bg-black text-white px-6 py-3 text-xs uppercase font-bold disabled:bg-gray-300"
        >
          {loading ? "Updating..." : "Update Section"}
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
