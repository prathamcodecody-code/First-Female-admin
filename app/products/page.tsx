"use client";

import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import ProductPreviewModal from "@/components/ProductPreviewModal";
import BulkUploadModal from "@/components/BulkUploadModal";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function ProductsPage() {
  const router = useRouter();

  // MAIN DATA
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [subtypes, setSubtypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // MODALS
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<any>(null);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  // FILTERS
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubtype, setSelectedSubtype] = useState("");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  // PAGINATION
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 10;

  // FETCH OPTIONS
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedCategory) { setTypes([]); return; }
    api.get(`/product-types?categoryId=${selectedCategory}`).then((res) => setTypes(res.data)).catch(console.error);
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedType) { setSubtypes([]); return; }
    api.get(`/product-subtypes?typeId=${selectedType}`).then((res) => setSubtypes(res.data)).catch(console.error);
  }, [selectedType]);

  // FETCH PRODUCTS
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/products", {
        params: {
          page,
          limit,
          categoryId: selectedCategory || undefined,
          typeId: selectedType || undefined,
          subtypeId: selectedSubtype || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort: sort || undefined,
          stock: stockFilter || undefined,
        },
      });
      setProducts(res.data.products || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error("Fetch error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, selectedType, selectedSubtype, sort, minPrice, maxPrice, stockFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const confirmDelete = async () => {
    await api.delete(`/products/${deleteId}`);
    setModalOpen(false);
    fetchProducts();
  };

  const openPreview = (product: any) => {
    setPreviewProduct(product);
    setPreviewOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const handleBulkUploadSuccess = () => {
    // Refresh products list after successful upload
    setPage(1);
    fetchProducts();
  };

  return (
    <AdminLayout>
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-brandBlack">
            Product <span className="text-brandPink">Inventory</span>
          </h1>
          <p className="text-brandGray text-sm">Manage your catalog, stock, and pricing.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all border ${
              filterOpen ? "bg-brandPink text-white border-brandPink" : "bg-white text-brandGray border-gray-200 hover:border-brandPink"
            }`}
          >
            <FilterAltIcon fontSize="small" />
            Filters
          </button>
          <button
            onClick={() => setBulkUploadOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg font-bold hover:shadow-lg shadow-md transition-all active:scale-95"
          >
            <CloudUploadIcon fontSize="small" />
            Bulk Upload
          </button>
          <button
            onClick={() => router.push("/products/create")}
            className="bg-brandPink text-white px-5 py-2.5 rounded-lg font-bold hover:bg-brandPinkLight shadow-md transition-all active:scale-95"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden mb-6 ${filterOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-brandGray uppercase ml-1">Category</label>
            <select className="w-full border border-gray-100 p-2.5 rounded-lg bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-brandPink/20" value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setSelectedType(""); setSelectedSubtype(""); }}>
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-brandGray uppercase ml-1">Type</label>
            <select className="w-full border border-gray-100 p-2.5 rounded-lg bg-gray-50 text-sm outline-none disabled:opacity-50" value={selectedType} onChange={(e) => { setSelectedType(e.target.value); setSelectedSubtype(""); }} disabled={!selectedCategory}>
              <option value="">All Types</option>
              {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-brandGray uppercase ml-1">Sort By</label>
            <select className="w-full border border-gray-100 p-2.5 rounded-lg bg-gray-50 text-sm outline-none" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Default</option>
              <option value="newest">Newest First</option>
              <option value="low_to_high">Price: Low to High</option>
              <option value="high_to_low">Price: High to Low</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-brandGray uppercase ml-1">Stock Status</label>
            <select className="w-full border border-gray-100 p-2.5 rounded-lg bg-gray-50 text-sm outline-none" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
              <option value="">All Levels</option>
              <option value="in">In Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          <div className="md:col-span-4 flex justify-end pt-2">
             <button onClick={() => { setPage(1); fetchProducts(); }} className="bg-brandBlack text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all">
                Search Products
             </button>
          </div>
        </div>
      </div>

      {/* PRODUCTS LIST */}
      <div className="relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin w-10 h-10 border-[3px] border-brandPink border-t-transparent rounded-full mb-4"></div>
              <p className="text-brandPink font-bold animate-pulse">Updating Catalog...</p>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="group bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex gap-5 items-center transition-all hover:shadow-md hover:border-brandPink/30 cursor-pointer"
              onClick={() => openPreview(p)}
            >
              <div className="relative w-24 h-24 overflow-hidden rounded-xl bg-gray-50 border border-gray-50">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${p.img1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={p.title}
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                   <span className="px-2 py-0.5 bg-brandCream text-brandPink text-[10px] font-bold rounded uppercase">
                     {p.category?.name}
                   </span>
                   <span className="text-brandGray text-xs">• {p.type?.name}</span>
                </div>
                <h2 className="text-lg font-bold text-brandBlack leading-tight mb-2 group-hover:text-brandPink transition-colors">
                  {p.title}
                </h2>
                
                <div className="flex items-center gap-4">
                   <p className="text-xl font-black text-brandBlack">
    ₹{Number(p.finalPrice).toLocaleString()}
  </p>

  {/* MRP (only if discounted) */}
  {p.discountType && p.discountValue && (
    <p className="text-sm text-gray-400 line-through">
      ₹{Number(p.price).toLocaleString()}
    </p>
  )}
                  <div className="h-4 w-[1px] bg-gray-200"></div>
                  <p className={`text-xs font-bold px-2 py-1 rounded-md ${
                    p.stock === 0 ? "bg-red-50 text-red-600" : p.stock < 5 ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"
                  }`}>
                    {p.stock === 0 ? "Out of Stock" : `Stock: ${p.stock}`}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-2.5 bg-brandPink/10 text-brandPink rounded-xl hover:bg-brandPink hover:text-white transition-all shadow-sm"
                  onClick={(e) => { e.stopPropagation(); router.push(`/products/edit/${p.id}`); }}
                >
                  Edit
                </button>
                <button
                  className="p-2.5 bg-brandRed/10 text-brandRed rounded-xl hover:bg-brandRed hover:text-white transition-all shadow-sm"
                  onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); setModalOpen(true); }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {!loading && products.length === 0 && (
            <div className="bg-white p-20 text-center rounded-2xl border-2 border-dashed border-gray-100">
               <SearchIcon className="text-gray-200 text-6xl mb-4" />
               <p className="text-brandGray font-medium">No products match your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-12 mb-8 gap-4 items-center">
        <button
          className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:border-brandPink hover:text-brandPink transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-inherit"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ←
        </button>

        <div className="bg-white px-6 py-2 rounded-xl border border-gray-100 shadow-sm font-bold text-brandBlack">
          Page {page} <span className="text-brandGray font-normal mx-1">of</span> {pages}
        </div>

        <button
          className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:border-brandPink hover:text-brandPink transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-inherit"
          disabled={page === pages}
          onClick={() => setPage(page + 1)}
        >
          →
        </button>
      </div>

      <DeleteConfirmModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={confirmDelete} itemName="product" />
      <ProductPreviewModal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} product={previewProduct} />
      <BulkUploadModal isOpen={bulkUploadOpen} onClose={() => setBulkUploadOpen(false)} onSuccess={handleBulkUploadSuccess} />
    </AdminLayout>
  );
}
