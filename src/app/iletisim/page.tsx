"use client";

import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function IletisimPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simüle edilen gönderim işlemi
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-blue-600 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Bize Ulaşın</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Teknolojik ihtiyaçlarınız ve projeleriniz için her zaman yanınızdayız. Ekibimiz en kısa sürede sorularınızı yanıtlamaktan memnuniyet duyacaktır.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex items-start gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-lg">Adresimiz</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Mobar Bilişim Teknoloji A.Ş. <br />
                  Cumhuriyet Mahallesi, Teknoloji Bulvarı No:42 <br />
                  Silivri / İstanbul
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex items-start gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-lg">Telefon</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Hafta içi 09:00 - 18:00 arası arayabilirsiniz. <br />
                  <a href="tel:+905321234567" className="font-bold text-emerald-600 mt-2 block hover:underline text-base">+90 532 123 45 67</a>
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex items-start gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-lg">E-Posta & Destek</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Teknik destek veya işbirlikleri için: <br />
                  <a href="mailto:info@mobarbilisim.com" className="font-bold text-purple-600 mt-2 block hover:underline text-base">info@mobarbilisim.com</a>
                </p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex items-start gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-lg">Çalışma Saatleri</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  Pazartesi - Cuma: <span className="text-gray-800">09:00 - 18:00</span> <br />
                  Cumartesi: <span className="text-gray-800">10:00 - 15:00</span> <br />
                  Pazar: <span className="text-gray-400">Kapalı</span>
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form & Map */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
              {isSubmitted ? (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Mesajınız Alındı!</h2>
                  <p className="text-gray-500 mb-8">Bize ulaştığınız için teşekkürler. Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
                  <button onClick={() => setIsSubmitted(false)} className="text-blue-600 font-bold hover:underline">Yeni bir mesaj gönder</button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Bize Mesaj Gönderin</h2>
                  <p className="text-gray-500 mb-8">İstek, öneri veya şikayetlerinizi yan taraftaki form üzerinden bize anında ulaştırabilirsiniz.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Adınız Soyadınız *</label>
                        <input type="text" className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="Ahmet Yılmaz" required />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">E-Posta Adresiniz *</label>
                        <input type="email" className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="ornek@posta.com" required />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Konu *</label>
                      <select className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700 cursor-pointer" required>
                        <option value="">Lütfen Bir Konu Seçin</option>
                        <option value="Satis">Satış ve Bilgi Ekibi</option>
                        <option value="Teknik">Teknik Destek ve Servis</option>
                        <option value="Yazilim">Özel Yazılım Çözümleri</option>
                        <option value="Diger">Diğer / Öneri</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Mesajınız *</label>
                      <textarea rows={5} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none placeholder:text-gray-400" placeholder="Size nasıl yardımcı olabiliriz?" required></textarea>
                    </div>
                    
                    <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/20 w-full md:w-auto ml-auto">
                      {loading ? "Gönderiliyor..." : (
                        <>
                          <Send size={18} />
                          Mesajı Gönder
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
            
            {/* Google Map Box */}
            <div className="bg-gray-200 rounded-3xl overflow-hidden h-80 relative shadow-inner">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2z4bC44bC_4bCa4bCq4bCs4bCq4bCV4bCF!5e0!3m2!1str!2str!4v1614000000000!5m2!1str!2str" 
                className="absolute inset-0 w-full h-full border-0" 
                allowFullScreen={false} 
                loading="lazy">
              </iframe>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg text-sm font-bold text-gray-800">
                📍 Mobar Bilişim Merkez Ofis
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
