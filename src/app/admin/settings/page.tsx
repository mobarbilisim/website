"use client";

import { useState, useEffect } from "react";
import { Save, MapPin, Phone, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 text-sm bg-white";

export default function GlobalSettingsPage() {
  const supabase = createClient();
  const [footerSettings, setFooterSettings] = useState({
    address: "",
    phone: "",
    email: "",
    facebook: "",
    twitter: "",
    instagram: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadFooter() {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'footer_settings').single();
      if (data?.value) {
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
    setIsSaving(true);
    await supabase.from('site_settings').upsert({ key: "footer_settings", value: footerSettings });
    setIsSaving(false);
    alert("Ayarlar başarıyla kaydedildi!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Genel Ayarlar</h2>
        <p className="text-gray-500 text-sm mt-1">İletişim bilgileri ve sosyal medya linklerini buradan yönetin.</p>
      </div>

      {/* İletişim & Footer */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
          İletişim ve Alt Bilgi (Footer)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-2">İletişim Bilgileri</h4>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><MapPin size={14}/> Adres</label>
              <textarea 
                rows={2} value={footerSettings.address}
                onChange={(e) => setFooterSettings({...footerSettings, address: e.target.value})}
                className={inputClass + " resize-none"}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><Phone size={14}/> Telefon</label>
              <input 
                type="text" value={footerSettings.phone}
                onChange={(e) => setFooterSettings({...footerSettings, phone: e.target.value})}
                className={inputClass}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><Mail size={14}/> E-Posta</label>
              <input 
                type="text" value={footerSettings.email}
                onChange={(e) => setFooterSettings({...footerSettings, email: e.target.value})}
                className={inputClass}
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-2">Sosyal Medya Linkleri</h4>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Facebook URL</label>
              <input 
                type="text" value={footerSettings.facebook}
                onChange={(e) => setFooterSettings({...footerSettings, facebook: e.target.value})}
                placeholder="https://facebook.com/sayfaniz"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Twitter (X) URL</label>
              <input 
                type="text" value={footerSettings.twitter}
                onChange={(e) => setFooterSettings({...footerSettings, twitter: e.target.value})}
                placeholder="https://twitter.com/sayfaniz"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Instagram URL</label>
              <input 
                type="text" value={footerSettings.instagram}
                onChange={(e) => setFooterSettings({...footerSettings, instagram: e.target.value})}
                placeholder="https://instagram.com/sayfaniz"
                className={inputClass}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={saveFooter}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70 text-sm shadow-sm"
          >
            <Save size={16} /> {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
