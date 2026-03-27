"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingCart, Users, Settings,
  Globe, Package, Home, ChevronRight, LogOut, Menu, X, BookOpen, List
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Ürünler" },
  { href: "/admin/categories", icon: List, label: "Kategoriler" },
  { href: "/admin/blog", icon: BookOpen, label: "Blog Yazıları" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Siparişler" },
  { href: "/admin/users", icon: Users, label: "Müşteriler" },
  { href: "/admin/homepage", icon: Home, label: "Anasayfa İçerik" },
  { href: "/admin/settings", icon: Settings, label: "Ayarlar" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useState(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && !isLoginPage) {
        router.push("/admin/login");
      } else {
        setIsCheckingAuth(false);
      }
    }
    checkUser();
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string) => href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  // Eğer giriş sayfasındaysak sadece içeriği döndür
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        {children}
      </div>
    );
  }

  // Yükleniyor durumu (Sıçramayı önlemek için)
  if (isCheckingAuth && !isLoginPage) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400 font-medium">Yönetim Paneli Yükleniyor...</div>;
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Image src="/MOBAR.png" alt="Mobar" width={110} height={32} className="h-7 w-auto object-contain" />
        <span className="ml-auto text-[10px] font-bold tracking-widest text-gray-400 uppercase">Panel</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(href)
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={18} />
                {label}
                {isActive(href) && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
        >
          <Globe size={18} />
          Siteye Dön
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={18} />
          Çıkış Yap
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="w-60 hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)}></div>
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col lg:pl-60 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 lg:px-8 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600">
              <Menu size={20} />
            </button>
            <h1 className="font-semibold text-gray-800 text-sm lg:text-base">Yönetim Paneli</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Aktif Seans
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">A</div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-8 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
