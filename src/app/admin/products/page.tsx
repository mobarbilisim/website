"use client";

import { Plus, Search, Filter, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
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
      if (cData.length > 0) setCategoryId(cData[0].id.toString());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes("Bucket not found")) {
          throw new Error("Supabase panelinden 'images' isimli bucket'ı oluşturduğunuzdan emin olun.");
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
      setImageUrl(publicUrl);
    } catch (err: any) {
      alert("Fotoğraf yükleme hatası: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return alert("Başlık ve fiyat zorunludur.");
    
    // Yükleniyor durumu eklenebilir
    const { error } = await supabase.from("products").insert([
      { 
        title, 
        price: parseFloat(price), 
        description, 
        category_id: parseInt(categoryId), 
        condition, 
        stock: parseInt(stock),
        image_url: imageUrl
      }
    ]);

    if (!error) {
      setIsAdding(false);
      setTitle("");
      setPrice("");
      setStock("1");
      setDescription("");
      setImageUrl("");
      fetchData(); // Listeyi güncelle
    } else {
      alert("Hata: " + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) fetchData();
    }
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ürün Yönetimi</h2>
          <p className="text-muted-foreground mt-2">Veritabanına bağlı canlı mağaza stoğunuz.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition w-full md:w-auto justify-center"
          >
            <Plus size={20} /> Yeni Ürün Ekle
          </button>
        )}
      </div>

      {isAdding && (
        <div className="glass border border-blue-500/30 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Yeni Ürün Ekle</h3>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-white p-2">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Ürün Görseli</label>
              <div className="flex items-center gap-4">
                {imageUrl && (
                  <img src={imageUrl} alt="Önizleme" className="w-20 h-20 object-cover rounded-xl border border-white/10" />
                )}
                <div className="relative overflow-hidden bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-colors font-medium px-4 py-2 rounded-xl cursor-pointer flex items-center justify-center">
                  <span>{isUploading ? "Yükleniyor..." : (imageUrl ? "Fotoğrafı Değiştir" : "Fotoğraf Seç ve Yükle")}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <label className="block text-sm font-medium text-gray-400">Ürün Başlığı</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl focus:border-blue-500 outline-none" placeholder="Örn: MSI B450 Anakart..." />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-400">Fiyat (TL)</label>
              <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl focus:border-blue-500 outline-none" placeholder="1500" />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-400">Durumu</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl focus:border-blue-500 outline-none">
                <option value="2.El">2. El Garantili</option>
                <option value="Sıfır">Sıfır Kapalı Kutu</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-400">Stok (Adet)</label>
              <input type="number" min="0" required value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl focus:border-blue-500 outline-none" placeholder="10" />
            </div>

            <div className="space-y-4 md:col-span-2">
              <label className="block text-sm font-medium text-gray-400">Kategori</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl focus:border-blue-500 outline-none">
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4 md:col-span-2">
              <label className="block text-sm font-medium text-gray-400">Açıklama</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl focus:border-blue-500 outline-none resize-none" placeholder="Ürün özelliklerini yazın..."></textarea>
            </div>

            <div className="md:col-span-2 mt-2">
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors">
                Veritabanına Kaydet ve Sitede Yayınla
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass border border-white/10 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground text-sm">
                <th className="pb-3 font-medium">Ürün Adı ID</th>
                <th className="pb-3 font-medium">Kategori</th>
                <th className="pb-3 font-medium">Durum</th>
                <th className="pb-3 font-medium">Stok</th>
                <th className="pb-3 font-medium">Fiyat (TL)</th>
                <th className="pb-3 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Yükleniyor...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Henüz ürün eklenmemiş. Lütfen bir ürün ekleyin.</td></tr>
              ) : (
                products.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4 flex items-center gap-4">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-xs text-muted-foreground">Yok</div>
                      )}
                      <div>
                        <div className="font-semibold text-foreground">{item.title}</div>
                        <div className="text-xs text-muted-foreground">#{item.id}</div>
                      </div>
                    </td>
                    <td className="py-4 text-sm">{item.categories?.name || "-"}</td>
                    <td className="py-4 text-sm">
                      <span className={`px-3 py-1 bg-opacity-10 rounded-full font-medium ${item.condition === 'Sıfır' ? 'bg-purple-500 text-purple-400' : 'bg-orange-500 text-orange-400'}`}>
                        {item.condition}
                      </span>
                    </td>
                    <td className="py-4 font-semibold text-foreground">
                      {item.stock > 0 ? (
                        <span className="text-emerald-400">{item.stock} Adet</span>
                      ) : (
                        <span className="text-red-400">Tükendi</span>
                      )}
                    </td>
                    <td className="py-4 font-semibold text-foreground">₺{item.price.toLocaleString('tr-TR')}</td>
                    <td className="py-4 text-right">
                      <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-500 p-2 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors inline-block">
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
