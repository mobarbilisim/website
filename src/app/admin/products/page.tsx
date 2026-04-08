"use client";

import { Plus, Trash2, X, Edit3, Images, Tag, Star, PlusCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

const BADGE_OPTIONS = ["", "%10 İndirim", "%20 İndirim", "%30 İndirim", "%40 İndirim", "%50 İndirim", "Fırsat!", "Çok Satan", "Son Stok", "Yeni Geldi"];

export default function AdminProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [condition, setCondition] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [badge, setBadge] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const prodRes = await fetch("/api/admin/products");
      const prodJson = await prodRes.json();
      if (prodJson.data) setProducts(prodJson.data);

      const catRes = await fetch("/api/admin/categories");
      const catJson = await catRes.json();
      if (catJson.data) {
        setCategories(catJson.data);
        if (catJson.data.length > 0 && !categoryId) setCategoryId(catJson.data[0].id.toString());
      }
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (images.length + files.length > 5) {
      toast.error("En fazla 5 fotoğraf ekleyebilirsiniz.");
      return;
    }
    setIsUploading(true);
    const toastId = toast.loading(`${files.length} fotoğraf yükleniyor...`);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `products/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
        urls.push(publicUrl);
      }
      setImages(prev => [...prev, ...urls]);
      toast.success(`${files.length} fotoğraf yüklendi!`, { id: toastId, icon: '📸' });
    } catch (err: any) {
      toast.error("Yükleme hatası: " + err.message, { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setFeatures(prev => [...prev, newFeature.trim()]);
    setNewFeature("");
  };

  const removeFeature = (idx: number) => setFeatures(prev => prev.filter((_, i) => i !== idx));

  const resetForm = () => {
    setTitle(""); setPrice(""); setStock("1"); setDescription("");
    setCondition(""); setImages([]); setBadge(""); setFeatures([]);
    setNewFeature(""); setEditingId(null); setIsAdding(false);
  };

  const handleEditClick = (product: any) => {
    setEditingId(product.id);
    setTitle(product.title);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setDescription(product.description || "");
    setCategoryId(product.category_id?.toString() || "");
    setCondition(product.condition || "");
    setImages(product.images || (product.image_url ? [product.image_url] : []));
    setBadge(product.badge || "");
    setFeatures(product.features || []);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return toast.error("Başlık ve fiyat zorunludur.");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId || undefined,
          title, price, description,
          category_id: categoryId,
          condition, stock,
          image_url: images[0] || "",
          images,
          badge,
          features
        })
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error("Hata: " + (result.error || "Bilinmeyen hata"));
      } else {
        toast.success(editingId ? "Ürün güncellendi!" : "Yeni ürün eklendi!", { icon: editingId ? '✏️' : '📦' });
        resetForm();
        fetchData();
      }
    } catch (err: any) {
      toast.error("İşlem hatası: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      try {
        const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
        const result = await res.json();
        if (!res.ok) toast.error("Silinemedi: " + (result.error || "Bilinmeyen hata"));
        else { toast.success("Ürün silindi.", { icon: '🗑️' }); fetchData(); }
      } catch (err: any) {
        toast.error("Silme hatası: " + err.message);
      }
    }
  };

  const parentCats = categories.filter(c => !c.parent_id);
  const getCategoryOptions = () => {
    const options: { id: number; name: string; isChild: boolean }[] = [];
    parentCats.forEach(parent => {
      options.push({ id: parent.id, name: parent.name, isChild: false });
      categories.filter(c => c.parent_id === parent.id).forEach(child => {
        options.push({ id: child.id, name: `  └─ ${child.name}`, isChild: true });
      });
    });
    return options;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h2>
          <p className="text-gray-500 text-sm mt-1">Mağazanızdaki tüm ürünleri buradan yönetin.</p>
        </div>
        {!isAdding && (
          <button onClick={() => { resetForm(); setIsAdding(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition text-sm shadow-sm">
            <Plus size={18} /> Yeni Ürün Ekle
          </button>
        )}
      </div>

      {/* Form Section */}
      {isAdding && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 ring-2 ring-blue-500/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">{editingId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* === ÇOKLU FOTOĞRAF === */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Images size={16} /> Ürün Fotoğrafları <span className="text-gray-400 font-normal">(max 5 adet)</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {images.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img src={url} alt="" className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200" />
                    {idx === 0 && <span className="absolute -top-1.5 -left-1.5 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">Ana</span>}
                    <button type="button" onClick={() => removeImage(idx)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs font-bold">×</button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="w-20 h-20 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl flex flex-col items-center justify-center cursor-pointer transition group">
                    <Plus size={20} className="text-gray-300 group-hover:text-blue-500" />
                    <span className="text-[10px] text-gray-400 mt-1">{isUploading ? "Yüklüyor" : "Ekle"}</span>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={isUploading} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Başlığı</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 text-sm"
                placeholder="Örn: HP ProDesk 600 G3 Mini PC" />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺)</label>
              <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 text-sm"
                placeholder="4500" />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok Adedi</label>
              <input type="number" min="0" required value={stock} onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 text-sm"
                placeholder="10" />
            </div>

            {/* Condition - free text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Durumu / Garanti Notu</label>
              <input type="text" value={condition} onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 text-sm"
                placeholder="Örn: 2 Yıl Garanti, Sıfır Kapalı Kutu..." />
            </div>

            {/* Badge */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                <Tag size={14} className="text-red-500" /> Fırsat Etiketi (Sağ Üst Köşe)
              </label>
              <select value={badge} onChange={(e) => setBadge(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 text-sm bg-white">
                {BADGE_OPTIONS.map(b => (
                  <option key={b} value={b}>{b === "" ? "Etiket Yok" : b}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 text-sm bg-white">
                <option value="">Kategori Seçin</option>
                {getCategoryOptions().map(opt => (
                  <option key={opt.id} value={opt.id} className={opt.isChild ? "pl-4" : "font-bold"}>{opt.name}</option>
                ))}
              </select>
            </div>

            {/* === ÖZELLİKLER === */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Star size={14} className="text-amber-500" /> Ürün Özellikleri / Etiketler
                <span className="text-gray-400 font-normal text-xs">(Kargo, Garanti, Özellik...)</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {features.map((f, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full">
                    {f}
                    <button type="button" onClick={() => removeFeature(idx)} className="ml-1 text-red-400 hover:text-red-600 font-bold text-sm leading-none">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                  placeholder="Örn: 2 Yıl Garanti, Ücretsiz Kargo, i5 11. Nesil..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500" />
                <button type="button" onClick={addFeature}
                  className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                  <PlusCircle size={16} /> Ekle
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 text-sm resize-none"
                placeholder="Ürün özelliklerini detaylıca yazın..." />
            </div>

            <div className="md:col-span-2">
              <button type="submit" disabled={submitting}
                className={`w-full ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white font-semibold py-3 rounded-lg transition shadow-sm text-sm disabled:opacity-60`}>
                {submitting ? "İşleniyor..." : (editingId ? "Değişiklikleri Kaydet" : "Ürünü Kaydet ve Yayınla")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Ürün</th>
                <th className="px-6 py-3 font-semibold">Kategori</th>
                <th className="px-6 py-3 font-semibold">Etiket</th>
                <th className="px-6 py-3 font-semibold">Stok</th>
                <th className="px-6 py-3 font-semibold">Fiyat</th>
                <th className="px-6 py-3 font-semibold text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Yükleniyor...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Henüz ürün eklenmemiş.</td></tr>
              ) : (
                products.map((item) => {
                  const imgUrl = (item.images?.[0]) || item.image_url;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="relative shrink-0">
                          {imgUrl ? (
                            <img src={imgUrl} alt={item.title} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] text-gray-400">Yok</div>
                          )}
                          {(item.images?.length > 1) && (
                            <span className="absolute -bottom-1 -right-1 bg-gray-700 text-white text-[9px] font-bold px-1 rounded-full">+{item.images.length - 1}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm line-clamp-1">{item.title}</div>
                          <div className="text-xs text-gray-400">#{item.id} {item.condition && `• ${item.condition}`}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.categories?.name || "-"}</td>
                      <td className="px-6 py-4">
                        {item.badge ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">{item.badge}</span>
                        ) : <span className="text-gray-300 text-xs">–</span>}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        {item.stock > 0 ? <span className="text-emerald-600">{item.stock} Adet</span> : <span className="text-red-500">Tükendi</span>}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">₺{item.price?.toLocaleString('tr-TR')}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEditClick(item)} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Düzenle"><Edit3 size={16} /></button>
                          <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Sil"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
