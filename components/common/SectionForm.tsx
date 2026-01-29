"use client";

import { useState } from "react";
import HeroFields from "./HeroFields";
import CategoryStripFields from "./CategoryStripFields";
import EditorialFields from "./EditorialFields";
import InfluencerFields from "./InfluencerFields";

/* ✅ FRONTEND-SAFE ENUM */
const HOME_SECTION_TYPES = [
  "HERO",
  "CATEGORY_STRIP",
  "EDITORIAL",
  "INFLUENCER",
] as const;

type HomeSectionType = typeof HOME_SECTION_TYPES[number];

export default function SectionForm({
  initial,
  onSubmit,
}: {
  initial?: any;
  onSubmit: (v: any) => void;
}) {
  const [form, setForm] = useState<{
    type: HomeSectionType;
    title: string;
    position: number;
    isActive: boolean;
    config: any;
  }>(
    initial || {
      type: "HERO",
      title: "",
      position: 0,
      isActive: true,
      config: {},
    }
  );

  return (
    <div className="space-y-6">
      {/* SECTION TYPE */}
      <select
        value={form.type}
        onChange={(e) =>
          setForm({
            ...form,
            type: e.target.value as HomeSectionType,
            config: {},
          })
        }
        className="border p-2 w-full"
      >
        {HOME_SECTION_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {form.type === "HERO" && (
        <HeroFields
          value={form.config}
          onChange={(c) =>
            setForm({ ...form, config: c })
          }
        />
      )}

      {form.type === "CATEGORY_STRIP" && (
        <CategoryStripFields
          value={form.config}
          onChange={(c:any) =>
            setForm({ ...form, config: c })
          }
        />
      )}

      {form.type === "EDITORIAL" && (
        <EditorialFields
          value={form.config}
          onChange={(c:any) =>
            setForm({ ...form, config: c })
          }
        />
      )}

      {form.type === "INFLUENCER" && (
        <InfluencerFields
          value={form.config}
          onChange={(c:any) =>
            setForm({ ...form, config: c })
          }
        />
      )}

      <button
        onClick={() => onSubmit(form)}
        className="px-6 py-3 bg-black text-white rounded"
      >
        Save Section
      </button>
    </div>
  );
}
