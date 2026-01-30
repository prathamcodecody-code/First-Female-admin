import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import MediaPicker from "../modals/MediaPicker";
import {
  FiTrash2,
  FiChevronUp,
  FiChevronDown,
  FiInstagram,
  FiUpload,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

export default function InfluencerItem({
  item,
  index,
  totalItems,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  item: any;
  index: number;
  totalItems: number;
  onChange: (v: any) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [product, setProduct] = useState<any>(null);

  /* ---------------- product fetch ---------------- */

  useEffect(() => {
    if (!item.productId) {
      setProduct(null);
      return;
    }

    api
      .get(`/products/${item.productId}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null));
  }, [item.productId]);

  /* ---------------- product search ---------------- */

  async function searchProducts(q: string) {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await api.get("/products", {
        params: { search: q, limit: 6 },
      });
      setResults(res.data.products || []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  const selectProduct = (p: any) => {
    onChange({ productId: p.id }); // ✅ single source of truth
    setSearch("");
    setResults([]);
  };

  const clearProduct = () => {
    onChange({ productId: null }); // ✅ product state will auto-reset
  };

  /* ---------------- validation ---------------- */

  const hasMedia =
    (item.mediaType === "UPLOAD" && item.mediaId) ||
    (item.mediaType === "INSTAGRAM" && item.embedUrl);

  const hasProduct = !!item.productId;
  const isComplete = hasMedia && hasProduct;

  /* ---------------- render ---------------- */

  return (
    <div
      className={`border-2 rounded-sm bg-white overflow-hidden transition-all ${
        isComplete ? "border-gray-100" : "border-amber-200 bg-amber-50"
      }`}
    >
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-4">
          <span
            className={`text-[10px] font-black uppercase tracking-widest ${
              isComplete ? "text-gray-400" : "text-amber-600"
            }`}
          >
            Reel #{index + 1}
          </span>

          {isComplete ? (
            <span className="flex items-center gap-1 text-[9px] text-emerald-600 uppercase tracking-widest">
              <FiCheck size={12} /> Complete
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[9px] text-amber-600 uppercase tracking-widest">
              <FiAlertCircle size={12} /> Incomplete
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-2 hover:bg-gray-100 rounded-sm disabled:opacity-30"
          >
            <FiChevronUp size={14} />
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === totalItems - 1}
            className="p-2 hover:bg-gray-100 rounded-sm disabled:opacity-30"
          >
            <FiChevronDown size={14} />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <button
            type="button"
            onClick={onRemove}
            className="p-2 hover:bg-red-50 text-red-500 rounded-sm"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Media selector */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
            Media Source
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                item.mediaType !== "UPLOAD" &&
                onChange({ mediaType: "UPLOAD", embedUrl: null })
              }
              className={`p-4 border-2 rounded-sm ${
                item.mediaType === "UPLOAD"
                  ? "border-brandPink bg-pink-50 text-brandPink"
                  : "border-gray-200"
              }`}
            >
              <FiUpload /> Upload
            </button>

            <button
              type="button"
              onClick={() =>
                item.mediaType !== "INSTAGRAM" &&
                onChange({ mediaType: "INSTAGRAM", mediaId: null })
              }
              className={`p-4 border-2 rounded-sm ${
                item.mediaType === "INSTAGRAM"
                  ? "border-brandPink bg-pink-50 text-brandPink"
                  : "border-gray-200"
              }`}
            >
              <FiInstagram /> Instagram
            </button>
          </div>
        </div>

        {/* Upload */}
        {item.mediaType === "UPLOAD" && (
          <MediaPicker
            value={item.mediaId ? [item.mediaId] : []}
            multiple={false}
            accept={["image/*", "video/*"]}
            onChange={(ids) => onChange({ mediaId: ids[0] })}
          />
        )}

        {/* Instagram */}
        {item.mediaType === "INSTAGRAM" && (
          <input
            type="url"
            placeholder="https://www.instagram.com/reel/..."
            value={item.embedUrl || ""}
            onChange={(e) => onChange({ embedUrl: e.target.value })}
            className="w-full bg-gray-50 px-4 py-3 rounded-sm text-xs"
          />
        )}

        {/* Product */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
            Linked Product
          </label>

          {product ? (
            <div className="bg-emerald-50 border border-emerald-200 p-4 flex justify-between">
              <div className="flex gap-3">
                {product.media?.[0]?.url && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${product.media[0].url}`}
                    className="w-12 h-12 object-cover"
                  />
                )}
                <div>
                  <p className="text-[10px] font-bold">{product.title}</p>
                  <p className="text-[9px] text-gray-500">
                    ID: {product.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearProduct}
                className="text-[9px] text-red-500 uppercase"
              >
                Change
              </button>
            </div>
          ) : (
            <>
              <input
                placeholder="Search for product..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  searchProducts(e.target.value);
                }}
                className="w-full bg-gray-50 px-4 py-3 rounded-sm text-xs"
              />

              {results.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectProduct(p)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex gap-3"
                >
                  {p.title}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
