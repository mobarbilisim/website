"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingCart, Users, Settings,
  Globe, Package, Home, ChevronRight, Boxes
} from "lucide-react";
import LogoutButton from "./LogoutButton";

const navGroups = [
  {
    label: "Ana Menü",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/admin/products", icon: Package, label: "Ürün Yönetimi" },
      { href: "/admin/orders", icon: ShoppingCart, label: "Siparişler" },
      { href: "/admin/users", icon: Users, label: "Müşteriler" },
    ],
  },
  {
    label: "Site Yönetimi",
    items: [
      { href: "/admin/homepage", icon: Home, label: "Anasayfa İçerik" },
      { href: "/admin/settings", icon: Settings, label: "Genel Ayarlar" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#0f1117] text-white">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col fixed inset-y-0 left-0 z-40 bg-[#101218] border-r border-white/[0.06]">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-5 border-b border-white/[0.06]">
          <Image
            src="/MOBAR.png"
            alt="Mobar"
            width={120}
            height={40}
            className="h-9 w-auto object-contain brightness-0 invert opacity-90"
          />
          <span className="ml-auto text-[10px] font-bold tracking-widest text-white/30 uppercase">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25 px-3 mb-2">
                {group.label}
              </div>
              <ul className="space-y-1">
                {group.items.map(({ href, icon: Icon, label }) => {
                  const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative group ${
                          active
                            ? "bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/25"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon size={18} className={active ? "text-blue-400" : "text-white/40 group-hover:text-white/70 transition-colors"} />
                        {label}
                        {active && <ChevronRight size={14} className="ml-auto text-blue-400" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/[0.06] space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <Globe size={18} />
            Siteye Dön
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:pl-64 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 md:px-8 bg-[#0f1117]/80 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Boxes size={20} className="text-blue-400" />
            <h1 className="font-bold text-lg tracking-tight text-white">Yönetim Paneli</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistem Aktif
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-500/40 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
              M
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
