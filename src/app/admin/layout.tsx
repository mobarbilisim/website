import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, ShoppingCart, Users, Settings, LogOut, Package } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 glass-dark border-r border-white/5 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/5 pb-2 pt-4">
          <Image 
            src="/MOBAR.png" 
            alt="Mobar Bilişim Logo" 
            width={120} 
            height={30} 
            className="h-8 w-auto object-contain brightness-0 invert opacity-90" 
          />
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem href="/admin/products" icon={<Package size={20} />} label="Ürünler" />
          <NavItem href="/admin/orders" icon={<ShoppingCart size={20} />} label="Siparişler" />
          <NavItem href="/admin/users" icon={<Users size={20} />} label="Müşteriler" />
          <NavItem href="/admin/homepage" icon={<Settings size={20} />} label="Anasayfa İçerik" />
          <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Ayarlar" />
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-red-400 transition-colors">
            <LogOut size={20} />
            Küresel Siteye Dön
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 glass z-10 flex items-center justify-between px-8 border-b border-white/5">
          <h1 className="font-semibold text-xl">Yönetim Paneli</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold">
              M
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
        ? "bg-primary/20 text-primary font-medium border border-primary/30" 
        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
