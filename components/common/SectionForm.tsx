"use client";

import { HomeSectionType } from "@prisma/client";
import HeroFields from "./HeroFields";
import CategoryStripFields from "./CategoryStripFields";
import EditorialFields from "./EditorialFields";
import InfluencerFields from "./InfluencerFields";

export default function SectionForm({ initial, onSubmit }: any) {
  const [form, setForm] = useState(
    initial || {
      type: HomeSectionType.HERO,
      title: "",
      position: 0,
      isActive: true,
      config: {},
    }
  );

  return (
    <div className="space-y-6">
      <select
        value={form.type}
        onChange={e =>
          setForm({ ...form, type: e.target.value, config: {} })
        }
        className="border p-2 w-full"
      >
        {Object.values(HomeSectionType).map(t => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {form.type === "HERO" && (
        <HeroFields
          value={form.config}
          onChange={c => setForm({ ...form, config: c })}
        />
      )}

      {form.type === "CATEGORY_STRIP" && (
        <CategoryStripFields
          value={form.config}
          onChange={c => setForm({ ...form, config: c })}
        />
      )}

      {form.type === "EDITORIAL" && (
        <EditorialFields
          value={form.config}
          onChange={c => setForm({ ...form, config: c })}
        />
      )}

      {form.type === "INFLUENCER" && (
        <InfluencerFields
          value={form.config}
          onChange={c => setForm({ ...form, config: c })}
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
