"use client";

type ProductPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: any;
};

export default function ProductPreviewModal({
  isOpen,
  onClose,
  product,
}: ProductPreviewModalProps) {
  if (!isOpen || !product) return null;

  /* ---------- PRICE CALCULATION ---------- */
  const basePrice = Number(product.price || 0);
  const discountValue = Number(product.discountValue || 0);

  let finalPrice = basePrice;
  if (product.discountType === "PERCENT") {
    finalPrice = Math.max(0, basePrice - (basePrice * discountValue) / 100);
  }
  if (product.discountType === "FLAT") {
    finalPrice = Math.max(0, basePrice - discountValue);
  }

  const images = [product.img1, product.img2, product.img3, product.img4].filter(Boolean);

  const createdAtValid =
    product.createdAt && !isNaN(Date.parse(product.createdAt));

  /* ---------- ATTRIBUTE HELPERS ---------- */
  const renderList = (items: any[], key: string) =>
    items?.length ? (
      <div className="flex flex-wrap gap-2">
        {items.map((x, index) => (
          <span
            /* FIX 1: Use index or a combined string if IDs repeat across categories */
            key={`${key}-${x[key]?.id || index}`} 
            className="px-3 py-1 text-xs rounded-full bg-pink-50 text-brandPink border border-pink-100"
          >
            {x[key]?.name}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-xs text-gray-400">—</p>
    );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-[900px] max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-brandPink">Product Preview</h2>
          <button onClick={onClose} className="text-xl text-gray-500 hover:text-black">✕</button>
        </div>

        {/* BODY */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT — IMAGES */}
          <div className="space-y-3">
            {images.length ? (
              images.map((img, i) => (
                <img
                  /* FIX 2: Ensure unique key for images */
                  key={`preview-img-${i}`}
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${img}`}
                  alt={`Preview ${i}`}
                  className="w-full h-44 object-cover rounded-lg border shadow-sm"
                />
              ))
            ) : (
              <div className="h-44 flex items-center justify-center text-gray-400 border rounded-lg bg-gray-50">
                No images uploaded
              </div>
            )}
          </div>

          {/* RIGHT — DETAILS */}
          <div className="space-y-5">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{product.title}</h3>
              {product.description && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{product.description}</p>
              )}
            </div>

            {/* PRICE */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-brandPink">
                  ₹{finalPrice.toLocaleString()}
                </p>

                {product.discountType && (
                  <p className="text-sm text-gray-400 line-through">
                    ₹{basePrice.toLocaleString()}
                  </p>
                )}
              </div>

              {product.discountType && (
                <span className="inline-block mt-1 text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                  {product.discountType === "PERCENT"
                    ? `${product.discountValue}% OFF`
                    : `₹${product.discountValue} OFF`}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
               <p className="text-xs text-gray-500 uppercase font-semibold">
                Weight: <span className="text-gray-900">{product.weight} kg</span>
              </p>
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Total Stock: <span className="text-gray-900">{product.stock}</span>
              </p>
            </div>

            {/* SIZES */}
            <div className="border-t pt-4">
              <p className="font-bold text-xs uppercase text-gray-400 mb-2">Inventory by Size</p>
              {product.sizes?.length ? (
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s: any) => (
                    <span
                      key={`size-${product.id || "tmp"}-${s.size}`}
                      className={`px-3 py-1 text-xs font-medium rounded border shadow-sm ${
                        s.stock > 0
                          ? "border-brandPink text-brandPink bg-pink-50/30"
                          : "border-gray-200 text-gray-300 line-through bg-gray-50"
                      }`}
                    >
                      {s.size} ({s.stock})
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No sizes defined</p>
              )}
            </div>

            {/* ATTRIBUTES */}
            <div className="space-y-4 border-t pt-4 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Colors</p>
                {renderList(product.productColors, "color")}
              </div>

              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Fabrics</p>
                {renderList(product.productFabrics, "fabric")}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Occasions</p>
                  {renderList(product.productOccasions, "occasion")}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Fits</p>
                  {renderList(product.productFits, "fit")}
                </div>
              </div>
            </div>

            {/* CATEGORY & METADATA */}
            <div className="bg-gray-50 p-3 rounded-lg space-y-1">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                Path: {product.category?.name} <span className="mx-1 opacity-30">/</span> {product.type?.name} <span className="mx-1 opacity-30">/</span> {product.subtype?.name}
              </p>
              {product.season && (
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                  Season: <span className="text-brandPink">{product.season.name}</span>
                </p>
              )}
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter pt-2">
                Added: {createdAtValid
                  ? new Date(product.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
