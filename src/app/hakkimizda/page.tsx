import { Shield, Target, Lightbulb, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda - Mobar Bilişim",
  description: "Mobar Bilişim hakkında daha fazla bilgi. Biz kimiz, misyonumuz, vizyonumuz ve sunduğumuz değerler.",
};

export default function HakkimizdaPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Geleceğin Teknolojisini Bugünden Kuruyoruz</h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Sıfır ve 2. el kurumsal teknoloji çözümlerinden uçtan uca özel yazılımlara kadar, dijital dünyadaki en güçlü iş ortağınız olmak için yola çıktık.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Shield size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Mobar Bilişim Kimdir?</h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
              Yılların getirdiği sektör tecrübesini, yenilikçi bir vizyonla harmanlayan <strong>Mobar Bilişim</strong>, kurumların ve bireylerin teknolojik donanım ve yazılım ihtiyaçlarını tek çatı altında çözmek amacıyla kurulmuştur.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              Özellikle kurumsal 2. el pazarında yarattığımız standartlar sayesinde müşterilerimize <span className="font-bold text-blue-600">sıfır güvenilirliğinde ancak çok daha erişilebilir bütçelerle</span> teknoloji sunmayı başardık.
            </p>
            
            <ul className="space-y-4">
              {[
                "100% Test Edilmiş Kurumsal Ürünler",
                "Firmalara Özel Profesyonel Yazılım Çözümleri",
                "İhtiyaca Özel Donanım Tedariği",
                "Satış Sonrası Koşulsuz Teknik Destek"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-800 font-medium">
                  <CheckCircle2 size={24} className="text-emerald-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-emerald-400 rounded-3xl transform rotate-3 scale-105 opacity-20 hidden md:block"></div>
            <img 
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80" 
              alt="Mobar Bilişim Ofis" 
              className="rounded-3xl shadow-2xl relative z-10 w-full object-cover h-[500px]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            <div className="p-10 rounded-3xl bg-gray-50 border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 p-8 text-blue-600/10 group-hover:scale-110 transition-transform">
                <Target size={120} />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                  <Target size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Müşterilerimizin dijitalleşme sürecindeki teknoloji maliyetlerini en aza indirirken, performans ve güvenlikten taviz vermeyen garantili çözümler üretmek. Her işletmeyi doğru donanım ve akıllı yazılımlarla buluşturmak.
                </p>
              </div>
            </div>

            <div className="p-10 rounded-3xl bg-gray-50 border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 p-8 text-emerald-600/10 group-hover:scale-110 transition-transform">
                <Lightbulb size={120} />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                  <Lightbulb size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Türkiye'nin önde gelen güvenilir IT tedarikçisi ve yazılım inovasyon merkezi olarak; sürdürülebilir teknoloji (yenilenmiş cihazlar) anlayışını tüm kurumlara benimsetmek ve katma değer yaratmak.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
