"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Edit2, Image as ImageIcon, Eye, EyeOff, X, CheckCircle2, FileText } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const supabase = createClient();

  const generateSlug = (text: string) => {
    const trMap: { [key: string]: string } = {
      'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
      'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
    };
    let slug = text.replace(/[çğışöüÇĞİŞÖÜ]/g, match => trMap[match]);
    return slug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs");
      const json = await res.json();
      if (json.data) setBlogs(json.data);
    } catch (err) {
      console.error("Blog çekme hatası:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchBlogs(); }, []);

  const resetForm = () => {
    setTitle(""); setContent(""); setImageUrl(""); setIsPublished(true);
    setEditingId(null); setIsFormOpen(false);
  };

  const handleEditClick = (blog: any) => {
    setEditingId(blog.id); setTitle(blog.title); setContent(blog.content);
    setImageUrl(blog.image_url || ""); setIsPublished(blog.is_published);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading("Görsel yükleniyor...");
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `blog-${Date.now()}.${fileExt}`;
      const filePath = `blogs/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
      setImageUrl(publicUrl);
      toast.success("Fotoğraf başarıyla eklendi!", { id: toastId, icon: '📸' });
    } catch (error: any) {
      toast.error("Yükleme hatası: " + error.message, { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return toast.error("Bütün alanları doldurmanız gerekmektedir.");
    setSubmitting(true);
    const slug = generateSlug(title);
    const toastId = toast.loading(editingId ? "Güncelleniyor..." : "Yayınlanıyor...");

    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId || undefined,
          title: title.trim(), slug, content: content.trim(),
          image_url: imageUrl, is_published: isPublished
        })
      });
      const result = await res.json();
      if (!res.ok) {
        if (result.error?.includes('23505')) toast.error("Bu başlıkta bir yazı zaten mevcut.", { id: toastId });
        else toast.error("Hata: " + (result.error || "Bilinmeyen hata"), { id: toastId });
      } else {
        toast.success(editingId ? "Makale güncellendi!" : "Yeni makale yayınlandı!", { id: toastId, icon: editingId ? '✏️' : '🚀' });
        resetForm(); fetchBlogs();
      }
    } catch (err: any) {
      toast.error("İşlem hatası: " + err.message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu blog yazısı kalıcı olarak silinecektir! Onaylıyor musunuz?")) return;
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Makale silindi.", { icon: '🗑️' }); fetchBlogs(); }
      else { const r = await res.json(); toast.error("Silinemedi: " + r.error); }
    } catch (err: any) { toast.error("Hata: " + err.message); }
  };

  const togglePublishStatus = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/blogs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_published: !currentStatus })
      });
      if (res.ok) {
        toast.success(currentStatus ? "Makale gizlendi." : "Makale yayına alındı!");
        fetchBlogs();
      }
    } catch (err: any) { toast.error("Durum güncellenemedi."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Kariyer & Blog Yazıları</h2>
          <p className="text-gray-500 text-sm mt-1">Firmanızdan haberler, duyurular ve e-ticaret sektörü metinleri ekleyip düzenleyin.</p>
        </div>
        {!isFormOpen && (
          <button onClick={() => { resetForm(); setIsFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition shadow-md shadow-blue-500/20">
            <Plus size={18} /> Yeni Makale Yaz
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 lg:p-8 ring-2 ring-blue-500/10">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              {editingId ? <><Edit2 className="text-blue-500"/> Makaleyi Düzenle</> : <><FileText className="text-blue-500"/> Yeni Makale Paneli</>}
            </h3>
            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition"><X size={20}/></button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">Makale Başlığı</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: 2024 E-ticaret Trendleri..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-bold text-gray-900 transition-all shadow-sm" />
                </div>
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">Makale Kapak Görseli</label>
                  <div className="flex gap-4 items-center">
                    {imageUrl ? (
                      <div className="relative w-32 h-20 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 shadow-sm">
                        <Image src={imageUrl} alt="Kapak" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-32 h-20 rounded-xl bg-white border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                        <ImageIcon size={24} />
                      </div>
                    )}
                    <label className="bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 text-sm font-bold transition">
                      {uploading ? "Yükleniyor..." : "Görsel Seç"}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 w-max">
                  <label className="block text-xs font-black uppercase text-gray-500">Yayın Durumu:</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    <span className="ml-3 text-sm font-bold text-gray-700">{isPublished ? 'Yayına Alınacak' : 'Taslak Kalacak'}</span>
                  </label>
                </div>
              </div>
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">Makale Metni</label>
                <textarea required value={content} onChange={(e) => setContent(e.target.value)} placeholder="Makalenizi buraya yazın..." rows={10} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium text-gray-800 resize-none min-h-[300px] shadow-sm transition-all"></textarea>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={resetForm} className="px-6 py-3 text-gray-500 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl transition">İptal Et</button>
              <button type="submit" disabled={submitting} className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-black rounded-xl shadow-xl transition flex items-center gap-2 disabled:opacity-60">
                <CheckCircle2 size={20} /> {submitting ? "İşleniyor..." : (editingId ? "KAYDET" : "YAYINLA")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blog Listesi */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-24">Görsel</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Tarih / Başlık</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Durum</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="py-16 text-center text-gray-400 font-bold animate-pulse">Makaleler Yükleniyor...</td></tr>
            ) : blogs.length === 0 ? (
              <tr><td colSpan={4} className="py-16 text-center text-gray-500"><FileText size={48} className="text-gray-200 mx-auto mb-3" /><span className="font-bold block">Henüz makale yazılmamış.</span></td></tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-24 h-16 bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200">
                      {blog.image_url ? <Image src={blog.image_url} alt={blog.title} fill className="object-cover" /> : <ImageIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[11px] font-black uppercase text-gray-400 mb-1">{new Date(blog.created_at).toLocaleDateString('tr-TR')}</div>
                    <div className="font-bold text-gray-900 line-clamp-1">{blog.title}</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-1 bg-gray-100 px-2 py-0.5 rounded w-max">/blog/{blog.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => togglePublishStatus(blog.id, blog.is_published)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black border transition-colors ${blog.is_published ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                      {blog.is_published ? <><Eye size={14}/> YAYINDA</> : <><EyeOff size={14}/> GİZLİ</>}
                    </button>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-end gap-2 opacity-100 lg:opacity-50 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(blog)} className="p-2.5 text-blue-500 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl shadow-sm transition" title="Düzenle"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(blog.id)} className="p-2.5 text-red-500 bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 rounded-xl shadow-sm transition" title="Sil"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
