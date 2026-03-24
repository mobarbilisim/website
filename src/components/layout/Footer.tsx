import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="block py-4">
              <img 
                src="/MOBAR.png" 
                alt="Mobar Bilişim Logo" 
                className="h-16 md:h-20 object-contain brightness-0 invert opacity-90" 
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Mükemmel teknoloji, kusursuz hizmet. Sıfır ve 2. el garantili teknoloji ürünleri, özel yazılım çözümleri ve kurumunuza özel altyapı hizmetleri.
            </p>
          </div>

          {/* Kurumsal */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Kurumsal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-blue-400 transition">Hakkımızda</Link></li>
              <li><Link href="/" className="hover:text-blue-400 transition">İletişim</Link></li>
              <li><Link href="/" className="hover:text-blue-400 transition">Banka Hesaplarımız</Link></li>
              <li><Link href="/" className="hover:text-blue-400 transition">Mesafeli Satış Sözleşmesi</Link></li>
              <li><Link href="/" className="hover:text-blue-400 transition">İade ve Çeviri Şartları</Link></li>
            </ul>
          </div>

          {/* Kategoriler */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Kategoriler</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/category/sifir-bilgisayarlar" className="hover:text-blue-400 transition">Sıfır Bilgisayarlar</Link></li>
              <li><Link href="/category/2-el-bilgisayarlar" className="hover:text-blue-400 transition">2. El Bilgisayarlar</Link></li>
              <li><Link href="/category/bilesenler" className="hover:text-blue-400 transition">Bilgisayar Bileşenleri</Link></li>
              <li><Link href="/category/cevre-birimleri" className="hover:text-blue-400 transition">Çevre Birimleri</Link></li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">İletişim</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5" />
                <span>Teknoloji Mah. Bilişim Sok. No: 1, İstanbul</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0" />
                <span>+90 850 123 45 67</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0" />
                <span>info@mobarbilisim.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
          <p>&copy; {new Date().getFullYear()} Mobar Bilişim. Tüm hakları saklıdır.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Social icons can be added here */}
            <span className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">F</span>
            <span className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">T</span>
            <span className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">I</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
