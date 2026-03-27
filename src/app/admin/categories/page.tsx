"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Edit3, X, Save } from "lucide-react";

export default function AdminCategoriesPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("categories").select("*").order("id", { ascending: true });
    if (data) setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const { error } = await supabase.from("categories").insert([{ name: newCategoryName.trim() }]);
    if (error) {
      alert("Hata: " + error.message);
    } else {
      setNewCategoryName("");
      setIsAdding(false);
      fetchCategories();
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz? (Eğer bu kategoriye bağlı ürünler varsa silinemeyebilir)")) return;

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      alert("Hata: Bu kategoriye bağlı ürünler olabilir, önce ürünleri başka kategoriye taşıyın.");
    } else {
      fetchCategories();
    }
  };

  const handleEditCategory = async (id: number) => {
    if (!editingName.trim()) return;

    const { error } = await supabase.from("categories").update({ name: editingName.trim() }).eq("id", id);
    if (error) {
      alert("Hata: " + error.message);
    } else {
      setEditingId(null);
      setEditingName("");
      fetchCategories();
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Kategoriler Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-sm lg:text-2xl">Kategori Yönetimi</h2>
          <p className="text-gray-500 text-xs lg:text-sm mt-1">Ürün gruplarını buradan düzenleyebilirsiniz.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 text-sm"
        >
          <Plus size={18} /> Yeni Kategori
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleAddCategory} className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Kategori Adı (örn: Monitörler)" 
              required
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition text-sm">Ekle</button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-xl transition text-sm">Vazgeç</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Kategori ID</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Kategori Adı</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-400">#{category.id}</td>
                <td className="px-6 py-4">
                  {editingId === category.id ? (
                    <input 
                      type="text" 
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-blue-500 rounded-lg outline-none text-sm"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm font-bold text-gray-900">{category.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {editingId === category.id ? (
                      <>
                        <button onClick={() => handleEditCategory(category.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Kaydet">
                          <Save size={18} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition" title="İptal">
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => { setEditingId(category.id); setEditingName(category.name); }} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" 
                          title="Düzenle"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" 
                          title="Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="py-20 text-center text-gray-400 font-medium">Henüz kategori bulunmuyor.</div>
        )}
      </div>
    </div>
  );
}
