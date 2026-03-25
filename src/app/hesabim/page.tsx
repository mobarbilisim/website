"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User, Package, MapPin, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HesabimPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "address">("profile");
  const [loading, setLoading] = useState(true);
  
  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/giris");
        return;
      }
      setUser(session.user);
      
      const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).single();
      
      setFullName(session.user.user_metadata?.full_name || "");
      if (profile) {
        setPhone(profile.phone || "");
        setAddress(profile.address || "");
      }
      setLoading(false);
    };
    fetchUser();
  }, [router, supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Auth metadata guncelleme
    await supabase.auth.updateUser({ data: { full_name: fullName } });
    
    // Kendi tablomuzda bir users tablosu acilariysa guncelle, hata olursa takilmasin.
    await supabase.from("users").upsert({ 
      id: user.id, 
      full_name: fullName, 
      phone, 
      address,
      email: user.email
    });
    
    alert("Profiliniz basariyla guncellendi!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return <div className="flex-1 flex justify-center items-center py-20 text-gray-500">Yukleniyor...</div>;
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md shadow-blue-500/20">
                {fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-bold text-gray-900 truncate max-w-[150px]">{fullName || "Musteri"}</h2>
                <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <User size={18} /> Profil Bilgilerim
              </button>
              <button 
                onClick={() => setActiveTab("address")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${activeTab === 'address' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <MapPin size={18} /> Adres & Iletisim
              </button>
              <button 
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Package size={18} /> Siparislerim
              </button>
              <div className="h-px bg-gray-100 my-4"></div>
              {user?.email === "mobarbilisim@gmail.com" && (
                <Link href="/admin" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-amber-600 hover:bg-amber-50 transition-colors">
                  <Settings size={18} /> Yonetim Paneli
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} /> Cikis Yap
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
            {activeTab === "profile" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Profil Bilgilerim</h3>
                <form onSubmit={handleUpdateProfile} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ad Soyad</label>
                    <input type="text" value={fullName} onChange={(e)=>setFullName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">E-Posta (Degistirilemez)</label>
                    <input type="email" value={user?.email || ""} disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none" />
                  </div>
                  <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition mt-4 shadow-md shadow-blue-500/20">
                    Guncelle
                  </button>
                </form>
              </div>
            )}

            {activeTab === "address" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Adres & Iletisim</h3>
                <form onSubmit={handleUpdateProfile} className="max-w-xl space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Telefon Numarasi</label>
                    <input type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="05XX XXX XX XX" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Acik Teslimat Adresi</label>
                    <textarea rows={4} value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Mahalle, Sokak, No, Daire, Ilce, Il..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white resize-none" />
                  </div>
                  <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition mt-4 shadow-md shadow-blue-500/20">
                    Adresi Kaydet
                  </button>
                </form>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Siparislerim</h3>
                <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-2xl border border-gray-100">
                  <Package size={48} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium mb-2">Henuz bir siparisiniz bulunmuyor.</p>
                  <p className="text-sm text-gray-400 max-w-sm">Mobar Bilisim magazasindan ihtiyaciniza uygun teknoloji urunlerini hemen kesfedin.</p>
                  <Link href="/store" className="mt-6 font-bold text-blue-600 hover:text-blue-700 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200 transition-colors">
                    Magazaya Git
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
