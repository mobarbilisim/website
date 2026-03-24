"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Plus, Trash2, Info } from "lucide-react";

const supabase = createClient();

const defaultSlides = [
  {
    title: "2.EL KURUMSAL BİLGİSAYARLAR",
    subtitle: "Fırsat Ürünleri",
    desc: "Kurumsal Performans, Uygun Maliyet. Tüm testleri yapılmış, 3 ay garantili ürünleri hemen inceleyin.",
    bg: "from-slate-800 to-slate-900",
    accent: "text-blue-400",
    btnText: "Hemen İncele",
    btnLink: "/store",
    image_url: "",
    Icon1: "Server",
    Icon2: "Monitor"
  },
  {
    title: "SIFIR OYUNCU KASALARI",
    subtitle: "Yeni Nesil",
    desc: "Oyunlarda en yüksek performansı alın. Garantili sıfır sistemlerle kesintisiz gücü hissedin.",
    bg: "from-indigo-900 to-purple-900",
    accent: "text-purple-400",
    btnText: "Sistemleri Gör",
    btnLink: "/store",
    image_url: "",
    Icon1: "Server",
    Icon2: "Cpu"
  },
  {
    title: "ÖZEL YAZILIM ÇÖZÜMLERİ",
    subtitle: "Kurumsal",
    desc: "İşletmenize özel web yazılımları, uygulamalar ve uçtan uca dijital çözümler üretiyoruz.",
    bg: "from-emerald-900 to-teal-900",
    accent: "text-emerald-400",
    btnText: "Bize Ulaşın",
    btnLink: "/iletisim",
    image_url: "",
    Icon1: "Code",
    Icon2: "Laptop"
  }
];

const defaultCards = [
  {
    title: "2.EL MASAÜSTÜ <br/> BİLGİSAYARLAR",
    features: ["• Çıkışlı Kurumsal", "• Temiz Kondisyon", "• Hızlı Kargo"],
    bg: "from-blue-400 to-blue-500",
    icon: "Monitor",
    btnText: "ÜRÜNLERİ GÖR",
    btnLink: "/store",
  },
  {
    title: "2.EL ALL IN ONE <br/> BİLGİSAYARLAR",
    features: ["• Kompakt Tasarım", "• Ofis İçin İdeal", "• Garantili"],
    bg: "from-orange-400 to-orange-500",
    icon: "Layers",
    btnText: "ÜRÜNLERİ GÖR",
    btnLink: "/store",
  },
  {
    title: "YAZILIM <br/> ÇÖZÜMLERİ",
    features: ["• Web Siteleri", "• E-Ticaret / Kurumsal", "• Hızlı Teslimat"],
    bg: "from-emerald-400 to-emerald-500",
    icon: "Code",
    btnText: "PAKETLERİ GÖR",
    btnLink: "/yazilim-cozumleri",
  },
  {
    title: "2.EL MİNİ OFİS <br/> BİLGİSAYARLARI",
    features: ["• Sessiz • Az Yer Kaplar", "• Kurumsal Kullanım", "• Garantili Tüketim"],
    bg: "from-purple-500 to-purple-600",
    icon: "Server",
    btnText: "ÜRÜNLERİ GÖR",
    btnLink: "/store",
  }
];

export default function HomepageAdminPage() {
  const [slides, setSlides] = useState<any[]>(defaultSlides);
  const [cards, setCards] = useState<any[]>(defaultCards);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) {
        console.error("Tablo yok veya hata", error);
        setStatusMessage("Lütfen veritabanında 'site_settings' tablosunu oluşturun. Slaytlar varsayılan olarak yüklenmiştir.");
      }
      if (data && data.length > 0) {
        const sObj = data.find(d => d.key === 'homepage_slides');
        const cObj = data.find(d => d.key === 'homepage_cards');
        if (sObj?.value?.length > 0) setSlides(sObj.value);
        if (cObj?.value?.length > 0) setCards(cObj.value);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage("Kaydediliyor...");
    try {
      // Upsert requires the unique key to exist
      const { error } = await supabase.from('site_settings').upsert([
        { key: 'homepage_slides', value: slides },
        { key: 'homepage_cards', value: cards }
      ], { onConflict: 'key' });

      if (error) throw error;
      setStatusMessage("Başarıyla kaydedildi!");
    } catch (err: any) {
      setStatusMessage("Hata: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addSlide = () => {
    setSlides([...slides, {
      title: "YENİ SLAYT BAŞLIĞI",
      subtitle: "Alt Başlık",
      desc: "Açıklama...",
      bg: "from-slate-800 to-slate-900",
      accent: "text-blue-400",
      btnText: "İncele",
      btnLink: "/store",
      image_url: "",
      Icon1: "Server",
      Icon2: "Monitor"
    }]);
  };

  const removeSlide = (index: number) => {
    setSlides(slides.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setStatusMessage("Fotoğraf yükleniyor...");
      
      const fileExt = file.name.split('.').pop();
      const fileName = \`\${Math.random()}.\${fileExt}\`;
      const filePath = \`slider/\${fileName}\`;

      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        // Eğer "images" bucket yoksa kullanıcıyı uyarmak için hata fırlatalım
        if (uploadError.message.includes("Bucket not found")) {
          throw new Error("Supabase panelinden 'images' isimli herkese açık (Public) bir Storage Bucket oluşturmalısınız.");
        }
        throw uploadError;
      }

      // Public URL alalım
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

      const newSlides = [...slides];
      newSlides[index].image_url = publicUrl;
      setSlides(newSlides);
      setStatusMessage("Fotoğraf yüklendi!");

    } catch (err: any) {
      console.error(err);
      setStatusMessage("Hata: " + err.message);
      alert("Fotoğraf yükleme hatası: " + err.message);
    }
  };

  if (isLoading) return <div>Yükleniyor...</div>;

  return (
    <div className="space-y-8 pb-12 w-full max-w-5xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Anasayfa İçerik Yönetimi</h2>
        <p className="text-muted-foreground">
          Slaytları ve aşağıdaki 4 özellik kartını buradan düzenleyebilirsiniz. Değişiklikleri kaydetmek için en alttaki butonu kullanın.
        </p>
        {statusMessage && (
          <div className="mt-4 p-4 bg-blue-500/10 text-blue-400 rounded-xl flex items-center gap-2 border border-blue-500/20">
            <Info size={20} />
            <span className="font-medium">{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Slaytlar */}
      <div className="glass border border-white/10 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">1. Kayan Slaytlar (Hero)</h3>
          <button onClick={addSlide} className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
            <Plus size={16} /> Yeni Ekle
          </button>
        </div>
        
        <div className="space-y-6">
          {slides.map((slide, index) => (
            <div key={index} className="border border-white/10 bg-white/5 rounded-2xl p-6 relative">
              <button 
                onClick={() => removeSlide(index)}
                className="absolute top-4 right-4 bg-red-500/10 text-red-500 p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                title="Slaytı Sil"
              >
                <Trash2 size={18} />
              </button>
              <h4 className="font-bold text-foreground mb-4">Slayt #{index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Küçük Üst Bilgi (Subtitle)</label>
                  <input type="text" value={slide.subtitle} onChange={(e) => {
                    const newSlides = [...slides]; newSlides[index].subtitle = e.target.value; setSlides(newSlides);
                  }} className="w-full px-4 py-2 rounded-lg bg-background border border-white/10 focus:border-blue-500 outline-none text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Ana Başlık</label>
                  <input type="text" value={slide.title} onChange={(e) => {
                    const newSlides = [...slides]; newSlides[index].title = e.target.value; setSlides(newSlides);
                  }} className="w-full px-4 py-2 rounded-lg bg-background border border-white/10 focus:border-blue-500 outline-none text-foreground" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Açıklama</label>
                  <textarea value={slide.desc} rows={2} onChange={(e) => {
                    const newSlides = [...slides]; newSlides[index].desc = e.target.value; setSlides(newSlides);
                  }} className="w-full px-4 py-2 rounded-lg bg-background border border-white/10 focus:border-blue-500 outline-none text-foreground"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Buton Metni</label>
                  <input type="text" value={slide.btnText} onChange={(e) => {
                    const newSlides = [...slides]; newSlides[index].btnText = e.target.value; setSlides(newSlides);
                  }} className="w-full px-4 py-2 rounded-lg bg-background border border-white/10 focus:border-blue-500 outline-none text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Buton Linki (örn: /store)</label>
                  <input type="text" value={slide.btnLink || ''} onChange={(e) => {
                    const newSlides = [...slides]; newSlides[index].btnLink = e.target.value; setSlides(newSlides);
                  }} className="w-full px-4 py-2 rounded-lg bg-background border border-white/10 focus:border-blue-500 outline-none text-foreground" />
                </div>
                <div className="md:col-span-2 p-4 bg-background border border-white/10 rounded-xl">
                  <label className="block text-sm font-bold text-foreground mb-2">Görsel Seçenekleri (İkon yerine Fotoğraf)</label>
                  <p className="text-xs text-muted-foreground mb-2">Eğer bir fotoğraf URL'si girerseniz, ikonlar iptal edilir ve bu fotoğraf gösterilir. Ya direkt bilgisayardan yükleyin ya da internetten link kopyalayın.</p>
                  
                  <div className="flex flex-col md:flex-row gap-4 mb-3">
                    <input type="text" placeholder="Fotoğraf Linki (https://...)" value={slide.image_url || ''} onChange={(e) => {
                      const newSlides = [...slides]; newSlides[index].image_url = e.target.value; setSlides(newSlides);
                    }} className="flex-1 px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:border-blue-500 outline-none text-foreground" />
                    
                    <div className="flex-shrink-0 relative overflow-hidden bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-colors font-medium px-4 py-2 rounded-lg cursor-pointer flex items-center justify-center">
                      <span className="cursor-pointer">Direkt Yükle</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, index)}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                    </div>
                  </div>

                  {slide.image_url && (
                    <div className="mb-4">
                      <img src={slide.image_url} alt="Önizleme" className="h-24 object-contain rounded border border-white/10" />
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-400 mb-1">Arka İkon</label>
                      <input type="text" value={slide.Icon1 || ''} onChange={(e) => {
                        const newSlides = [...slides]; newSlides[index].Icon1 = e.target.value; setSlides(newSlides);
                      }} className="w-full px-3 py-1.5 rounded-md bg-black/20 border border-white/10 outline-none text-sm text-foreground" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-400 mb-1">Ön İkon</label>
                      <input type="text" value={slide.Icon2 || ''} onChange={(e) => {
                        const newSlides = [...slides]; newSlides[index].Icon2 = e.target.value; setSlides(newSlides);
                      }} className="w-full px-3 py-1.5 rounded-md bg-black/20 border border-white/10 outline-none text-sm text-foreground" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Arkaplan Rengi (from-... to-...)</label>
                  <input type="text" value={slide.bg} onChange={(e) => {
                    const newSlides = [...slides]; newSlides[index].bg = e.target.value; setSlides(newSlides);
                  }} className="w-full px-4 py-2 rounded-lg bg-background border border-white/10 focus:border-blue-500 outline-none text-foreground" />
                </div>
              </div>
            </div>
          ))}
          {slides.length === 0 && (
            <div className="text-center py-10 text-muted-foreground bg-white/5 border border-white/10 rounded-xl">Hiç slayt bulunmuyor. Eklemek için "Yeni Ekle"ye tıklayın.</div>
          )}
        </div>
      </div>

      {/* Kartlar */}
      <div className="glass border border-white/10 rounded-3xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-6">2. Özellik Kartları (4 Adet)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <div key={index} className="border border-white/10 bg-white/5 rounded-2xl p-4">
              <h4 className="font-bold text-foreground mb-4 inline-block bg-background px-3 py-1 rounded-full text-xs shadow-sm border border-white/10">Kart #{index + 1}</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Başlık (HTML br kullanılabilir)</label>
                  <input type="text" value={card.title} onChange={(e) => {
                    const newCards = [...cards]; newCards[index].title = e.target.value; setCards(newCards);
                  }} className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 focus:border-blue-500 outline-none text-sm text-foreground" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Özellikler (Virgülle ayırın)</label>
                  <input type="text" value={card.features?.join(', ') || ''} onChange={(e) => {
                    const newCards = [...cards]; newCards[index].features = e.target.value.split(',').map(s => s.trim()); setCards(newCards);
                  }} className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 focus:border-blue-500 outline-none text-sm text-foreground" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">İkon Adı</label>
                    <input type="text" value={card.icon} onChange={(e) => {
                      const newCards = [...cards]; newCards[index].icon = e.target.value; setCards(newCards);
                    }} className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 focus:border-blue-500 outline-none text-sm text-foreground" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Arkaplan Sınıfı</label>
                    <input type="text" value={card.bg} onChange={(e) => {
                      const newCards = [...cards]; newCards[index].bg = e.target.value; setCards(newCards);
                    }} className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 focus:border-blue-500 outline-none text-sm text-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Buton Metni</label>
                    <input type="text" value={card.btnText} onChange={(e) => {
                      const newCards = [...cards]; newCards[index].btnText = e.target.value; setCards(newCards);
                    }} className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 focus:border-blue-500 outline-none text-sm text-foreground" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Buton Linki</label>
                    <input type="text" value={card.btnLink} onChange={(e) => {
                      const newCards = [...cards]; newCards[index].btnLink = e.target.value; setCards(newCards);
                    }} className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 focus:border-blue-500 outline-none text-sm text-foreground" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={isSaving}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-all text-lg disabled:opacity-70"
      >
        <Save size={24} /> {isSaving ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}
      </button>

      <div className="p-6 bg-slate-900 text-white rounded-3xl mt-8">
        <h4 className="font-bold flex items-center gap-2 text-yellow-500"><Info size={20} /> SQL Tablo Kurulumu</h4>
        <p className="text-sm text-slate-300 mt-2 mb-4">
          Bu modülün düzgün çalışması için Supabase'de `site_settings` isimli bir tabloya ihtiyacınız vardır. Eğer yoksa SQL Editör'den çalıştırın:
        </p>
        <pre className="text-xs bg-black/50 p-4 rounded-xl font-mono text-emerald-400 overflow-x-auto">
{`CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL
);`}
        </pre>
      </div>

    </div>
  );
}
