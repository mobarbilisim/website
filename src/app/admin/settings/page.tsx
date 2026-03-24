"use client";

import { useState } from "react";
import { Save, Plus, Trash2, Image as ImageIcon } from "lucide-react";

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
    </div>
  );
}
