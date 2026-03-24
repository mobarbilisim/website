import { Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export const metadata = {
  title: "Yazılım Çözümleri | Mobar Bilişim",
  description: "İşletmeniz için modern, hızlı ve kurumsal web sitesi paketleri ve özel yazılım çözümleri.",
};

export default function YazilimCozumleriPage() {
  const packages = [
    {
      id: "starter",
      name: "Başlangıç Paketi",
      desc: "Küçük işletmeler ve kişisel markalar için ideal başlangıç.",
      price: "15.000 ₺",
      features: [
        "Kurumsal Web Tasarımı",
        "Mobil Uyumlu (Responsive)",
        "SEO Temel Optimizasyon",
        "Yönetim Paneli (Sade)",
        "Ücretsiz SSL Sertifikası",
        "1 Yıl Ücretsiz Hosting",
      ],
      color: "from-blue-500 to-cyan-500",
      isPopular: false,
    },
    {
      id: "corporate",
      name: "Kurumsal Paket",
      desc: "İşletmesini dijitalde güçlü bir şekilde temsil etmek isteyenler için.",
      price: "35.000 ₺",
      features: [
        "Özel Kurumsal Tasarım",
        "Gelişmiş Yönetim Paneli",
        "Kapsamlı SEO Altyapısı",
        "Çoklu Dil Desteği (+1 Dil)",
        "Blog / Haber Modülü",
        "Kurumsal Mail Adresleri",
        "Performans Optimizasyonu",
      ],
      color: "from-purple-500 to-indigo-600",
      isPopular: true,
    },
    {
      id: "ecommerce",
      name: "E-Ticaret Paketi",
      desc: "Ürünlerini internetten satmak isteyen markalar için.",
      price: "60.000 ₺",
      features: [
        "Sınırsız Ürün Ekleme Özelliği",
        "Sanal POS ve Kredi Kartı Entegrasyonu",
        "Kargo Entegrasyonu",
        "Müşteri Paneli ve Sipariş Takibi",
        "Promosyon ve İndirim Altyapısı",
        "Gelişmiş Raporlama",
        "Sepet Terk Kurtarma Desteği",
      ],
      color: "from-emerald-500 to-teal-500",
      isPopular: false,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Web Sitesi Paketleri</h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            İşletmenizin ihtiyacına uygun paketlerimizle dijital dünyada yerinizi hemen alın.
            Gelişmiş teknolojilerle inşa edilen, hızlı ve güvenli sistemler üretiyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <div 
              key={pkg.id} 
              className={`bg-white rounded-3xl shadow-xl border overflow-hidden relative flex flex-col ${pkg.isPopular ? 'border-purple-400 scale-100 md:scale-105 z-10' : 'border-gray-100'}`}
            >
              {pkg.isPopular && (
                <div className="bg-purple-600 text-white text-xs font-bold uppercase tracking-wider text-center py-2 absolute top-0 w-full left-0">
                  En Çok Tercih Edilen
                </div>
              )}
              
              <div className={`p-8 ${pkg.isPopular ? 'pt-12' : ''}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-sm text-gray-500 h-10 mb-6">{pkg.desc}</p>
                <div className="mb-8">
                  <span className="text-4xl font-extrabold text-gray-900">{pkg.price}</span>
                  <span className="text-gray-500 text-sm font-medium"> + KDV</span>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-gray-600 text-sm">
                      <Check className={`w-5 h-5 mr-3 shrink-0 ${pkg.isPopular ? 'text-purple-600' : 'text-blue-500'}`} />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-8 pt-0 mt-auto">
                <Link 
                  href={`https://wa.me/905330000000?text=Merhaba, ${pkg.name} detayları hakkında bilgi almak istiyorum.`} 
                  target="_blank"
                  className={`block w-full text-center py-4 rounded-xl font-bold text-white shadow-lg transition-transform hover:-translate-y-1 ${
                    pkg.isPopular 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-500/30' 
                      : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:shadow-gray-900/30'
                  }`}
                >
                  Hemen Satın Al
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-24 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center">
          <h2 className="text-2xl font-bold mb-4">Özel Bir Projeniz Mi Var?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Paketlerimizin dışında tamamen size özel bir web uygulaması, CRM, ERP veya mobil uygulama geliştirme talebiniz mi var? Size özel çözüm üretebilmemiz için projenizi dinlemek isteriz.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-colors">
            Özel Teklif Alın
          </Link>
        </div>
      </div>
    </div>
  );
}
