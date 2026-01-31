"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import ProductSeoForm from "./ProductSeoForm";
import ProductDiscountSection from "@/components/modals/ProductDiscountSection";

const SIZE_OPTIONS = ["Free Size", "XS", "S", "M", "L", "XL", "XXL", "3XL"];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  // FORM STATES
  const [product, setProduct] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [isTrending, setIsTrending] = useState(false);
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");

  // DROPDOWNS & ATTRIBUTES
  const [categories, setCategories] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [subtypes, setSubtypes] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubtype, setSelectedSubtype] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");

  const [colors, setColors] = useState<number[]>([]);
  const [fabrics, setFabrics] = useState<number[]>([]);
  const [occasions, setOccasions] = useState<number[]>([]);
  const [fits, setFits] = useState<number[]>([]);
  const [sleeves, setSleeves] = useState<number[]>([]);
  const [patterns, setPatterns] = useState<number[]>([]);

  const [colorList, setColorList] = useState<any[]>([]);
  const [fabricList, setFabricList] = useState<any[]>([]);
  const [occasionList, setOccasionList] = useState<any[]>([]);
  const [fitList, setFitList] = useState<any[]>([]);
  const [sleeveList, setSleeveList] = useState<any[]>([]);
  const [patternList, setPatternList] = useState<any[]>([]);

  const [sizes, setSizes] = useState<{ id?: number; size: string; stock: number }[]>([]);
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null]);
  const [existingImages, setExistingImages] = useState<(string | null)[]>([null, null, null, null]);

  const totalStock = useMemo(() => sizes.reduce((sum, s) => sum + Number(s.stock || 0), 0), [sizes]);

  /* ================= FETCHING ================= */
  useEffect(() => {
    if (!productId) return;
    api.get(`/products/${productId}`).then((res) => {
      const data = res.data;
      setProduct(data);
      setTitle(data.title);
      setDescription(data.description);
      setPrice(data.price);
      setWeight(data.weight || "");
      setDiscountType(data.discountType || "");
      setDiscountValue(data.discountValue !== null ? String(data.discountValue) : "");
      setStock(data.stock);
      setSelectedCategory(data.categoryId);
      setSelectedSeason(data.seasonId ? String(data.seasonId) : "");
      setColors(data.colors?.map((c: any) => c.id) || []);
      setFabrics(data.fabrics?.map((f: any) => f.id) || []);
      setOccasions(data.occasions?.map((o: any) => o.id) || []);
      setFits(data.fits?.map((f: any) => f.id) || []);
      setSleeves(data.sleeves?.map((s: any) => s.id) || []);
      setPatterns(data.patterns?.map((p: any) => p.id) || []);
      setSelectedType(data.typeId);
      setSelectedSubtype(data.subtypeId);
      setIsTrending(Boolean(data.isTrending));
      setSizes(Array.isArray(data.sizes) ? data.sizes.map((s: any) => ({ id: s.id, size: s.size, stock: s.stock })) : []);
      setExistingImages([data.img1 || null, data.img2 || null, data.img3 || null, data.img4 || null]);
    }).catch(err => console.error("Error loading product", err));
  }, [productId]);

  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data));
    api.get("/attributes/seasons").then(r => setSeasons(r.data));
    api.get("/attributes/colors").then(r => setColorList(r.data));
    api.get("/attributes/fabrics").then(r => setFabricList(r.data));
    api.get("/attributes/occasions").then(r => setOccasionList(r.data));
    api.get("/attributes/fits").then(r => setFitList(r.data));
    api.get("/attributes/sleeves").then(r => setSleeveList(r.data));
    api.get("/attributes/patterns").then(r => setPatternList(r.data));
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    api.get(`/product-types?categoryId=${selectedCategory}`).then((res) => setTypes(res.data));
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedType) return;
    api.get(`/product-subtypes?typeId=${selectedType}`).then((res) => setSubtypes(res.data));
  }, [selectedType]);

  const estimatedPricing = useMemo(() => {
    const p = Number(price);
    const dv = Number(discountValue || 0);
    let sellingPrice = p;
    if (discountType === "PERCENT") sellingPrice = Math.max(0, p - (p * dv) / 100);
    else if (discountType === "FLAT") sellingPrice = Math.max(0, p - dv);

    const kg = Math.max(Number(weight), 0.5);
    const shipping = 80 + Math.max(0, Math.ceil((kg - 0.5) / 0.5)) * 30;
    return { shipping, profit: sellingPrice - shipping, final: sellingPrice };
  }, [price, weight, discountType, discountValue]);

  /* ================= HELPERS ================= */
  const toggleAttribute = (list: number[], setList: (v: number[]) => void, id: number) => {
    if (list.includes(id)) setList(list.filter(item => item !== id));
    else setList([...list, id]);
  };

  const handleImageChange = (index: number, file: File | null) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
    if (file) {
      const existing = [...existingImages];
      existing[index] = null;
      setExistingImages(existing);
    }
  };

  const removeImage = (index: number) => {
    const updatedNew = [...images];
    updatedNew[index] = null;
    setImages(updatedNew);
    const updatedOld = [...existingImages];
    updatedOld[index] = null;
    setExistingImages(updatedOld);
  };

  const updateProduct = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("weight", weight);
    formData.append("stock", String(totalStock));
    formData.append("categoryId", selectedCategory);
    formData.append("typeId", selectedType);
    formData.append("subtypeId", selectedSubtype);
    formData.append("isTrending", String(isTrending));
    formData.append("discountType", discountType || "");
    formData.append("discountValue", discountValue || "");
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("seasonId", selectedSeason || "");
    formData.append("colors", JSON.stringify(colors));
    formData.append("fabrics", JSON.stringify(fabrics));
    formData.append("occasions", JSON.stringify(occasions));
    formData.append("fits", JSON.stringify(fits));
    formData.append("sleeves", JSON.stringify(sleeves));
    formData.append("patterns", JSON.stringify(patterns));

    images.forEach((img, i) => { if (img) formData.append(`image${i + 1}`, img); });
    existingImages.forEach((img, i) => {
      if (img === null && product[`img${i + 1}`]) formData.append(`remove_image_${i + 1}`, "true");
    });

    try {
      await api.put(`/products/${productId}`, formData);
      alert("Product updated!");
      router.push("/products");
    } catch (err) {
      alert("Error updating product");
    }
  };

  if (!product) return <AdminLayout><p className="p-10 text-center">Loading Canvas...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto pb-20 px-6">
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black italic font-serif text-brandBlack uppercase tracking-tighter">Edit Product</h1>
            <p className="text-[10px] font-black text-brandPink uppercase tracking-[0.3em] mt-2">ID: {productId} • {title}</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => router.back()} className="px-6 py-3 border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">Discard</button>
             <button onClick={updateProduct} className="px-10 py-3 bg-brandBlack text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-brandPink transition-all">Save Changes</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: CORE PRODUCT DATA (8 COLUMNS) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 1. BASIC IDENTITY */}
            <section className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm space-y-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack border-b border-gray-50 pb-4">Essential Details</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Product Name</label>
                  <input className="w-full bg-gray-50 border-none px-4 py-3 text-sm font-bold focus:ring-1 focus:ring-brandPink outline-none" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Description</label>
                  <textarea className="w-full bg-gray-50 border-none px-4 py-4 text-sm font-medium focus:ring-1 focus:ring-brandPink outline-none leading-relaxed" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <ProductSeoForm productId={product.id} initialSeo={{ slug: product.slug, metaTitle: product.metaTitle, metaDescription: product.metaDescription, metaKeywords: product.metaKeywords }} />
              </div>
            </section>

            {/* 2. ATTRIBUTES (MOVED FROM SIDEBAR FOR BETTER FLOW) */}
            <section className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm space-y-10">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack border-b border-gray-50 pb-4">Style Attributes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <AttributeWrapper title="Colors" items={colorList} selected={colors} toggle={(id) => toggleAttribute(colors, setColors, id)} />
                <AttributeWrapper title="Fabrics" items={fabricList} selected={fabrics} toggle={(id) => toggleAttribute(fabrics, setFabrics, id)} />
                <AttributeWrapper title="Occasions" items={occasionList} selected={occasions} toggle={(id) => toggleAttribute(occasions, setOccasions, id)} />
                <AttributeWrapper title="Fits" items={fitList} selected={fits} toggle={(id) => toggleAttribute(fits, setFits, id)} />
                <AttributeWrapper title="Sleeves" items={sleeveList} selected={sleeves} toggle={(id) => toggleAttribute(sleeves, setSleeves, id)} />
                <AttributeWrapper title="Patterns" items={patternList} selected={patterns} toggle={(id) => toggleAttribute(patterns, setPatterns, id)} />
              </div>
            </section>

            {/* 3. TRENDING TOGGLE */}
            <section className="bg-brandPink/5 border border-brandPink/10 p-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-brandBlack">Promote to Trending</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 tracking-tighter italic">Showcase this item on the homepage curation.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="sr-only peer" />
                <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brandPink after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6"></div>
              </label>
            </section>
          </div>

          {/* RIGHT COLUMN: MEDIA & PRICING (4 COLUMNS) */}
          <div className="lg:col-span-4 space-y-10">
            
            {/* 1. GALLERY (IMAGE UPLOAD) - NOW AT TOP */}
            <section className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack mb-6">Gallery Curation</h2>
              <div className="grid grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="aspect-[3/4] relative bg-gray-50 rounded-sm overflow-hidden border-2 border-dashed border-gray-100 group transition-all hover:border-brandPink/30">
                    {existingImages[i] ? (
                      <>
                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${existingImages[i]}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-brandBlack text-white w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                      </>
                    ) : images[i] ? (
                      <>
                        <img src={URL.createObjectURL(images[i]!)} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-brandBlack text-white w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-all">
                        <span className="text-xl text-gray-200 group-hover:text-brandPink">+</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(i, e.target.files?.[0] || null)} />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 2. PRICING & PROFIT */}
            <section className="bg-brandBlack text-white p-8 rounded-sm shadow-2xl space-y-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] border-b border-white/10 pb-4">Commercial Insight</h2>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Base Price</label>
                      <input type="number" className="w-full bg-white/5 border-none px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-brandPink" value={price} onChange={(e) => setPrice(e.target.value)} />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Weight (kg)</label>
                      <input type="number" step="0.01" className="w-full bg-white/5 border-none px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-brandPink" value={weight} onChange={(e) => setWeight(e.target.value)} />
                   </div>
                </div>
                
                <ProductDiscountSection price={price} discountType={discountType} discountValue={discountValue} onChange={({ discountType, discountValue }) => { setDiscountType(discountType); setDiscountValue(discountValue); }} />
                
                <div className="pt-4 border-t border-white/10 space-y-2">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400"><span>Final Sale Price</span><span>₹{estimatedPricing.final}</span></div>
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400"><span>Est. Shipping</span><span className="text-orange-400">₹{estimatedPricing.shipping}</span></div>
                   <div className="flex justify-between items-center pt-4">
                      <span className="text-xs font-black uppercase tracking-[0.2em]">Net Profit</span>
                      <span className={`text-2xl font-black italic font-serif ${estimatedPricing.profit >= 0 ? "text-green-400" : "text-rose-500"}`}>₹{estimatedPricing.profit}</span>
                   </div>
                </div>
              </div>
            </section>

            {/* 3. CATEGORIZATION & INVENTORY */}
            <section className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm space-y-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack">Logistics</h2>
              <div className="space-y-4">
                <select className="w-full bg-gray-50 border-none px-4 py-3 text-xs font-bold uppercase tracking-widest" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">Select Category</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <select className="w-full bg-gray-50 border-none px-4 py-3 text-xs font-bold uppercase tracking-widest" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} disabled={!selectedCategory}>
                  <option value="">Select Type</option>
                  {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <select className="w-full bg-gray-50 border-none px-4 py-3 text-xs font-bold uppercase tracking-widest" value={selectedSubtype} onChange={(e) => setSelectedSubtype(e.target.value)} disabled={!selectedType}>
                  <option value="">Select Subtype</option>
                  {subtypes.map((st) => <option key={st.id} value={st.id}>{st.name}</option>)}
                </select>
                <select className="w-full bg-gray-50 border-none px-4 py-3 text-xs font-bold uppercase tracking-widest" value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)}>
                  <option value="">Select Season</option>
                  {seasons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                
                <div className="pt-6 border-t border-gray-50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Stock Level: {totalStock}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {SIZE_OPTIONS.map((size) => {
                      const existing = sizes.find((s) => s.size === size);
                      return (
                        <div key={size} className={`p-3 border rounded-sm transition-all ${existing ? 'border-brandPink bg-pink-50' : 'border-gray-50 bg-gray-50 opacity-60'}`}>
                          <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter cursor-pointer">
                            <input type="checkbox" className="accent-brandPink" checked={!!existing} onChange={(e) => {
                              if (e.target.checked) setSizes(prev => [...prev, { size, stock: 1 }]);
                              else setSizes(prev => prev.filter(s => s.size !== size));
                            }} /> {size}
                          </label>
                          {existing && <input type="number" className="w-full mt-2 border-b border-brandPink/20 bg-transparent text-[11px] font-black outline-none focus:border-brandPink" value={existing.stock} onChange={(e) => setSizes(prev => prev.map(s => s.size === size ? { ...s, stock: Number(e.target.value) } : s))} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function AttributeWrapper({ title, items, selected, toggle }: any) {
  if (!items.length) return null;
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item: any) => (
          <button key={item.id} type="button" onClick={() => toggle(item.id)} className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${selected.includes(item.id) ? "bg-brandPink text-white border-brandPink shadow-md" : "bg-white border-gray-100 text-gray-400 hover:border-brandPink"}`}>
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
