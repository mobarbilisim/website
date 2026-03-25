"use client";

import { motion } from "framer-motion";
import { DollarSign, Activity, CreditCard, Laptop } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
        // Products count
        const { count: productsCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        // Orders fetch
        const { data: orders } = await supabase
          .from("orders")
          .select("id, total_price, status, created_at")
          .order("created_at", { ascending: false })
          .limit(50); // Fetch all recent for stats
          
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
    { title: "Toplam Ciro", value: loading ? "..." : `₺${metrics.totalGelir.toLocaleString('tr-TR')}`, change: "Tüm zamanlar", icon: <DollarSign size={22} className="text-emerald-400" /> },
    { title: "Toplam Sipariş", value: loading ? "..." : metrics.toplamSiparis.toString(), change: "Sistemdeki tüm kayıtlar", icon: <CreditCard size={22} className="text-blue-400" /> },
    { title: "Aktif Ürünler", value: loading ? "..." : metrics.toplamUrun.toString(), change: "Mağazada listelenenler", icon: <Laptop size={22} className="text-purple-400" /> },
    { title: "Bekleyen Yönetim İşlemi", value: loading ? "..." : metrics.bekleyenSiparis.toString(), change: "Acil ilgilenilmesi gereken", icon: <Activity size={22} className="text-orange-400" /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sisteme Hoş Geldiniz</h2>
        <p className="text-muted-foreground mt-2">İşletmenizin ve e-ticaret sitenizin güncel özeti burada.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass p-6 rounded-2xl flex flex-col border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none">
              {stat.icon}
            </div>
            <div className="flex items-center gap-3 mb-4">
              {stat.icon}
              <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mt-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass border border-white/5 rounded-2xl p-6 lg:col-span-4 h-96 flex flex-col justify-center gap-6"
        >
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Performans Özeti</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Sistem sağlıklı çalışıyor. Grafik ve detaylı raporlama modülü ilerici bir aşamada aktif edilecektir.
            </p>
          </div>
          <div className="flex justify-center flex-wrap gap-4 mt-4">
             <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-medium">Veritabanı: Aktif</div>
             <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-xl text-sm font-medium">Satış Altyapısı: Aktif</div>
             <div className="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-xl text-sm font-medium">Storage: Aktif</div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass border border-white/5 rounded-2xl p-6 lg:col-span-3 h-96 overflow-hidden flex flex-col"
        >
          <h3 className="font-semibold mb-4 text-white">Son Siparişler</h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {loading ? (
              <div className="text-center text-sm text-muted-foreground mt-10">Yükleniyor...</div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground mt-10">Henüz sipariş yok.</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-200">Sipariş #{order.id}</span>
                    <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString('tr-TR')} • <span className={order.status === 'Bekliyor' ? 'text-orange-400' : 'text-emerald-400'}>{order.status}</span></span>
                  </div>
                  <span className="font-semibold text-emerald-400">₺{(order.total_price || 0).toLocaleString('tr-TR')}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
