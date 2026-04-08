"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Plus, Trash2, ChevronDown, Image as ImageIcon, Type, Link as LinkIcon, Palette, Menu, Layout, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";

const slidePalettes = [
  { name: "Koyu Lacivert (Orijinal)", bg: "from-slate-800 via-slate-900 to-gray-900", accent: "text-blue-400" },
  { name: "Zümrüt Yeşili", bg: "from-emerald-900 via-teal-900 to-slate-900", accent: "text-emerald-400" },
  { name: "Derin Mavi", bg: "from-blue-900 via-indigo-900 to-slate-900", accent: "text-blue-400" },
  { name: "Koyu Mor", bg: "from-purple-900 via-purple-950 to-slate-900", accent: "text-purple-400" },
  { name: "Gece Yarısı Siyahı", bg: "from-gray-900 via-black to-slate-900", accent: "text-gray-400" },
  { name: "Açık Gri (Modern)", bg: "from-gray-100 via-gray-200 to-gray-300 softly", accent: "text-gray-900" }
];

const defaultSlides = [
  {
    title: "ALL IN ONE BİLGİSAYARLAR",
    subtitle: "Modern Ofislerin Vazgeçilmezi",
    desc: "Daha düzenli çalışma alanları için tasarlanmış hepsi bir arada bilgisayarlar.",
    bg: "from-gray-100 via-gray-200 to-gray-300",
    accent: "text-gray-900",
    btnText: "İncele",
    btnLink: "/store",
    image_url: "",
    Icon1: "Monitor",
    Icon2: "Server"
  }
];

// Removed defaultCategoryMenu as categories are globally synced string

const defaultPromoBanners = [
  { title: "2.EL MASAÜSTÜ BİLGİSAYARLAR", subtitle: "Kurumsal Çıkışlı - Temiz Kondisyon", bg: "from-blue-400 to-blue-500", link: "/store", image_url: "" },
  { title: "2.EL ALL IN ONE BİLGİSAYARLAR", subtitle: "Kompakt Tasarım - Garantili", bg: "from-orange-400 to-orange-500", link: "/store", image_url: "" },
  { title: "2.EL DİZÜSTÜ BİLGİSAYARLAR", subtitle: "Taşınabilir Performans", bg: "from-emerald-400 to-emerald-500", link: "/store", image_url: "" },
  { title: "2.EL MİNİ OFİS BİLGİSAYARLARI", subtitle: "Sessiz - Az Yer Kaplar", bg: "from-purple-400 to-purple-500", link: "/store", image_url: "" }
];

const defaultProductSliders = [
  { title: "OYUN BİLGİSAYARLARI", subtitle: "En çok tercih edilen oyun bilgisayarları!", category_id: "", limit: 10 }
];

export default function HomepageAdminPage() {
  const supabase = createClient();
  const [slides, setSlides] = useState<any[]>(defaultSlides);
  const [promoBanners, setPromoBanners] = useState<any[]>(defaultPromoBanners);
  const [productSliders, setProductSliders] = useState<any[]>(defaultProductSliders);
  
  const [systemCategories, setSystemCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { 
    fetchSettings(); 
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const json = await res.json();
      if (json.data) setSystemCategories(json.data);
    } catch (err) { }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        const sObj = json.data.find((d: any) => d.key === 'homepage_slides');
        const pbObj = json.data.find((d: any) => d.key === 'homepage_promo_banners');
        const psObj = json.data.find((d: any) => d.key === 'homepage_product_sections');
        
        if (sObj?.value?.length > 0) setSlides(sObj.value);
        if (pbObj?.value?.length > 0) setPromoBanners(pbObj.value);
        if (psObj?.value?.length > 0) setProductSliders(psObj.value);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Anasayfa güncelleniyor...");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          { key: 'homepage_slides', value: slides },
          { key: 'homepage_promo_banners', value: promoBanners },
          { key: 'homepage_product_sections', value: productSliders }
        ])
      });
      if (res.ok) {
        toast.success("Anasayfa vitrini yayına alındı!", { id: toastId, icon: '🚀' });
      } else {
        const r = await res.json();
        toast.error("Hata: " + (r.error || "Bilinmeyen hata"), { id: toastId });
      }
    } catch (err: any) {
      toast.error("Hata: " + err.message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, listSetter: any, list: any[], index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading("Görsel yükleniyor...");
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `home_${Date.now()}.${fileExt}`;
      const filePath = `anasayfa/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
      
      const newList = [...list];
      newList[index].image_url = publicUrl;
      listSetter(newList);

      toast.success("Görsel yüklendi!", { id: toastId, icon: '📸' });
    } catch (err: any) {
      toast.error("Yükleme hatası: " + err.message, { id: toastId });
    }
  };

  if (isLoading) return <div className="p-10 flex items-center justify-center text-gray-500 font-medium animate-pulse">Anasayfa Verileri Yükleniyor...</div>;

  return (
    <div className="space-y-10 pb-24 w-full max-w-5xl mx-auto">
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h2 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Anasayfa Vitrin Yönetimi</h2>
        <p className="text-gray-500 text-sm">Arama çubuğu altı menüleri, slider, promosyon bannerları ve dinamik ürün listelerini buradan yönetin.</p>
      </div>

      {/* 1. ÜST KATEGORİ MENÜSÜ -> KALDIRILDI (Artık Global Kategoriler kullanılıyor) */}

      {/* 2. HERO SLIDER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
           <div>
             <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><Layout size={20}/> 2. Geniş Kayan Slaytlar (Hero Slider)</h3>
           </div>
           <button onClick={() => setSlides([...slides, { title: "YENİ", subtitle: "", desc: "", bg: "from-gray-100", btnText: "İncele", btnLink: "/", image_url: "" }])} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm">
             <Plus size={16} /> Ekle
           </button>
        </div>
        <div className="p-6 space-y-4">
          {slides.map((slide, index) => (
             <details key={index} className="group bg-white border border-gray-200 rounded-xl overflow-hidden p-4">
               <summary className="font-bold cursor-pointer">{slide.title || "İsimsiz Slayt"} (Genişlet)</summary>
               <div className="mt-4 space-y-4 pt-4 border-t border-gray-100">
                  <button onClick={() => setSlides(slides.filter((_, i) => i !== index))} className="text-red-500 text-xs flex items-center gap-1 mb-2"><Trash2 size={12}/> Sil</button>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500">Ana Başlık</label>
                      <input className="w-full border p-2 rounded text-sm" value={slide.title} onChange={(e) => { const n=[...slides]; n[index].title=e.target.value; setSlides(n); }}/>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500">Üst Başlık (Subtitle)</label>
                      <input className="w-full border p-2 rounded text-sm" value={slide.subtitle} onChange={(e) => { const n=[...slides]; n[index].subtitle=e.target.value; setSlides(n); }}/>
                    </div>
                    <div className="col-span-2">
                       <label className="text-xs font-bold text-gray-500">Açıklama (Gri metin)</label>
                       <input className="w-full border p-2 rounded text-sm" value={slide.desc} onChange={(e) => { const n=[...slides]; n[index].desc=e.target.value; setSlides(n); }}/>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500">Buton Linki</label>
                      <input className="w-full border p-2 rounded text-sm" value={slide.btnLink} onChange={(e) => { const n=[...slides]; n[index].btnLink=e.target.value; setSlides(n); }}/>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500">Arkaplan Rengi / Teması</label>
                      <input className="w-full border p-2 rounded text-sm" value={slide.bg} onChange={(e) => { const n=[...slides]; n[index].bg=e.target.value; setSlides(n); }} placeholder="Örn: from-gray-100 to-gray-200"/>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded mt-4 flex items-center gap-4">
                     <div className="relative w-32 h-20 bg-white border border-gray-300 rounded flex items-center justify-center">
                        {slide.image_url ? <img src={slide.image_url} className="h-full object-contain p-1"/> : <span className="text-xs text-gray-400">Ürün PNG / Slider PNG</span>}
                        <input type="file" onChange={(e) => handleImageUpload(e, setSlides, slides, index)} className="absolute inset-0 opacity-0 cursor-pointer"/>
                     </div>
                     <span className="text-xs text-gray-500">Bu kısıma sağ tarafta duracak ürünü şeffaf PNG olarak yükleyin.</span>
                  </div>
               </div>
             </details>
          ))}
        </div>
      </div>

      {/* 3. PROMOSYON BANNERLARI (4'LÜ) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><LayoutGrid size={20}/> 3. Dörtlü Fırsat Bannerları</h3>
            <p className="text-xs text-gray-500 mt-1">Slider altındaki 4 adet renkli küçük banner.</p>
          </div>
          <button onClick={() => setPromoBanners([...promoBanners, { title: "YENİ", subtitle: "", link: "/", bg: "from-blue-400 to-blue-500", image_url: "" }])} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-500/20">
            <Plus size={16} /> Banner Ekle
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {promoBanners.map((banner, index) => (
             <div key={index} className="border border-gray-200 p-4 rounded-xl relative group">
                <button onClick={() => { if(confirm("Silmek emin misiniz?")) setPromoBanners(promoBanners.filter((_, i) => i !== index)); }} className="absolute -top-2 -right-2 bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10"><Trash2 size={12} /></button>
                <div className="grid grid-cols-3 gap-4">
                   <div className="col-span-2 space-y-2">
                     <input className="w-full border p-1.5 rounded text-sm font-bold placeholder-gray-400" placeholder="BAŞLIK" value={banner.title} onChange={(e)=>{const n=[...promoBanners]; n[index].title=e.target.value; setPromoBanners(n);}}/>
                     <input className="w-full border p-1.5 rounded text-xs text-gray-500" placeholder="Açıklama" value={banner.subtitle} onChange={(e)=>{const n=[...promoBanners]; n[index].subtitle=e.target.value; setPromoBanners(n);}}/>
                     <select className="w-full border p-1.5 rounded text-xs bg-white font-mono" value={banner.link} onChange={(e)=>{const n=[...promoBanners]; n[index].link=e.target.value; setPromoBanners(n);}}>
                         <option value="">-- Link Seçin --</option>
                         <optgroup label="Sayfalar">
                           <option value="/store">Tüm Ürünler</option>
                           <option value="/sifir-urunler">Sıfır Ürünler</option>
                           <option value="/ikinci-el-urunler">2.El Ürünler</option>
                           <option value="/blogs">Blog</option>
                         </optgroup>
                         <optgroup label="Kategoriler">
                           {systemCategories.map((c: any) => (
                             <option key={c.id} value={`/category/${c.slug}`}>{c.parent_id ? '  - ' : ''}{c.name}</option>
                           ))}
                         </optgroup>
                       </select>
                     <input className="w-full border border-dashed border-blue-300 bg-blue-50 p-1.5 rounded text-xs font-mono" placeholder="Renk Örn: from-blue-400 to-blue-600" value={banner.bg} onChange={(e)=>{const n=[...promoBanners]; n[index].bg=e.target.value; setPromoBanners(n);}}/>
                   </div>
                   <div className="col-span-1 relative bg-gray-50 border border-gray-300 rounded flex items-center justify-center overflow-hidden">
                      {banner.image_url ? <img src={banner.image_url} className="h-full object-contain p-1 w-full"/> : <span className="text-[10px] text-gray-400 text-center">Görsel<br/>Tıkla Yükle</span>}
                      <input type="file" onChange={(e) => handleImageUpload(e, setPromoBanners, promoBanners, index)} className="absolute inset-0 opacity-0 cursor-pointer"/>
                   </div>
                </div>
             </div>
          ))}
        </div>
      </div>

      {/* 4. DİNAMİK ÜRÜN KATEGORİ SLIDERLARI */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><LayoutGrid size={20}/> 4. Dinamik Kaydırılabilir Ürün Listeleri</h3>
            <p className="text-xs text-gray-500 mt-1">Anasayfada kategori tabanlı ürün çekmeceleri oluşturun.</p>
          </div>
          <button onClick={() => setProductSliders([...productSliders, { title: "YENİ VİTRİN", subtitle: "Alt açıklama", category_id: "", limit: 10 }])} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-500/20">
            <Plus size={16} /> Slayt Grubu Ekle
          </button>
        </div>
        <div className="p-6 space-y-4">
          {productSliders.map((slider, index) => (
             <div key={index} className="border border-gray-200 p-5 rounded-xl block relative group">
               <button onClick={() => { if(confirm("Bölümü silmek istediğinizden emin misiniz?")) setProductSliders(productSliders.filter((_, i) => i !== index)); }} className="absolute 1 top-2 right-2 bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10 hover:bg-red-500 hover:text-white"><Trash2 size={14} /></button>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-10">
                 <div>
                    <label className="block text-xs font-bold text-gray-500">Alan Başlığı</label>
                    <input className="w-full border p-2 rounded text-sm font-bold text-gray-900" placeholder="Örn: OYUN BİLGİSAYARLARI" value={slider.title} onChange={(e)=>{const n=[...productSliders]; n[index].title=e.target.value; setProductSliders(n);}}/>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500">Hangi Kategoriden Gösterilsin?</label>
                    <select className="w-full border p-2 rounded text-sm bg-white" value={slider.category_id} onChange={(e)=>{const n=[...productSliders]; n[index].category_id=e.target.value; setProductSliders(n);}}>
                       <option value="">-- Kategori Seçin --</option>
                       {systemCategories
                         .filter((c: any) => !c.parent_id)
                         .map((parent: any) => {
                           const kids = systemCategories.filter((ch: any) => ch.parent_id === parent.id);
                           return kids.length > 0 ? (
                             <optgroup key={parent.id} label={parent.name}>
                               <option value={parent.id}> Tümü: {parent.name}</option>
                               {kids.map((ch: any) => (
                                 <option key={ch.id} value={ch.id}>  - {ch.name}</option>
                               ))}
                             </optgroup>
                           ) : (
                             <option key={parent.id} value={parent.id}>{parent.name}</option>
                           );
                         })}
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500">Alt Başlık (Açıklama)</label>
                    <input className="w-full border p-2 rounded text-sm" placeholder="Örn: En çok tercih edilenler!" value={slider.subtitle} onChange={(e)=>{const n=[...productSliders]; n[index].subtitle=e.target.value; setProductSliders(n);}}/>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500">Maksimum Gösterilecek Ürün Adedi</label>
                    <input type="number" min="4" max="24" className="w-full border p-2 rounded text-sm bg-white" value={slider.limit} onChange={(e)=>{const n=[...productSliders]; n[index].limit=parseInt(e.target.value); setProductSliders(n);}}/>
                 </div>
               </div>
             </div>
          ))}
          {productSliders.length === 0 && <div className="text-gray-400 font-medium text-sm text-center py-6">Ürün slider'ı eklenmemiş.</div>}
        </div>
      </div>

      {/* SABİT KAYDET BUTONU */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-50 flex justify-center">
        <button onClick={handleSave} disabled={isSaving} className="w-full max-w-2xl flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-2xl font-black shadow-2xl shadow-green-600/20 transition-all text-base disabled:opacity-70">
          <Save size={20} /> {isSaving ? "KAYDEDİLİYOR..." : "YENİ TASARIMI YAYINLA"}
        </button>
      </div>
    </div>
  );
}
