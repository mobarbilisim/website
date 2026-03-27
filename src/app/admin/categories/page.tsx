"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Edit2, CheckCircle2, XCircle } from "lucide-react";

export default function KategorilerPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const supabase = createClient();

  // Her zaman "slug" uyumlu metin oluşturucu (örn: "2. El Bilgisayarlar" -> "2-el-bilgisayarlar")
  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  const fetchCategories = async () => {
    setLoading(true);
    // parent_id field included
    const { data: cats, error } = await supabase.from("categories").select("*");
    if (cats && !error) {
      setCategories(cats);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Slug oluştur (Kendi yazılan URL)
    let autoSlug = generateSlug(name);
    
    // Alt kategori verisi
    const pId = parentId ? parseInt(parentId) : null;

    const { error } = await supabase.from("categories").insert([
      { name: name.trim(), parent_id: pId, slug: autoSlug }
    ]);

    if (!error) {
      alert("Kategori eklendi!");
      setName("");
      setParentId("");
      fetchCategories();
    } else {
      alert("Eklenemedi: " + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Silerken dikkat! Eğer bu kategoriye bağlı alt kategoriler veya ürünler varsa onlara ait bağlantılar kopabilir. Emin misiniz?")) return;
    
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) {
      fetchCategories();
    } else {
      alert("Silinemedi: " + error.message);
    }
  };

  // Kategorileri ağaç şeklinde gruplandırmak için yardımcı fonksiyon (Anne/Alt Kategoriler)
  const parents = categories.filter(c => !c.parent_id);
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Kategori & Alt Kategori Yönetimi</h2>
        <p className="text-gray-500 text-sm mt-1">E-Ticaret sitenizin bel kemiği. Menü (Navbar) hiyerarşisi de buradan şekillenir.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kategori Ekleme Formu */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus size={18}/> Yeni Ekle</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori Adı</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: 2. El Bilgisayarlar"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Üst Kategori (Opsiyonel)</label>
                <select 
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                >
                  <option value="">-- Bu Ana Kategori Olsun (Köktedir) --</option>
                  {parents.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-2">
                  Eğer bu bölümü "Ana Kategori" bırakırsanız direkt Navbarda görünür. Üst kategori seçerseniz navbarda tıkladıklarında altına açılır (Hepsiburada mantığı).
                </p>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition shadow-md shadow-blue-500/30"
              >
                Kategoriyi Kaydet
              </button>
            </form>
          </div>
        </div>

        {/* Kategorilerin Listelendiği Ağaç (Tree) Görünümü */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Mevcut Kategoriler</h3>
              <span className="text-xs font-semibold px-2 py-1 bg-white border rounded-full text-blue-600 shadow-sm">{categories.length} Toplam</span>
            </div>
            
            <div className="p-4 space-y-4">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Kategoriler Yükleniyor...</div>
              ) : parents.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl">Henüz hiç kategori eklenmemiş.</div>
              ) : (
                parents.map(parent => {
                  const children = categories.filter(c => c.parent_id === parent.id);
                  return (
                    <div key={parent.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between bg-white px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                            {(parent.name).substring(0, 1)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{parent.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded inline-block mt-0.5">/category/{parent.slug || parent.id}</div>
                          </div>
                        </div>
                        <button onClick={() => handleDelete(parent.id)} className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      {/* Alt Kategoriler Varsa Çiz */}
                      {children.length > 0 && (
                        <div className="bg-gray-50 border-t border-gray-100 p-3 space-y-2">
                          {children.map(child => (
                            <div key={child.id} className="flex items-center justify-between bg-white rounded-lg border border-gray-100 px-3 py-2 ml-4 relative">
                              {/* Alt ağaç ağacı çiziği */}
                              <div className="absolute -left-4 top-1/2 w-4 h-px bg-gray-300"></div>
                              <div className="absolute -left-4 -top-3 bottom-1/2 w-px bg-gray-300"></div>
                              
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-gray-700">{child.name}</span>
                                <span className="text-[10px] text-gray-400 border px-1 rounded">Alt</span>
                              </div>
                              <button onClick={() => handleDelete(child.id)} className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded transition">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
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
