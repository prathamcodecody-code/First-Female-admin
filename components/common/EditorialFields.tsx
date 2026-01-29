"use client";

type EditorialItem = {
  productId: number;
  modelImage: string;
  accent?: string;
  bgColor?: string;
};

export default function EditorialFields({
  value = { items: [] },
  onChange,
}: {
  value: { items: EditorialItem[] };
  onChange: (v: any) => void;
}) {
  const items = value.items || [];

  const updateItem = (
    i: number,
    field: keyof EditorialItem,
    val: string
  ) => {
    const updated = [...items];
    updated[i] = {
      ...updated[i],
      [field]: field === "productId" ? Number(val) : val,
    };
    onChange({ items: updated });
  };

  const addItem = () =>
    onChange({
      items: [
        ...items,
        {
          productId: 0,
          modelImage: "",
          accent: "",
          bgColor: "#ffffff",
        },
      ],
    });

  const removeItem = (i: number) =>
    onChange({ items: items.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-sm uppercase">Editorial Slides</h3>

      {items.map((item, i) => (
        <div key={i} className="border p-4 rounded space-y-3">
          <input
            placeholder="Product ID"
            type="number"
            value={item.productId || ""}
            onChange={(e) => updateItem(i, "productId", e.target.value)}
            className="border p-2 w-full"
          />

          <input
            placeholder="Model Image URL"
            value={item.modelImage}
            onChange={(e) => updateItem(i, "modelImage", e.target.value)}
            className="border p-2 w-full"
          />

          <input
            placeholder="Accent Text (NEW IN / TRENDING)"
            value={item.accent || ""}
            onChange={(e) => updateItem(i, "accent", e.target.value)}
            className="border p-2 w-full"
          />

          <input
            placeholder="Background Color (#FDF2F2)"
            value={item.bgColor || ""}
            onChange={(e) => updateItem(i, "bgColor", e.target.value)}
            className="border p-2 w-full"
          />

          <button
            onClick={() => removeItem(i)}
            className="text-xs text-red-500 underline"
          >
            Remove Item
          </button>
        </div>
      ))}

      <button
        onClick={addItem}
        className="px-4 py-2 border text-xs rounded"
      >
        + Add Editorial Item
      </button>
    </div>
  );
}
