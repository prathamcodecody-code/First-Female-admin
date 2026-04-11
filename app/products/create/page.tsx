"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import ProductDiscountSection from "@/components/modals/ProductDiscountSection";

const SIZE_OPTIONS = ["Free Size", "XS", "S", "M", "L", "XL", "XXL", "3XL"];
const VENDOR_TYPES = ["MANUFACTURER", "WHOLESALER", "RETAILER", "DISTRIBUTOR"];

interface Vendor {
  id: number;
  companyName: string;
  contactPersonName: string;
  vendorType: string;
}

interface ProductVendor {
  vendorId: number;
  costPrice: string;
  fabricType: string;
  quantity: number;
}

export default function CreateProductPage() {
  const router = useRouter();

  /* ================= FORM STATES ================= */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [isTrending, setIsTrending] = useState(false);
  const [freeShipping, setFreeShipping] = useState(false);
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");

  /* ================= VENDOR STATES ================= */
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [productVendors, setProductVendors] = useState<ProductVendor[]>([]);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [newVendor, setNewVendor] = useState({
    companyName: "",
    contactPersonName: "",
    contactNumber: "",
    emailId: "",
    gstNumber: "",
    address: "",
    vendorType: "WHOLESALER",
  });

  /* ================= DROPDOWNS & ATTRIBUTES ================= */
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

  const [sizes, setSizes] = useState<{ size: string; stock: number }[]>([]);
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null]);

  const totalStock = useMemo(() => sizes.reduce((sum, s) => sum + Number(s.stock || 0), 0), [sizes]);

  /* ================= FETCHING ================= */
  useEffect(() => {
    api.get("/categories").then(r => setCategories(r.data));
    api.get("/attributes/seasons").then(r => setSeasons(r.data));
    api.get("/attributes/colors").then(r => setColorList(r.data));
    api.get("/attributes/fabrics").then(r => setFabricList(r.data));
    api.get("/attributes/occasions").then(r => setOccasionList(r.data));
    api.get("/attributes/fits").then(r => setFitList(r.data));
    api.get("/attributes/sleeves").then(r => setSleeveList(r.data));
    api.get("/attributes/patterns").then(r => setPatternList(r.data));
    api.get("/vendors").then(r => setVendors(r.data));
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    api.get(`/product-types?categoryId=${selectedCategory}`).then(r => {
      setTypes(r.data);
      setSelectedType("");
      setSelectedSubtype("");
    });
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedType) return;
    api.get(`/product-subtypes?typeId=${selectedType}`).then(r => setSubtypes(r.data));
  }, [selectedType]);

  const estimatedPricing = useMemo(() => {
    const p = Number(price);
    const dv = Number(discountValue || 0);
    let sellingPrice = p;
    if (discountType === "PERCENT") sellingPrice = Math.max(0, p - (p * dv) / 100);
    else if (discountType === "FLAT") sellingPrice = Math.max(0, p - dv);

    const kg = Math.max(Number(weight), 0.5);
    // Base shipping 80 + (weight - 0.5) * 60 per 0.5kg
    const shippingCost = Math.max(0, 80 + Math.ceil(Math.max(0, kg - 0.5) / 0.5) * 30);
    
    // Calculate profit considering all vendors
    const totalCost = productVendors.reduce((sum, pv) => sum + (Number(pv.costPrice) * pv.quantity), 0);
    const profit = (sellingPrice * totalStock) - totalCost - shippingCost;
    
    return { shipping: shippingCost, profit, final: sellingPrice, totalCost };
  }, [price, weight, discountType, discountValue, productVendors, totalStock]);

  const handleImageChange = (index: number, file: File | null) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  const toggleAttribute = (list: number[], setList: (v: number[]) => void, id: number) => {
    if (list.includes(id)) setList(list.filter(item => item !== id));
    else setList([...list, id]);
  };

  const handleCreateVendor = async () => {
    if (!newVendor.companyName || !newVendor.contactNumber || !newVendor.emailId) {
      alert("Please fill all required vendor fields");
      return;
    }

    try {
      const createdVendor = await api.post("/vendors", newVendor);
      setVendors([...vendors, createdVendor.data]);
      setNewVendor({
        companyName: "",
        contactPersonName: "",
        contactNumber: "",
        emailId: "",
        gstNumber: "",
        address: "",
        vendorType: "WHOLESALER",
      });
      setShowVendorForm(false);
    } catch (err) {
      alert("Error creating vendor");
    }
  };

  const handleAddProductVendor = (vendorId: number) => {
    if (productVendors.some(pv => pv.vendorId === vendorId)) {
      alert("This vendor is already added");
      return;
    }
    setProductVendors([...productVendors, { vendorId, costPrice: "", fabricType: "", quantity: 1 }]);
  };

  const handleRemoveProductVendor = (vendorId: number) => {
    setProductVendors(productVendors.filter(pv => pv.vendorId !== vendorId));
  };

  const handleProductVendorChange = (vendorId: number, field: string, value: any) => {
    setProductVendors(
      productVendors.map(pv =>
        pv.vendorId === vendorId ? { ...pv, [field]: value } : pv
      )
    );
  };

  const createProduct = async () => {
    if (!title || !price || !weight) return alert("Missing Basic Fields");
    if (productVendors.length === 0) return alert("Please add at least one vendor");
    if (sizes.length === 0) return alert("Please add at least one size");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("price", price);
    fd.append("weight", weight);
    fd.append("estimatedShipping", String(estimatedPricing.shipping)); // ADD THIS
    fd.append("stock", String(totalStock));
    fd.append("categoryId", selectedCategory);
    fd.append("typeId", selectedType);
    fd.append("subtypeId", selectedSubtype);
    if (selectedSeason) fd.append("seasonId", selectedSeason);
    fd.append("sizes", JSON.stringify(sizes));
    fd.append("colors", JSON.stringify(colors));
    fd.append("fabrics", JSON.stringify(fabrics));
    fd.append("occasions", JSON.stringify(occasions));
    fd.append("fits", JSON.stringify(fits));
    fd.append("sleeves", JSON.stringify(sleeves));
    fd.append("patterns", JSON.stringify(patterns));
    fd.append("isTrending", String(isTrending));
    fd.append("freeShipping", String(freeShipping));
    if (discountType) {
      fd.append("discountType", discountType);
      fd.append("discountValue", discountValue);
    }
    fd.append("vendorId", JSON.stringify(productVendors));
    images.forEach((img, i) => img && fd.append(`image${i + 1}`, img));

    try {
      await api.post("/products", fd);
      alert("Product Created!");
      router.push("/products");
    } catch (err: any) {
      console.error("Error:", err.response?.data || err.message);
      alert(`Error creating product: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto pb-20 px-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black italic font-serif text-brandBlack uppercase tracking-tighter">Add New Product</h1>
            <p className="text-[10px] font-black text-brandPink uppercase tracking-[0.3em] mt-2">Create a new canvas entry</p>
          </div>
          <button onClick={createProduct} className="px-10 py-4 bg-brandBlack text-white rounded-sm font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:bg-brandPink transition-all">
            Save Product
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-10">
            <section className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm space-y-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack border-b border-gray-50 pb-4">Essential Details</h2>
              <div className="space-y-6">
                <input className="w-full bg-gray-50 border-none px-4 py-3 text-sm font-bold focus:ring-1 focus:ring-brandPink outline-none" placeholder="Product Title" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea className="w-full bg-gray-50 border-none px-4 py-4 text-sm font-medium focus:ring-1 focus:ring-brandPink outline-none" rows={4} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Selling Price (₹)</label>
                    <input type="number" className="w-full bg-gray-50 border-none px-4 py-3 font-bold text-sm" value={price} onChange={e => setPrice(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Weight (kg)</label>
                    <input type="number" step="0.01" className="w-full bg-gray-50 border-none px-4 py-3 font-bold text-sm" value={weight} onChange={e => setWeight(e.target.value)} />
                  </div>
                </div>
                <ProductDiscountSection price={price} discountType={discountType} discountValue={discountValue} onChange={({ discountType, discountValue }) => { setDiscountType(discountType); setDiscountValue(discountValue); }} />
              </div>
            </section>

            {/* VENDOR SECTION */}
            <section className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-8 rounded-sm shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-amber-200 pb-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-900">Vendor Management</h2>
                <button type="button" onClick={() => setShowVendorForm(!showVendorForm)} className="px-4 py-2 bg-amber-600 text-white text-[9px] font-black uppercase rounded-sm hover:bg-amber-700 transition-all">
                  {showVendorForm ? "Cancel" : "+ New Vendor"}
                </button>
              </div>

              {/* New Vendor Form */}
              {showVendorForm && (
                <div className="bg-white p-6 rounded-sm border border-amber-100 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Company Name*" className="bg-amber-50 border border-amber-200 px-3 py-2 text-sm rounded-sm" value={newVendor.companyName} onChange={e => setNewVendor({...newVendor, companyName: e.target.value})} />
                    <input type="text" placeholder="Contact Person Name" className="bg-amber-50 border border-amber-200 px-3 py-2 text-sm rounded-sm" value={newVendor.contactPersonName} onChange={e => setNewVendor({...newVendor, contactPersonName: e.target.value})} />
                    <input type="text" placeholder="Contact Number*" className="bg-amber-50 border border-amber-200 px-3 py-2 text-sm rounded-sm" value={newVendor.contactNumber} onChange={e => setNewVendor({...newVendor, contactNumber: e.target.value})} />
                    <input type="email" placeholder="Email ID*" className="bg-amber-50 border border-amber-200 px-3 py-2 text-sm rounded-sm" value={newVendor.emailId} onChange={e => setNewVendor({...newVendor, emailId: e.target.value})} />
                    <input type="text" placeholder="GST Number (Optional)" className="bg-amber-50 border border-amber-200 px-3 py-2 text-sm rounded-sm" value={newVendor.gstNumber} onChange={e => setNewVendor({...newVendor, gstNumber: e.target.value})} />
                    <select className="bg-amber-50 border border-amber-200 px-3 py-2 text-sm rounded-sm font-bold" value={newVendor.vendorType} onChange={e => setNewVendor({...newVendor, vendorType: e.target.value})}>
                      {VENDOR_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <textarea placeholder="Address" className="w-full bg-amber-50 border border-amber-200 px-3 py-2 text-sm rounded-sm" rows={2} value={newVendor.address} onChange={e => setNewVendor({...newVendor, address: e.target.value})} />
                  <button type="button" onClick={handleCreateVendor} className="w-full py-2 bg-green-600 text-white text-sm font-bold rounded-sm hover:bg-green-700">
                    Create Vendor
                  </button>
                </div>
              )}

              {/* Added Vendors List */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Selected Vendors ({productVendors.length})</p>
                {productVendors.length === 0 && (
                  <p className="text-[9px] text-amber-700 italic">No vendors added yet. Select from existing or create new.</p>
                )}
                {productVendors.map(pv => {
                  const vendor = vendors.find(v => v.id === pv.vendorId);
                  return (
                    <div key={pv.vendorId} className="bg-white p-4 rounded-sm border border-amber-200 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-brandBlack">{vendor?.companyName}</p>
                          <p className="text-[9px] text-gray-500">{vendor?.contactPersonName} • {vendor?.vendorType}</p>
                        </div>
                        <button type="button" onClick={() => handleRemoveProductVendor(pv.vendorId)} className="text-red-500 text-lg font-black hover:text-red-700">
                          ×
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-[8px] font-black text-gray-500 uppercase">Cost Price (₹)</label>
                          <input type="number" step="0.01" className="w-full bg-amber-50 border border-amber-200 px-2 py-2 text-sm font-bold rounded-sm" value={pv.costPrice} onChange={e => handleProductVendorChange(pv.vendorId, 'costPrice', e.target.value)} />
                        </div>
                        <div>
                          <label className="text-[8px] font-black text-gray-500 uppercase">Fabric Type</label>
                          <input type="text" className="w-full bg-amber-50 border border-amber-200 px-2 py-2 text-sm rounded-sm" placeholder="e.g., Cotton" value={pv.fabricType} onChange={e => handleProductVendorChange(pv.vendorId, 'fabricType', e.target.value)} />
                        </div>
                        <div>
                          <label className="text-[8px] font-black text-gray-500 uppercase">Quantity</label>
                          <input type="number" min="1" className="w-full bg-amber-50 border border-amber-200 px-2 py-2 text-sm font-bold rounded-sm" value={pv.quantity} onChange={e => handleProductVendorChange(pv.vendorId, 'quantity', parseInt(e.target.value))} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Vendor Selector */}
              {productVendors.length < vendors.length && (
                <div className="space-y-3 pt-4 border-t border-amber-200">
                  <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Add Existing Vendor</p>
                  <div className="flex flex-wrap gap-2">
                    {vendors
                      .filter(v => !productVendors.some(pv => pv.vendorId === v.id))
                      .map(vendor => (
                        <button key={vendor.id} type="button" onClick={() => handleAddProductVendor(vendor.id)} className="px-3 py-2 bg-white border border-amber-300 text-amber-900 text-[9px] font-bold rounded-sm hover:bg-amber-50 transition-all">
                          {vendor.companyName}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </section>

            <section className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm space-y-10">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack border-b border-gray-50 pb-4">Style Attributes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <AttributeWrapper title="Colors" items={colorList} selected={colors} toggle={(id:any) => toggleAttribute(colors, setColors, id)} />
                <AttributeWrapper title="Fabrics" items={fabricList} selected={fabrics} toggle={(id:any) => toggleAttribute(fabrics, setFabrics, id)} />
                <AttributeWrapper title="Occasions" items={occasionList} selected={occasions} toggle={(id:any) => toggleAttribute(occasions, setOccasions, id)} />
                <AttributeWrapper title="Fits" items={fitList} selected={fits} toggle={(id:any) => toggleAttribute(fits, setFits, id)} />
                <AttributeWrapper title="Sleeves" items={sleeveList} selected={sleeves} toggle={(id:any) => toggleAttribute(sleeves, setSleeves, id)} />
                <AttributeWrapper title="Patterns" items={patternList} selected={patterns} toggle={(id:any) => toggleAttribute(patterns, setPatterns, id)} />
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 space-y-10">
            <section className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack mb-6">Gallery</h2>
              <div className="grid grid-cols-2 gap-4">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="aspect-[3/4] relative bg-gray-50 rounded-sm overflow-hidden border-2 border-dashed border-gray-100 group transition-all hover:border-brandPink/30">
                    {images[i] ? (
                      <>
                        <img src={URL.createObjectURL(images[i]!)} className="w-full h-full object-cover" alt="Preview" />
                        <button type="button" onClick={() => handleImageChange(i, null)} className="absolute top-2 right-2 bg-brandBlack text-white w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100">×</button>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-all">
                        <span className="text-xl text-gray-200 group-hover:text-brandPink">+</span>
                        <input type="file" className="hidden" accept="image/*" onChange={e => handleImageChange(i, e.target.files?.[0] || null)} />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-brandBlack text-white p-8 rounded-sm shadow-2xl space-y-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] border-b border-white/10 pb-4">Pricing Insight</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-300"><span>Final Sale Price</span><span>₹{estimatedPricing.final}</span></div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-300"><span>Total Cost (All Vendors)</span><span className="text-orange-400">₹{estimatedPricing.totalCost}</span></div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-300"><span>Est. Shipping</span><span className="text-orange-400">₹{estimatedPricing.shipping}</span></div>
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Net Profit</span>
                  <span className={`text-2xl font-black italic font-serif ${estimatedPricing.profit >= 0 ? "text-green-400" : "text-rose-500"}`}>₹{estimatedPricing.profit}</span>
                </div>
              </div>
            </section>

            <section className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm space-y-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack">Logistics</h2>
              <div className="space-y-4">
                <select className="w-full bg-gray-50 border-none px-4 py-3 text-xs font-bold uppercase tracking-widest" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                  <option value="">Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <select className="w-full bg-gray-50 border-none px-4 py-3 text-xs font-bold uppercase tracking-widest" value={selectedType} onChange={e => setSelectedType(e.target.value)} disabled={!selectedCategory}>
                  <option value="">Type</option>
                  {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <select className="w-full bg-gray-50 border-none px-4 py-3 text-xs font-bold uppercase tracking-widest" value={selectedSubtype} onChange={e => setSelectedSubtype(e.target.value)} disabled={!selectedType}>
                  <option value="">Subtype</option>
                  {subtypes.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
                </select>
                
                <select className="w-full bg-gray-50 border-none px-4 py-3 text-xs font-bold uppercase tracking-widest" value={selectedSeason} onChange={e => setSelectedSeason(e.target.value)}>
                  <option value="">Select Season</option>
                  {seasons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>

                <div className="pt-6 border-t border-gray-50 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Stock: {totalStock}</p>
                    <div className="grid grid-cols-2 gap-2">
                        {SIZE_OPTIONS.map(size => {
                            const existing = sizes.find(s => s.size === size);
                            return (
                                <div key={size} className={`p-3 border rounded-sm transition-all ${existing ? 'border-brandPink bg-pink-50' : 'border-gray-50 bg-gray-50 opacity-60'}`}>
                                    <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter cursor-pointer">
                                        <input type="checkbox" className="accent-brandPink" checked={!!existing} onChange={e => e.target.checked ? setSizes([...sizes, { size, stock: 1 }]) : setSizes(sizes.filter(s => s.size !== size))} /> {size}
                                    </label>
                                    {existing && <input type="number" className="w-full mt-2 border-b border-brandPink/20 bg-transparent text-[11px] font-black outline-none" value={existing.stock} onChange={e => setSizes(sizes.map(s => s.size === size ? { ...s, stock: Number(e.target.value) } : s))} />}
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
