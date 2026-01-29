"use client";

import MediaPicker from "@/components/modals/MediaPicker";

type Slide = {
  mediaId: number | null;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
};

export default function HeroFields({
  value = { slides: [] },
  onChange,
}: {
  value: { slides: Slide[] };
  onChange: (v: any) => void;
}) {
  const slides = value.slides || [];

  const updateSlide = (i: number, field: keyof Slide, val: any) => {
    const updated = [...slides];
    updated[i] = { ...updated[i], [field]: val };
    onChange({ slides: updated });
  };

  const addSlide = () =>
    onChange({
      slides: [
        ...slides,
        {
          mediaId: null,
          title: "",
          subtitle: "",
          ctaText: "",
          ctaLink: "",
        },
      ],
    });

  const removeSlide = (i: number) =>
    onChange({ slides: slides.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-sm uppercase">Hero Slides</h3>

      {/* RULES */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
        <p className="font-semibold mb-1">Hero Media Rules</p>
        <ul className="list-disc ml-4 space-y-1">
          <li>Images: 16:9, max 300KB</li>
          <li>Videos: max 30s, max 5MB, muted autoplay</li>
          <li>One image or video per slide</li>
        </ul>
      </div>

      {slides.map((s, i) => (
        <div key={i} className="border p-4 rounded space-y-4">
          {/* MEDIA PICKER */}
          <MediaPicker
            value={s.mediaId ? [s.mediaId] : []}
            onChange={(ids) =>
              updateSlide(i, "mediaId", ids[0] ?? null)
            }
            multiple={false}
            accept={["image/*", "video/*"]}
          />

          <input
            placeholder="Title"
            value={s.title}
            onChange={(e) => updateSlide(i, "title", e.target.value)}
            className="border p-2 w-full"
          />

          <input
            placeholder="Subtitle"
            value={s.subtitle || ""}
            onChange={(e) => updateSlide(i, "subtitle", e.target.value)}
            className="border p-2 w-full"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="CTA Text"
              value={s.ctaText || ""}
              onChange={(e) => updateSlide(i, "ctaText", e.target.value)}
              className="border p-2 w-full"
            />
            <input
              placeholder="CTA Link"
              value={s.ctaLink || ""}
              onChange={(e) => updateSlide(i, "ctaLink", e.target.value)}
              className="border p-2 w-full"
            />
          </div>

          <button
            onClick={() => removeSlide(i)}
            className="text-xs text-red-500 underline"
          >
            Remove Slide
          </button>
        </div>
      ))}

      <button
        onClick={addSlide}
        className="px-4 py-2 border text-xs rounded"
      >
        + Add Slide
      </button>
    </div>
  );
}
