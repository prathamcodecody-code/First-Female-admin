import Link from "next/link";
import { api } from "@/lib/api";

export default function SectionCard({ section, onUpdate }: any) {
  const toggle = async () => {
    await api.patch(`/admin/homepage/${section.id}`, {
      isActive: !section.isActive,
    });
    onUpdate();
  };

  const remove = async () => {
    if (!confirm("Delete this section?")) return;
    await api.delete(`/admin/homepage/${section.id}`);
    onUpdate();
  };

  return (
    <div className="border p-4 rounded flex justify-between items-center">
      <div>
        <p className="font-bold">{section.type}</p>
        <p className="text-xs text-gray-500">
          Position: {section.position}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={toggle}
          className="px-3 py-1 text-xs border rounded"
        >
          {section.isActive ? "Disable" : "Enable"}
        </button>

        <Link
          href={`/homepage/edit/${section.id}`}
          className="px-3 py-1 text-xs border rounded"
        >
          Edit
        </Link>

        <button
          onClick={remove}
          className="px-3 py-1 text-xs border border-red-500 text-red-500 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
