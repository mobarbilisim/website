"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, Heart, ShoppingCart, Menu, X, ChevronDown, ChevronRight, Monitor, Laptop, Cpu, Smartphone, Code, ShieldCheck, Award, Zap, Store, Tag, CreditCard, TrendingUp, Package, Truck, ArrowRight, BookOpen, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/providers/CartProvider";
import { useFavorites } from "@/components/providers/FavoriteProvider";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";

const iconMap: any = { Monitor, Laptop, Cpu, Smartphone, Code, ShieldCheck, Award, Zap, ShoppingCart, Store, Tag, CreditCard, TrendingUp, Package, Truck, ArrowRight };

export default function Header({ categories = [] }: { categories?: any[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="w-full bg-white z-50">
      {/* Top Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1400px] w-[97%] mx-auto py-3 md:py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">

            <div className="w-full md:w-auto flex items-center justify-between">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Mobar Bilişim Logo"
                  width={600}
                  height={120}
                  className="h-[120px] w-auto object-contain"
                  priority
                />
              </Link>
              
              <div className="flex md:hidden items-center gap-4">
                <Link href="/cart" className="relative group">
                  <ShoppingCart size={24} className="text-gray-800" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-800">
                  {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Aramak istediğin ürünü yaz, kolayca bul!"
                className="w-full pl-5 pr-14 py-2.5 rounded-lg border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-sm font-semibold text-gray-700"
              />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition">
                <Search size={18} />
              </button>
            </form>

            <div className="hidden md:flex items-center gap-7 lg:gap-10">
              {user ? (
                <Link href={user.user_metadata?.role === 'admin' || user.email === 'mobarbilisim@gmail.com' ? '/admin' : '/hesabim'} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-11 h-11 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-600 font-bold bg-blue-50 text-base">
                     {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "M"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition">Hesabım</span>
                    <span className="text-sm text-gray-500 truncate max-w-[120px]">
                      {user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
                    </span>
                  </div>
                </Link>
              ) : (
                <Link href="/giris" className="flex items-center gap-3 group cursor-pointer">
                  <User size={30} className="text-gray-700 group-hover:text-blue-500 transition" />
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-gray-900 group-hover:text-blue-500 transition">Giriş Yap</span>
                    <span className="text-sm text-gray-500">Üye Ol</span>
                  </div>
                </Link>
              )}

              <Link href="/favorites" className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <Heart size={30} className="text-gray-700 group-hover:text-blue-500 transition" />
                  {totalFavorites > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {totalFavorites}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-gray-900 group-hover:text-blue-500 transition">Favori</span>
                  <span className="text-sm text-gray-500">Ürünlerim</span>
                </div>
              </Link>

              <div className="h-10 w-[1.5px] bg-gray-200"></div>

              <Link href="/cart" className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <ShoppingCart size={34} className="text-gray-700 group-hover:text-blue-500 transition" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {totalItems}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-gray-900 group-hover:text-blue-500 transition">Sepetim</span>
                  <span className="text-sm text-gray-500 font-bold">{totalPrice.toLocaleString('tr-TR')} ₺</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ara..." 
              className="w-full pl-4 pr-10 py-3 rounded-lg border-[2px] border-blue-500 bg-white outline-none text-sm font-bold text-gray-700 shadow-sm"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500">
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Category Icons Bar (Desktop) */}
      {categories.length > 0 && (
         <div className="hidden md:block bg-white shadow-sm border-b border-gray-100 relative">
            <div className="max-w-[1400px] w-[97%] mx-auto">
               <ul className="flex flex-wrap items-center justify-evenly gap-y-3 py-3">
                  {categories.filter((c: any) => !c.parent_id).map((cat, idx) => {
                     const subCats = categories.filter((c: any) => c.parent_id === cat.id);
                     const RenderIcon = iconMap[cat.icon] || Monitor;
                     return (
                       <li key={cat.id || idx} className="group cursor-pointer relative px-4">
                         <Link href={`/category/${cat.slug}`} className="flex flex-col items-center gap-1.5 group-hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-14 h-14 flex items-center justify-center pointer-events-none">
                              {cat.image_url ? (
                                 <img src={cat.image_url} alt={cat.name} className="w-full h-full object-contain drop-shadow-sm" />
                              ) : (
                                 <RenderIcon size={38} strokeWidth={1.5} className="text-gray-700 group-hover:text-blue-500 transition-colors drop-shadow-sm" />
                              )}
                            </div>
                            <span className="text-[13px] font-bold text-gray-700 group-hover:text-blue-500 transition-colors text-center w-max max-w-[120px] leading-tight flex-shrink-0">
                              {cat.name}
                            </span>
                         </Link>

                         {/* Mega Menu Popup for Subcategories */}
                         {subCats.length > 0 && (
                           <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                             <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 p-4 min-w-[200px] whitespace-nowrap relative after:absolute after:-top-2 after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-b-white">
                               <ul className="flex flex-col gap-2">
                                 {subCats.map((sub: any) => (
                                   <li key={sub.id}>
                                     <Link href={`/category/${sub.slug}`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors text-sm font-bold">
                                       {sub.image_url && <img src={sub.image_url} alt={sub.name} className="w-6 h-6 object-contain" />}
                                       <span>{sub.name}</span>
                                     </Link>
                                   </li>
                                 ))}
                               </ul>
                             </div>
                           </div>
                         )}
                       </li>
                     )
                  })}
               </ul>
            </div>
         </div>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}/>
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 flex flex-col p-6 shadow-2xl md:hidden overflow-y-auto">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <span className="font-bold text-xl text-gray-900">Mobar</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-900 rounded-full">
                  <X size={24} />
                </button>
              </div>
              
              {user ? (
              <div className="flex items-center gap-4 mb-8 bg-blue-50 p-4 rounded-xl">
                <Link href="/hesabim" onClick={() => setIsMobileMenuOpen(false)} className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User size={24} />
                </Link>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <Link href="/hesabim" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-gray-900 truncate hover:text-blue-600">
                    {user.user_metadata?.full_name || user.email?.split("@")[0]}
                  </Link>
                  <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="text-sm font-semibold text-red-500 text-left mt-1 hover:underline">Çıkış Yap</button>
                </div>
              </div>
              ) : (
                <div className="flex items-center gap-4 mb-8 bg-blue-50 p-4 rounded-xl">
                  <User size={24} className="text-blue-600" />
                  <div className="flex flex-col">
                    <Link href="/giris" className="font-bold text-gray-900 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Giriş / Üye Ol</Link>
                  </div>
                </div>
              )}
              
              <ul className="space-y-1 mb-8">
                <li>
                  <Link href="/store" onClick={() => { setIsMobileMenuOpen(false); }} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 font-bold text-gray-800">
                    <ShoppingCart size={20} className="text-gray-500" /> Tüm Mağaza
                  </Link>
                </li>
              </ul>
              
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Kategoriler (Menü)</h3>
              <ul className="space-y-2">
                {categories.filter((c: any) => !c.parent_id).map((cat, idx) => (
                  <li key={`mobmenu-${cat.id || idx}`}>
                     <Link href={`/category/${cat.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 font-bold text-gray-800">
                        {cat.name}
                     </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
