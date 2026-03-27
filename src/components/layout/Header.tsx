"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, Heart, ShoppingCart, Menu, X, Monitor, Laptop, Cpu, Mouse, Smartphone, Code, BookOpen, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/providers/CartProvider";
import { useFavorites } from "@/components/providers/FavoriteProvider";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const { totalItems, totalPrice } = useCart();
  const { totalFavorites } = useFavorites();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(searchQuery.trim()) {
      router.push(`/store?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Auth listener
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: any, session: any) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      window.removeEventListener("scroll", handleScroll);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const topCategories = [
    { name: "Yazılım Çözümleri", icon: Code, href: "/category/yazilim-cozumleri" },
    { name: "Sıfır Ürünler", icon: Laptop, href: "/sifir-urunler" },
    { name: "2. El Ürünler", icon: Monitor, href: "/ikinci-el-urunler" },
    { name: "Bileşenler & Aksesuarlar", icon: Cpu, href: "/category/bilesenler-ve-aksesuarlar" },
    { name: "Çevre Birimleri", icon: Mouse, href: "/category/bilesenler-ve-aksesuarlar" },
    { name: "Telefonlar", icon: Smartphone, href: "/category/telefonlar" },
  ];

  return (
    <header className="w-full bg-white sticky top-0 z-50 transition-all duration-300 shadow-sm">
      {/* Top Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image 
                src="/MOBAR.png" 
                alt="Mobar Bilişim Logo" 
                width={280} 
                height={80} 
                className="h-16 md:h-24 w-auto object-contain mix-blend-multiply" 
                priority
              />
            </Link>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Aramak istediğiniz ürünü yazın..." 
                className="w-full pl-5 pr-12 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-0 outline-none transition-colors text-sm"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                <Search size={18} />
              </button>
            </form>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-3 group relative cursor-pointer">
                  <Link href="/hesabim" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition">
                      <User size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 leading-tight truncate max-w-[120px] hover:text-blue-600 transition">
                        {user.user_metadata?.full_name || user.email?.split("@")[0]}
                      </span>
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="text-xs text-red-500 font-medium hover:underline self-end pb-0.5 ml-2">Çıkış</button>
                </div>
              ) : (
                <Link href="/giris" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition text-gray-700 group-hover:text-blue-600">
                    <User size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition">Giriş Yap</span>
                    <span className="text-xs text-gray-500">Üye Ol</span>
                  </div>
                </Link>
              )}
              
              <Link href="/favorites" className="flex items-center gap-2 group text-gray-700 hover:text-red-500 transition relative">
                <Heart size={24} className="group-hover:fill-red-50 group-hover:text-red-500 transition" />
                {totalFavorites > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                    {totalFavorites}
                  </span>
                )}
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Favori</span>
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-red-500 transition">Ürünlerim</span>
                </div>
              </Link>

              <div className="h-8 w-px bg-gray-200"></div>

              <Link href="/cart" className="flex items-center gap-3 group">
                <div className="relative">
                  <ShoppingCart size={28} className="text-gray-700 group-hover:text-blue-600 transition" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {totalItems}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition">Sepetim</span>
                  <span className="text-xs text-gray-500 font-medium">{totalPrice.toLocaleString('tr-TR')} ₺</span>
                </div>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center gap-4">
              <Link href="/cart" className="relative group">
                <ShoppingCart size={24} className="text-gray-800" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-800"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Search Bar (Shows below header on mobile) */}
        <div className="md:hidden px-4 pb-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ara..." 
              className="w-full pl-4 pr-10 py-2.5 rounded-full border border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white outline-none transition-colors text-sm"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Categories Desktop Bar */}
      <div className="hidden md:block bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-between overflow-x-auto py-2">
            {topCategories.map((category, index) => {
              const Icon = category.icon;
              const isActive = pathname === category.href || pathname.startsWith(category.href + "/");
              return (
                <li key={index}>
                  <Link 
                    href={category.href}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-blue-50 group min-w-[100px] transition-colors relative ${isActive ? 'bg-blue-50/80' : ''}`}
                  >
                    <Icon size={24} className={`transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'}`} strokeWidth={1.5} />
                    <span className={`text-xs font-semibold whitespace-nowrap ${isActive ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-700'}`}>
                      {category.name}
                    </span>
                    {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-t-full"></span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 top-[120px] bg-black/40 z-40 md:hidden backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-full left-0 w-full bg-white z-50 flex flex-col p-4 border-t md:hidden shadow-xl max-h-[calc(100vh-120px)] overflow-y-auto">
            {user ? (
              <div className="flex items-center gap-4 mb-8 bg-blue-50 p-4 rounded-xl">
                <Link href="/hesabim" onClick={() => setIsMobileMenuOpen(false)} className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User size={24} />
                </Link>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <Link href="/hesabim" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-gray-900 truncate max-w-[200px] hover:text-blue-600">
                    {user.user_metadata?.full_name || user.email?.split("@")[0]}
                  </Link>
                  <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">Blog</Link>
                  <Link href="/hakkimizda" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">Hakkımızda</Link>
                  <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="text-sm font-semibold text-red-500 text-left mt-1 hover:underline">Çıkış Yap</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 mb-8 bg-blue-50 p-4 rounded-xl">
                <User size={24} className="text-blue-600" />
                <div className="flex flex-col">
                  <Link href="/giris" className="font-bold text-gray-900 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Giriş Yap / Üye Ol</Link>
                </div>
              </div>
            )}
            
            <ul className="space-y-1 mb-8">
              <li>
                <Link href="/blog" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 font-medium text-gray-800">
                  <BookOpen size={20} className="text-gray-500" />
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 font-medium text-gray-800">
                  <Info size={20} className="text-gray-500" />
                  Hakkımızda
                </Link>
              </li>
            </ul>

            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Kategoriler</h3>
            <ul className="space-y-1">
              {topCategories.map((category, idx) => {
                const Icon = category.icon;
                const isActive = pathname === category.href || pathname.startsWith(category.href + "/");
                return (
                  <li key={idx}>
                    <Link 
                      href={category.href} 
                      onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'instant' }); }}
                      className={`flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 font-medium ${isActive ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : 'text-gray-800'}`}
                    >
                      <Icon size={20} className={isActive ? "text-blue-600" : "text-gray-500"} />
                      {category.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </header>
  );
}
