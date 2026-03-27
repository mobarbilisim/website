"use client";

import { Plus, Trash2, X, Edit3 } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [condition, setCondition] = useState("2.El");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data: pData } = await supabase.from("products").select("*, categories(name)").order("id", { ascending: false });
    const { data: cData } = await supabase.from("categories").select("*");
    if (pData) setProducts(pData);
    if (cData) {
      setCategories(cData);
      if (cData.length > 0 && !categoryId) setCategoryId(cData[0].id.toString());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
      setImageUrl(publicUrl);
    } catch (err: any) {
      alert("Yükleme hatası: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setStock("1");
    setDescription("");
    setImageUrl("");
    setCondition("2.El");
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEditClick = (product: any) => {
    setEditingId(product.id);
    setTitle(product.title);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setDescription(product.description || "");
    setCategoryId(product.category_id.toString());
    setCondition(product.condition);
    setImageUrl(product.image_url || "");
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return alert("Başlık ve fiyat zorunludur.");
    
    const productData = { 
      title, 
      price: parseFloat(price), 
      description, 
      category_id: parseInt(categoryId), 
      condition, 
      stock: parseInt(stock),
      image_url: imageUrl
    };

    if (editingId) {
      // Güncelleme
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingId);
      
      if (!error) {
        resetForm();
        fetchData();
      } else {
        alert("Güncelleme hatası: " + error.message);
      }
    } else {
      // Yeni Ekleme
      const { error } = await supabase
        .from("products")
        .insert([productData]);

      if (!error) {
        resetForm();
        fetchData();
      } else {
        alert("Ekleme hatası: " + error.message);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h2>
          <p className="text-gray-500 text-sm mt-1">Mağazanızdaki tüm ürünleri buradan yönetin.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition text-sm shadow-sm"
          >
            <Plus size={18} /> Yeni Ürün Ekle
          </button>
        )}
      </div>

      {/* Form Section (Add or Edit) */}
      {isAdding && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 ring-2 ring-blue-500/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              {editingId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-1">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Görseli</label>
              <div className="flex items-center gap-4">
                {imageUrl && (
                  <img src={imageUrl} alt="Önizleme" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                )}
                <div className="relative overflow-hidden bg-white border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors rounded-lg px-4 py-3 cursor-pointer flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">{isUploading ? "Yükleniyor..." : (imageUrl ? "Değiştir" : "Fotoğraf Seç")}</span>
                  <input 
                    type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                </div>
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

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durumu</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 text-sm bg-white">
                <option value="2.El">2. El Garantili</option>
                <option value="Sıfır">Sıfır Kapalı Kutu</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 text-sm bg-white">
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 text-sm resize-none" 
                placeholder="Ürün özelliklerini yazın..."></textarea>
            </div>

            <div className="md:col-span-2">
              <button type="submit" className={`w-full ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white font-semibold py-3 rounded-lg transition shadow-sm text-sm`}>
                {editingId ? "Değişiklikleri Kaydet" : "Ürünü Kaydet ve Yayınla"}
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
                <th className="px-6 py-3 font-semibold">Durum</th>
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
                products.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-[10px] text-gray-400">Yok</div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                        <div className="text-xs text-gray-400">#{item.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.categories?.name || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.condition === 'Sıfır' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {item.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {item.stock > 0 ? (
                        <span className="text-emerald-600">{item.stock} Adet</span>
                      ) : (
                        <span className="text-red-500">Tükendi</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-sm">₺{item.price.toLocaleString('tr-TR')}</td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(item)} 
                        className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
