"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Edit2, Image as ImageIcon, Eye, EyeOff, X, CheckCircle2, FileText } from "lucide-react";
import Image from "next/image";

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const supabase = createClient();

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
    if (data && !error) setBlogs(data);
    setLoading(false);
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `blog-${Date.now()}.${fileExt}`;
      const filePath = `blogs/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      
      if (uploadError) {
        if (uploadError.message.includes("Bucket not found")) throw new Error("Supabase Storage'da 'images' adında public folder yok!");
        throw uploadError;
      }
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
      setImageUrl(publicUrl);
    } catch (error: any) {
      alert("Fotoğraf yükleme hatası: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("Başlık ve içerik zorunludur.");

    let slug = generateSlug(title);

    const { error } = await supabase.from("blogs").insert([{
      title: title.trim(),
      slug: slug,
      content: content.trim(),
      image_url: imageUrl,
      is_published: isPublished
    }]);

    if (!error) {
      alert("Blog yazısı başarıyla eklendi / yayınlandı!");
      setTitle(""); setContent(""); setImageUrl(""); setIsFormOpen(false);
      fetchBlogs();
    } else {
      if (error.code === '23505') alert("Bu başlıkta bir yazı zaten var. Lütfen başlığı değiştirin.");
      else alert("Hata: " + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu blog yazısı kalıcı olarak silinecektir! Onaylıyor musunuz?")) return;
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (!error) fetchBlogs();
    else alert("Silinemedi: " + error.message);
  };

  const togglePublishStatus = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase.from("blogs").update({ is_published: !currentStatus }).eq("id", id);
    if (!error) fetchBlogs();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Yazıları</h2>
          <p className="text-gray-500 text-sm mt-1">Firmanızdan haberler, duyurular ve bilişim sektörü yazıları paylaşın.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition"
        >
          {isFormOpen ? <><X size={18} /> Kapat</> : <><Plus size={18} /> Yeni Makale Yaz</>}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white border text-left border-gray-200 shadow-xl rounded-2xl p-6 lg:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-4 mb-6">Makale Paneli</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Makale Başlığı</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: 2024 Bilişim Trendleri ve Yeni Teknolojiler" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Makale Kapak Görseli</label>
                  <div className="flex gap-4 items-center">
                    {imageUrl ? (
                      <div className="relative w-32 h-20 rounded-lg overflow-hidden border">
                        <Image src={imageUrl} alt="Kapak" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-32 h-20 rounded-lg bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                        <ImageIcon size={24} />
                      </div>
                    )}
                    <label className="bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium transition cursor-pointer">
                      {uploading ? "Yükleniyor..." : "Görsel Yükle (PC'den)"}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 w-max">
                  <label className="block text-sm font-semibold text-gray-700">Durum:</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">{isPublished ? 'Direkt Yayına Al' : 'Sadece Taslak Olarak Kaydet'}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Makale Metni (İçerik)</label>
                <textarea 
                  required 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="Makalenizi buraya yazın... İsterseniz basit HTML etiketleri <b>kalın</b> <br> yeni satır gibi kullanabilirsiniz."
                  rows={10} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-medium resize-none min-h-[300px]"
                ></textarea>
              </div>

            </div>

            <div className="pt-4 border-t flex justify-end gap-3">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl transition">İptal</button>
              <button type="submit" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-2">
                <CheckCircle2 size={20} /> Makaleyi Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blog Listesi Tablosu */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="px-6 py-4 font-semibold w-24">Görsel</th>
              <th className="px-6 py-4 font-semibold">Tarih / Başlık</th>
              <th className="px-6 py-4 font-semibold">Durum</th>
              <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="py-12 text-center text-gray-400">Makaleler Yükleniyor...</td></tr>
            ) : blogs.length === 0 ? (
              <tr><td colSpan={4} className="py-12 text-center text-gray-500 flex-col items-center flex gap-2"><FileText size={48} className="text-gray-300 mx-auto" />Hiç makale veya haber yazılmamış.</td></tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                      {blog.image_url ? <Image src={blog.image_url} alt={blog.title} fill className="object-cover" /> : <ImageIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-400 mb-1">{new Date(blog.created_at).toLocaleDateString('tr-TR')}</div>
                    <div className="font-bold text-gray-900 line-clamp-1">{blog.title}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-1">/blog/{blog.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => togglePublishStatus(blog.id, blog.is_published)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${blog.is_published ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-red-50 hover:text-red-600' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-emerald-50 hover:text-emerald-600'}`}
                      title="Durumu Değiştirmek İçin Tıklayın"
                    >
                      {blog.is_published ? <><Eye size={14}/> Yayında</> : <><EyeOff size={14}/> Taslak (Gizli)</>}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                    <button onClick={() => handleDelete(blog.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Makaleyi Sil">
                      <Trash2 size={18} />
                    </button>
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
