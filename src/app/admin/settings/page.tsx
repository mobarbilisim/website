"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Image as ImageIcon, MapPin, Phone, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function GlobalSettingsPage() {
  const [siteName, setSiteName] = useState("MOBARBİLİŞİM");
  const [heroTitle, setHeroTitle] = useState("2.EL KURUMSAL BİLGİSAYARLAR");
  const [heroDesc, setHeroDesc] = useState("Kurumsal Performans, Uygun Maliyet. Tüm testleri yapılmış...");
  
  const [categories, setCategories] = useState([
    { id: 1, name: "2.El Bilgisayarlar", icon: "Monitor" },
    { id: 2, name: "Sıfır Bilgisayarlar", icon: "Laptop" },
    { id: 3, name: "Yazılım Çözümleri", icon: "Code" },
    { id: 4, name: "Bileşenler", icon: "Cpu" },
  ]);

  const supabase = createClient();
  const [footerSettings, setFooterSettings] = useState({
    address: "",
    phone: "",
    email: "",
    facebook: "",
    twitter: "",
    instagram: "",
  });
  const [isSavingFooter, setIsSavingFooter] = useState(false);

  useEffect(() => {
    async function loadFooter() {
       const { data } = await supabase.from('site_settings').select('value').eq('key', 'footer_settings').single();
       if(data?.value) {
         setFooterSettings(data.value);
       } else {
         setFooterSettings({
           address: "Gaziantep/Şehitkamil Dinç Can Plaza",
           phone: "0533 040 72 27",
           email: "info@mobarbilisim.com",
           facebook: "https://facebook.com",
           twitter: "https://twitter.com",
           instagram: "https://instagram.com"
         });
       }
    }
    loadFooter();
  }, [supabase]);

  const saveFooter = async () => {
    setIsSavingFooter(true);
    await supabase.from('site_settings').upsert({ key: "footer_settings", value: footerSettings });
    setIsSavingFooter(false);
    alert("Alt bilgi (Footer) ayarları başarıyla kaydedildi!");
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Genel Site Ayarları</h2>
        <p className="text-muted-foreground mt-2">
          Anasayfa başlıkları, logolar, menüler ve site geneli konfigürasyonları buradan yönetin. 
          Değişiklikler kaydedildiğinde Supabase üzerinden anında tüm siteye yansır.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Temel Ayarlar */}
        <div className="glass border border-gray-200/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span> Temel Bilgiler
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Site Başlığı (Logo Metni)</label>
              <input 
                type="text" 
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-background border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Logo Görseli Yükle</label>
              <div className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer">
                <ImageIcon size={32} className="mb-2" />
                <span className="text-sm">Görsel seçmek için tıklayın veya sürükleyin</span>
              </div>
            </div>
            
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors w-full justify-center mt-4">
              <Save size={18} /> Temel Ayarları Kaydet
            </button>
          </div>
        </div>

        {/* Anasayfa Banner Ayarları */}
        <div className="glass border border-gray-200/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-500 rounded-full"></span> Anasayfa Hero (Banner)
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Büyük Başlık</label>
              <input 
                type="text" 
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-background border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Alt Açıklama Metni</label>
              <textarea 
                rows={3}
                value={heroDesc}
                onChange={(e) => setHeroDesc(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-background border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
              />
            </div>
            <button className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 transition-colors w-full justify-center">
              <Save size={18} /> Banner'ı Kaydet
            </button>
          </div>
        </div>
      </div>

      {/* Dinamik Kategori ve Menü Yönetimi */}
      <div className="glass border border-gray-200/20 rounded-2xl p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span> Anasayfa Menü Kategorileri
          </h3>
          <button className="flex items-center gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">
            <Plus size={16} /> Yeni Kategori Ekle
          </button>
        </div>
        
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-4 bg-background border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-mono text-xs">
                  {cat.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{cat.name}</div>
                  <div className="text-xs text-gray-400">/category/{cat.name.toLowerCase().replace(/ /g, '-')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-blue-500 p-2 font-medium text-sm">Düzenle</button>
                <button className="text-red-400 hover:text-red-500 p-2 bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">* Menüde yapılabilecek değişiklikler doğrudan Header üzerinde ve mobilde güncellenecektir.</p>
      </div>

      {/* İletişim & Footer Yönetimi */}
      <div className="glass border border-gray-200/20 rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
          <span className="w-1 h-6 bg-pink-500 rounded-full"></span> İletişim ve Alt Bilgi (Footer)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 border-b pb-2">İletişim Bilgileri</h4>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1"><MapPin size={16}/> Adres Bilgisi</label>
              <textarea 
                rows={2}
                value={footerSettings.address}
                onChange={(e) => setFooterSettings({...footerSettings, address: e.target.value})}
                className="w-full px-4 py-2 rounded-xl bg-background border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1"><Phone size={16}/> Telefon Numarası</label>
              <input 
                type="text" 
                value={footerSettings.phone}
                onChange={(e) => setFooterSettings({...footerSettings, phone: e.target.value})}
                className="w-full px-4 py-2 rounded-xl bg-background border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1"><Mail size={16}/> E-Posta Adresi</label>
              <input 
                type="text" 
                value={footerSettings.email}
                onChange={(e) => setFooterSettings({...footerSettings, email: e.target.value})}
                className="w-full px-4 py-2 rounded-xl bg-background border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 border-b pb-2">Sosyal Medya Linkleri</h4>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Facebook URL
              </label>
              <input 
                type="text" 
                value={footerSettings.facebook}
                onChange={(e) => setFooterSettings({...footerSettings, facebook: e.target.value})}
                placeholder="https://facebook.com/sayfaniz"
                className="w-full px-4 py-2 rounded-xl bg-background border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                Twitter (X) URL
              </label>
              <input 
                type="text" 
                value={footerSettings.twitter}
                onChange={(e) => setFooterSettings({...footerSettings, twitter: e.target.value})}
                placeholder="https://twitter.com/sayfaniz"
                className="w-full px-4 py-2 rounded-xl bg-background border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                Instagram URL
              </label>
              <input 
                type="text" 
                value={footerSettings.instagram}
                onChange={(e) => setFooterSettings({...footerSettings, instagram: e.target.value})}
                placeholder="https://instagram.com/sayfaniz"
                className="w-full px-4 py-2 rounded-xl bg-background border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button 
            onClick={saveFooter}
            disabled={isSavingFooter}
            className="flex items-center gap-2 bg-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors disabled:opacity-70"
          >
            <Save size={18} /> {isSavingFooter ? "Kaydediliyor..." : "İletişim & Footer Ayarlarını Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
