"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import ProductDiscountSection from "@/components/modals/ProductDiscountSection";

const SIZE_OPTIONS = ["Free Size", "XS", "S", "M", "L", "XL", "XXL", "3XL"];

export default function CreateProductPage() {
  const router = useRouter();

  // FORM STATES
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  // DROPDOWN DATA
  const [categories, setCategories] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [subtypes, setSubtypes] = useState<any[]>([]);

  // SELECTED VALUES
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubtype, setSelectedSubtype] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [isTrending, setIsTrending] = useState(false);
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [weight, setWeight] = useState("");

  // IMAGES
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null]);
  const [sizes, setSizes] = useState<{ size: string; stock: number; price?: number }[]>([]);

  // FETCH FUNCTIONS
  const fetchTypes = async (categoryId: string) => {
    try {
      const res = await api.get(`/product-types?categoryId=${categoryId}`);
      setTypes(res.data || []);
      setSelectedType("");
      setSelectedSubtype("");
      setSubtypes([]);
    } catch (err: any) {
      console.error("Error fetching types:", err);
      setTypes([]);
    }
  };

  const fetchSubtypes = async (typeId: string) => {
    try {
      const res = await api.get(`/product-subtypes?typeId=${typeId}`);
      setSubtypes(res.data || []);
      setSelectedSubtype("");
    } catch (err: any) {
      console.error("Error fetching subtypes:", err);
      setSubtypes([]);
    }
  };

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data)).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setTypes([]);
      setSubtypes([]);
      return;
    }
    fetchTypes(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedType) {
      setSubtypes([]);
      return;
    }
    fetchSubtypes(selectedType);
  }, [selectedType]);

  const handleImageChange = (index: number, file: File | null) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  function calculateFinalPrice(price: number, discountType?: string, discountValue?: number) {
    if (!discountType || !discountValue) return price;
    if (discountType === "PERCENT") return Math.max(0, price - (price * discountValue) / 100);
    if (discountType === "FLAT") return Math.max(0, price - discountValue);
    return price;
  }

  const [estimatedShipping, setEstimatedShipping] = useState<number | null>(null);
  const [profitPreview, setProfitPreview] = useState<number | null>(null);

  const estimatePricing = () => {
    if (!price || !weight) return;
    const basePrice = Number(price);
    const discountVal = Number(discountValue || 0);
    const sellingPrice = calculateFinalPrice(basePrice, discountType, discountVal);
    const kg = Math.max(Number(weight), 0.5);
    let shipping = 80;
    if (kg > 0.5) shipping += Math.ceil((kg - 0.5) / 0.5) * 30;
    setEstimatedShipping(shipping);
    setProfitPreview(sellingPrice - shipping);
  };

  useEffect(() => { estimatePricing(); }, [price, weight, discountType, discountValue]);

  const createProduct = async () => {
    if (!selectedCategory || !selectedType || !selectedSubtype) return alert("Please select all dropdown values");
    if (!title || !price || !stock || sizes.length === 0) return alert("Please fill in all required fields");
    if (!weight || Number(weight) <= 0) return alert("Product weight is required");
    if (estimatedShipping === null) {
  alert("Estimated shipping could not be calculated");
  return;
}
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("weight", weight);
    formData.append("stock", stock);
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("categoryId", selectedCategory);
    formData.append("estimatedShipping", String(estimatedShipping));
    formData.append("typeId", selectedType);
    formData.append("subtypeId", selectedSubtype);
    formData.append("isTrending", isTrending ? "true" : "false");
    if (discountType) {
      formData.append("discountType", discountType);
      formData.append("discountValue", discountValue);
    }
    images.forEach((img, i) => { if (img) formData.append(`image${i + 1}`, img); });

    try {
      await api.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Product created successfully!");
      router.push("/products");
    } catch (err) {
      alert("Error creating product");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto pb-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brandBlack">Add New Product</h1>
            <p className="text-brandGray">Fill in the details to list a new item in your store</p>
          </div>
          <button
            type="button"
            onClick={createProduct}
            className="px-8 py-3 rounded-xl text-white bg-brandPink hover:bg-brandPink/90 shadow-lg shadow-brandPink/20 transition-all font-semibold"
          >
            Save Product
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE — PRODUCT DETAILS */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic Details */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
              <h2 className="text-xl font-bold text-brandBlack mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-brandPink rounded-full"></span>
                Basic Details
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-brandBlack">Product Title</label>
                  <input
                    className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink outline-none transition-all"
                    placeholder="e.g. Silk Floral Summer Dress"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-brandBlack">Description</label>
                  <textarea
                    className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink outline-none transition-all"
                    rows={4}
                    placeholder="Describe the material, fit, and style..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5 text-sm font-semibold text-brandBlack">Base Price (₹)</label>
                    <input
                      type="number"
                      className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink outline-none transition-all"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-semibold text-brandBlack">Total Stock</label>
                    <input
                      type="number"
                      className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink outline-none transition-all"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                   <ProductDiscountSection
                    price={price}
                    discountType={discountType}
                    discountValue={discountValue}
                    onChange={({ discountType, discountValue }) => {
                      setDiscountType(discountType);
                      setDiscountValue(discountValue);
                    }}
                  />
                  <div>
                    <label className="block mb-1.5 text-sm font-semibold text-brandBlack">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brandPink/20 focus:border-brandPink outline-none transition-all"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CATEGORY MAPPING */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
              <h2 className="text-xl font-bold text-brandBlack mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-brandPurple rounded-full"></span>
                Categorization
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-brandBlack">Category</label>
                  <select
                    className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-brandPink/20 outline-none"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-brandBlack">Type</label>
                  <select
                    className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-brandPink/20 outline-none disabled:opacity-50"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    disabled={!selectedCategory || types.length === 0}
                  >
                    <option value="">Select Type</option>
                    {types.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-brandBlack">Subtype</label>
                  <select
                    className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-brandPink/20 outline-none disabled:opacity-50"
                    value={selectedSubtype}
                    onChange={(e) => setSelectedSubtype(e.target.value)}
                    disabled={!selectedType || subtypes.length === 0}
                  >
                    <option value="">Select Subtype</option>
                    {subtypes.map((st) => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SIZES */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
              <h2 className="text-xl font-bold text-brandBlack mb-6">Inventory by Size</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {SIZE_OPTIONS.map((size) => {
                  const existing = sizes.find((s) => s.size === size);
                  return (
                    <div key={size} className={`border rounded-2xl p-4 transition-all ${existing ? 'border-brandPink bg-brandPink/5' : 'border-gray-100 bg-gray-50'}`}>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-brandPink"
                          checked={!!existing}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSizes((prev) => [...prev, { size, stock: 1 }]);
                            } else {
                              setSizes((prev) => prev.filter((s) => s.size !== size));
                            }
                          }}
                        />
                        <span className={`font-bold ${existing ? 'text-brandPink' : 'text-brandGray'}`}>{size}</span>
                      </label>
                      {existing && (
                        <input
                          type="number"
                          min={0}
                          placeholder="Stock"
                          value={existing.stock}
                          onChange={(e) => {
                            const stock = Number(e.target.value);
                            setSizes((prev) => prev.map((s) => s.size === size ? { ...s, stock } : s));
                          }}
                          className="mt-3 w-full border border-brandPink/20 p-2 rounded-lg bg-white text-sm focus:outline-none"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — IMAGES & INSIGHTS */}
          <div className="space-y-6">
            
            {/* PRICING INSIGHT */}
            <div className="bg-brandBlack text-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                💰 Pricing Insight
              </h2>
              {!price || !weight ? (
                <p className="text-brandGray text-sm">Enter price and weight to see profit analysis.</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-brandGray">MRP</span>
                    <span className="font-medium">₹{price}</span>
                  </div>
                  {discountType && (
                    <div className="flex justify-between text-sm">
                      <span className="text-brandGray">Discount</span>
                      <span className="text-green-400 font-medium">
                        {discountType === "PERCENT" ? `-${discountValue}%` : `-₹${discountValue}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t border-white/10 pt-4">
                    <span className="text-sm">Final Sale Price</span>
                    <span className="text-xl font-bold text-brandPinkLight">
                      ₹{calculateFinalPrice(Number(price), discountType, Number(discountValue))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brandGray">Est. Shipping</span>
                    <span className="text-orange-300">₹{estimatedShipping}</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Estimated Profit</span>
                      <span className={`text-xl font-black ${profitPreview && profitPreview >= 0 ? "text-green-400" : "text-red-400"}`}>
                        ₹{profitPreview}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* IMAGES */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
              <h2 className="text-xl font-bold text-brandBlack mb-4">Gallery</h2>
              <div className="grid grid-cols-2 gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <label className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-brandCream/50 hover:border-brandPink/50 transition-all overflow-hidden">
                      {img ? (
                        <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="text-center p-2">
                          <span className="text-2xl text-gray-300 group-hover:text-brandPink">+</span>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 group-hover:text-brandPink">Img {index + 1}</p>
                        </div>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(index, e.target.files?.[0] || null)} />
                    </label>
                    {img && (
                      <button
                        type="button"
                        onClick={() => handleImageChange(index, null)}
                        className="absolute -top-2 -right-2 bg-brandRed text-white w-7 h-7 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* TRENDING TOGGLE */}
            <div className="bg-brandCream/50 border border-brandPink/10 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-brandBlack">Trending Item</p>
                <p className="text-xs text-brandGray">Show on homepage</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="sr-only peer" />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-brandPink after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6"></div>
              </label>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
