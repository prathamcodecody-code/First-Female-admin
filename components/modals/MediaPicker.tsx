"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Media = {
  id: number;
  url: string;
  type: "IMAGE" | "VIDEO";
};

export default function MediaPicker({
  value = [],
  onChange,
  multiple = true,
  accept,
}: {
  value: number[];
  onChange: (ids: number[]) => void;
  multiple?: boolean;
  accept?: string[]; // ✅ ADD THIS
}) {
  const [media, setMedia] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);

  // Load existing media
  useEffect(() => {
    console.log("API URL =", process.env.NEXT_PUBLIC_API_URL);
    api.get("/admin/media").then((res) => setMedia(res.data));
  }, []);

  const toggle = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter((x) => x !== id));
    } else {
      onChange(multiple ? [...value, id] : [id]);
    }
  };

  const upload = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);

    const res = await api.post("/admin/media", form);
    setMedia((prev) => [res.data, ...prev]);
    onChange(multiple ? [...value, res.data.id] : [res.data.id]);
    setUploading(false);
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase">Media</h4>

      {/* Upload */}
      <input
        type="file"
        accept="image/*,video/*"
        disabled={uploading}
        onChange={(e) => e.target.files && upload(e.target.files[0])}
        className="text-xs"
      />

      {/* Media Grid */}
      <div className="grid grid-cols-4 gap-3">
        {media.map((m) => (
          <div
            key={m.id}
            onClick={() => toggle(m.id)}
            className={`border rounded cursor-pointer overflow-hidden relative
              ${value.includes(m.id)
                ? "border-brandPink ring-2 ring-brandPink"
                : "border-gray-200"
              }`}
          >
            {m.type === "IMAGE" ? (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${m.url}`}
                className="w-full h-20 object-cover"
              />
            ) : (
              <video className="w-full h-20 object-cover" />
            )}

            {value.includes(m.id) && (
              <span className="absolute top-1 right-1 bg-brandPink text-white text-[10px] px-1 rounded">
                ✓
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
