"use client";

import { motion } from "framer-motion";
import { DollarSign, Activity, CreditCard, Laptop, TrendingUp, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalGelir: 0,
    toplamSiparis: 0,
    toplamUrun: 0,
    bekleyenSiparis: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const { count: productsCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        const { data: orders } = await supabase
          .from("orders")
          .select("id, total_price, status, created_at, customer_name")
          .order("created_at", { ascending: false })
          .limit(50);
          
        const gelir = orders?.reduce((sum, order) => sum + (Number(order.total_price) || 0), 0) || 0;
        const bekleyen = orders?.filter(o => o.status === "Bekliyor").length || 0;

        setMetrics({
          toplamUrun: productsCount || 0,
          toplamSiparis: orders?.length || 0,
          totalGelir: gelir,
          bekleyenSiparis: bekleyen,
        });
        
        setRecentOrders(orders?.slice(0, 5) || []);
      } catch (err) {
        console.error("Dashboard Stats Error:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadStats();
  }, []);

  const stats = [
    { title: "Toplam Ciro", value: loading ? "..." : `₺${metrics.totalGelir.toLocaleString('tr-TR')}`, sub: "Tüm zamanlar", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Toplam Sipariş", value: loading ? "..." : metrics.toplamSiparis.toString(), sub: "Tüm kayıtlar", icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Aktif Ürünler", value: loading ? "..." : metrics.toplamUrun.toString(), sub: "Mağazada listelenen", icon: Laptop, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Bekleyen Sipariş", value: loading ? "..." : metrics.bekleyenSiparis.toString(), sub: "İlgilenilmesi gereken", icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Hoş Geldiniz 👋</h2>
        <p className="text-gray-500 text-sm mt-1">İşletmenizin güncel durumu aşağıda özetlenmiştir.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{stat.title}</span>
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon size={16} className={stat.color} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* System Status */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Sistem Durumu</h3>
          <div className="space-y-3">
            {[
              { label: "Veritabanı Bağlantısı", status: "Aktif", color: "bg-emerald-500" },
              { label: "Satış Altyapısı", status: "Aktif", color: "bg-emerald-500" },
              { label: "Storage (Fotoğraflar)", status: "Aktif", color: "bg-emerald-500" },
              { label: "Auth (Kimlik Doğrulama)", status: "Aktif", color: "bg-emerald-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Link href="/admin/products" className="flex-1 text-center text-xs font-semibold bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Ürünlere Git
            </Link>
            <Link href="/admin/orders" className="flex-1 text-center text-xs font-semibold bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition">
              Siparişlere Git
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-3 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Son Siparişler</h3>
            <Link href="/admin/orders" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Tümü <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center text-sm text-gray-400 py-8">Yükleniyor...</div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-8">Henüz sipariş bulunmuyor.</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-800">#{order.id} — {order.customer_name || "Müşteri"}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleString('tr-TR')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">₺{(order.total_price || 0).toLocaleString('tr-TR')}</div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      order.status === 'Bekliyor' ? 'bg-orange-100 text-orange-600' :
                      order.status === 'Tamamlandı' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
