"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import MediaPicker from "@/components/modals/MediaPicker";

type StripItem = {
  subtypeId: number;
  mediaId?: number;
};

export default function CategoryStripFields({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  const [subtypes, setSubtypes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<number | "ALL">("ALL");

  const items: StripItem[] = value?.items || [];

  useEffect(() => {
    api.get("/product-subtypes/admin/all").then((res) => {
      setSubtypes(res.data);
    });
  }, []);

  /* ---------------- FILTERING ---------------- */

  const productTypes = useMemo(() => {
    const map = new Map<number, string>();
    subtypes.forEach((s) => {
      map.set(s.type.id, s.type.name);
    });
    return Array.from(map.entries());
  }, [subtypes]);

  const filteredSubtypes = subtypes.filter((s) => {
    const matchesSearch = s.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      typeFilter === "ALL" || s.type.id === typeFilter;

    return matchesSearch && matchesType;
  });

  /* ---------------- ACTIONS ---------------- */

  const toggleSubtype = (subtypeId: number) => {
    const exists = items.find((i) => i.subtypeId === subtypeId);

    const next = exists
      ? items.filter((i) => i.subtypeId !== subtypeId)
      : [...items, { subtypeId }];

    onChange({ ...value, items: next });
  };

  const updateMedia = (subtypeId: number, mediaId: number) => {
    const next = items.map((i) =>
      i.subtypeId === subtypeId ? { ...i, mediaId } : i
    );

    onChange({ ...value, items: next });
  };

  return (
    <div className="space-y-6">
      <h3 className="font-bold uppercase text-sm">
        Category Strip
      </h3>

      {/* FILTERS */}
      <div className="flex gap-3">
        <input
          placeholder="Search subtype..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 text-sm w-full"
        />

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(
              e.target.value === "ALL"
                ? "ALL"
                : Number(e.target.value)
            )
          }
          className="border px-3 py-2 text-sm"
        >
          <option value="ALL">All Types</option>
          {productTypes.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* SUBTYPE LIST */}
      <div className="space-y-4">
        {filteredSubtypes.map((s) => {
          const item = items.find(
            (i) => i.subtypeId === s.id
          );

          const selected = !!item;

          return (
            <div
              key={s.id}
              className={`border rounded p-4 space-y-3 ${
                selected
                  ? "border-brandPink bg-brandPink/5"
                  : "border-gray-200"
              }`}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleSubtype(s.id)}
                />
                <div>
                  <p className="font-semibold text-sm">
                    {s.name}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {s.type.name}
                  </p>
                </div>
              </label>

              {/* MEDIA PICKER PER SUBTYPE */}
              {selected && (
                <MediaPicker
                  value={item?.mediaId ? [item.mediaId] : []}
                  onChange={(ids) =>
                    updateMedia(s.id, ids[0])
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
