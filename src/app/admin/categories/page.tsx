"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Edit2, X, ChevronRight, FolderTree, Package, AlertTriangle, Link as LinkIcon, ArrowUp, ArrowDown } from "lucide-react";
import toast from "react-hot-toast";

export default function KategorilerPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reordering, setReordering] = useState(false);
  const supabase = createClient();

  // Türkçe Slug Üreticisi
  const generateSlug = (text: string) => {
    const trMap: { [key: string]: string } = {
      'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
      'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
    };
    let slug = text.replace(/[çğışöüÇĞİŞÖÜ]/g, match => trMap[match]);
    return slug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // API route üzerinden kategorileri çek
      const catRes = await fetch("/api/admin/categories");
      const catJson = await catRes.json();
      if (catJson.data) setCategories(catJson.data);

      // Ürünleri doğrudan çek (sadece okuma, RLS sorunu olmaz)
      const { data: prodsData } = await supabase.from("products").select("id, category_id");
      if (prodsData) setProducts(prodsData);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
      toast.error("Veriler yüklenemedi.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Kategori başına ürün sayısı (alt kategorileri de dahil et)
  const getProductCount = (categoryId: number): number => {
    const childIds = categories.filter(c => c.parent_id === categoryId).map(c => c.id);
    const allIds = [categoryId, ...childIds];
    return products.filter(p => allIds.includes(p.category_id)).length;
  };

  const getDirectProductCount = (categoryId: number): number => {
    return products.filter(p => p.category_id === categoryId).length;
  };

  const resetForm = () => {
    setName("");
    setParentId("");
    setImageUrl("");
    setEditingId(null);
  };

  const handleEditClick = (category: any) => {
    setEditingId(category.id);
    setName(category.name);
    setParentId(category.parent_id ? category.parent_id.toString() : "");
    setImageUrl(category.image_url || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading("Görsel yükleniyor...");
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `cat_${Date.now()}.${fileExt}`;
      const filePath = `kategoriler/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
      
      setImageUrl(publicUrl);
      toast.success("Görsel eklendi!", { id: toastId, icon: '📸' });
    } catch (err: any) {
      toast.error("Yükleme hatası: " + err.message, { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Lütfen bir kategori adı girin.");
    
    setSubmitting(true);
    const autoSlug = generateSlug(name);
    const pId = parentId ? parseInt(parentId) : null;

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId || undefined,
          name: name.trim(),
          parent_id: pId,
          slug: autoSlug,
          image_url: imageUrl
        })
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error("Hata: " + (result.error || "Bilinmeyen hata"));
      } else {
        toast.success(editingId ? "Kategori başarıyla güncellendi!" : "Kategori başarıyla eklendi!");
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
    const childCount = categories.filter(c => c.parent_id === id).length;
    const productCount = getDirectProductCount(id);
    
    let msg = "Bu kategoriyi silmek istediğinize emin misiniz?";
    if (childCount > 0) msg = `DİKKAT! Bu kategorinin ${childCount} alt kategorisi var. Alt kategoriler bağımsız hale gelecektir. Emin misiniz?`;
    if (productCount > 0) msg = `DİKKAT! Bu kategoriye bağlı ${productCount} ürün var. Ürünler kategorisiz kalacaktır. Emin misiniz?`;
    
    if (!confirm(msg)) return;
    
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      const result = await res.json();

      if (!res.ok) {
        toast.error("Silinemedi: " + (result.error || "Bilinmeyen hata"));
      } else {
        toast.success("Kategori kalıcı olarak silindi.", { icon: '🗑️' });
        fetchData();
      }
    } catch (err: any) {
      toast.error("Silme hatası: " + err.message);
    }
  };

  const handleReorder = async (currentIndex: number, direction: 'up' | 'down', listToReorder: any[]) => {
    // Array order array [c1, c2, c3]
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === listToReorder.length - 1) return;

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newOrder = [...listToReorder];
    const temp = newOrder[currentIndex];
    newOrder[currentIndex] = newOrder[swapIndex];
    newOrder[swapIndex] = temp;

    // Her item'a bir order_index ata
    const itemsToUpdate = newOrder.map((item, idx) => ({ id: item.id, order_index: idx }));

    setReordering(true);
    const toastId = toast.loading("Sıralama güncelleniyor...");
    try {
      const res = await fetch("/api/admin/categories/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsToUpdate })
      });
      if (!res.ok) throw new Error("Sıralama başarısız");
      toast.success("Sıralama kaydedildi!", { id: toastId });
      fetchData();
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setReordering(false);
    }
  };

  const parents = categories.filter(c => !c.parent_id);
  
  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Kategori & Alt Kategori Yönetimi</h2>
        <p className="text-gray-500 text-sm mt-1">Ürünlerinizi organize edin. Alt kategoriler ana menüde hover ile açılır. Tüm bağlantılar dinamiktir.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol: Form Paneli */}
        <div className="lg:col-span-1">
          <div className={`bg-white rounded-2xl p-6 shadow-sm border ${editingId ? 'border-blue-300 ring-2 ring-blue-500/10' : 'border-gray-100'} sticky top-24`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black flex items-center gap-2">
                {editingId ? <><Edit2 size={18} className="text-blue-500"/> Düzenle</> : <><Plus size={18}/> Yeni Kategori</>}
              </h3>
              {editingId && (
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-700 bg-gray-50 rounded-lg p-1.5 transition">
                  <X size={16} />
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-500 mb-1.5 uppercase">Kategori Adı</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Masaüstü Bilgisayarlar"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
                />
                {name && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <LinkIcon size={12} />
                    <span className="font-mono bg-gray-50 px-2 py-0.5 rounded">/category/{generateSlug(name)}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 mb-1.5 uppercase">Kategori Görseli / İkonu (Opsiyonel)</label>
                <div className="flex items-center gap-4 border border-gray-200 rounded-xl p-3 bg-gray-50">
                  <div className="relative w-16 h-16 bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                    {imageUrl ? <img src={imageUrl} alt="" className="w-full h-full object-contain p-1"/> : <span className="text-[10px] text-gray-400 text-center">Görsel<br/>Yok</span>}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" title="Görsel Yükle" />
                  </div>
                  <div className="flex flex-col flex-1">
                     <span className="text-xs font-bold text-gray-700">Görsel Seç</span>
                     <span className="text-[11px] text-gray-500 mb-2">Şeffaf PNG veya kare SVG ikonu tavsiye edilir.</span>
                     {imageUrl && <button type="button" onClick={() => setImageUrl("")} className="text-[11px] text-red-500 font-bold self-start bg-red-50 px-2 py-0.5 rounded">Görseli Kaldır</button>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 mb-1.5 uppercase">Bağlı Olduğu Üst Kategori</label>
                <select 
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                >
                  <option value="">🏠 Bağımsız Ana Kategori (Navbar'da Çıkar)</option>
                  {parents.map(p => (
                    p.id !== editingId && <option key={p.id} value={p.id}>📁 {p.name} altına ekle</option>
                  ))}
                </select>
                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                    <strong>Ana Kategori:</strong> Sitenin üst menüsünde (Navbar) bağımsız olarak görünür.<br/>
                    <strong>Alt Kategori:</strong> Seçtiğiniz ana kategorinin altında hover ile açılır menüde listelenir. (Hepsiburada/Trendyol mantığı)
                  </p>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className={`w-full ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-black'} text-white font-black py-3 rounded-xl transition shadow-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {submitting ? "İŞLENİYOR..." : (editingId ? "DEĞİŞİKLİKLERİ KAYDET" : "KATEGORİYİ OLUŞTUR")}
              </button>
            </form>
          </div>
        </div>

        {/* Sağ: Kategoriler Ağacı */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderTree size={18} className="text-blue-600"/>
                <h3 className="font-black text-gray-800">Kategori Haritası</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-600">{parents.length} Ana</span>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-full text-purple-600">{categories.length - parents.length} Alt</span>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-full text-gray-600">{categories.length} Toplam</span>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              {loading ? (
                <div className="p-12 text-center text-gray-400 font-bold animate-pulse">Kategoriler taranıyor...</div>
              ) : categories.length === 0 ? (
                <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <FolderTree size={40} className="mx-auto mb-3 text-gray-300"/>
                  <p className="font-bold">Henüz kategori oluşturulmamış.</p>
                  <p className="text-sm text-gray-400 mt-1">Soldaki formu kullanarak ilk kategorinizi ekleyin.</p>
                </div>
              ) : parents.length === 0 && categories.length > 0 ? (
                <div className="p-8 text-center">
                  <AlertTriangle size={32} className="mx-auto mb-3 text-orange-400"/>
                  <p className="font-bold text-gray-700">Tüm kategoriler alt kategori olarak tanımlı.</p>
                  <p className="text-sm text-gray-400 mt-1">Ana kategori oluşturun veya mevcut kategorileri düzenleyin.</p>
                  <div className="mt-4 space-y-2">
                    {categories.map(cat => (
                      <div key={cat.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                        <span className="text-sm font-bold text-gray-700">{cat.name}</span>
                        <div className="flex gap-1">
                          <button onClick={() => handleEditClick(cat)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                parents.map(parent => {
                  const children = categories.filter(c => c.parent_id === parent.id);
                  const totalProducts = getProductCount(parent.id);
                  return (
                    <div key={parent.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-200 transition-colors group/parent">
                      {/* Ana Kategori Satırı */}
                      <div className="flex items-center justify-between bg-white px-5 py-3.5">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                            {(parent.name).substring(0, 1).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-gray-900 truncate">{parent.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">/category/{parent.slug || parent.id}</span>
                              <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                <Package size={10}/> {totalProducts} ürün
                              </span>
                              {children.length > 0 && (
                                <span className="text-[10px] font-bold text-purple-500 flex items-center gap-0.5">
                                  <ChevronRight size={10}/> {children.length} alt
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover/parent:opacity-100 transition">
                          <button onClick={() => handleReorder(parents.indexOf(parent), 'up', parents)} disabled={reordering || parents.indexOf(parent) === 0} className="text-gray-400 hover:text-green-600 p-2 hover:bg-green-50 rounded-lg transition disabled:opacity-30">
                            <ArrowUp size={16} />
                          </button>
                          <button onClick={() => handleReorder(parents.indexOf(parent), 'down', parents)} disabled={reordering || parents.indexOf(parent) === parents.length - 1} className="text-gray-400 hover:text-green-600 p-2 hover:bg-green-50 rounded-lg transition disabled:opacity-30">
                            <ArrowDown size={16} />
                          </button>
                          <button onClick={() => handleEditClick(parent)} className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition" title="Düzenle">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(parent.id)} className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition" title="Sil">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Alt Kategoriler */}
                      {children.length > 0 && (
                        <div className="bg-gray-50/80 border-t border-gray-100 p-3 space-y-1.5">
                          {children.map((child, i) => {
                            const childProducts = getDirectProductCount(child.id);
                            return (
                              <div key={child.id} className="flex items-center justify-between bg-white rounded-lg border border-gray-100 px-4 py-2.5 ml-6 relative hover:border-blue-200 group/child transition-all hover:shadow-sm">
                                {/* Ağaç çizgileri */}
                                <div className="absolute -left-6 top-1/2 w-6 border-t border-gray-300"></div>
                                {i === 0 && <div className="absolute -left-6 top-0 bottom-1/2 border-l border-gray-300"></div>}
                                {i < children.length - 1 && <div className="absolute -left-6 top-0 bottom-0 border-l border-gray-300"></div>}
                                {i === children.length - 1 && <div className="absolute -left-6 top-0 bottom-1/2 border-l border-gray-300"></div>}
                                
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-6 h-6 rounded bg-purple-50 text-purple-500 flex items-center justify-center text-[10px] font-black shrink-0">
                                    {(child.name).substring(0, 1).toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <span className="font-bold text-sm text-gray-800 block truncate">{child.name}</span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] text-gray-400 font-mono bg-gray-50 border border-gray-100 px-1 py-0.5 rounded">{child.slug}</span>
                                      <span className="text-[10px] font-bold text-gray-400"><Package size={9} className="inline mr-0.5"/>{childProducts}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-1 opacity-0 group-hover/child:opacity-100 transition-opacity shrink-0">
                                  <button onClick={() => handleReorder(i, 'up', children)} disabled={reordering || i === 0} className="text-gray-400 hover:text-green-600 p-1.5 hover:bg-green-50 rounded-lg transition disabled:opacity-30">
                                    <ArrowUp size={14} />
                                  </button>
                                  <button onClick={() => handleReorder(i, 'down', children)} disabled={reordering || i === children.length - 1} className="text-gray-400 hover:text-green-600 p-1.5 hover:bg-green-50 rounded-lg transition disabled:opacity-30">
                                    <ArrowDown size={14} />
                                  </button>
                                  <button onClick={() => handleEditClick(child)} className="text-gray-400 hover:text-blue-500 p-1.5 hover:bg-blue-50 rounded-lg transition" title="Düzenle">
                                    <Edit2 size={14} />
                                  </button>
                                  <button onClick={() => handleDelete(child.id)} className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition" title="Sil">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
