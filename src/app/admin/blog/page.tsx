"use client";

import { Plus, Trash2, X, Edit3, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminBlogPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Otomatik slug oluşturma
  useEffect(() => {
    if (!editingId) {
      const s = title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(s);
    }
  }, [title, editingId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `blogs/${fileName}`;
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
    setSlug("");
    setContent("");
    setImageUrl("");
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setImageUrl(post.image_url || "");
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) return alert("Başlık, slug ve içerik zorunludur.");
    
    const postData = { title, slug, content, image_url: imageUrl };

    if (editingId) {
      const { error } = await supabase.from("blogs").update(postData).eq("id", editingId);
      if (!error) { resetForm(); fetchPosts(); }
      else alert("Hata: " + error.message);
    } else {
      const { error } = await supabase.from("blogs").insert([postData]);
      if (!error) { resetForm(); fetchPosts(); }
      else alert("Hata: " + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm("Bu yazıyı silmek istediğinize emin misiniz?")) {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (!error) fetchPosts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Yönetimi</h2>
          <p className="text-gray-500 text-sm mt-1">Sitenizdeki haber ve makaleleri buradan yönetin.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition text-sm shadow-sm"
          >
            <Plus size={18} /> Yeni Yazı Ekle
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">{editingId ? "Yazıyı Düzenle" : "Yeni Yazı Ekle"}</h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Yazı Başlığı</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500" 
                  placeholder="Haber başlığını girin..." />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL (Slug)</label>
                <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 bg-gray-50" 
                  placeholder="yazi-basligi" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kapak Görseli</label>
              <div className="flex items-center gap-4">
                {imageUrl && (
                  <img src={imageUrl} alt="Önizleme" className="w-24 h-16 object-cover rounded-lg border border-gray-200" />
                )}
                <div className="relative overflow-hidden bg-white border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg px-4 py-2 cursor-pointer flex items-center gap-2">
                  <ImageIcon size={16} className="text-gray-400" />
                  <span className="text-xs text-gray-600 font-medium">{isUploading ? "Yükleniyor..." : "Görsel Seç"}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
              <textarea rows={10} required value={content} onChange={(e) => setContent(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 resize-none" 
                placeholder="Yazı içeriğini buraya girin..."></textarea>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-sm">
              {editingId ? "Güncelle ve Yayınla" : "Yazıyı Yayınla"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Görsel</th>
                <th className="px-6 py-4 font-semibold">Başlık / Tarih</th>
                <th className="px-6 py-4 font-semibold text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={3} className="py-12 text-center text-gray-400 text-sm">Yükleniyor...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={3} className="py-12 text-center text-gray-400 text-sm">Henüz yazı eklenmemiş.</td></tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {post.image_url ? (
                        <img src={post.image_url} alt="" className="w-16 h-10 object-cover rounded-lg border border-gray-200" />
                      ) : (
                        <div className="w-16 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400">Görsel Yok</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 text-sm">{post.title}</div>
                      <div className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString('tr-TR')}</div>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(post)} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
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
