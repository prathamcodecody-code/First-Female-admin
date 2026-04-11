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

  /* ---------- VENDOR CALCULATION ---------- */
  const vendors = product.productVendors || [];
  const totalVendorCost = vendors.reduce(
    (sum: number, pv: any) => sum + (Number(pv.costPrice || 0) * pv.quantity),
    0
  );
  const profitPerUnit = finalPrice - (vendors.length > 0 ? totalVendorCost / (product.stock || 1) : 0);
  const totalProfit = profitPerUnit * (product.stock || 1);

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
      <div className="bg-white w-full max-w-[1000px] max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-brandPink">Product Preview</h2>
          <button onClick={onClose} className="text-xl text-gray-500 hover:text-black">✕</button>
        </div>

        {/* BODY */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">

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

          {/* CENTER — DETAILS */}
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

          {/* RIGHT — VENDORS & PROFIT */}
          <div className="space-y-5">
            {/* VENDOR INFORMATION */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-4 rounded-lg">
              <h4 className="font-bold text-sm text-amber-900 uppercase tracking-wide mb-4 border-b border-amber-200 pb-2">
                📦 Vendor Details
              </h4>

              {vendors.length > 0 ? (
                <div className="space-y-4">
                  {vendors.map((pv: any, idx: number) => (
                    <div key={`vendor-${pv.vendorId || idx}`} className="bg-white p-3 rounded-lg border border-amber-100 space-y-2">
                      {/* Vendor Company Name */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Company</p>
                          <p className="text-sm font-bold text-gray-800">{pv.vendor?.companyName || "—"}</p>
                        </div>
                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full whitespace-nowrap ${
                          pv.vendor?.vendorType === "MANUFACTURER"
                            ? "bg-blue-100 text-blue-700"
                            : pv.vendor?.vendorType === "WHOLESALER"
                            ? "bg-purple-100 text-purple-700"
                            : pv.vendor?.vendorType === "RETAILER"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {pv.vendor?.vendorType || "—"}
                        </span>
                      </div>

                      {/* Contact Person */}
                      {pv.vendor?.contactPersonName && (
                        <div>
                          <p className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Contact Person</p>
                          <p className="text-sm text-gray-700">{pv.vendor.contactPersonName}</p>
                        </div>
                      )}

                      {/* Contact & Email */}
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        {pv.vendor?.contactNumber && (
                          <div>
                            <p className="font-black text-gray-400 uppercase tracking-widest">Phone</p>
                            <p className="text-gray-700 font-mono">{pv.vendor.contactNumber}</p>
                          </div>
                        )}
                        {pv.vendor?.emailId && (
                          <div>
                            <p className="font-black text-gray-400 uppercase tracking-widest">Email</p>
                            <p className="text-gray-700 font-mono break-all">{pv.vendor.emailId}</p>
                          </div>
                        )}
                      </div>

                      {/* Cost & Fabric */}
                      <div className="pt-2 border-t border-amber-100 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Cost Price</p>
                            <p className="text-lg font-bold text-orange-600">₹{Number(pv.costPrice || 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Quantity</p>
                            <p className="text-lg font-bold text-gray-800">{pv.quantity}</p>
                          </div>
                        </div>

                        {pv.fabricType && (
                          <div>
                            <p className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Fabric Type</p>
                            <p className="text-sm text-gray-700">{pv.fabricType}</p>
                          </div>
                        )}

                        {/* Total Cost for this Vendor */}
                        <div className="bg-amber-50 p-2 rounded border border-amber-100">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Subtotal</p>
                          <p className="text-base font-bold text-amber-700">
                            ₹{(Number(pv.costPrice || 0) * pv.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Summary */}
                  <div className="bg-white p-3 rounded-lg border border-amber-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-600">Total Vendor Cost:</p>
                      <p className="font-bold text-orange-600">₹{totalVendorCost.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between text-sm border-t border-amber-100 pt-2">
                      <p className="text-gray-600">Cost per Unit:</p>
                      <p className="font-bold text-orange-600">₹{(totalVendorCost / (product.stock || 1)).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-amber-700 italic">No vendors assigned</p>
              )}
            </div>

            {/* PROFIT ANALYSIS */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 p-4 rounded-lg">
              <h4 className="font-bold text-sm text-emerald-900 uppercase tracking-wide mb-4 border-b border-emerald-200 pb-2">
                💰 Profit Analysis
              </h4>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Selling Price:</p>
                  <p className="font-bold text-lg text-emerald-600">₹{finalPrice.toLocaleString()}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Cost per Unit:</p>
                  <p className="font-bold text-lg text-orange-600">
                    ₹{(totalVendorCost / (product.stock || 1)).toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-between border-t-2 border-emerald-200 pt-2">
                  <p className="text-sm font-bold text-gray-700">Profit per Unit:</p>
                  <p className={`font-bold text-lg ${profitPerUnit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ₹{profitPerUnit.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white p-2 rounded border border-emerald-100">
                  <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Total Profit (All Units)</p>
                  <p className={`text-2xl font-black ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ₹{totalProfit.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] pt-2">
                  <div className="bg-white p-2 rounded border border-gray-100">
                    <p className="font-black text-gray-400 uppercase">Margin %</p>
                    <p className="font-bold text-gray-800">
                      {finalPrice > 0 ? ((profitPerUnit / finalPrice) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-100">
                    <p className="font-black text-gray-400 uppercase">Total Units</p>
                    <p className="font-bold text-gray-800">{product.stock}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
