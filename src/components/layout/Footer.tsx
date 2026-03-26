import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function Footer() {
  const supabase = await createClient();

  const { data: settingsData } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "footer_settings")
    .single();

  const settings = settingsData?.value || {
    address: "Gaziantep/Şehitkamil Dinç Can Plaza",
    phone: "0533 040 72 27",
    email: "info@mobarbilisim.com",
    facebook: "#",
    twitter: "#",
    instagram: "#",
  };
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block py-2">
              <div className="bg-white p-4 rounded-2xl w-fit">
                <Image 
                  src="/MOBAR.png" 
                  alt="Mobar Bilişim Logo" 
                  width={240}
                  height={100}
                  className="h-14 md:h-16 w-auto object-contain" 
                />
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Mükemmel teknoloji, kusursuz hizmet. Sıfır ve 2. el garantili teknoloji ürünleri, özel yazılım çözümleri ve kurumunuza özel altyapı hizmetleri.
            </p>
          </div>

          {/* Kurumsal */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Kurumsal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/hakkimizda" className="hover:text-blue-400 transition">Hakkımızda</Link></li>
              <li><Link href="/iletisim" className="hover:text-blue-400 transition">İletişim</Link></li>
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
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={12} />
                </div>
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Phone size={12} />
                </div>
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Mail size={12} />
                </div>
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
          <p>&copy; {new Date().getFullYear()} Mobar Bilişim. Tüm hakları saklıdır.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition cursor-pointer text-gray-400 hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            )}
            {settings.twitter && (
              <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition cursor-pointer text-gray-400 hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition cursor-pointer text-gray-400 hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
